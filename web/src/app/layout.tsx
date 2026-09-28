import type { Metadata } from "next";
import { Archivo, Source_Serif_4 } from "next/font/google";
import "./globals.css";
import { ToastProvider } from "@/components/common/ToastProvider";

const archivo = Archivo({
  variable: "--font-archivo",
  subsets: ["latin"],
  axes: ["wdth"],
});

const sourceSerif = Source_Serif_4({
  variable: "--font-source-serif",
  subsets: ["latin"],
  style: ["normal", "italic"],
});

export const metadata: Metadata = {
  title: {
    default: "Nav H2E | Hidrogênio Naval",
    template: "%s | Hidrogênio Naval",
  },
  description:
    "Blog dos alunos de Engenharia Naval da Poli-USP sobre o hidrogênio como combustível para a navegação.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className={`${archivo.variable} ${sourceSerif.variable}`}>
      <body className="antialiased">
        {children}

        <ToastProvider />
      </body>
    </html>
  );
}
