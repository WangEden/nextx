"use client";

import { BookOpen, Grid2X2, Info, Moon, Sun, UserRound, ArrowLeft, X } from "lucide-react";
import { useEffect, useState, type MouseEvent } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import { motion, useReducedMotion } from "motion/react";
import { useViewTransitionRouter } from "./useViewTransitionRouter";
import { useDockInk, useGlassLens } from "./LiquidGlass";
import { edenAvatar, siteImage } from "@/lib/site-images";

const navItems = [
  { href: "/archives", label: "文库", icon: BookOpen },
  { href: "/about", label: "关于", icon: Info },
  { href: "/dashboard", label: "应用", icon: Grid2X2 },
  { href: "/mine", label: "我的", icon: UserRound },
];

export default function Header() {
  const [mounted, setMounted] = useState(false);
  const { resolvedTheme, setTheme } = useTheme();
  const pathname = usePathname();
  const { push, closeArticle } = useViewTransitionRouter();
  const reduceMotion = useReducedMotion();
  const dock = useGlassLens<HTMLDivElement>("dock");
  useDockInk(dock, pathname);
  const isArticle = pathname.startsWith("/archives/");
  useEffect(() => { setMounted(true); }, []);

  const navigate = (event: MouseEvent<HTMLAnchorElement>, href: string) => {
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0) return;
    event.preventDefault();
    push(href);
  };

  return <header className="site-header">
    <a className="skip-link" href="#main-content">跳到正文</a>
    <div className="site-dock liquid-glass glass-optical" ref={dock}>
      <Link href="/" className="dock-brand" aria-label="EdenX 首页" onClick={(event) => navigate(event, "/")}>
        <img {...siteImage(edenAvatar, "38px")} alt="" width="38" height="38" className="dock-avatar" decoding="async" />
        <span>Eden<span className="dock-brand__x">X</span><small>日常手记</small></span>
      </Link>
      <span className="dock-divider" aria-hidden="true" />
      <nav className="dock-nav" aria-label="主导航">
        {navItems.map(({ href, label, icon: Icon }) => {
          const active = pathname === href || pathname.startsWith(`${href}/`);
          return <Link key={href} href={href} className={`dock-link${active ? " is-active" : ""}`}
            aria-current={active ? "page" : undefined} onClick={(event) => navigate(event, href)}>
            {active && <motion.span className="dock-active" layoutId="dock-active"
              transition={reduceMotion ? { duration: 0 } : { type: "spring", stiffness: 380, damping: 32 }} />}
            <Icon size={18} strokeWidth={1.65} aria-hidden="true" /><span>{label}</span>
          </Link>;
        })}
      </nav>
      <span className="dock-divider dock-divider--end" aria-hidden="true" />
      <button className="dock-theme" disabled={!mounted}
        aria-label={mounted && resolvedTheme === "dark" ? "切换浅色模式" : "切换深色模式"}
        title={mounted && resolvedTheme === "dark" ? "切换浅色模式" : "切换深色模式"}
        onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}>
        {mounted && resolvedTheme === "dark" ? <Sun size={18} strokeWidth={1.65} /> : <Moon size={18} strokeWidth={1.65} />}
      </button>
    </div>
    {isArticle && <button className="reader-back liquid-glass" onClick={closeArticle} aria-label="关闭文章，返回卡片">
      <ArrowLeft size={17} /><span>返回</span>
    </button>}
    {isArticle && <button className="reader-close liquid-glass" onClick={closeArticle} aria-label="收起文章" title="收起文章 · Esc"><X size={19} /></button>}
  </header>;
}
