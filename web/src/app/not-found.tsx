import Link from "next/link";
import Navbar from "@/components/base/nav";
import { Button } from "@/components/ui/button";
import { Hull, Waterline } from "@/components/base/Hull";

export default function NotFound() {
  return (
    <div className="flex min-h-svh flex-col">
      <Navbar />

      <div className="container flex flex-1 items-end pt-28 pb-6">
        <div>
          <p className="text-sm text-muted-foreground">Erro 404</p>
          <h1 className="mt-2 text-5xl font-extrabold tracking-tight [font-stretch:125%] md:text-7xl">
            Esta página afundou.
          </h1>
        </div>
      </div>

      <Waterline />

      <main className="flex-1 overflow-hidden bg-sea text-sea-foreground">
        <div className="container relative pt-8 pb-20">
          <p className="max-w-md font-serif text-lg leading-relaxed text-sea-foreground/80">
            O endereço pode ter mudado ou o conteúdo foi removido.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button asChild size="lg" className="bg-sea-foreground text-sea hover:bg-white">
              <Link href="/">Voltar ao início</Link>
            </Button>
            <Button asChild size="lg" variant="ghost" className="text-sea-foreground hover:bg-white/10 hover:text-sea-foreground">
              <Link href="/blog">Ver o blog</Link>
            </Button>
          </div>

          <Hull
            id="sunk-hull"
            className="pointer-events-none mt-12 aspect-[3/1] w-[min(90vw,520px)] rotate-[8deg] text-primary-glow opacity-60 md:absolute md:right-[6%] md:top-10 md:mt-0"
          />
        </div>
      </main>
    </div>
  );
}
