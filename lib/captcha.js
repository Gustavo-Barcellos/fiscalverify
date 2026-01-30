const captchaChallenge = {
  question: "Quanto é 3 + 4?",
  answer: "7",
};

const normalizeCaptchaValue = (value = "") => value.trim();

const isCaptchaValid = (value) =>
  normalizeCaptchaValue(value) === captchaChallenge.answer;

export { captchaChallenge, isCaptchaValid };
