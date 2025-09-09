// app/archives/page.tsx
import { getAllPosts } from "@/lib/posts";
import BlogList from "./_BlogList";

export default function ArchivesPage() {
  const posts = getAllPosts();      // 这里用 fs/gray-matter 读取
  return <BlogList posts={posts} />; // 交给客户端组件做交互/搜索/切换视图
}
