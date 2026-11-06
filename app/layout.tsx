// layout.tsx
import type { Metadata, Viewport } from "next";
import "./globals.css";
import "./liquid-glass.css";
import "./wenkai.generated.css";
import { ThemeProvider } from "next-themes";
// import AutoSunsetTheme from "@/components/function/AutoSunsetTheme";
import Header from "@/components/header"
import { Footer } from "@/components/footer";
import PwaSplashLinks from "@/components/PwaSplashLinks";
// import { useEffect } from "react";
import { VisitorTracker } from "@/components/VisitorTracker";
import { ArticleTransitionProvider } from "@/components/ArticleTransitionProvider";
import { LiquidGlassEnvironment } from "@/components/LiquidGlass";
import { DirectionalCursor } from "@/components/DirectionalCursor";

export const metadata: Metadata = {
  metadataBase: new URL("https://edenx.me"),
  title: "EdenX",
  description: "Eden的笔记",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,                     // 等价 <meta name="apple-mobile-web-app-capable" content="yes">
    statusBarStyle: "black-translucent",
    title: "EdenX",                  // <meta name="apple-mobile-web-app-title">
  },
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon-192.png",   sizes: "192x192", type: "image/png" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180" }],
    shortcut: ["/favicon.ico"],
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)",  color: "#000000" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh" suppressHydrationWarning>
      <head>
        <PwaSplashLinks />
        <meta name="msvalidate.01" content="D031115EBF62CB35F2ACB25CAC665807" />
      </head>
      <body className="min-h-screen antialiased overflow-x-hidden pt-safe pb-safe">
        <DirectionalCursor />
        <ThemeProvider 
          attribute="class"   // 使用 class 切换主题
          defaultTheme="system"   // 跟随系统
          enableSystem           // 开启系统模式检测
          storageKey="theme-v1"
          // disableStorage={true}   // 禁用 localStorage
          // disableTransitionOnChange // 切换主题时禁用 CSS 过渡
        >
          {/* 移除 AutoSunsetTheme */}
          <ArticleTransitionProvider>
            <LiquidGlassEnvironment />
            <Header />
            <VisitorTracker />
            <div id="main-content" tabIndex={-1}>{children}</div>
            <Footer />
          </ArticleTransitionProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
