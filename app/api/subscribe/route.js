import { NextResponse } from "next/server";
import { validateLeadInput } from "@/lib/leadValidation";
import { submitLead } from "@/lib/leadSubscription";

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

export async function POST(request) {
  /** @type {{ name?: string; email?: string; consent?: boolean; companyWebsite?: string }} */
  const payload = await request.json();

  if (payload.companyWebsite) {
    return NextResponse.json({ message: "Recebido." }, { status: 200 });
  }

  const validationErrors = validateLeadInput(payload);

  if (validationErrors.name) {
    return NextResponse.json(
      { message: validationErrors.name },
      { status: 400 }
    );
  }

  if (validationErrors.email) {
    return NextResponse.json(
      { message: validationErrors.email },
      { status: 400 }
    );
  }

  if (validationErrors.consent) {
    return NextResponse.json(
      { message: "É necessário aceitar o consentimento para continuar." },
      { status: 400 }
    );
  }

  const config = getSupabaseConfig();

  if (!config) {
    return NextResponse.json(
      { message: "Credenciais do Supabase não configuradas." },
      { status: 500 }
    );
  }

  const result = await submitLead(
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
    return NextResponse.json(
      { message: "Cadastro realizado! Em breve entraremos em contato." },
      { status: 200 }
    );
  }

  if (result.status === "duplicate") {
    return NextResponse.json(
      { message: "E-mail já cadastrado. Avisaremos sobre as novidades." },
      { status: 200 }
    );
  }

  return NextResponse.json(
    { message: "Falha ao salvar seus dados. Tente novamente." },
    { status: 500 }
  );
}
