// 文章示例页面

import React from 'react'
import { ImageWithFallback } from "@/components/figma/ImageWithFallback";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { 
  Calendar,
  Clock,
  Eye,
  Heart,
  MessageCircle,
  Share2,
  BookOpen,
  User,
  Tag,
  ImportIcon
} from "lucide-react";

import {Hero} from "@/components/blog/Hero";
import printerImg from "@/public/imgs/articleCover/3d-printer-notes.jpg";
import { ArticleContent } from '@/components/blog/ArticleContent';
import { Sidebar } from '@/components/blog/Sidebar';

import fs from 'fs';
import path from 'path';

// 读去markdown文本
const mdPath = path.join(process.cwd(), 'content', 'notes', '3D打印机笔记.md');
const mdContent = fs.readFileSync(mdPath, "utf-8");

export default function page() {
  return (
    <div className="min-h-screen cursor-custom">
      {/* Hero Section with Cover Image */}
      <Hero
        title="3D打印机笔记"
        subtitle="记录3D打印机使用中的经验和常见问题"
        categories={[{ name: "科技", icon: <Tag /> }, { name: "3D打印", icon: <BookOpen /> }]}
        date="2025-09-05"
        readingTime="8分钟"
        views={2437}
        coverImage={printerImg.src}
      />

      {/* Main Content */}
      <section className="py-16 bg-radial">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="grid lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2">
              <ArticleContent
                author={{ name: "Wang Eden", role: "3D打印爱好者" }}
                content={mdContent}
                likes={234}
                comments={42}
              />
            </div>
            <Sidebar
              author={{ name: "Wang Eden", role: "3D打印爱好者", description: "分享3D打印经验和技巧" }}
              stats={{ views: 2437, likes: 234, comments: 42, shares: 18 }}
            />
          </div>
        </div>
      </section>

      {/* Comments Section */}
      <section className="py-16 bg-radial">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="max-w-8xl mx-auto">
            <Card className="p-8 bg-white/50 dark:bg-black/20 backdrop-blur-sm border-white/20 dark:border-white/10">
              <div className="mb-8">
                <h2 className="text-2xl font-semibold mb-2">Comments (42)</h2>
                <p className="text-muted-foreground">Join the discussion and share your thoughts</p>
              </div>

              {/* Add Comment Form */}
              <div className="mb-8 p-6 bg-white/30 dark:bg-black/10 rounded-xl">
                <h3 className="font-medium mb-4">Add your comment</h3>
                <div className="space-y-4">
                  <Textarea 
                    placeholder="What are your thoughts on this article?"
                    className="min-h-[100px] bg-white/50 dark:bg-black/20"
                  />
                  <div className="flex justify-between items-center">
                    <p className="text-sm text-muted-foreground">
                      Be respectful and constructive in your comments.
                    </p>
                    <Button className="bg-gradient-primary">
                      Post Comment
                    </Button>
                  </div>
                </div>
              </div>

              {/* Sample Comments */}
              <div className="space-y-6">
                <div className="border-l-4 border-primary/20 pl-6">
                  <div className="flex items-center gap-3 mb-3">
                    <Avatar className="w-8 h-8">
                      <div className="w-full h-full bg-gradient-secondary rounded-full flex items-center justify-center">
                        <User className="w-4 h-4 text-white" />
                      </div>
                    </Avatar>
                    <div>
                      <span className="font-medium">Alex Chen</span>
                      <span className="text-sm text-muted-foreground ml-2">2 hours ago</span>
                    </div>
                  </div>
                  <p className="text-sm text-foreground">
                    Great article! I've been working with Next.js 14 lately and the improvements in performance are remarkable. The AI integration points you mentioned are spot on.
                  </p>
                  <div className="flex gap-4 mt-3">
                    <Button variant="ghost" size="sm" className="text-xs gap-1">
                      <Heart className="w-3 h-3" />
                      12
                    </Button>
                    <Button variant="ghost" size="sm" className="text-xs">
                      Reply
                    </Button>
                  </div>
                </div>

                <div className="border-l-4 border-primary/20 pl-6">
                  <div className="flex items-center gap-3 mb-3">
                    <Avatar className="w-8 h-8">
                      <div className="w-full h-full bg-gradient-accent rounded-full flex items-center justify-center">
                        <User className="w-4 h-4 text-white" />
                      </div>
                    </Avatar>
                    <div>
                      <span className="font-medium">Maria Rodriguez</span>
                      <span className="text-sm text-muted-foreground ml-2">4 hours ago</span>
                    </div>
                  </div>
                  <p className="text-sm text-foreground">
                    The section on Core Web Vitals is very insightful. We've seen a significant improvement in our conversion rates after optimizing for these metrics.
                  </p>
                  <div className="flex gap-4 mt-3">
                    <Button variant="ghost" size="sm" className="text-xs gap-1">
                      <Heart className="w-3 h-3" />
                      8
                    </Button>
                    <Button variant="ghost" size="sm" className="text-xs">
                      Reply
                    </Button>
                  </div>
                </div>

              </div>

              <div className="mt-8 text-center">
                <Button variant="outline">Load More Comments</Button>
              </div>
            </Card>
          </div>
        </div>
      </section>
    </div>
  )
}
