import { notFound } from "next/navigation";
import Navbar from "@/components/base/nav";
import Footer from "../../components/Footer";
import { getBlogBySlug } from "@/backend/services/blogs";
import { BlockRenderer } from "./_components/BlockRenderer";

export default async function BlogDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const blog = await getBlogBySlug(slug);

  if (!blog || blog.archived) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container pt-32 pb-20 max-w-3xl">
        {blog.imageUrl && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={blog.imageUrl}
            alt={blog.name}
            className="w-full h-64 object-cover rounded-xl mb-8"
          />
        )}

        <h1 className="font-display font-bold text-3xl md:text-4xl mb-3">{blog.name}</h1>

        {blog.description && (
          <p className="text-muted-foreground text-lg mb-4">{blog.description}</p>
        )}

        {blog.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-10">
            {blog.tags.map((tag) => (
              <span key={tag} className="text-xs px-2 py-0.5 rounded-full bg-gradient-soft text-muted-foreground">
                {tag}
              </span>
            ))}
          </div>
        )}

        <div className="space-y-8">
          {blog.contentBlocks
            .filter((block) => !block.archived)
            .map((block) => (
              <BlockRenderer key={block.id} block={block} />
            ))}
        </div>
      </main>
      <Footer />
    </div>
  );
}
