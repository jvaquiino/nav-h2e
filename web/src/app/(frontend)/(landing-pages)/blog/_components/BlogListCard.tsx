import Link from "next/link";
import { Blog } from "@/generated/prisma";

export function BlogListCard({ blog }: { blog: Blog }) {
  return (
    <Link
      href={`/blog/${blog.slug}`}
      className="block rounded-xl border border-border overflow-hidden bg-background hover:shadow-md transition-smooth"
    >
      {blog.imageUrl && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={blog.imageUrl} alt={blog.name} className="w-full h-40 object-cover" />
      )}
      <div className="p-5">
        <h3 className="font-display font-semibold text-lg mb-2">{blog.name}</h3>
        {blog.description && (
          <p className="text-sm text-muted-foreground line-clamp-3">{blog.description}</p>
        )}
        {blog.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-4">
            {blog.tags.map((tag) => (
              <span key={tag} className="text-xs px-2 py-0.5 rounded-full bg-gradient-soft text-muted-foreground">
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </Link>
  );
}
