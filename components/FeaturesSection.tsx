import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { PostMeta } from "@/lib/posts";
import { ArticleCard } from "./blog/ArticleCard";

export function FeaturesSection({ posts }: { posts: PostMeta[] }) {
  return <section id="services" className="journal-shell home-articles" aria-labelledby="home-articles-heading">
    <div className="section-heading">
      <div><p className="eyebrow section-eyebrow">A FEW THINGS I&apos;VE BEEN EXPLORING</p><h2 id="home-articles-heading">朝花夕拾<span className="heading-note">随手记下的片段</span></h2></div>
      <Link href="/archives" className="text-link">全部文章<ArrowUpRight size={17} /></Link>
    </div>
    <div className="article-grid">{posts.map((post) => <ArticleCard key={post.slug} post={post} context="home" />)}</div>
  </section>;
}
