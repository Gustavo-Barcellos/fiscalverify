"use client";

import { useCallback, useEffect, useState } from "react";
import { validateLeadInput } from "@/lib/leadValidation";

type LeadFormValues = {
  name: string;
  email: string;
  consent: boolean;
  companyWebsite: string;
  captcha: string;
};

type LeadFormErrors = Partial<Record<keyof LeadFormValues, string>>;

type FormStatus = "idle" | "loading" | "success" | "error";

const initialValues: LeadFormValues = {
  name: "",
  email: "",
  consent: false,
  companyWebsite: "",
  captcha: "",
};

export default function LeadForm() {
  const [values, setValues] = useState<LeadFormValues>(initialValues);
  const [errors, setErrors] = useState<LeadFormErrors>({});
  const [status, setStatus] = useState<FormStatus>("idle");
  const [message, setMessage] = useState<string>("");
  const [captchaQuestion, setCaptchaQuestion] = useState<string>("");
  const [captchaLoading, setCaptchaLoading] = useState<boolean>(true);

  const fetchCaptcha = useCallback(async () => {
    setCaptchaLoading(true);
    try {
      const response = await fetch("/api/captcha");
      const payload = (await response.json()) as { question?: string };
      setCaptchaQuestion(payload.question ?? "");
    } catch {
      setCaptchaQuestion("");
    } finally {
      setCaptchaLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCaptcha();
  }, [fetchCaptcha]);

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ): void => {
    const { name, value, type, checked } = event.target;
    setValues((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const validate = (): boolean => {
    const validationErrors = validateLeadInput(values);
    const nextErrors = {
      ...validationErrors,
      companyWebsite: undefined,
    };

    setErrors(nextErrors);
    return Object.keys(validationErrors).length === 0;
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setMessage("");

    if (!validate()) {
      return;
    }

    setStatus("loading");

    try {
      const response = await fetch("/api/subscribe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      const payload = (await response.json()) as { message?: string };

      if (!response.ok) {
        setStatus("error");
        setMessage(
          payload.message ??
            "Não foi possível enviar seus dados agora. Tente novamente."
        );
        return;
      }

      setStatus("success");
      setMessage(
        payload.message ?? "Cadastro realizado! Em breve entraremos em contato."
      );
      setValues(initialValues);
      setErrors({});
      fetchCaptcha();
    } catch {
      setStatus("error");
      setMessage("Falha ao conectar. Verifique sua internet e tente novamente.");
      fetchCaptcha();
    }
  };

  return (
    <form className="space-y-6" onSubmit={handleSubmit} noValidate>
      <div className="grid gap-4">
        <label className="text-sm font-semibold text-[#1D3557]" htmlFor="name">
          Nome completo
        </label>
        <input
          id="name"
          name="name"
          type="text"
          className="w-full rounded-xl border border-[#D6DEE8] bg-white px-4 py-3 text-base text-[#343A40] shadow-sm transition-all duration-200 ease-out hover:border-[#b9c6d8] focus:border-[#1D3557] focus:outline-none focus:ring-2 focus:ring-[#1D3557]/20"
          placeholder="Ex.: Mariana Souza"
          value={values.name}
          onChange={handleChange}
          aria-invalid={errors.name ? "true" : "false"}
          aria-describedby={errors.name ? "name-error" : undefined}
        />
        {errors.name && (
          <p className="text-sm text-red-600" id="name-error">
            {errors.name}
          </p>
        )}
      </div>

      <div className="grid gap-4">
        <label className="text-sm font-semibold text-[#1D3557]" htmlFor="email">
          E-mail profissional
        </label>
        <input
          id="email"
          name="email"
          type="email"
          className="w-full rounded-xl border border-[#D6DEE8] bg-white px-4 py-3 text-base text-[#343A40] shadow-sm transition-all duration-200 ease-out hover:border-[#b9c6d8] focus:border-[#1D3557] focus:outline-none focus:ring-2 focus:ring-[#1D3557]/20"
          placeholder="voce@empresa.com.br"
          value={values.email}
          onChange={handleChange}
          aria-invalid={errors.email ? "true" : "false"}
          aria-describedby={errors.email ? "email-error" : undefined}
        />
        {errors.email && (
          <p className="text-sm text-red-600" id="email-error">
            {errors.email}
          </p>
        )}
      </div>

      <div className="flex items-start gap-3 rounded-xl border border-[#E4EAF2] bg-[#F8FAFC] p-4 text-sm text-[#4A5568]">
        <input
          id="consent"
          name="consent"
          type="checkbox"
          className="mt-1 h-4 w-4 rounded border-[#CBD5E1] text-[#1D3557] focus:ring-[#1D3557]"
          checked={values.consent}
          onChange={handleChange}
        />
        <label htmlFor="consent">
          Concordo em receber comunicações da FiscalVerify. Consulte a nossa
          Política de Privacidade e Termos de Uso.
        </label>
      </div>
      {errors.consent && (
        <p className="text-sm text-red-600">{errors.consent}</p>
      )}

      <div className="hidden">
        <label htmlFor="companyWebsite">Website</label>
        <input
          id="companyWebsite"
          name="companyWebsite"
          type="text"
          tabIndex={-1}
          autoComplete="off"
          value={values.companyWebsite}
          onChange={handleChange}
        />
      </div>

      <div className="grid gap-4">
        <label className="text-sm font-semibold text-[#1D3557]" htmlFor="captcha">
          Verificação antispam:{" "}
          {captchaLoading ? "Carregando..." : captchaQuestion}
        </label>
        <input
          id="captcha"
          name="captcha"
          type="text"
          inputMode="numeric"
          autoComplete="off"
          className="w-full rounded-xl border border-[#D6DEE8] bg-white px-4 py-3 text-base text-[#343A40] shadow-sm transition-all duration-200 ease-out hover:border-[#b9c6d8] focus:border-[#1D3557] focus:outline-none focus:ring-2 focus:ring-[#1D3557]/20"
          placeholder="Digite a resposta"
          value={values.captcha}
          onChange={handleChange}
          aria-invalid={errors.captcha ? "true" : "false"}
          aria-describedby={errors.captcha ? "captcha-error" : undefined}
        />
        {errors.captcha && (
          <p className="text-sm text-red-600" id="captcha-error">
            {errors.captcha}
          </p>
        )}
      </div>

      <div className="space-y-3">
        <button
          type="submit"
          className="flex w-full items-center justify-center rounded-full bg-[#E37400] px-6 py-3 text-base font-semibold text-white shadow-lg transition-all duration-300 ease-out hover:-translate-y-0.5 hover:bg-[#cc6600] hover:shadow-xl focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#E37400]"
          disabled={status === "loading"}
        >
          {status === "loading" ? "Enviando..." : "Quero acesso prioritário"}
        </button>
        <p className="text-center text-sm text-[#6B7280]">
          Sem cartão de crédito • Cancelamento a qualquer momento
        </p>
      </div>

      {status !== "idle" && message && (
        <div
          className={`rounded-xl border px-4 py-3 text-sm ${
            status === "success"
              ? "border-green-200 bg-green-50 text-green-700"
              : "border-red-200 bg-red-50 text-red-700"
          }`}
          role="status"
        >
          {message}
        </div>
      )}
    </form>
  );
}
