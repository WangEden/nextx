// layout.tsx
import type { Metadata, Viewport } from "next";
import "./globals.css";
import localFont from "next/font/local";
import { ThemeProvider } from "next-themes";
import AutoSunsetTheme from "@/components/function/AutoSunsetTheme";
import Header from "@/components/header"
import { Footer } from "@/components/footer";
import PwaSplashLinks from "@/components/PwaSplashLinks";

// 字体：无衬线（正文）— 纤黑/常规/中等
const wenkai = localFont({
  src: [
    { path: "../public/fonts/LXGWWenKai-Light.ttf",   weight: "300", style: "normal" },
    { path: "../public/fonts/LXGWWenKai-Regular.ttf", weight: "400", style: "normal" },
    { path: "../public/fonts/LXGWWenKai-Medium.ttf",  weight: "500", style: "normal" },
  ],
  variable: "--font-wenkai",
  display: "swap",
  fallback: ["system-ui", "Segoe UI", "Helvetica", "Arial"],
  adjustFontFallback: false, // 避免 Next 注入的度量替代引起跳动
});

// 字体：等宽（代码）— 纤黑/常规/中等
const wenkaiMono = localFont({
  src: [
    { path: "../public/fonts/LXGWWenKaiMono-Light.ttf",   weight: "300", style: "normal" },
    { path: "../public/fonts/LXGWWenKaiMono-Regular.ttf", weight: "400", style: "normal" },
    { path: "../public/fonts/LXGWWenKaiMono-Medium.ttf",  weight: "500", style: "normal" },
  ],
  variable: "--font-wenkai-mono",
  display: "swap",
  fallback: ["system-ui", "Segoe UI", "Helvetica", "Arial"],
  adjustFontFallback: false,
});

export const metadata: Metadata = {
  title: "榴莲桂花糕",
  description: "WangEden WebSite",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,                     // 等价 <meta name="apple-mobile-web-app-capable" content="yes">
    statusBarStyle: "black-translucent",
    title: "WangEden",                  // <meta name="apple-mobile-web-app-title">
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
    <html lang="zh" suppressHydrationWarning className={`${wenkai.variable} ${wenkaiMono.variable}`}>
      <head>
        <PwaSplashLinks />
      </head>
      <body className={`${wenkai.className} ${wenkaiMono.className} min-h-screen cursor-custom antialiased overflow-x-hidden pt-safe pb-safe`}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <AutoSunsetTheme />
          <Header />
          {children}
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
