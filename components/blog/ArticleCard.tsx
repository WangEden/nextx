"use client";

import Link from "next/link";
import { ArrowUpRight, Clock, Star } from "lucide-react";
import type { PostMeta } from "@/lib/posts";
import { ImageWithFallback } from "@/components/figma/ImageWithFallback";
import { moveGlassHighlight } from "@/components/LiquidGlass";
import { useViewTransitionRouter } from "@/components/useViewTransitionRouter";

export function ArticleCard({ post, featured = false, list = false, context = "archives" }: {
  post: PostMeta; featured?: boolean; list?: boolean; context?: string;
}) {
  const { push } = useViewTransitionRouter();
  const href = `/archives/${encodeURIComponent(post.slug)}`;
  return <Link href={href} id={`${context}-card-${post.slug}`} data-article-card={post.slug}
    className={`article-card liquid-glass${featured ? " article-card--featured" : ""}${list ? " article-card--list" : ""}`}
    onPointerMove={moveGlassHighlight}
    onClick={(event) => {
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0) return;
      event.preventDefault();
      push(href, { source: event.currentTarget });
    }}>
    <div className="article-card__cover" data-article-cover>
      <ImageWithFallback src={post.cover} alt="" loading="lazy" decoding="async" />
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
