# Contribuindo com o FiscalBox Upload

Obrigado por contribuir com o FiscalBox Upload.
Este documento define regras simples para manter **qualidade, previsibilidade e velocidade** no desenvolvimento.

O projeto está em fase de **MVP / Soft Launch**, portanto priorizamos clareza e baixo atrito.

---

## Princípios Gerais

* Simplicidade > complexidade
* Código legível > otimização prematura
* Automação > processos manuais
* CI sempre verde

---

## Estratégia de Branches

Utilizamos uma estratégia simples baseada em *trunk-based development*.

* `main`
  Branch principal. Deve estar **sempre estável**.

* `feature/<descricao-curta>`
  Branches para desenvolvimento de funcionalidades ou melhorias.

Regras importantes:

* Nunca faça push direto na `main`
* Toda mudança deve passar por Pull Request

Exemplo de branch:

```
feature/ofx-parser
```

---

## Commits

Utilizamos o padrão **Conventional Commits**.

Tipos mais comuns:

* `feat:` nova funcionalidade
* `fix:` correção de bug
* `chore:` configuração, infra, docs
* `refactor:` refatoração sem mudança de comportamento
* `test:` adição ou ajuste de testes

Exemplos:

```
feat: add OFX parser
fix: handle duplicated transactions
chore: configure CI pipeline
```

Commits pequenos e objetivos são preferíveis.

---

## Pull Requests

Antes de abrir um Pull Request, verifique:

* O código compila
* O CI está verde
* Não há segredos commitados (.env, tokens, chaves)
* A mudança resolve **um único problema**

Todo Pull Request deve conter:

* Descrição clara do que foi feito
* Contexto do porquê da mudança
* Impactos relevantes (se houver)

Pull Requests que quebram o build ou violam as regras de branch **não serão aceitos**.

---

## Qualidade de Código

* Lint e testes fazem parte do pipeline de CI
* Código deve ser legível e autoexplicativo
* Evite lógica fiscal ou contábil “hard-coded” sem documentação

---

## Testes

Sempre que possível:

* Adicione testes unitários para novas funcionalidades
* Garanta que regras determinísticas tenham casos de borda cobertos

Mesmo no MVP, testes evitam regressões silenciosas.

---

## Segurança

* Nunca commite segredos ou credenciais
* Use variáveis de ambiente para dados sensíveis
* Qualquer dúvida sobre segurança deve ser levantada antes do merge

Para reporte de vulnerabilidades, consulte `SECURITY.md`.

---

## Comunicação

Se algo não estiver claro:

* Abra uma issue
* Documente no PR
* Prefira alinhar antes de implementar algo grande

---

## Licença

Este projeto é de uso privado.
Contribuições não concedem direitos de redistribuição.
