// app/archives/[slug]/page.tsx
import { notFound } from "next/navigation";
import { getPostBySlug } from "@/lib/posts";
import { ArticlePage } from "./_ArticlePage"; 

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
  const likes = 0; // 临时占位

  return (
    <div className="min-h-screen cursor-custom">
      <ArticlePage post={post} likes={likes} />
    </div>
  );
}
