// components/blog/ArticleContent.tsx
import React from "react";
import { Avatar } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Heart, MessageCircle, Share2, User } from "lucide-react";
import { MarkdownRenderer } from "./MarkdownRenderer";

interface ArticleContentProps {
  author: { name: string; role: string };
  content: string;
  likes: number;
  comments: number;
}

export const ArticleContent: React.FC<ArticleContentProps> = ({ 
  author, 
  content, 
  likes, 
  comments 
}) => (
  <article className="prose prose-lg max-w-none min-w-0">
    {/* Article header */}
    <div className="mb-8 p-6 bg-white/50 dark:bg-black/20 rounded-2xl backdrop-blur-sm border border-white/20 dark:border-white/10">
      <div className="flex items-center gap-4 mb-4">
        <Avatar className="w-12 h-12">
          <div className="w-full h-full bg-gradient-primary rounded-full flex items-center justify-center">
            <User className="w-6 h-6 text-white" />
          </div>
        </Avatar>
        <div>
          <p className="font-semibold text-foreground">{author.name}</p>
          <p className="text-muted-foreground">{author.role}</p>
        </div>
      </div>
      <Separator className="mb-4" />
      <div className="flex items-center justify-between">
        <div className="flex gap-4">
          <Button variant="ghost" size="sm" className="gap-2"><Heart className="w-4 h-4" /><span>{likes}</span></Button>
          <Button variant="ghost" size="sm" className="gap-2"><MessageCircle className="w-4 h-4" /><span>{comments}</span></Button>
          <Button variant="ghost" size="sm" className="gap-2"><Share2 className="w-4 h-4" />Share</Button>
        </div>
      </div>
    </div>

    {/* Article body */}
    <div className="space-y-8 text-foreground w-full max-w-full min-w-0">

      <MarkdownRenderer content={content} extractStrategy="after-first-dash" />
    </div>
  </article>
);
