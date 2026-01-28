-- 001_init.sql
-- FiscalBox Upload - Schema inicial + RLS + Storage policies (parte DB)

-- Extensões úteis
create extension if not exists "uuid-ossp";
create extension if not exists "pgcrypto";

-- =========================
-- ENUMS (opcional, mas ajuda)
-- =========================
do $$
begin
  if not exists (select 1 from pg_type where typname = 'regime_tributario') then
    create type regime_tributario as enum ('SIMPLES', 'PRESUMIDO', 'REAL');
  end if;

  if not exists (select 1 from pg_type where typname = 'status_processamento') then
    create type status_processamento as enum ('PENDENTE', 'PROCESSANDO', 'PROCESSADO', 'FALHOU');
  end if;

  if not exists (select 1 from pg_type where typname = 'status_conciliacao') then
    create type status_conciliacao as enum ('NAO_CONCILIADO', 'CONCILIADO', 'IGNORADO');
  end if;
end $$;

-- =========================
-- TABELAS
-- =========================

create table if not exists public.empresas (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null, -- auth.users.id
  nome text not null,
  cnpj text not null,
  regime regime_tributario not null,
  municipio text not null,
  uf char(2) not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint empresas_cnpj_format check (length(cnpj) in (11,14)), -- MVP: aceita 11/14 (ajuste depois)
  constraint empresas_cnpj_unique unique (cnpj)
);

create index if not exists idx_empresas_owner on public.empresas(owner_id);

create table if not exists public.empresa_usuarios (
  id uuid primary key default gen_random_uuid(),
  empresa_id uuid not null references public.empresas(id) on delete cascade,
  user_id uuid not null, -- auth.users.id
  role text not null default 'member', -- 'owner'|'member' (MVP simplificado)
  created_at timestamptz not null default now(),
  constraint empresa_usuarios_unique unique (empresa_id, user_id)
);

create index if not exists idx_empresa_usuarios_user on public.empresa_usuarios(user_id);
create index if not exists idx_empresa_usuarios_empresa on public.empresa_usuarios(empresa_id);

create table if not exists public.contas_bancarias (
  id uuid primary key default gen_random_uuid(),
  empresa_id uuid not null references public.empresas(id) on delete cascade,
  banco text not null,
  tipo text not null, -- 'corrente'|'poupanca'|'outros' (MVP)
  identificador text not null, -- ex: "agencia/conta" ou "apelido"
  created_at timestamptz not null default now()
);

create index if not exists idx_contas_empresa on public.contas_bancarias(empresa_id);

create table if not exists public.extratos (
  id uuid primary key default gen_random_uuid(),
  conta_id uuid not null references public.contas_bancarias(id) on delete cascade,
  data_upload timestamptz not null default now(),
  arquivo_path text not null,
  status status_processamento not null default 'PENDENTE',
  erro text null
);

create index if not exists idx_extratos_conta on public.extratos(conta_id);
create index if not exists idx_extratos_status on public.extratos(status);

create table if not exists public.notas_fiscais (
  id uuid primary key default gen_random_uuid(),
  empresa_id uuid not null references public.empresas(id) on delete cascade,
  xml_path text not null,
  cnpj_emitente text not null,
  cnpj_destinatario text not null,
  valor numeric(14,2) not null,
  data_emissao date not null,
  chave_acesso text null,
  created_at timestamptz not null default now()
);

create index if not exists idx_nf_empresa on public.notas_fiscais(empresa_id);
create index if not exists idx_nf_data_valor on public.notas_fiscais(data_emissao, valor);

create table if not exists public.transacoes (
  id uuid primary key default gen_random_uuid(),
  extrato_id uuid not null references public.extratos(id) on delete cascade,
  data date not null,
  valor numeric(14,2) not null,
  descricao text not null,
  identificador text null, -- id do banco / hash do lançamento
  categoria text null, -- determinística (MVP)
  status_conciliacao status_conciliacao not null default 'NAO_CONCILIADO',
  nota_fiscal_id uuid null references public.notas_fiscais(id) on delete set null,
  created_at timestamptz not null default now()
);

create index if not exists idx_tx_extrato on public.transacoes(extrato_id);
create index if not exists idx_tx_data_valor on public.transacoes(data, valor);
create index if not exists idx_tx_status on public.transacoes(status_conciliacao);

create table if not exists public.casos_inconsistencia (
  id uuid primary key default gen_random_uuid(),
  empresa_id uuid not null references public.empresas(id) on delete cascade,
  tipo text not null, -- 'NF_SEM_PAGAMENTO'|'PAGAMENTO_SEM_NF'|'VALOR_DIVERGENTE' etc
  severidade text not null default 'media', -- 'baixa'|'media'|'alta'
  referencia_id uuid null, -- id relacionado (transacao/nf etc) - MVP
  descricao text not null,
  status text not null default 'aberto', -- 'aberto'|'resolvido'|'ignorado'
  created_at timestamptz not null default now(),
  resolved_at timestamptz null
);

create index if not exists idx_incons_empresa on public.casos_inconsistencia(empresa_id);
create index if not exists idx_incons_status on public.casos_inconsistencia(status);

create table if not exists public.logs (
  id uuid primary key default gen_random_uuid(),
  empresa_id uuid null references public.empresas(id) on delete set null,
  user_id uuid null,
  action text not null,
  meta jsonb null,
  created_at timestamptz not null default now()
);

create index if not exists idx_logs_empresa on public.logs(empresa_id);
create index if not exists idx_logs_action on public.logs(action);

-- =========================
-- TRIGGERS (updated_at)
-- =========================
create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists trg_empresas_updated_at on public.empresas;
create trigger trg_empresas_updated_at
before update on public.empresas
for each row execute function public.set_updated_at();

-- =========================
-- FUNÇÃO AUXILIAR PARA RLS
-- =========================
create or replace function public.has_empresa_access(p_empresa_id uuid)
returns boolean
language sql
stable
as $$
  select exists (
    select 1
    from public.empresa_usuarios eu
    where eu.empresa_id = p_empresa_id
      and eu.user_id = auth.uid()
  );
$$;

-- =========================
-- RLS: habilitar e policies
-- =========================
alter table public.empresas enable row level security;
alter table public.empresa_usuarios enable row level security;
alter table public.contas_bancarias enable row level security;
alter table public.extratos enable row level security;
alter table public.transacoes enable row level security;
alter table public.notas_fiscais enable row level security;
alter table public.casos_inconsistencia enable row level security;
alter table public.logs enable row level security;

-- empresas: usuário vê se é membro
drop policy if exists "empresas_select" on public.empresas;
create policy "empresas_select"
on public.empresas
for select
using (public.has_empresa_access(id));

-- empresas: criar apenas se for dono (owner_id = auth.uid())
drop policy if exists "empresas_insert" on public.empresas;
create policy "empresas_insert"
on public.empresas
for insert
with check (owner_id = auth.uid());

-- empresas: update apenas se for owner
drop policy if exists "empresas_update" on public.empresas;
create policy "empresas_update"
on public.empresas
for update
using (owner_id = auth.uid())
with check (owner_id = auth.uid());

-- membership: usuário vê apenas suas memberships
drop policy if exists "empresa_usuarios_select" on public.empresa_usuarios;
create policy "empresa_usuarios_select"
on public.empresa_usuarios
for select
using (user_id = auth.uid());

-- membership: apenas owner da empresa pode adicionar/remover membros
drop policy if exists "empresa_usuarios_manage" on public.empresa_usuarios;
create policy "empresa_usuarios_manage"
on public.empresa_usuarios
for all
using (
  exists (select 1 from public.empresas e where e.id = empresa_id and e.owner_id = auth.uid())
)
with check (
  exists (select 1 from public.empresas e where e.id = empresa_id and e.owner_id = auth.uid())
);

-- contas_bancarias: acesso via empresa
drop policy if exists "contas_select" on public.contas_bancarias;
create policy "contas_select"
on public.contas_bancarias
for select
using (public.has_empresa_access(empresa_id));

drop policy if exists "contas_write" on public.contas_bancarias;
create policy "contas_write"
on public.contas_bancarias
for insert
with check (public.has_empresa_access(empresa_id));

drop policy if exists "contas_update_delete" on public.contas_bancarias;
create policy "contas_update_delete"
on public.contas_bancarias
for update
using (public.has_empresa_access(empresa_id))
with check (public.has_empresa_access(empresa_id));

-- extratos: acesso via conta -> empresa
create or replace view public.v_extratos_empresa as
select ex.*, cb.empresa_id
from public.extratos ex
join public.contas_bancarias cb on cb.id = ex.conta_id;

drop policy if exists "extratos_select" on public.extratos;
create policy "extratos_select"
on public.extratos
for select
using (
  exists (
    select 1
    from public.contas_bancarias cb
    where cb.id = conta_id
      and public.has_empresa_access(cb.empresa_id)
  )
);

drop policy if exists "extratos_insert" on public.extratos;
create policy "extratos_insert"
on public.extratos
for insert
with check (
  exists (
    select 1
    from public.contas_bancarias cb
    where cb.id = conta_id
      and public.has_empresa_access(cb.empresa_id)
  )
);

drop policy if exists "extratos_update" on public.extratos;
create policy "extratos_update"
on public.extratos
for update
using (
  exists (
    select 1 from public.contas_bancarias cb
    where cb.id = conta_id
      and public.has_empresa_access(cb.empresa_id)
  )
)
with check (
  exists (
    select 1 from public.contas_bancarias cb
    where cb.id = conta_id
      and public.has_empresa_access(cb.empresa_id)
  )
);

-- notas_fiscais: acesso via empresa
drop policy if exists "nf_select" on public.notas_fiscais;
create policy "nf_select"
on public.notas_fiscais
for select
using (public.has_empresa_access(empresa_id));

drop policy if exists "nf_write" on public.notas_fiscais;
create policy "nf_write"
on public.notas_fiscais
for insert
with check (public.has_empresa_access(empresa_id));

drop policy if exists "nf_update" on public.notas_fiscais;
create policy "nf_update"
on public.notas_fiscais
for update
using (public.has_empresa_access(empresa_id))
with check (public.has_empresa_access(empresa_id));

-- transacoes: acesso via extrato -> conta -> empresa
drop policy if exists "tx_select" on public.transacoes;
create policy "tx_select"
on public.transacoes
for select
using (
  exists (
    select 1
    from public.extratos ex
    join public.contas_bancarias cb on cb.id = ex.conta_id
    where ex.id = extrato_id
      and public.has_empresa_access(cb.empresa_id)
  )
);

drop policy if exists "tx_write" on public.transacoes;
create policy "tx_write"
on public.transacoes
for insert
with check (
  exists (
    select 1
    from public.extratos ex
    join public.contas_bancarias cb on cb.id = ex.conta_id
    where ex.id = extrato_id
      and public.has_empresa_access(cb.empresa_id)
  )
);

drop policy if exists "tx_update" on public.transacoes;
create policy "tx_update"
on public.transacoes
for update
using (
  exists (
    select 1
    from public.extratos ex
    join public.contas_bancarias cb on cb.id = ex.conta_id
    where ex.id = extrato_id
      and public.has_empresa_access(cb.empresa_id)
  )
)
with check (
  exists (
    select 1
    from public.extratos ex
    join public.contas_bancarias cb on cb.id = ex.conta_id
    where ex.id = extrato_id
      and public.has_empresa_access(cb.empresa_id)
  )
);

-- inconsistencias: acesso via empresa
drop policy if exists "incons_select" on public.casos_inconsistencia;
create policy "incons_select"
on public.casos_inconsistencia
for select
using (public.has_empresa_access(empresa_id));

drop policy if exists "incons_write" on public.casos_inconsistencia;
create policy "incons_write"
on public.casos_inconsistencia
for insert
with check (public.has_empresa_access(empresa_id));

drop policy if exists "incons_update" on public.casos_inconsistencia;
create policy "incons_update"
on public.casos_inconsistencia
for update
using (public.has_empresa_access(empresa_id))
with check (public.has_empresa_access(empresa_id));

-- logs: leitura restrita ao owner da empresa (ou ao próprio user se log sem empresa)
drop policy if exists "logs_select" on public.logs;
create policy "logs_select"
on public.logs
for select
using (
  (empresa_id is null and user_id = auth.uid())
  or
  (empresa_id is not null and exists (select 1 from public.empresas e where e.id = empresa_id and e.owner_id = auth.uid()))
);

drop policy if exists "logs_insert" on public.logs;
create policy "logs_insert"
on public.logs
for insert
with check (user_id = auth.uid());
