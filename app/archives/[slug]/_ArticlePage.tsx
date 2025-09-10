"use client";
// app/archives/[slug]/page.tsx
import { Hero } from "@/components/blog/Hero";
import { ArticleContent } from "@/components/blog/ArticleContent";
import { Sidebar } from "@/components/blog/Sidebar";
import { Tag } from "lucide-react";
import type { Post } from "@/lib/posts";
import { PopupNotification } from "@/components/PopupNotification";
import { useState } from "react";

export function ArticlePage({ post }: { post: Post }) {
  const [notification, setNotification] = useState(false);

  const triggerPopup = () => {
    setNotification(true);
  }

  const handlePopupComplete = () => {
    setNotification(false);
  } 

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
            onTriggerPopup={() => triggerPopup()}
          />
        </div>
      </section>

      <PopupNotification
        isVisible={notification}
        onComplete={handlePopupComplete}
        message="现在还不能关注老王"
        type="warning"
      />
    </div>
  );
}
