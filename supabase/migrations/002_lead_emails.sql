-- 002_lead_emails.sql
-- Captura de leads para landing page

create table if not exists public.lead_emails (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  consent boolean not null default false,
  created_at timestamptz not null default now(),
  constraint lead_emails_email_unique unique (email)
);

alter table public.lead_emails enable row level security;

drop policy if exists "lead_emails_insert_public" on public.lead_emails;
create policy "lead_emails_insert_public"
on public.lead_emails
for insert
to anon, authenticated
with check (true);
