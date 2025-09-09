"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Zap, Shield, Globe, Users, Code, Smartphone } from "lucide-react";
import type { PostMeta } from "@/lib/posts";
import { useRouter } from "next/navigation";

function mapPostsToFeatures(posts: PostMeta[]) {
  return posts.map((post) => ({
    icon: Zap, // 默认图标，稍后会被覆盖
    title: post.title,
    description: post.excerpt,
    badge: post.category || "General",  // 或者用 post.tags[0] 做 badge
    slug: post.slug,                    // 👈 保留 slug，方便点击跳转
    cover: post.cover                   // 👈 保留封面图，如果需要卡片封面
  }));
}

export function FeaturesSection({ posts }: { posts: PostMeta[] }) {
  const router = useRouter();
  const features = mapPostsToFeatures(posts);
  const icons = [Zap, Shield, Globe, Users, Code, Smartphone];
  features.forEach((feature, index) => {
    feature.icon = icons[index % icons.length];
  });

  return (
    <section id="services" className="py-16 sm:py-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl sm:text-4xl">
            朝花夕拾
          </h2>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
            一切事物都值得被记录
          </p>
        </div>

        <div className="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => {
            const IconComponent = feature.icon;
            return (
              <Card 
                key={index} 
                className="relative overflow-hidden hover:shadow-lg bg-card/60 backdrop-blur-sm border-border/30 transform transition duration-500 ease-elastic hover:scale-102"
                onClick={() => router.push(`/archives/${feature.slug}`)}
              >
              {/* <Card key={index} className="relative overflow-hidden hover:shadow-lg transition-shadow bg-card/60 backdrop-blur-sm border-border/30"> */}
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                        <IconComponent className="h-5 w-5" />
                      </div>
                      <CardTitle className="text-lg">{feature.title}</CardTitle>
                    </div>
                    <Badge variant="secondary">{feature.badge}</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}