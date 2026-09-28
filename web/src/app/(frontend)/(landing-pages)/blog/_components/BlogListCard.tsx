import Image from "next/image";
import Link from "next/link";
import { Blog } from "@/generated/prisma";
import { formatDate } from "@/utils";

export const DEFAULT_COVER = "/images/capa-padrao.jpg";

function Cover({ blog, className, priority }: { blog: Blog; className?: string; priority?: boolean }) {
  // Capas enviadas pelo admin podem vir de qualquer host (S3), por isso `unoptimized` nelas.
  return (
    <div className={`relative overflow-hidden rounded-lg bg-muted ${className ?? ""}`}>
      <Image
        src={blog.imageUrl || DEFAULT_COVER}
        alt=""
        fill
        priority={priority}
        unoptimized={!!blog.imageUrl}
        sizes="(min-width: 768px) 60vw, 100vw"
        className="object-cover transition-transform duration-500 group-hover:scale-[1.02]"
      />
    </div>
  );
}

/** Post em destaque: capa grande e título largo. */
export function FeaturedPost({ blog, priority }: { blog: Blog; priority?: boolean }) {
  return (
    <Link href={`/blog/${blog.slug}`} className="group grid items-end gap-6 md:grid-cols-[1.5fr_1fr] md:gap-10">
      <Cover blog={blog} priority={priority} className="aspect-[16/10]" />
      <div className="pb-1">
        <time dateTime={blog.publishedAt.toISOString()} className="text-sm text-muted-foreground">
          {formatDate(blog.publishedAt)}
        </time>
        <h3 className="mt-2 text-3xl font-bold leading-[1.1] tracking-tight [font-stretch:112%] group-hover:text-primary md:text-4xl">
          {blog.name}
        </h3>
        {blog.description && (
          <p className="mt-4 line-clamp-3 font-serif text-lg leading-relaxed text-muted-foreground">{blog.description}</p>
        )}
      </div>
    </Link>
  );
}

/** Linha do índice de posts. */
export function PostRow({ blog }: { blog: Blog }) {
  return (
    <li className="border-t border-border">
      <Link
        href={`/blog/${blog.slug}`}
        className="group grid gap-1 py-5 md:grid-cols-[9rem_1fr_auto] md:items-baseline md:gap-8"
      >
        <time dateTime={blog.publishedAt.toISOString()} className="text-sm tabular-nums text-muted-foreground">
          {formatDate(blog.publishedAt)}
        </time>
        <div>
          <h3 className="text-lg font-semibold leading-snug group-hover:text-primary md:text-xl">{blog.name}</h3>
          {blog.description && (
            <p className="mt-1 line-clamp-2 font-serif text-muted-foreground">{blog.description}</p>
          )}
        </div>
        {blog.tags.length > 0 && (
          <span className="text-sm text-muted-foreground">{blog.tags.slice(0, 2).join(", ")}</span>
        )}
      </Link>
    </li>
  );
}
