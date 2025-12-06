// app/archives/[slug]/page.tsx
import { notFound } from "next/navigation";
import { getPostBySlug } from "@/lib/posts";
import { ArticlePage } from "./_ArticlePage"; 
import type { Metadata } from "next";

const SITE_URL = "https://wangeden.top"

// 很粗暴的 markdown -> 文本，够用即可
function stripMarkdown(md: string): string {
  return md
    .replace(/```[\s\S]*?```/g, "")        // 去掉代码块
    .replace(/`[^`]*`/g, "")               // 行内代码
    .replace(/!\[[^\]]*\]\([^)]*\)/g, "")  // 图片
    .replace(/\[[^\]]*\]\([^)]*\)/g, "")   // 链接
    .replace(/[#>*_~\-]+/g, " ")           // 标记符号
    .replace(/\s+/g, " ")                  // 多空格
    .trim();
}

export async function generateMetadata(
  { params }: { params: { slug: string } }
): Promise<Metadata> {
  const slug = decodeURIComponent(params.slug);
  const post = getPostBySlug(slug);

  if (!post) return {};

  const title = `${post.title} | 老王的笔记本`;

  // 1. 优先用 frontmatter.excerpt
  // 2. 没有的话从正文前几百字截一段
  const descSource = post.excerpt && post.excerpt.trim().length > 0
    ? post.excerpt
    : stripMarkdown(post.content).slice(0, 120);

  const description = descSource;

  return {
    title,
    description,
    alternates: {
      canonical: `${SITE_URL}/archives/${slug}`,
    },
    openGraph: {
      type: "article",
      url: `${SITE_URL}/archives/${slug}`,
      title,
      description,
      images: post.cover ? [post.cover] : undefined,
    },
  };
}


export default async function PostPage({ params }: { params: { slug: string } }) {
  const slug = await params;
  const post = getPostBySlug(decodeURIComponent(slug.slug));
  if (!post) return notFound();

  // // 👇 这里去数据库查点赞数（调用 API 或 Prisma）
  // const res = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/like?slug=${slug}`, {
  //   cache: "no-store", // 保证每次拿到最新数据
  // });
  // const data = await res.json();
  // const likes = data.likes;
  const likes = 1; // 临时占位

  return (
    <div className="min-h-screen cursor-custom">
      <ArticlePage post={post} likes={likes} />
    </div>
  );
}
