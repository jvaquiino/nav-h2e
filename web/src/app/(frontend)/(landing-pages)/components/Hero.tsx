import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Hull, Waterline } from "@/components/base/Hull";
import { OpenChatButton } from "@/components/chat/ChatWidget";

const headline = "text-[clamp(3rem,8vw,7.5rem)] font-extrabold leading-[0.92] tracking-[-0.03em] [font-stretch:125%]";

const Hero = () => {
  return (
    <section id="top" className="flex min-h-svh flex-col">
      <h1 className="sr-only">O futuro navega a hidrogênio.</h1>

      {/* Acima d'água */}
      <div className="container relative z-10 flex flex-1 items-end pt-28 pb-[calc(min(80vw,620px)/3*0.55+1rem)] md:pb-5">
        <p aria-hidden className={`${headline} max-w-[11ch] md:max-w-[52%] lg:max-w-[9ch]`}>
          O futuro navega
        </p>
      </div>

      {/* Linha d'água com o casco apoiado nela */}
      <div className="relative">
        <Waterline animate />
        <Hull
          id="hero-hull"
          animate
          className="pointer-events-none absolute z-0 right-[4%] top-1.5 aspect-[3/1] w-[min(80vw,620px)] -translate-y-[55%] text-primary md:w-[min(46vw,620px)]"
        />
      </div>

      {/* Abaixo d'água */}
      <div className="bg-sea text-sea-foreground">
        <div className="container relative z-10 flex flex-1 flex-col pt-4 pb-16 md:pb-20">
          <p aria-hidden className={`${headline} text-sea-foreground`}>a hidrogênio.</p>

          <p className="mt-8 max-w-xl font-serif text-lg leading-relaxed text-sea-foreground/80 md:text-xl">
            O portal da Engenharia Naval da Poli-USP sobre o combustível que pode tirar o carbono da terra e do mar.
          </p>

          <div className="mt-10 flex flex-wrap gap-3">
            <Button asChild size="lg" className="h-12 bg-sea-foreground px-6 text-sea hover:bg-white">
              <Link href="/blog">Ler os artigos</Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="h-12 border-sea-foreground/40 bg-transparent px-6 text-sea-foreground hover:bg-white/10 hover:text-sea-foreground">
              <OpenChatButton>Perguntar ao assistente</OpenChatButton>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
