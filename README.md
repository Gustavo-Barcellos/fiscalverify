# FiscalBox Upload

FiscalBox Upload é um SaaS B2B focado em **conciliação fiscal automatizada via upload** (OFX / CSV / XML), voltado para **PMEs e escritórios de contabilidade**.

O produto permite:

* Importar extratos bancários e notas fiscais
* Normalizar e conciliar dados
* Identificar inconsistências (NF sem pagamento, pagamento sem NF, divergências)
* Gerar relatórios operacionais para apoio à conferência fiscal

⚠️ Importante:
FiscalBox Upload é uma **ferramenta de apoio operacional**.
Não substitui validação contábil ou jurídica por profissional habilitado.

---

## Status do Projeto

🚧 **Em desenvolvimento (MVP / Soft Launch)**
Este repositório está em fase inicial de construção do produto.

---

## Stack (inicial)

* Frontend: Next.js
* Backend: Supabase (Postgres + Auth + RLS)
* Infra: Vercel (preview automático por PR)
* CI/CD: GitHub Actions

---

## Desenvolvimento

### Pré-requisitos

* Node.js LTS
* npm

### Variáveis de ambiente

Crie um arquivo `.env.local` com as credenciais do Supabase para gravar leads:

```env
SUPABASE_URL= https://<seu-projeto>.supabase.co
SUPABASE_ANON_KEY= <sua-chave-anon>
```

### Rodar localmente (quando aplicável)

```sh
npm install
npm run dev
```

### Testes

```sh
npm test
```

---

## CI/CD

* Todo push ou Pull Request para `main` executa:

  * Lint
  * Testes
  * Build
* Merges na branch `main` exigem CI verde.
* Deploy de preview é feito automaticamente via Vercel.

---

## Contribuição

Consulte o arquivo [CONTRIBUTING.md](./CONTRIBUTING.md).

---

## Licença

Uso interno / privado.
Licença será definida antes do lançamento público.
