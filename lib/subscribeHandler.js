import { validateLeadInput } from "./leadValidation.js";
import { submitLead } from "./leadSubscription.js";

const getSupabaseConfig = () => {
  const url = process.env.SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey =
    process.env.SUPABASE_ANON_KEY ??
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !anonKey) {
    return null;
  }

  return { url, anonKey };
};

const handleSubscribe = async (
  payload,
  { submitLeadFn = submitLead, getConfig = getSupabaseConfig } = {}
) => {
  if (payload.companyWebsite) {
    return { status: 200, message: "Recebido." };
  }

  const validationErrors = validateLeadInput(payload);

  if (validationErrors.name) {
    return { status: 400, message: validationErrors.name };
  }

  if (validationErrors.email) {
    return { status: 400, message: validationErrors.email };
  }

  if (validationErrors.consent) {
    return {
      status: 400,
      message: "É necessário aceitar o consentimento para continuar.",
    };
  }

  if (validationErrors.captcha) {
    return { status: 400, message: validationErrors.captcha };
  }

  const config = getConfig();

  if (!config) {
    return { status: 500, message: "Credenciais do Supabase não configuradas." };
  }

  const result = await submitLeadFn(
    {
      name: payload.name ?? "",
      email: payload.email ?? "",
      consent: Boolean(payload.consent),
    },
    {
      supabaseUrl: config.url,
      supabaseAnonKey: config.anonKey,
    }
  );

  if (result.status === "success") {
    return {
      status: 200,
      message: "Cadastro realizado! Em breve entraremos em contato.",
    };
  }

  if (result.status === "duplicate") {
    return {
      status: 200,
      message: "E-mail já cadastrado. Avisaremos sobre as novidades.",
    };
  }

  return { status: 500, message: "Falha ao salvar seus dados. Tente novamente." };
};

export { getSupabaseConfig, handleSubscribe };
