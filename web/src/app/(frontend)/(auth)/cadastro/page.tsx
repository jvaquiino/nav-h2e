import type { Metadata } from "next";
import CadastroForm from "./_components/CadastroForm";

export const metadata: Metadata = { title: "Criar conta" };

export default function Cadastro() {
  return <CadastroForm />;
}
