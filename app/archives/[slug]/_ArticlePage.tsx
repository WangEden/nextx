"use client";

import { Hero } from "@/components/blog/Hero";
import { ArticleContent } from "@/components/blog/ArticleContent";
import { Sidebar } from "@/components/blog/Sidebar";
import type { Post } from "@/lib/posts";
import { PopupNotification } from "@/components/PopupNotification";
import { FloatingActionMenu } from "@/components/FloatingActionMenu";
import { GiscusComments } from "@/components/GiscusComments";
import { useViewTransitionRouter } from "@/components/useViewTransitionRouter";
import { ArrowLeft } from "lucide-react";
import { useEffect, useState } from "react";

type NoticeType = "info" | "warning" | "error";

export function ArticlePage({ post, likes }: { post: Post; likes: number }) {
  const { closeArticle } = useViewTransitionRouter();
  const [notification, setNotification] = useState({ visible: false, message: "", type: "info" as NoticeType });
  const showNotification = (message: string, type: NoticeType) => setNotification({ visible: true, message, type });

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key !== "Escape" || event.defaultPrevented) return;
      if (event.target instanceof Element && event.target.closest("input, textarea, select, [contenteditable=true], [role=dialog]")) return;
      closeArticle();
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [closeArticle]);

  return <main className="article-page">
    <div className="article-page__content">
      <Hero title={post.title} subtitle={post.excerpt} categories={post.tags.map((name) => ({ name }))}
        date={post.date} readingTime={post.readTime || ""} views={post.views || 0} coverImage={post.cover} />
      <section className="journal-shell article-layout" id="article-body">
        <div className="article-main">
          <div className="article-paper liquid-glass">
            <div className="article-byline"><span className="article-byline__dot" />{post.author}<span>的探索笔记</span></div>
            <ArticleContent author={{ name: post.author, role: "" }} content={post.content} likes={likes} comments={0} />
            <div className="article-paper__end"><span>感谢阅读，愿有所获。</span><button onClick={closeArticle}><ArrowLeft size={15} />返回卡片</button></div>
          </div>
          <div className="article-comments liquid-glass"><p className="eyebrow section-eyebrow">LET&apos;S TALK</p><h2>留下一点想法</h2><GiscusComments /></div>
        </div>
        <aside className="article-sidebar" aria-label="作者与文章信息">
          <Sidebar author={{ name: post.author, role: "保持好奇，持续探索", description: "在实践中思考，在记录中成长。", avatar: "/imgs/avatar/flower.jpg" }}
            stats={{ views: post.views || 0, likes: 0, comments: 0, shares: 0 }}
            onTriggerPopup={() => showNotification("谢谢关注，欢迎常来看看。", "info")} />
          <button className="article-return liquid-glass" onClick={closeArticle}><ArrowLeft size={16} />收起文章，继续探索<span>Esc</span></button>
        </aside>
      </section>
    </div>
    <FloatingActionMenu onNotification={showNotification} />
    <PopupNotification isVisible={notification.visible} onComplete={() => setNotification((previous) => ({ ...previous, visible: false }))} message={notification.message} type={notification.type} />
  </main>;
}
