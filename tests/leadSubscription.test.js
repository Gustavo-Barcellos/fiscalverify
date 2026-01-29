import assert from "node:assert/strict";
import test from "node:test";
import { submitLead } from "../lib/leadSubscription.js";

const createFetchResponse = (status, payload) =>
  Promise.resolve(
    new Response(payload ? JSON.stringify(payload) : null, {
      status,
      headers: { "Content-Type": "application/json" },
    })
  );

test("submitLead returns success for 201", async () => {
  const result = await submitLead(
    { name: "Maria", email: "maria@empresa.com", consent: true },
    {
      supabaseUrl: "https://example.supabase.co",
      supabaseAnonKey: "anon-key",
      fetcher: () => createFetchResponse(201),
    }
  );

  assert.equal(result.status, "success");
});

test("submitLead returns duplicate for 409", async () => {
  const result = await submitLead(
    { name: "Maria", email: "maria@empresa.com", consent: true },
    {
      supabaseUrl: "https://example.supabase.co",
      supabaseAnonKey: "anon-key",
      fetcher: () => createFetchResponse(409),
    }
  );

  assert.equal(result.status, "duplicate");
});

test("submitLead returns error for 500", async () => {
  const result = await submitLead(
    { name: "Maria", email: "maria@empresa.com", consent: true },
    {
      supabaseUrl: "https://example.supabase.co",
      supabaseAnonKey: "anon-key",
      fetcher: () =>
        createFetchResponse(500, { message: "Unexpected error" }),
    }
  );

  assert.equal(result.status, "error");
});
