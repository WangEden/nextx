// components/blog/Sidebar.tsx
import React from "react";
import { Card } from "@/components/ui/card";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Eye, Heart, MessageCircle, Share2, User } from "lucide-react";

interface SidebarProps {
  author: { name: string; role: string; description: string };
  stats: { views: number; likes: number; comments: number; shares: number };
}

export const Sidebar: React.FC<SidebarProps> = ({ author, stats }) => (
  <div className="space-y-6">
    {/* Author Info */}
    <Card className="p-6 bg-white/50 dark:bg-black/20 backdrop-blur-sm border-white/20 dark:border-white/10">
      <div className="flex items-center gap-4 mb-4">
        <Avatar className="w-16 h-16">
          <div className="w-full h-full bg-gradient-primary rounded-full flex items-center justify-center">
            <User className="w-8 h-8 text-white" />
          </div>
        </Avatar>
        <div>
          <h3 className="font-semibold">{author.name}</h3>
          <p className="text-muted-foreground text-sm">{author.role}</p>
        </div>
      </div>
      <p className="text-sm text-muted-foreground mb-4">{author.description}</p>
      <Button variant="outline" size="sm" className="w-full">Follow Author</Button>
    </Card>

    {/* Stats */}
    <Card className="p-6 bg-white/50 dark:bg-black/20 backdrop-blur-sm border-white/20 dark:border-white/10">
      <h3 className="font-semibold mb-4">Article Statistics</h3>
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm"><Eye className="w-4 h-4" />Views</div>
          <span className="font-medium">{stats.views}</span>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm"><Heart className="w-4 h-4" />Likes</div>
          <span className="font-medium">{stats.likes}</span>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm"><MessageCircle className="w-4 h-4" />Comments</div>
          <span className="font-medium">{stats.comments}</span>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm"><Share2 className="w-4 h-4" />Shares</div>
          <span className="font-medium">{stats.shares}</span>
        </div>
      </div>
    </Card>
  </div>
);
