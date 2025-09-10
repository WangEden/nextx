// app/archives/[slug]/page.tsx
import { notFound } from "next/navigation";
import { getPostBySlug } from "@/lib/posts";
import { ArticlePage } from "./_ArticlePage"; 

export default async function PostPage({ params }: { params: { slug: string } }) {
  const slug = await params;
  const post = getPostBySlug(decodeURIComponent(slug.slug));
  if (!post) return notFound();

  return (
    <div className="min-h-screen cursor-custom">
      <ArticlePage post={post} />
    </div>
  );
}
