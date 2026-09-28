import Link from "next/link";
import { Instagram, Mail } from "lucide-react";
import { BrandMark } from "@/components/base/Hull";

// TODO: confirmar e-mail e perfil do Instagram oficiais do projeto.
const CONTACT = {
  email: "navegantes.navh2e@usp.br",
  instagram: "nav.h2e",
};

const Footer = () => {
  return (
    <footer id="contato" className="scroll-mt-20 border-t border-sea-foreground/10 bg-sea text-sea-foreground">
      <div className="container py-16">
        <div className="grid gap-12 md:grid-cols-[1.5fr_1fr_1fr]">
          <div>
            <Link href="/" className="flex items-center gap-3 text-3xl font-extrabold tracking-tight [font-stretch:125%] md:text-4xl">
              <BrandMark className="size-8" />
              Hidrogênio Naval
            </Link>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-sea-foreground/70">
              Um projeto de alunos de Engenharia Naval e Oceânica da Escola Politécnica da Universidade de São Paulo.
            </p>
          </div>

          <div>
            <h2 className="mb-4 text-sm font-semibold">Contato</h2>
            <ul className="space-y-3 text-sm text-sea-foreground/80">
              <li>
                <a href={`mailto:${CONTACT.email}`} className="inline-flex items-center gap-2 hover:text-primary-glow">
                  <Mail className="size-4" />
                  {CONTACT.email}
                </a>
              </li>
              <li>
                <a
                  href={`https://instagram.com/${CONTACT.instagram}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 hover:text-primary-glow"
                >
                  <Instagram className="size-4" />@{CONTACT.instagram}
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h2 className="mb-4 text-sm font-semibold">Navegação</h2>
            <ul className="space-y-3 text-sm text-sea-foreground/80">
              <li><Link href="/#sobre" className="hover:text-primary-glow">Sobre o hidrogênio</Link></li>
              <li><Link href="/blog" className="hover:text-primary-glow">Blog</Link></li>
            </ul>
          </div>
        </div>

        <p className="mt-14 border-t border-sea-foreground/10 pt-6 text-xs text-sea-foreground/60">
          © {new Date().getFullYear()} Hidrogênio Naval, Poli-USP.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
