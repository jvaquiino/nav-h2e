import { cn } from "@/lib/utils";

// Perfil de casco no estilo "plano de linhas". viewBox 600×200, linha d'água em y=110 (55% da altura).
const HULL = "M40 62 Q300 74 560 40 C550 92 538 140 498 160 L104 160 C72 160 50 132 40 100 Z";
const DECK = [
  "M180 66 L180 48 Q180 40 188 40 L284 40 Q292 40 292 48 L292 69", // tanque de H₂
  "M350 67 L354 30 L444 24 L456 58", // casario
  "M400 27 L400 6", // mastro
];
const STATIONS = [100, 160, 220, 280, 340, 400, 460, 520];
export const HULL_WATERLINE = 0.55;

function Lines({ id, animate }: { id: string; animate: boolean }) {
  const draw = animate ? "draw-in" : undefined;
  return (
    <>
      <path d={HULL} pathLength={1} className={draw} strokeWidth={2} />
      {DECK.map((d, i) => (
        <path key={d} d={d} pathLength={1} className={draw} style={{ animationDelay: `${0.5 + i * 0.15}s` }} strokeWidth={1.5} />
      ))}
      <g clipPath={`url(#${id}-hull)`} strokeWidth={0.75} opacity={0.5}>
        {STATIONS.map((x, i) => (
          <path key={x} d={`M${x} 20 L${x} 180`} pathLength={1} className={draw} style={{ animationDelay: `${0.8 + i * 0.06}s` }} />
        ))}
        <path d="M0 85 L600 85 M0 135 L600 135" strokeDasharray="4 6" />
      </g>
    </>
  );
}

/** Casco cortado pela linha d'água: acima em `currentColor`, abaixo em Brilho H₂. */
export function Hull({ id, className, animate = false }: { id: string; className?: string; animate?: boolean }) {
  return (
    <svg viewBox="0 0 600 200" fill="none" aria-hidden className={cn("overflow-visible", className)}>
      <defs>
        <clipPath id={`${id}-hull`}><path d={HULL} /></clipPath>
        <clipPath id={`${id}-above`}><rect width="600" height="110" /></clipPath>
        <clipPath id={`${id}-below`}><rect y="110" width="600" height="90" /></clipPath>
      </defs>
      <g clipPath={`url(#${id}-above)`} stroke="currentColor">
        <Lines id={id} animate={animate} />
      </g>
      <g clipPath={`url(#${id}-below)`} className="stroke-primary-glow">
        <Lines id={id} animate={animate} />
      </g>
    </svg>
  );
}

const WAVE = "M0 6" + Array.from({ length: 48 }, (_, i) => ` Q${i * 50 + 25} ${i % 2 ? 11 : 1} ${(i + 1) * 50} 6`).join("");

export function Waterline({ className, animate = false }: { className?: string; animate?: boolean }) {
  return (
    <svg viewBox="0 0 2400 12" preserveAspectRatio="none" aria-hidden className={cn("block h-3 w-full", className)}>
      <path d={WAVE} pathLength={1} fill="none" strokeWidth={2} vectorEffect="non-scaling-stroke" className={cn("stroke-primary-glow", animate && "draw-in")} />
    </svg>
  );
}

/** Marca: círculo meio submerso. */
export function BrandMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 20 20" aria-hidden className={cn("size-5 shrink-0", className)}>
      <circle cx="10" cy="10" r="8.25" fill="none" stroke="currentColor" strokeWidth="1.5" />
      <path d="M1.75 11h16.5a8.25 8.25 0 0 1-16.5 0Z" className="fill-primary-glow" />
    </svg>
  );
}
