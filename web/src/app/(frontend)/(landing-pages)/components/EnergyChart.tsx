'use client';

import { useState } from "react";
import { cn } from "@/lib/utils";

// Poder calorífico inferior (PCI) aproximado; por litro usa a densidade típica de armazenamento.
const FUELS = [
  { name: "Hidrogênio líquido (−253 °C)", kg: 120, l: 8.5, h2: true },
  { name: "Hidrogênio comprimido (700 bar)", kg: 120, l: 5.0, h2: true },
  { name: "Diesel marítimo", kg: 42.7, l: 36.1 },
  { name: "Metanol", kg: 19.9, l: 15.8 },
  { name: "Amônia líquida", kg: 18.6, l: 12.7 },
];

const UNITS = {
  kg: { label: "Por quilo", unit: "MJ/kg", max: 120 },
  l: { label: "Por litro", unit: "MJ/L", max: 40 },
} as const;

type Unit = keyof typeof UNITS;

export default function EnergyChart() {
  const [unit, setUnit] = useState<Unit>("kg");
  const { unit: suffix, max } = UNITS[unit];

  return (
    <section id="sobre" className="container scroll-mt-20 py-24 md:py-32">
      <div className="grid gap-12 lg:grid-cols-[1fr_1.3fr] lg:gap-20">
        <div className="max-w-md">
          <h2 className="text-4xl font-bold leading-[1.05] tracking-tight [font-stretch:112%] md:text-5xl">
            Muita energia por quilo, pouca por litro.
          </h2>
          <div className="mt-6 space-y-4 font-serif text-lg leading-relaxed text-muted-foreground">
            <p>
              Um quilo de hidrogênio guarda quase três vezes a energia de um quilo de diesel. O problema é o espaço:
              para levar a mesma energia, o tanque precisa ser de 4 a 7 vezes maior.
            </p>
            <p>
              É aí que entra a engenharia naval. Onde colocar esses tanques, como mantê-los a −253 °C e como
              redesenhar o casco em volta deles são as perguntas que este blog tenta responder.
            </p>
          </div>
        </div>

        <figure>
          <div role="group" aria-label="Unidade de comparação" className="inline-flex rounded-lg border border-border bg-card p-1 text-sm font-medium">
            {(Object.keys(UNITS) as Unit[]).map((u) => (
              <button
                key={u}
                type="button"
                aria-pressed={unit === u}
                onClick={() => setUnit(u)}
                className="rounded-md px-4 py-1.5 text-muted-foreground transition-colors aria-pressed:bg-sea aria-pressed:text-sea-foreground"
              >
                {UNITS[u].label}
              </button>
            ))}
          </div>

          <dl className="mt-8 space-y-5">
            {FUELS.map((f) => {
              const value = f[unit];
              return (
                <div key={f.name}>
                  <dt className="flex justify-between gap-4 text-sm">
                    <span className={cn(f.h2 ? "font-semibold text-foreground" : "text-muted-foreground")}>{f.name}</span>
                  </dt>
                  <dd className="mt-1.5 flex items-center gap-3">
                    <span className="h-3 flex-1 overflow-hidden rounded-full bg-muted">
                      <span
                        className={cn(
                          "block h-full origin-left rounded-full transition-transform duration-500 ease-out motion-reduce:transition-none",
                          f.h2 ? "bg-primary" : "bg-muted-foreground/40"
                        )}
                        style={{ transform: `scaleX(${Math.min(value / max, 1)})` }}
                      />
                    </span>
                    <span className="w-20 text-right text-sm tabular-nums">
                      {value.toLocaleString("pt-BR")} <span className="text-muted-foreground">{suffix}</span>
                    </span>
                  </dd>
                </div>
              );
            })}
          </dl>

          <figcaption className="mt-6 text-xs leading-relaxed text-muted-foreground">
            Valores aproximados de poder calorífico inferior (PCI). Por litro, considera a densidade de cada combustível
            na forma em que é armazenado a bordo.
          </figcaption>
        </figure>
      </div>
    </section>
  );
}
