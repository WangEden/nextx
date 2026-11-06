"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowUpRight, Clock, Star } from "lucide-react";
import type { PostMeta } from "@/lib/posts";
import { ImageWithFallback } from "@/components/figma/ImageWithFallback";
import { useGlassLens } from "@/components/LiquidGlass";
import { useViewTransitionRouter } from "@/components/useViewTransitionRouter";
import { siteImage } from "@/lib/site-images";

export function ArticleCard({ post, featured = false, list = false, context = "archives" }: {
  post: PostMeta; featured?: boolean; list?: boolean; context?: string;
}) {
  const { push } = useViewTransitionRouter();
  const router = useRouter();
  const lens = useGlassLens<HTMLAnchorElement>("card");
  const href = `/archives/${encodeURIComponent(post.slug)}`;
  const sizes = list ? "(max-width: 540px) 104px, 230px" :
    "(max-width: 540px) calc(100vw - 56px), (max-width: 800px) 44vw, (max-width: 1200px) 31vw, 420px";
  const prefetch = () => router.prefetch(href);
  return <Link href={href} id={`${context}-card-${post.slug}`} data-article-card={post.slug} ref={lens} prefetch={false}
    className={`article-card liquid-glass glass-optical${featured ? " article-card--featured" : ""}${list ? " article-card--list" : ""}`}
    onPointerEnter={(event) => { if (event.pointerType === "mouse") prefetch(); }}
    onFocus={prefetch}
    onClick={(event) => {
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0) return;
      event.preventDefault();
      push(href, { source: event.currentTarget });
    }}>
    <div className="article-card__cover" data-article-cover>
      <ImageWithFallback {...siteImage(post.cover, sizes)} alt="" loading="lazy" decoding="async" />
      <div className="article-card__scrim" />
      <span className="article-card__category">{post.category || "随笔"}</span>
      {featured && <span className="article-card__featured"><Star size={11} fill="currentColor" />精选笔记</span>}
      <span className="article-card__open" aria-hidden="true"><ArrowUpRight size={19} /></span>
    </div>
    <div className="article-card__body">
      <div className="article-card__eyebrow">
        <time dateTime={post.date}>{post.date.replaceAll("-", ".")}</time>
        {post.readTime && <span><Clock size={12} />{post.readTime}</span>}
      </div>
      <h3 className="article-card__title" data-article-title>{post.title}</h3>
      <p className="article-card__excerpt">{post.excerpt || "关于探索、实践与思考的记录。"}</p>
      <div className="article-card__bottom">
        <div className="article-card__tags">{post.tags.slice(0, 2).map((tag) => <span key={tag}>#{tag}</span>)}</div>
        <span className="article-card__read">阅读全文<ArrowUpRight size={14} /></span>
      </div>
    </div>
  </Link>;
}
