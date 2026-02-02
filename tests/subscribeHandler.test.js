import assert from "node:assert/strict";
import test from "node:test";
import { handleSubscribe } from "../lib/subscribeHandler.js";

test("handleSubscribe rejects invalid captcha", async () => {
  const result = await handleSubscribe(
    {
      name: "Maria",
      email: "maria@empresa.com",
      consent: true,
      captcha: "3",
    },
    {
      submitLeadFn: async () => ({ status: "success" }),
      getConfig: () => ({ url: "https://example.supabase.co", anonKey: "key" }),
      verifyCaptchaFn: () => false,
      captchaToken: "token",
    }
  );

  assert.equal(result.status, 400);
});

test("handleSubscribe returns success for valid submission", async () => {
  const result = await handleSubscribe(
    {
      name: "Maria",
      email: "maria@empresa.com",
      consent: true,
      captcha: "7",
    },
    {
      submitLeadFn: async () => ({ status: "success" }),
      getConfig: () => ({ url: "https://example.supabase.co", anonKey: "key" }),
      verifyCaptchaFn: () => true,
      captchaToken: "token",
    }
  );

  assert.equal(result.status, 200);
  assert.equal(
    result.message,
    "Cadastro realizado! Em breve entraremos em contato."
  );
});

test("handleSubscribe short-circuits honeypot", async () => {
  let called = false;
  const result = await handleSubscribe(
    {
      name: "Maria",
      email: "maria@empresa.com",
      consent: true,
      captcha: "7",
      companyWebsite: "https://spam.example",
    },
    {
      submitLeadFn: async () => {
        called = true;
        return { status: "success" };
      },
      getConfig: () => ({ url: "https://example.supabase.co", anonKey: "key" }),
      verifyCaptchaFn: () => true,
      captchaToken: "token",
    }
  );

  assert.equal(result.status, 200);
  assert.equal(result.message, "Recebido.");
  assert.equal(called, false);
});
