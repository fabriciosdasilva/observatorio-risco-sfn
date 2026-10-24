import type { Metadata } from "next";
import { Roboto_Slab, Open_Sans, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const robotoSlab = Roboto_Slab({
  variable: "--font-serif",
  subsets: ["latin"],
  weight: ["400", "600", "700", "800"],
});

const openSans = Open_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Observatório de Risco do SFN | Data Science no Setor Bancário",
  description:
    "Inteligência analítica, modelagem preditiva e backtesting quantitativo sobre o Sistema Financeiro Nacional com dados 100% reais do BACEN e CVM.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="pt-BR"
      className={`${robotoSlab.variable} ${openSans.variable} ${jetbrainsMono.variable} antialiased`}
    >
      <body className="font-sans bg-[#f7f8fa] text-[#3d4449] min-h-screen">
        {children}
      </body>
    </html>
  );
}
