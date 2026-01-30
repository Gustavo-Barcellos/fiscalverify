import assert from "node:assert/strict";
import test from "node:test";
import { createCaptchaChallenge, verifyCaptchaAnswer } from "../lib/captcha.js";

test("captcha token validates correct answer", () => {
  const { question, token } = createCaptchaChallenge();
  const numbers = question.match(/\d+/g) ?? [];

  assert.equal(numbers.length, 2);

  const answer = String(Number(numbers[0]) + Number(numbers[1]));

  assert.equal(verifyCaptchaAnswer(answer, token), true);
  assert.equal(verifyCaptchaAnswer("999", token), false);
});
