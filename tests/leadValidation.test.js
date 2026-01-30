import assert from "node:assert/strict";
import test from "node:test";
import { validateLeadInput } from "../lib/leadValidation.js";

test("validateLeadInput returns errors for missing fields", () => {
  const errors = validateLeadInput({});

  assert.equal(errors.name, "Informe seu nome completo.");
  assert.equal(errors.email, "Insira um e-mail válido.");
  assert.equal(errors.consent, "Você precisa concordar para continuar.");
  assert.equal(errors.captcha, "Responda a verificação antispam.");
});

test("validateLeadInput passes for valid fields", () => {
  const errors = validateLeadInput({
    name: "Maria Silva",
    email: "maria@empresa.com",
    consent: true,
    captcha: "10",
  });

  assert.deepEqual(errors, {});
});
