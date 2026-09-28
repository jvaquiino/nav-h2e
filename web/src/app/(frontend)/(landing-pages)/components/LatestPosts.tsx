import Link from "next/link";
import { getAllBlogs } from "@/backend/services/blogs";
import { FeaturedPost, PostRow } from "../blog/_components/BlogListCard";

export default async function LatestPosts() {
  const [featured, ...rest] = (await getAllBlogs({ archived: false })).slice(0, 4);
  if (!featured) return null;

  return (
    <section className="container border-t border-border py-24 md:py-32">
      <div className="mb-12 flex items-end justify-between gap-6">
        <h2 className="text-4xl font-bold tracking-tight [font-stretch:112%] md:text-5xl">Do blog</h2>
        <Link href="/blog" className="text-sm font-semibold text-primary underline-offset-4 hover:underline">
          Ver todos os artigos
        </Link>
      </div>

      <FeaturedPost blog={featured} />

      {rest.length > 0 && <ul className="mt-14">{rest.map((b) => <PostRow key={b.id} blog={b} />)}</ul>}
    </section>
  );
}
