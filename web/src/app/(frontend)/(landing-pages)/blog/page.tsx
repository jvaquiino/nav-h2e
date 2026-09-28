import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/base/nav";
import Footer from "../components/Footer";
import { getAllBlogs } from "@/backend/services/blogs";
import { OpenChatButton } from "@/components/chat/ChatWidget";
import { cn } from "@/lib/utils";
import { FeaturedPost, PostRow } from "./_components/BlogListCard";

export const metadata: Metadata = { title: "Blog" };

export default async function BlogListPage({
  searchParams,
}: {
  searchParams: Promise<{ tag?: string }>;
}) {
  const { tag } = await searchParams;
  const all = await getAllBlogs({ archived: false });
  const tags = [...new Set(all.flatMap((b) => b.tags))].sort((a, b) => a.localeCompare(b, "pt-BR"));
  const [featured, ...rest] = tag ? all.filter((b) => b.tags.includes(tag)) : all;

  const chip = (active: boolean) =>
    cn(
      "rounded-full border px-3.5 py-1.5 text-sm transition-colors",
      active ? "border-sea bg-sea text-sea-foreground" : "border-border text-muted-foreground hover:border-primary hover:text-primary"
    );

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container pt-32 pb-24 md:pt-40">
        <header className="max-w-2xl">
          <h1 className="text-5xl font-extrabold tracking-tight [font-stretch:125%] md:text-7xl">Blog</h1>
          <p className="mt-4 font-serif text-lg leading-relaxed text-muted-foreground md:text-xl">
            Artigos sobre hidrogênio e propulsão naval, escritos por alunos de Engenharia Naval da Poli-USP.
          </p>
        </header>

        {tags.length > 0 && (
          <nav aria-label="Filtrar por assunto" className="mt-10 flex flex-wrap gap-2">
            <Link href="/blog" className={chip(!tag)} aria-current={!tag ? "page" : undefined}>
              Todos
            </Link>
            {tags.map((t) => (
              <Link
                key={t}
                href={`/blog?tag=${encodeURIComponent(t)}`}
                className={chip(tag === t)}
                aria-current={tag === t ? "page" : undefined}
              >
                {t}
              </Link>
            ))}
          </nav>
        )}

        <div className="mt-14">
          {!featured ? (
            <div className="max-w-lg border-t border-border pt-10">
              <p className="text-xl font-semibold">
                {tag ? `Nenhum artigo sobre "${tag}" ainda.` : "Os primeiros artigos estão sendo escritos."}
              </p>
              <p className="mt-3 font-serif text-lg text-muted-foreground">
                Enquanto isso, você pode tirar dúvidas sobre hidrogênio com o nosso assistente.
              </p>
              <OpenChatButton className="mt-6 text-sm font-semibold text-primary underline-offset-4 hover:underline">
                Perguntar ao assistente
              </OpenChatButton>
            </div>
          ) : (
            <>
              <FeaturedPost blog={featured} priority />
              {rest.length > 0 && <ul className="mt-16">{rest.map((b) => <PostRow key={b.id} blog={b} />)}</ul>}
            </>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
