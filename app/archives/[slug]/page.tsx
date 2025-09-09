// app/archives/[slug]/page.tsx
import { notFound } from "next/navigation";
import { getAllPosts, getPostBySlug } from "@/lib/posts";
import { Hero } from "@/components/blog/Hero";
import { ArticleContent } from "@/components/blog/ArticleContent";
import { Sidebar } from "@/components/blog/Sidebar";
import { Tag } from "lucide-react";

export function generateStaticParams() {
  const posts = getAllPosts();
  return posts.map(p => ({ slug: p.slug }));
}

export default function PostPage({ params }: { params: { slug: string } }) {
  const slug = decodeURIComponent(params.slug);
  const post = getPostBySlug(slug);
  if (!post) return notFound();

  return (
    <div className="min-h-screen cursor-custom">
      <Hero
        title={post.title}
        subtitle={post.excerpt}
        // 如果 Hero 要求 {name, icon}：
        categories={post.tags.map(t => ({ name: t, icon: <Tag className="w-4 h-4" /> }))}
        date={post.date}
        readingTime={post.readTime ?? ""}
        views={post.views ?? 0}
        coverImage={post.cover}
      />

      <section className="py-16 bg-radial">
        <div className="container mx-auto px-6 lg:px-12 grid lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2">
            <ArticleContent
              author={{ name: post.author, role: "" }}
              content={post.content}
              likes={0}
              comments={0}
            />
          </div>
          <Sidebar
            author={{ name: post.author, role: "", description: "" }}
            stats={{ views: post.views ?? 0, likes: 0, comments: 0, shares: 0 }}
          />
        </div>
      </section>
    </div>
  );
}
