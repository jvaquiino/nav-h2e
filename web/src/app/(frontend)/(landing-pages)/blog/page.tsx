import Navbar from "@/components/base/nav";
import Footer from "../components/Footer";
import { getAllBlogs } from "@/backend/services/blogs";
import { BlogListCard } from "./_components/BlogListCard";

export default async function BlogListPage() {
  const blogs = await getAllBlogs({ archived: false });

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container pt-32 pb-20">
        <div className="max-w-2xl mb-12">
          <h1 className="font-display font-bold text-3xl md:text-4xl mb-3">Blog</h1>
          <p className="text-muted-foreground">
            Novidades e conteúdo sobre hidrogênio e propulsão naval, direto dos projetos da Poli-USP.
          </p>
        </div>

        {blogs.length === 0 ? (
          <p className="text-muted-foreground">Nenhum post publicado ainda.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {blogs.map((blog) => (
              <BlogListCard key={blog.id} blog={blog} />
            ))}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
