// app/sitemap.ts
import type { MetadataRoute } from "next";
import { getAllPosts } from "@/lib/posts";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://wangeden.top";

  const posts = getAllPosts();  // 自己实现：返回所有 { slug, date, updatedAt? }

  // const staticPages: MetadataRoute.Sitemap = [
  //   { url: baseUrl, lastModified: new Date() },
  //   { url: `${baseUrl}/archives/1`, lastModified: new Date() }, // 你的列表页（可选）:contentReference[oaicite:6]{index=6}
  // ];

  const postPages: MetadataRoute.Sitemap = posts.map((post) => ({
    url: `${baseUrl}/archives/${post.slug}`,
    lastModified: posts[0]?.date ?? new Date() ,
  }));

  return [...postPages];
  // return [...staticPages, ...postPages];
}
