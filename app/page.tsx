import Image from "next/image";
import LeadForm from "./components/LeadForm";

const benefits = [
  {
    title: "Economia de tempo real",
    description:
      "Reduza o fechamento mensal de 40 horas para cerca de 4 horas com conciliações automáticas.",
    icon: (
      <svg
        aria-hidden="true"
        viewBox="0 0 24 24"
        className="h-6 w-6 text-[#2E7D32]"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      >
        <circle cx="12" cy="12" r="9" />
        <path strokeLinecap="round" d="M12 7v5l3 3" />
      </svg>
    ),
  },
  {
    title: "Menos erros e multas",
    description:
      "Matching determinístico e alertas inteligentes para identificar inconsistências antes do prazo.",
    icon: (
      <svg
        aria-hidden="true"
        viewBox="0 0 24 24"
        className="h-6 w-6 text-[#1D3557]"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      >
        <path
          strokeLinecap="round"
          d="M12 3l8 4v5c0 5-3.5 7.5-8 9-4.5-1.5-8-4-8-9V7l8-4z"
        />
        <path strokeLinecap="round" d="m9 12 2 2 4-4" />
      </svg>
    ),
  },
  {
    title: "Escalabilidade sem equipe",
    description:
      "A plataforma é self-service e preparada para lidar com múltiplas empresas e arquivos simultâneos.",
    icon: (
      <svg
        aria-hidden="true"
        viewBox="0 0 24 24"
        className="h-6 w-6 text-[#E37400]"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      >
        <path strokeLinecap="round" d="M3 12h6l3-8 3 16 3-8h3" />
      </svg>
    ),
  },
  {
    title: "Risco regulatório reduzido",
    description:
      "Fluxo upload-first elimina integrações bancárias complexas e garante compliance contínuo.",
    icon: (
      <svg
        aria-hidden="true"
        viewBox="0 0 24 24"
        className="h-6 w-6 text-[#2E7D32]"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      >
        <path strokeLinecap="round" d="M4 12h16" />
        <path strokeLinecap="round" d="M12 4v16" />
      </svg>
    ),
  },
];

const steps = [
  {
    title: "Upload inteligente",
    description:
      "Envie extratos OFX/CSV/XML e notas fiscais eletrônicas em poucos cliques.",
  },
  {
    title: "Conciliação automática",
    description:
      "Cruzamos valores, datas e descrições para identificar divergências instantaneamente.",
  },
  {
    title: "Relatórios prontos",
    description:
      "Revise, aprove e exporte relatórios completos em PDF ou CSV para o fechamento.",
  },
];

export default function Home() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "FiscalVerify",
    applicationCategory: "BusinessApplication",
    operatingSystem: "Web",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "BRL",
    },
    description:
      "Plataforma de conciliação fiscal que cruza extratos e NF-es em minutos.",
  };

  return (
    <div className="min-h-screen bg-[#F5F7FA] text-[#343A40]">
      <header className="border-b border-[#E4EAF2] bg-white">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-6">
          <div className="flex items-center gap-3 text-lg font-semibold text-[#1D3557]">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#EAF1FA]">
              <span className="text-xl">⬆️</span>
            </span>
            FiscalVerify
          </div>
          <a
            href="#formulario"
            className="hidden rounded-full border border-[#E37400] px-5 py-2 text-sm font-semibold text-[#E37400] transition hover:bg-[#E37400] hover:text-white md:inline-flex"
          >
            Quero acesso
          </a>
        </div>
      </header>

      <main>
        <section className="bg-white">
          <div className="mx-auto grid w-full max-w-6xl items-center gap-12 px-6 py-16 lg:grid-cols-[1.1fr_0.9fr] lg:py-24">
            <div className="space-y-6">
              <span className="inline-flex items-center gap-2 rounded-full bg-[#EAF1FA] px-4 py-2 text-sm font-semibold text-[#1D3557]">
                Conciliação fiscal em minutos
              </span>
              <h1 className="text-4xl font-semibold leading-tight text-[#1D3557] sm:text-5xl">
                Feche o mês sem planilhas: concilie extratos e NF-es em minutos
              </h1>
              <p className="text-lg leading-relaxed text-[#4B5563]">
                Transforme horas de conciliação manual em minutos de upload. A
                FiscalVerify cruza valores e datas, identifica inconsistências e
                gera relatórios completos automaticamente.
              </p>
              <div className="flex flex-col gap-4 sm:flex-row">
                <a
                  href="#formulario"
                  className="inline-flex items-center justify-center rounded-full bg-[#E37400] px-6 py-3 text-base font-semibold text-white shadow-lg transition hover:bg-[#cc6600]"
                >
                  Comece agora – teste grátis
                </a>
                <a
                  href="#como-funciona"
                  className="inline-flex items-center justify-center rounded-full border border-[#1D3557] px-6 py-3 text-base font-semibold text-[#1D3557] transition hover:bg-[#1D3557] hover:text-white"
                >
                  Ver como funciona
                </a>
              </div>
              <p className="text-sm text-[#6B7280]">
                Sem cartão de crédito • Cancelamento instantâneo
              </p>
            </div>
            <div className="relative">
              <div className="absolute -left-6 -top-6 h-20 w-20 rounded-full bg-[#E37400]/10" />
              <Image
                src="/hero-illustration.svg"
                alt="Profissional analisando relatórios fiscais no laptop"
                width={520}
                height={420}
                className="relative z-10 w-full"
                priority
              />
            </div>
          </div>
        </section>

        <section className="mx-auto w-full max-w-6xl px-6 py-16" id="beneficios">
          <div className="mb-10 max-w-3xl space-y-4">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#2E7D32]">
              Benefícios
            </p>
            <h2 className="text-3xl font-semibold text-[#1D3557]">
              Confiança, clareza e velocidade para equipes contábeis e PMEs
            </h2>
            <p className="text-lg text-[#4B5563]">
              A FiscalVerify foi criada para eliminar o caos fiscal, reduzir o
              retrabalho e acelerar a entrega de relatórios.
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-2">
            {benefits.map((benefit) => (
              <div
                key={benefit.title}
                className="flex gap-4 rounded-2xl border border-[#E4EAF2] bg-white p-6 shadow-sm"
              >
                <div className="mt-1 flex h-12 w-12 items-center justify-center rounded-xl bg-[#F5F7FA]">
                  {benefit.icon}
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-[#1D3557]">
                    {benefit.title}
                  </h3>
                  <p className="mt-2 text-sm text-[#4B5563]">
                    {benefit.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="bg-white" id="como-funciona">
          <div className="mx-auto w-full max-w-6xl px-6 py-16">
            <div className="mb-10 max-w-3xl space-y-4">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#E37400]">
                Como funciona
              </p>
              <h2 className="text-3xl font-semibold text-[#1D3557]">
                Três passos simples para conciliar seu mês
              </h2>
              <p className="text-lg text-[#4B5563]">
                Faça upload, acompanhe a conciliação automática e exporte seus
                relatórios quando estiver pronto.
              </p>
            </div>
            <div className="grid gap-6 md:grid-cols-3">
              {steps.map((step, index) => (
                <div
                  key={step.title}
                  className="rounded-2xl border border-[#E4EAF2] bg-[#F9FBFF] p-6"
                >
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#1D3557] text-base font-semibold text-white">
                    {index + 1}
                  </span>
                  <h3 className="mt-4 text-lg font-semibold text-[#1D3557]">
                    {step.title}
                  </h3>
                  <p className="mt-2 text-sm text-[#4B5563]">
                    {step.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="mx-auto w-full max-w-6xl px-6 py-16">
          <div className="grid gap-8 rounded-3xl border border-[#E4EAF2] bg-gradient-to-r from-[#F9FBFF] via-white to-[#F5F7FA] p-10 lg:grid-cols-[1.2fr_0.8fr]">
            <div className="space-y-4">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#2E7D32]">
                Prova social
              </p>
              <h2 className="text-3xl font-semibold text-[#1D3557]">
                +50 PMEs já reduziram 90% do tempo de fechamento
              </h2>
              <p className="text-base text-[#4B5563]">
                "Finalmente conseguimos fechar o mês sem virar noites. A
                FiscalVerify nos deu visibilidade e confiança para crescer."
              </p>
              <p className="text-sm font-semibold text-[#1D3557]">
                Juliana P. • Sócia de escritório contábil digital
              </p>
            </div>
            <div className="grid gap-4 rounded-2xl bg-white p-6 text-center shadow-sm">
              <div>
                <p className="text-4xl font-semibold text-[#1D3557]">36h</p>
                <p className="text-sm text-[#6B7280]">Economizadas por mês</p>
              </div>
              <div>
                <p className="text-4xl font-semibold text-[#2E7D32]">98%</p>
                <p className="text-sm text-[#6B7280]">Conciliações automáticas</p>
              </div>
              <div>
                <p className="text-4xl font-semibold text-[#E37400]">24/7</p>
                <p className="text-sm text-[#6B7280]">Relatórios disponíveis</p>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-[#1D3557]" id="formulario">
          <div className="mx-auto w-full max-w-6xl px-6 py-16 text-white">
            <div className="grid gap-10 lg:grid-cols-[1fr_0.9fr]">
              <div className="space-y-6">
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#FCD34D]">
                  Lista VIP
                </p>
                <h2 className="text-3xl font-semibold">
                  Garanta acesso antecipado à FiscalVerify
                </h2>
                <p className="text-base text-[#EAF1FA]">
                  Receba a demonstração guiada, materiais de boas práticas e seja
                  o primeiro a testar as automações de conciliação.
                </p>
                <ul className="space-y-3 text-sm text-[#EAF1FA]">
                  <li>✔ Diagnóstico inicial gratuito para sua empresa</li>
                  <li>✔ Checklist de fechamento mensal simplificado</li>
                  <li>✔ Conteúdos sobre LGPD e compliance fiscal</li>
                </ul>
              </div>
              <div className="rounded-3xl bg-white p-8 text-[#343A40] shadow-xl">
                <LeadForm />
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-[#0F1E33] text-[#F5F7FA]">
        <div className="mx-auto w-full max-w-6xl space-y-6 px-6 py-10">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <p className="text-lg font-semibold">FiscalVerify</p>
            <div className="flex flex-wrap gap-4 text-sm">
              <a className="hover:text-white" href="/politica-privacidade">
                Política de Privacidade
              </a>
              <a className="hover:text-white" href="/termos">
                Termos de Uso
              </a>
              <a className="hover:text-white" href="mailto:contato@fiscalverify.com.br">
                contato@fiscalverify.com.br
              </a>
            </div>
          </div>
          <p className="text-sm text-[#C7D2E1]">
            FiscalVerify é uma plataforma de conciliação fiscal que transforma
            horas de planilhas em minutos de upload, com relatórios confiáveis e
            compliance contínuo.
          </p>
        </div>
      </footer>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
    </div>
  );
}
