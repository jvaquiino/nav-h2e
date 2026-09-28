'use client';

import { useState } from "react";
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
    figure: "Motor elétrico → hélice",
    text: "A eletricidade move motores elétricos ligados ao hélice. Menos peças móveis, menos vibração e menos ruído debaixo d'água.",
  },
];

export default function HydrogenCycle() {
  const [active, setActive] = useState(0);
  const step = STEPS[active];

  return (
    <section className="border-t border-border bg-card">
      <div className="container py-24 md:py-32">
        <h2 className="max-w-2xl text-4xl font-bold leading-[1.05] tracking-tight [font-stretch:112%] md:text-5xl">
          Da água ao hélice em quatro etapas.
        </h2>

        <div className="mt-14 grid gap-10 md:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)] md:gap-16">
          <ol role="tablist" aria-label="Etapas do ciclo do hidrogênio" className="relative">
            {/* linha que liga as etapas, como uma tubulação */}
            <span aria-hidden className="absolute left-[1.1875rem] top-5 bottom-5 w-px bg-border" />
            {STEPS.map((s, i) => (
              <li key={s.title} role="presentation">
                <button
                  type="button"
                  role="tab"
                  id={`step-${i}`}
                  aria-selected={active === i}
                  aria-controls="step-panel"
                  onClick={() => setActive(i)}
                  className="group relative flex w-full items-center gap-5 rounded-lg py-3 text-left"
                >
                  <span
                    className={cn(
                      "grid size-10 shrink-0 place-items-center rounded-full border text-sm font-semibold tabular-nums transition-colors",
                      active === i
                        ? "border-sea bg-sea text-sea-foreground"
                        : "border-border bg-card text-muted-foreground group-hover:border-primary group-hover:text-primary"
                    )}
                  >
                    {i + 1}
                  </span>
                  <span className={cn("text-lg font-semibold md:text-xl", active !== i && "text-muted-foreground group-hover:text-foreground")}>
                    {s.title}
                  </span>
                </button>
              </li>
            ))}
          </ol>

          <div
            role="tabpanel"
            id="step-panel"
            aria-labelledby={`step-${active}`}
            key={active}
            className="animate-fade-up motion-reduce:animate-none self-center border-l-2 border-primary-glow pl-6 md:pl-10"
          >
            <p className="text-2xl font-semibold text-primary md:text-3xl">{step.figure}</p>
            <p className="mt-5 max-w-prose font-serif text-lg leading-relaxed text-muted-foreground md:text-xl">{step.text}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
