"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { useEffect, useState } from "react";

const START_TIME = new Date(2025, 8, 10, 14, 57, 0);
function formatRuntime() {
  const elapsed = Math.max(0, Math.floor((Date.now() - START_TIME.getTime()) / 1000));
  return `已记录 ${Math.floor(elapsed / 86400)} 天 ${Math.floor(elapsed / 3600) % 24} 时 ${Math.floor(elapsed / 60) % 60} 分 ${elapsed % 60} 秒`;
}

export function Footer() {
  const [runtime, setRuntime] = useState("记录从未停下");
  useEffect(() => {
    setRuntime(formatRuntime());
    const timer = window.setInterval(() => setRuntime(formatRuntime()), 1000);
    return () => window.clearInterval(timer);
  }, []);
  return <footer className="site-footer">
    <div className="journal-shell footer-top"><div><Link href="/" className="footer-brand">Eden<span>X</span><span className="footer-brand__dot" /></Link><p>掬水月在手，弄花香满衣。</p></div><nav aria-label="页脚导航"><Link href="/archives">文库<ArrowUpRight size={14} /></Link><Link href="/about">关于我<ArrowUpRight size={14} /></Link></nav></div>
    <div className="journal-shell footer-bottom"><span>© {new Date().getFullYear()} Eden. 用热爱构建。</span><span>{runtime}</span><span>MADE OF THOUGHTS & COFFEE</span></div>
  </footer>;
}
