import { OpenChatButton } from "@/components/chat/ChatWidget";

const QUESTIONS = [
  "Por que o hidrogênio precisa ficar a −253 °C?",
  "Hidrogênio é mais perigoso que diesel num navio?",
  "Qual a diferença entre hidrogênio verde e cinza?",
];

export default function AskAssistant() {
  return (
    <section className="bg-sea text-sea-foreground">
      <div className="container grid gap-10 py-24 md:grid-cols-[1fr_1.2fr] md:gap-16 md:py-28">
        <div>
          <h2 className="text-4xl font-bold leading-[1.05] tracking-tight [font-stretch:112%] md:text-5xl">
            Ficou com alguma dúvida?
          </h2>
          <p className="mt-6 max-w-md font-serif text-lg leading-relaxed text-sea-foreground/75">
            Nosso assistente responde com base nas pesquisas e documentos do projeto. É preciso entrar com uma conta
            para usar.
          </p>
        </div>

        <ul className="flex flex-col gap-3 self-center">
          {QUESTIONS.map((q) => (
            <li key={q}>
              <OpenChatButton
                question={q}
                className="w-full rounded-lg border border-sea-foreground/20 px-5 py-4 text-left text-base font-medium transition-colors hover:border-primary-glow hover:bg-white/5 md:text-lg"
              >
                {q}
              </OpenChatButton>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
