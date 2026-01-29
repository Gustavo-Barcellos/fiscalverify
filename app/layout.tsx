import type { Metadata } from "next";
import { Inter, Roboto_Mono } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const robotoMono = Roboto_Mono({
  variable: "--font-roboto-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://fiscalverify.com.br"),
  title: "FiscalVerify | Conciliação fiscal em minutos",
  description:
    "Concilie extratos e NF-es em minutos com a FiscalVerify. Reduza erros, evite multas e ganhe tempo com relatórios automáticos.",
  openGraph: {
    title: "FiscalVerify | Conciliação fiscal em minutos",
    description:
      "Transforme horas de planilhas em minutos de upload. Conciliação automática e relatórios prontos para o fechamento mensal.",
    url: "https://fiscalverify.com.br",
    siteName: "FiscalVerify",
    images: [
      {
        url: "/og-fiscalverify.svg",
        width: 1200,
        height: 630,
        alt: "FiscalVerify - conciliação fiscal em minutos",
      },
    ],
    locale: "pt_BR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "FiscalVerify | Conciliação fiscal em minutos",
    description:
      "Concilie extratos e NF-es em minutos com a FiscalVerify e reduza o esforço do fechamento mensal.",
    images: ["/og-fiscalverify.svg"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className={`${inter.variable} ${robotoMono.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
