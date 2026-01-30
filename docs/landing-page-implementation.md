# Implementação da Landing Page FiscalVerify

Este documento descreve, passo a passo, como a landing page foi implementada, quais arquivos foram criados ou alterados e como configurar o ambiente para rodar localmente.

## 1. Visão geral da solução

A landing page foi construída com a estrutura `app/` do Next.js, seguindo o wireframe e a identidade visual definidos no plano de branding. O fluxo principal inclui:

1. Hero com proposta de valor e CTA.
2. Seção de benefícios em cards.
3. Seção "Como funciona" em três passos.
4. Prova social com dados resumidos.
5. Formulário de captura com validação e proteção anti-spam (honeypot).
6. Rodapé com links institucionais e texto de SEO.

## 2. Arquivos criados/alterados

### Frontend

- `app/page.tsx`: layout da landing page, seções, copy e JSON-LD de SEO.
- `app/components/LeadForm.tsx`: formulário de captura com validação client-side.
- `app/layout.tsx`: metadados (title/description/OG) e fontes do Google.
- `app/globals.css`: cores e tipografia da marca.
- `public/hero-illustration.svg`: ilustração principal do hero.
- `public/og-fiscalverify.svg`: imagem Open Graph.

### Backend

- `app/api/subscribe/route.js`: endpoint `/api/subscribe` para persistir leads no Supabase.
- `supabase/migrations/002_lead_emails.sql`: criação da tabela `lead_emails` e políticas RLS.

### Compartilhado

- `lib/leadValidation.js`: validação reutilizável para nome, e-mail e consentimento.
- `lib/leadSubscription.js`: envio dos dados para o Supabase via REST.

### Testes

- `tests/leadValidation.test.js`: garante que a validação aceita dados válidos e rejeita inválidos.
- `tests/leadSubscription.test.js`: valida a integração com o Supabase via mock de `fetch`.

### Documentação

- `README.md`: instruções de ambiente e testes.

## 3. Variáveis de ambiente

Crie um arquivo `.env.local` na raiz do projeto com:

```env
SUPABASE_URL= https://<seu-projeto>.supabase.co
SUPABASE_ANON_KEY= <sua-chave-anon>
```

Essas variáveis são usadas pelo endpoint `/api/subscribe` para enviar os dados ao Supabase via REST.

## 4. Estrutura do formulário de captura

- Campos: nome, e-mail e consentimento LGPD.
- Validação: feita no client e repetida no servidor para segurança.
- Honeypot: campo oculto `companyWebsite` para bloquear bots.
- Feedback: mensagens de erro e sucesso com contraste acessível.

## 5. Integração com Supabase

1. A migração `002_lead_emails.sql` cria a tabela `lead_emails` com coluna `consent`.
2. A política RLS permite apenas `INSERT` para usuários anon e autenticados.
3. O endpoint `/api/subscribe` envia um POST para `https://<projeto>.supabase.co/rest/v1/lead_emails` usando a chave `anon`.

## 6. Como rodar localmente

```sh
npm install
npm run dev
```

Abra `http://localhost:3000` para visualizar a landing page.

## 7. Testes automatizados

```sh
npm test
```

Os testes validam a lógica de validação e o envio para o Supabase usando mocks.

## 8. Possíveis erros e soluções

### Falha ao salvar e-mail (status 500)
- Verifique se `SUPABASE_URL` e `SUPABASE_ANON_KEY` estão corretos.
- Confirme se a tabela `lead_emails` existe e se a política RLS de insert está ativa.

### Rejeição por spam (honeypot)
- Se o campo `companyWebsite` estiver preenchido, o backend retorna sucesso silencioso.
- Em formulários customizados, garanta que esse campo permaneça vazio.

### Erros de validação no formulário
- O usuário precisa preencher nome, e-mail válido e consentimento.
- As mensagens são exibidas imediatamente para orientar a correção.

## 9. Recomendações futuras

- Integrar um provedor de e-mail (Mailerlite/Resend) após o insert no Supabase.
- Adicionar testes end-to-end com Playwright para validar o fluxo no navegador.
- Ajustar o conteúdo do hero para testes A/B conforme evolução do branding.
