"use client";
// app/archives/[slug]/_ArticlePage.tsx
import { Hero } from "@/components/blog/Hero";
import { ArticleContent } from "@/components/blog/ArticleContent";
import { Sidebar } from "@/components/blog/Sidebar";
import { Tag } from "lucide-react";
import type { Post } from "@/lib/posts";
import { PopupNotification } from "@/components/PopupNotification";
import { FloatingActionMenu } from "@/components/FloatingActionMenu";
import { GiscusComments } from "@/components/GiscusComments";
import { useState } from "react";

type NoticeType = "info" | "warning" | "error";

export function ArticlePage({ post, likes }: { post: Post; likes: number }) {
  const [notification, setNotification] = useState<{
    visible: boolean;
    message: string;
    type: NoticeType;
  }>({
    visible: false,
    message: "",
    type: "info",
  });

  // 统一的弹窗函数：谁想弹，就调用它
  const showNotification = (message: string, type: NoticeType) => {
    setNotification({ visible: true, message, type });
  };

  const handlePopupComplete = () => {
    setNotification((prev) => ({ ...prev, visible: false }));
  };

  return (
    <div className="min-h-screen cursor-custom">
      <Hero
        title={post.title}
        subtitle={post.excerpt}
        categories={post.tags.map((t) => ({
          name: t,
          icon: <Tag className="w-4 h-4" />,
        }))}
        date={post.date}
        readingTime={post.readTime ?? ""}
        views={post.views ?? 0}
        coverImage={post.cover}
        coverTransitionName={`cover-${post.slug}`}
      />

      <section className="py-16 bg-radial">
        <div className="container mx-auto px-6 lg:px-12 grid lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2 min-w-0">
            <ArticleContent
              author={{ name: post.author, role: "" }}
              content={post.content}
              likes={likes}
              comments={0}
            />
            <div className="mt-12 rounded-2xl bg-white/50 dark:bg-black/20 backdrop-blur-sm border border-white/20 dark:border-white/10 p-6">
              <h3 className="text-lg font-semibold mb-4">评论区</h3>
              <GiscusComments />
            </div>
          </div>

          <Sidebar
            // author={{ name: post.author, role: "各位见笑了", description: "" }}
            author={{
              name: post.author,
              role: "各位见笑了",
              description: "",
              avatar: "/imgs/avatar/flower.jpg", // 👈 你的头像路径
            }}
            stats={{
              views: post.views ?? 0,
              likes: 0,
              comments: 0,
              shares: 0,
            }}
            // 原来的逻辑：点“关注作者”弹出提示
            onTriggerPopup={() =>
              showNotification("现在还不能关注Eden", "warning")
            }
          />
        </div>
      </section>

      {/* 右下角悬浮菜单，给它一个 onNotification 回调 */}
      <FloatingActionMenu
        onNotification={(message, type) => {
          // 如果 FloatingActionMenu 里有 'success'，这里顺手映射一下
          // PopupNotification 的类型是 'info' | 'warning' | 'error'
          const mappedType: NoticeType =
            type === "error" || type === "warning" ? type : "info";
          showNotification(message, mappedType);
        }}
      />

      {/* 顶部弹出的通知 */}
      <PopupNotification
        isVisible={notification.visible}
        onComplete={handlePopupComplete}
        message={notification.message}
        type={notification.type}
      />
    </div>
  );
}

// --------------------------------------------------------------------
// "use client";
// // app/archives/[slug]/page.tsx
// import { Hero } from "@/components/blog/Hero";
// import { ArticleContent } from "@/components/blog/ArticleContent";
// import { Sidebar } from "@/components/blog/Sidebar";
// import { Tag } from "lucide-react";
// import type { Post } from "@/lib/posts";
// import { PopupNotification } from "@/components/PopupNotification";
// import { useState } from "react";

// export function ArticlePage({ post, likes }: { post: Post, likes: number }) {
//   const [notification, setNotification] = useState(false);

//   const triggerPopup = () => {
//     setNotification(true);
//   }

//   const handlePopupComplete = () => {
//     setNotification(false);
//   } 

//   return (
//     <div className="min-h-screen cursor-custom">
//       <Hero
//         title={post.title}
//         subtitle={post.excerpt}
//         // 如果 Hero 要求 {name, icon}：
//         categories={post.tags.map(t => ({ name: t, icon: <Tag className="w-4 h-4" /> }))}
//         date={post.date}
//         readingTime={post.readTime ?? ""}
//         views={post.views ?? 0}
//         coverImage={post.cover}
//       />

//       <section className="py-16 bg-radial">
//         <div className="container mx-auto px-6 lg:px-12 grid lg:grid-cols-3 gap-12">
//           <div className="lg:col-span-2 min-w-0">
//             <ArticleContent
//               author={{ name: post.author, role: "" }}
//               content={post.content}
//               likes={likes}
//               comments={0}
//             />
//           </div>
//           <Sidebar
//             author={{ name: post.author, role: "", description: "" }}
//             stats={{ views: post.views ?? 0, likes: 0, comments: 0, shares: 0 }}
//             onTriggerPopup={() => triggerPopup()}
//           />
//         </div>
//       </section>

//       <PopupNotification
//         isVisible={notification}
//         onComplete={handlePopupComplete}
//         message="现在还不能关注Eden"
//         type="warning"
//       />
//     </div>
//   );
// }
