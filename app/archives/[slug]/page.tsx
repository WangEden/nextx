// app/archives/[slug]/page.tsx
import { notFound } from "next/navigation";
import { getPostBySlug } from "@/lib/posts";
import { ArticlePage } from "./_ArticlePage"; 

export default function PostPage({ params }: { params: { slug: string } }) {
  const slug = decodeURIComponent(params.slug);
  const post = getPostBySlug(slug);
  if (!post) return notFound();

  return (
    <div className="min-h-screen cursor-custom">
      <ArticlePage post={post} />
    </div>
  );
}
