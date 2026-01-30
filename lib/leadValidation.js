import { isCaptchaValid } from "./captcha.js";

/**
 * @typedef {Object} LeadInput
 * @property {string=} name
 * @property {string=} email
 * @property {boolean=} consent
 * @property {string=} captcha
 */

/**
 * @typedef {Object<string, string>} LeadValidationErrors
 */

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * @param {LeadInput} values
 * @returns {Record<string, string>}
 */
const validateLeadInput = (values) => {
  /** @type {Record<string, string>} */
  const errors = {};

  if (!values.name || values.name.trim().length < 2) {
    errors.name = "Informe seu nome completo.";
  }

  if (!values.email || !emailRegex.test(values.email)) {
    errors.email = "Insira um e-mail válido.";
  }

  if (!values.consent) {
    errors.consent = "Você precisa concordar para continuar.";
  }

  if (!isCaptchaValid(values.captcha)) {
    errors.captcha = "Responda corretamente a verificação antispam.";
  }

  return errors;
};

export { emailRegex, validateLeadInput };
