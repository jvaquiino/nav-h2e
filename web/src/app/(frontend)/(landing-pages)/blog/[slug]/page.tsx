import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import Navbar from "@/components/base/nav";
import Footer from "../../components/Footer";
import { getAllBlogs, getBlogBySlug } from "@/backend/services/blogs";
import { OpenChatButton } from "@/components/chat/ChatWidget";
import { formatDate } from "@/utils";
import { BlockRenderer } from "./_components/BlockRenderer";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const blog = await getBlogBySlug((await params).slug);
  return blog ? { title: blog.name, description: blog.description ?? undefined } : {};
}

export default async function BlogDetailPage({ params }: Props) {
  const { slug } = await params;
  const blog = await getBlogBySlug(slug);

  if (!blog || blog.archived) {
    notFound();
  }

  const blocks = blog.contentBlocks.filter((block) => !block.archived);
  const words = blocks.reduce((n, b) => n + (b.markdown?.split(/\s+/).length ?? 0), 0);
  const minutes = Math.max(1, Math.round(words / 200));

  // Lista vem ordenada do mais novo para o mais antigo.
  const posts = await getAllBlogs({ archived: false });
  const index = posts.findIndex((p) => p.id === blog.id);
  const newer = posts[index - 1];
  const older = posts[index + 1];

  return (
    <div className="min-h-screen bg-background">
      <div aria-hidden className="reading-progress fixed inset-x-0 top-0 z-[60] h-[3px] bg-primary-glow" />
      <Navbar />

      <main className="pt-32 pb-24 md:pt-40">
        <header className="container max-w-4xl">
          {blog.tags.length > 0 && (
            <ul className="mb-6 flex flex-wrap gap-2">
              {blog.tags.map((tag) => (
                <li key={tag}>
                  <Link
                    href={`/blog?tag=${encodeURIComponent(tag)}`}
                    className="rounded-full bg-accent px-3 py-1 text-sm text-accent-foreground hover:bg-accent/70"
                  >
                    {tag}
                  </Link>
                </li>
              ))}
            </ul>
          )}

          <h1 className="text-4xl font-extrabold leading-[1.02] tracking-tight [font-stretch:112%] md:text-6xl">
            {blog.name}
          </h1>

          {blog.description && (
            <p className="mt-6 max-w-2xl font-serif text-xl leading-relaxed text-muted-foreground md:text-2xl">
              {blog.description}
            </p>
          )}

          <p className="mt-8 flex gap-5 text-sm text-muted-foreground">
            <time dateTime={blog.publishedAt.toISOString()}>{formatDate(blog.publishedAt)}</time>
            <span>{minutes} min de leitura</span>
          </p>
        </header>

        {blog.imageUrl && (
          <div className="container mt-12 max-w-6xl">
            <div className="relative aspect-[2/1] overflow-hidden rounded-lg bg-muted">
              <Image src={blog.imageUrl} alt="" fill priority unoptimized className="object-cover" />
            </div>
          </div>
        )}

        <article className="article container mt-14 max-w-4xl space-y-8 [&>*]:max-w-[68ch]">
          {blocks.map((block) => (
            <BlockRenderer key={block.id} block={block} />
          ))}
        </article>

        <aside className="container mt-20 max-w-4xl [&>*]:max-w-[68ch]">
          <div className="rounded-lg bg-sea p-8 text-sea-foreground">
            <p className="text-xl font-semibold">Ficou com dúvida sobre este artigo?</p>
            <p className="mt-2 text-sea-foreground/75">O assistente responde com base nas pesquisas do projeto.</p>
            <OpenChatButton
              question={`Sobre o artigo "${blog.name}": `}
              className="mt-6 rounded-md bg-sea-foreground px-5 py-2.5 text-sm font-semibold text-sea hover:bg-white"
            >
              Perguntar ao assistente
            </OpenChatButton>
          </div>

          {(newer || older) && (
            <nav aria-label="Outros artigos" className="mt-12 grid gap-4 border-t border-border pt-8 sm:grid-cols-2">
              {older && (
                <Link href={`/blog/${older.slug}`} className="group">
                  <span className="text-sm text-muted-foreground">Anterior</span>
                  <span className="mt-1 block font-semibold group-hover:text-primary">{older.name}</span>
                </Link>
              )}
              {newer && (
                <Link href={`/blog/${newer.slug}`} className="group sm:col-start-2 sm:text-right">
                  <span className="text-sm text-muted-foreground">Próximo</span>
                  <span className="mt-1 block font-semibold group-hover:text-primary">{newer.name}</span>
                </Link>
              )}
            </nav>
          )}
        </aside>
      </main>
      <Footer />
    </div>
  );
}
