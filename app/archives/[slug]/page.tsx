// app/archives/[slug]/page.tsx
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getAllPosts, getPostBySlug } from "@/lib/posts";
import { ArticlePage } from "./_ArticlePage";

const SITE_URL = "https://edenx.me";

type RouteParams = { slug: string };
type Props = { params: Promise<RouteParams> };

export function generateStaticParams(): RouteParams[] {
  return getAllPosts().map((p) => ({ slug: p.slug }));
}

// 粗暴 markdown -> text
function stripMarkdown(md: string): string {
  return md
    .replace(/```[\s\S]*?```/g, "")
    .replace(/`[^`]*`/g, "")
    .replace(/!\[[^\]]*\]\([^)]*\)/g, "")
    .replace(/\[[^\]]*\]\([^)]*\)/g, "")
    .replace(/[#>*_~\-]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const decoded = decodeURIComponent(slug);
  const post = getPostBySlug(decoded);
  if (!post) return {};

  const title = `${post.title} | 老王的笔记本`;
  const description =
    post.excerpt && post.excerpt.trim().length > 0
      ? post.excerpt
      : stripMarkdown(post.content).slice(0, 120);

  return {
    title,
    description,
    alternates: { canonical: `${SITE_URL}/archives/${decoded}` },
    openGraph: {
      type: "article",
      url: `${SITE_URL}/archives/${decoded}`,
      title,
      description,
      images: post.cover ? [post.cover] : undefined,
    },
  };
}
 
export default async function PostPage({ params }: Props) {
  const { slug } = await params;
  const decoded = decodeURIComponent(slug);
  const post = getPostBySlug(decoded);
  if (!post) return notFound();

  const likes = 1;
  return <ArticlePage post={post} likes={likes} />;
}
