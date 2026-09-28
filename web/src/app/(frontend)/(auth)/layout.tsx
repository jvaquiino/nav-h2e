import Image from "next/image";
import Link from "next/link";
import { BrandMark } from "@/components/base/Hull";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className="grid min-h-svh md:grid-cols-[1fr_minmax(0,0.85fr)]">
      <div className="flex flex-col px-5 py-6 md:px-12 md:py-8">
        <Link href="/" className="flex w-fit items-center gap-2 font-bold tracking-tight">
          <BrandMark className="text-primary" />
          Hidrogênio Naval
        </Link>
        <div className="flex flex-1 items-center justify-center py-12">
          <div className="w-full max-w-sm">{children}</div>
        </div>
      </div>

      <div className="relative hidden overflow-hidden bg-sea md:block">
        <Image
          src="/images/rastro-noturno.jpg"
          alt="Vista aérea de duas lanchas deixando rastros de espuma no mar escuro"
          fill
          priority
          sizes="45vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-sea via-sea/20 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 p-12 text-sea-foreground">
          <p className="max-w-sm text-3xl font-bold leading-tight tracking-tight [font-stretch:112%]">
            Entre para conversar com o assistente sobre hidrogênio.
          </p>
          <p className="mt-6 text-xs text-sea-foreground/60">Foto: Red Zeppelin, Unsplash</p>
        </div>
      </div>
    </main>
  );
}
