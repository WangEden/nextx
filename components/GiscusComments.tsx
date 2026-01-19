"use client";

import { useEffect, useRef } from "react";
import { useTheme } from "next-themes";

type GiscusTheme = "light" | "dark_dimmed";

function resolveGiscusTheme(theme: string | undefined): GiscusTheme {
  return theme === "dark" ? "dark_dimmed" : "light";
}

export function GiscusComments() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { resolvedTheme } = useTheme();

  useEffect(() => {
    if (!containerRef.current) return;

    const script = document.createElement("script");
    script.src = "https://giscus.app/client.js";
    script.async = true;
    script.crossOrigin = "anonymous";

    script.setAttribute("data-repo", "WangEden/blog-comments");
    script.setAttribute("data-repo-id", "R_kgDOQ9F3Vg");
    script.setAttribute("data-category", "Announcements");
    script.setAttribute("data-category-id", "DIC_kwDOQ9F3Vs4C1Kbd");
    script.setAttribute("data-mapping", "pathname");
    script.setAttribute("data-strict", "0");
    script.setAttribute("data-reactions-enabled", "1");
    script.setAttribute("data-emit-metadata", "0");
    script.setAttribute("data-input-position", "top");
    script.setAttribute("data-theme", resolveGiscusTheme(resolvedTheme));
    script.setAttribute("data-lang", "zh-CN");
    script.setAttribute("data-loading", "lazy");

    containerRef.current.innerHTML = "";
    containerRef.current.appendChild(script);
  }, [resolvedTheme]);

  return <div ref={containerRef} className="giscus" />;
}
