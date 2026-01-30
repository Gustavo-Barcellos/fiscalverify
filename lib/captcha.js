import { createHmac, randomBytes, timingSafeEqual } from "node:crypto";

const normalizeCaptchaValue = (value = "") => value.trim();
const fallbackSecret = randomBytes(32).toString("hex");

const getCaptchaSecret = () =>
  process.env.CAPTCHA_SECRET ?? fallbackSecret;

const generateCaptchaNumbers = () => {
  const first = Math.floor(Math.random() * 9) + 1;
  const second = Math.floor(Math.random() * 9) + 1;
  return { first, second };
};

const createCaptchaChallenge = () => {
  const { first, second } = generateCaptchaNumbers();
  const answer = String(first + second);
  const nonce = randomBytes(16).toString("hex");
  const signature = createHmac("sha256", getCaptchaSecret())
    .update(`${nonce}:${answer}`)
    .digest("hex");

  return {
    question: `Quanto é ${first} + ${second}?`,
    token: `${nonce}:${signature}`,
  };
};

const verifyCaptchaAnswer = (answer, token) => {
  if (!token) {
    return false;
  }

  const [nonce, signature] = token.split(":");

  if (!nonce || !signature) {
    return false;
  }

  const expected = createHmac("sha256", getCaptchaSecret())
    .update(`${nonce}:${normalizeCaptchaValue(answer)}`)
    .digest("hex");

  if (expected.length !== signature.length) {
    return false;
  }

  return timingSafeEqual(Buffer.from(expected), Buffer.from(signature));
};

export {
  createCaptchaChallenge,
  normalizeCaptchaValue,
  verifyCaptchaAnswer,
};
