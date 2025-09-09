"use client";

import Link from "next/link";
import { useState } from "react";
import type { PostMeta } from "@/lib/posts";
import { Card } from "@/components/ui/card";
import { ImageWithFallback } from "@/components/figma/ImageWithFallback";
import { Badge } from "@/components/ui/badge";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { 
  Calendar,
  Clock,
  Eye,
  ArrowRight,
  Search,
  Filter,
  Grid,
  List,
  Bookmark,
  TrendingUp
} from "lucide-react";
import { Input } from "@/components/ui/input";

// 把你贴的 BlogListPage 改成接收 posts，从 PostMeta 渲染；跳转用 Link/router
export default function BlogList({ posts }: { posts: PostMeta[] }) {
  const [searchTerm, setSearchTerm] = useState('');
  const filtered = posts.filter(p =>
    p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.tags.some(t => t.toLowerCase().includes(searchTerm.toLowerCase()))
  );
  const featured = filtered.filter(p => p.featured);
  const regular = filtered;

  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const router = useRouter();

  // …把你原来的 UI 贴过来…
  // 关键改动：卡片点击的跳转
  // <Link href={`/archives/${post.slug}`} className="block">...</Link>
  // 或 onClick={() => router.push(`/archives/${post.slug}`)}
  const BlogCard = ({ post, featured = false }: { post: PostMeta; featured?: boolean }) => (
    <Card 
      className={`group cursor-pointer transition-all duration-300 hover:scale-[1.02] hover:shadow-xl bg-white/50 dark:bg-black/20 backdrop-blur-sm border-white/20 dark:border-white/10 overflow-hidden ${
        featured ? 'lg:col-span-2' : ''
      }`}
      onClick={() => router.push(`/archives/${post.slug}`)}
    >
      <div className={`relative ${featured ? 'h-80' : 'h-48'} overflow-hidden`}>
        <ImageWithFallback
          src={post.cover}
          alt={post.title}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
        <div className="absolute top-4 left-4">
          <Badge className="bg-white/20 text-white border-white/30 backdrop-blur-sm">
            {post.category}
          </Badge>
        </div>
        {featured && (
          <div className="absolute top-4 right-4">
            <Badge className="bg-gradient-primary text-white border-0">
              {/* <TrendingUp className="w-3 h-3 mr-1" /> */}
              推荐
            </Badge>
          </div>
        )}
        <div className="absolute bottom-4 left-4 right-4">
          <h3 className={`text-white mb-2 line-clamp-2 group-hover:text-blue-200 transition-colors ${
            featured ? 'text-2xl font-bold' : 'text-lg font-semibold'
          }`}>
            {post.title}
          </h3>
          {featured && (
            <p className="text-white/90 text-sm line-clamp-2 mb-3">
              {post.excerpt}
            </p>
          )}
        </div>
      </div>
      
      <div className="p-6">
        {!featured && (
          <p className="text-muted-foreground text-sm line-clamp-3 mb-4">
            {post.excerpt}
          </p>
        )}
        
        <div className="flex flex-wrap gap-2 mb-4">
          {post.tags.slice(0, 3).map((tag) => (
            <Badge key={tag} variant="secondary" className="text-xs">
              {tag}
            </Badge>
          ))}
        </div>
        
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              <span>{post.date}</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              <span>{post.readTime}</span>
            </div>
            <div className="flex items-center gap-1">
              <Eye className="w-4 h-4" />
              <span>{post.views.toLocaleString()}</span>
            </div>
          </div>
          <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
        </div>
      </div>
    </Card>
  );

  const BlogListItem = ({ post }: { post: PostMeta }) => (
    <Card 
      className="group cursor-pointer transition-all duration-300 hover:shadow-lg bg-white/50 dark:bg-black/20 backdrop-blur-sm border-white/20 dark:border-white/10"
      onClick={() => router.push(`/archives/${post.slug}`)}
    >
      <div className="p-6">
        <div className="flex gap-6">
          <div className="flex-shrink-0 w-32 h-20 rounded-lg overflow-hidden">
            <ImageWithFallback
              src={post.cover}
              alt={post.title}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
            />
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between mb-2">
              <h3 className="text-lg font-semibold line-clamp-2 group-hover:text-primary transition-colors">
                {post.title}
              </h3>
              <Badge variant="secondary" className="ml-2 flex-shrink-0">
                {post.category}
              </Badge>
            </div>
            
            <p className="text-muted-foreground text-sm line-clamp-2 mb-3">
              {post.excerpt}
            </p>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                <span>{post.author}</span>
                <span>•</span>
                <span>{post.date}</span>
                <span>•</span>
                <span>{post.readTime}</span>
                <span>•</span>
                <span>{post.views.toLocaleString()} views</span>
              </div>
              <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
            </div>
          </div>
        </div>
      </div>
    </Card>
  );

  return (
    // 你的渲染结构...
    // 例子：
    <div className="min-h-screen cursor-custom bg-radial pt-20">
      {/* 调试 */}
      {/* <div className="text-sm opacity-60 mb-4">Found {posts.length} posts</div> */}
      {/* <div className="text-sm opacity-60 mb-4">Search term: {searchTerm}</div> */}
      
      {/* 搜索输入框改写 setSearchTerm */}
      {/* Featured/Regular mapping 里用 post.slug */}
      {/* Link href={`/archives/${post.slug}`} */}
      <section className="py-16">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              文章汇总
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              关于各种技术、开发、和设计的见解、教程和想法
            </p>
          </div>

          {/* Search and Controls */}
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between mb-12">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                type="text"
                placeholder="Search articles..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-white/50 dark:bg-black/20 backdrop-blur-sm border-white/20 dark:border-white/10"
              />
            </div>
            
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Button
                  variant={viewMode === 'grid' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('grid')}
                  className={viewMode === 'grid' ? 'bg-gradient-primary' : ''}
                >
                  <Grid className="w-4 h-4" />
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('list')}
                  className={viewMode === 'list' ? 'bg-gradient-primary' : ''}
                >
                  <List className="w-4 h-4" />
                </Button>
              </div>
              
              <Button variant="outline" size="sm" className="gap-2">
                <Filter className="w-4 h-4" />
                Filter
              </Button>
              
              <Button variant="outline" size="sm" className="gap-2">
                <Bookmark className="w-4 h-4" />
                Saved
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Articles */}
      {featured.length > 0 && (
        <section className="pb-16">
          <div className="container mx-auto px-6 lg:px-12">
            <h2 className="text-2xl font-semibold mb-8">Featured Articles</h2>
            <div className="grid lg:grid-cols-3 gap-8">
              {featured.map((post) => (
                <BlogCard key={post.slug} post={post} featured />
              ))}
            </div>
          </div>
        </section>
      )}


      {/* Regular Articles */}
      <section className="pb-16">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-semibold">
              All Articles {searchTerm && `(${filtered.length} results)`}
            </h2>
            <span className="text-muted-foreground">
              {regular.length} articles
            </span>
          </div>
          
          {viewMode === 'grid' ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {regular.map((post) => (
                <BlogCard key={post.slug} post={post} />
              ))}
            </div>
          ) : (
            <div className="space-y-6">
              {regular.map((post) => (
                <BlogListItem key={post.slug} post={post} />
              ))}
            </div>
          )}

          {filtered.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No articles found matching your search.</p>
            </div>
          )}
        </div>
      </section>

      {/* Load More */}
      {regular.length > 0 && (
        <section className="pb-16">
          <div className="container mx-auto px-6 lg:px-12 text-center">
            <Button variant="outline" size="lg" className="gap-2">
              浏览更多
              <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        </section>
      )}
    </div>
  );
}
