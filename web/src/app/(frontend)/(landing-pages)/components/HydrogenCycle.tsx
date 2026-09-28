'use client';

import { useRef, useState } from "react";
import { AnimatePresence, motion, useMotionValueEvent, useReducedMotion, useScroll } from "motion/react";
import { cn } from "@/lib/utils";

const STEPS = [
  {
    title: "Eletrólise",
    figure: "H₂O → H₂ + ½ O₂",
    text: "Em terra, eletricidade separa a água em hidrogênio e oxigênio. Se essa eletricidade vem do sol ou do vento, o combustível nasce sem emissões.",
  },
  {
    title: "Armazenamento a bordo",
    figure: "−253 °C ou 700 bar",
    text: "O hidrogênio embarca líquido, em tanques criogênicos, ou comprimido em cilindros. Os dois ocupam muito volume, e o projeto do navio precisa girar em torno disso.",
  },
  {
    title: "Célula a combustível",
    figure: "H₂ + ½ O₂ → H₂O + eletricidade",
    text: "O hidrogênio reage com o oxigênio do ar e gera eletricidade diretamente, sem combustão. O que sai do escapamento é vapor d'água.",
  },
  {
    title: "Propulsão elétrica",
    figure: "Motor elétrico → hélice ou rodas :)",
    text: "A eletricidade move motores elétricos ligados ao hélice. Menos peças móveis, menos vibração e menos ruído debaixo d'água.",
  },
];

export default function HydrogenCycle() {
  const [active, setActive] = useState(0);
  const sectionRef = useRef<HTMLElement>(null);
  const reduceMotion = useReducedMotion();

  // A seção é mais alta que a tela e o conteúdo fica "sticky": o progresso do scroll dentro dela escolhe a etapa.
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start start", "end end"] });
  useMotionValueEvent(scrollYProgress, "change", (p) => {
    setActive(Math.min(STEPS.length - 1, Math.floor(p * STEPS.length)));
  });

  const goTo = (i: number) => {
    const el = sectionRef.current;
    if (!el) return;
    const scrollable = el.offsetHeight - window.innerHeight;
    const top = el.getBoundingClientRect().top + window.scrollY + ((i + 0.5) / STEPS.length) * scrollable;
    window.scrollTo({ top, behavior: reduceMotion ? "auto" : "smooth" });
  };

  const step = STEPS[active];
  const offset = reduceMotion ? 0 : 16;

  return (
    <section ref={sectionRef} style={{ height: `${STEPS.length * 70}svh` }} className="relative border-t border-border bg-card">
      <div className="container sticky top-0 flex h-svh flex-col justify-center pt-16">
        <h2 className="max-w-2xl text-4xl font-bold leading-[1.05] tracking-tight [font-stretch:112%] md:text-5xl">
          Da água ao hélice em quatro etapas.
        </h2>

        <div className="mt-10 grid gap-8 md:mt-14 md:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)] md:gap-16">
          <ol role="tablist" aria-label="Etapas do ciclo do hidrogênio" className="relative">
            {/* tubulação que liga as etapas e "enche" conforme o scroll */}
            <span aria-hidden className="absolute left-[1.1875rem] top-5 bottom-5 w-px bg-border" />
            <motion.span
              aria-hidden
              style={{ scaleY: scrollYProgress }}
              className="absolute left-[1.1875rem] top-5 bottom-5 w-px origin-top bg-primary-glow"
            />
            {STEPS.map((s, i) => (
              <li key={s.title} role="presentation">
                <button
                  type="button"
                  role="tab"
                  id={`step-${i}`}
                  aria-selected={active === i}
                  aria-controls="step-panel"
                  onClick={() => goTo(i)}
                  className="group relative flex w-full cursor-pointer items-center gap-5 rounded-lg py-2.5 text-left md:py-3"
                >
                  <span
                    className={cn(
                      "grid size-10 shrink-0 place-items-center rounded-full border text-sm font-semibold tabular-nums transition-colors duration-300",
                      active === i
                        ? "border-sea bg-sea text-sea-foreground"
                        : "border-border bg-card text-muted-foreground group-hover:border-primary group-hover:text-primary"
                    )}
                  >
                    {i + 1}
                  </span>
                  <span
                    className={cn(
                      "text-lg font-semibold transition-colors duration-300 md:text-xl",
                      active !== i && "text-muted-foreground group-hover:text-foreground"
                    )}
                  >
                    {s.title}
                  </span>
                </button>
              </li>
            ))}
          </ol>

          <div role="tabpanel" id="step-panel" aria-labelledby={`step-${active}`} aria-live="polite" className="relative self-center md:min-h-56">
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={active}
                initial={{ opacity: 0, y: offset }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -offset }}
                transition={{ duration: 0.25, ease: "easeOut" }}
                className="border-l-2 border-primary-glow pl-6 md:pl-10"
              >
                <p className="text-2xl font-semibold text-primary md:text-3xl">{step.figure}</p>
                <p className="mt-5 max-w-prose font-serif text-lg leading-relaxed text-muted-foreground md:text-xl">{step.text}</p>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
