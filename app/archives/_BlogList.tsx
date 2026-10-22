"use client";

import { ArrowDown, BookOpen, Grid2X2, List, Search, SearchX, X } from "lucide-react";
import type { PostMeta } from "@/lib/posts";
import { ArticleCard } from "@/components/blog/ArticleCard";
import { useViewTransitionRouter } from "@/components/useViewTransitionRouter";

export default function BlogList({ posts }: { posts: PostMeta[] }) {
  const { archiveState, setArchiveState } = useViewTransitionRouter();
  const { query, category, view } = archiveState;
  const categories = ["全部", ...new Set(posts.map((post) => post.category || "随笔"))];
  const keyword = query.trim().toLocaleLowerCase();
  const filtered = posts.filter((post) =>
    (category === "全部" || (post.category || "随笔") === category) &&
    [post.title, post.excerpt, ...post.tags].some((value) => value.toLocaleLowerCase().includes(keyword))
  );
  const featured = !keyword && category === "全部" && view === "grid" ? filtered.find((post) => post.featured) : undefined;
  const ordered = featured ? [featured, ...filtered.filter((post) => post.slug !== featured.slug)] : filtered;
  const setFilter = (patch: Partial<typeof archiveState>) => setArchiveState((previous) => ({ ...previous, ...patch }));

  return <main className="journal-page">
    <section className="journal-hero">
      <div className="journal-hero__scene" aria-hidden="true" />
      <div className="journal-hero__grid" aria-hidden="true" />
      <div className="journal-shell journal-hero__content">
        <p className="eyebrow hero-reveal">THE JOURNAL <span /> EDENX</p>
        <h1 className="journal-hero__title hero-reveal">坐看云起时<span>。</span></h1>
        <p className="journal-hero__description hero-reveal">王维<span aria-hidden="true"> · </span>《终南别业》</p>
        <div className="journal-hero__bottom hero-reveal">
          <div className="journal-signature">
            <img src="/imgs/elaina2.jpg" alt="" width="36" height="36" />
            <div><span>Eden 的笔记</span><small>随笔、技术与日常</small></div>
          </div>
          <a href="#articles" className="hero-scroll"><span>向下探索</span><ArrowDown size={15} /></a>
        </div>
      </div>
    </section>
    <section className="journal-shell journal-articles" id="articles" aria-labelledby="articles-heading">
      <div className="section-heading">
        <div><p className="eyebrow section-eyebrow">IDEAS, NOTES & EVERYTHING BETWEEN</p><h2 id="articles-heading">文章与思考<span className="article-count">{posts.length.toString().padStart(2, "0")}</span></h2></div>
        <div className="view-switch liquid-glass" role="group" aria-label="文章显示方式">
          <button aria-label="网格视图" aria-pressed={view === "grid"} className={view === "grid" ? "is-active" : ""} onClick={() => setFilter({ view: "grid" })}><Grid2X2 size={17} /></button>
          <button aria-label="列表视图" aria-pressed={view === "list"} className={view === "list" ? "is-active" : ""} onClick={() => setFilter({ view: "list" })}><List size={18} /></button>
        </div>
      </div>
      <div className="journal-toolbar">
        <div className="category-filters" role="group" aria-label="按分类筛选">
          {categories.map((item) => <button key={item} aria-pressed={category === item}
            className={`category-filter${category === item ? " is-active" : ""}`}
            onClick={() => setFilter({ category: item })}>{item}{item === "全部" && <span>{posts.length}</span>}</button>)}
        </div>
        <div className="journal-search liquid-glass">
          <Search size={16} aria-hidden="true" />
          <input type="search" aria-label="搜索文章标题、内容摘要或标签" placeholder="寻找一点灵感…" value={query} onChange={(event) => setFilter({ query: event.target.value })} />
          {query ? <button onClick={() => setFilter({ query: "" })} aria-label="清空搜索"><X size={14} /></button> : <span className="search-hint">搜索</span>}
        </div>
      </div>
      <p className="search-results" role="status" aria-live="polite">{keyword || category !== "全部" ? `找到 ${filtered.length} 篇笔记` : `共 ${posts.length} 篇笔记`}</p>
      {ordered.length ? <div className={`article-grid${view === "list" ? " article-grid--list" : ""}`}>
        {ordered.map((post) => <ArticleCard key={post.slug} post={post} featured={post === featured} list={view === "list"} />)}
      </div> : <div className="journal-empty liquid-glass">
        <SearchX size={32} strokeWidth={1.3} /><h3>还没有找到这份灵感</h3><p>换个关键词，或者去看看全部笔记。</p>
        <button onClick={() => setFilter({ query: "", category: "全部" })}>浏览全部文章<BookOpen size={15} /></button>
      </div>}
      {ordered.length > 0 && <div className="journal-end"><span /><p>待续</p><span /></div>}
    </section>
  </main>;
}
