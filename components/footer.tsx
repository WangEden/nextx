"use client";

import { useEffect, useState } from "react";
const START_TIME = new Date(2025, 8, 10, 14, 57, 0);

function getRuntimeParts(now: Date) {
  if (now.getTime() < START_TIME.getTime()) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0 };
  }

  let diff = Math.floor((now.getTime() - START_TIME.getTime()) / 1000);
  const days = Math.floor(diff / 86400);
  diff %= 86400;
  const hours = Math.floor(diff / 3600);
  diff %= 3600;
  const minutes = Math.floor(diff / 60);
  const seconds = diff % 60;
  return { days, hours, minutes, seconds };
}

function formatRuntime(now: Date) {
  const { days, hours, minutes, seconds } = getRuntimeParts(now);
  return `本站已运行 ${days}天${hours}时${minutes}分${seconds}秒`;
}

export function Footer() {
  const [runtimeText, setRuntimeText] = useState(() => formatRuntime(new Date()));

  useEffect(() => {
    const id = window.setInterval(() => {
      setRuntimeText(formatRuntime(new Date()));
    }, 1000);
    return () => window.clearInterval(id);
  }, []);

  return (
    <footer className="border-t border-border/20 backdrop-blur-sm" aria-labelledby="footer-heading">
      <h2 id="footer-heading" className="sr-only">
        Footer
      </h2>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="mx-auto max-w-2xl text-center space-y-2">
          <div>
            <p className="text-base text-muted-foreground">由 Eden 构建与维护</p>
          </div>
          <div className="pt-2">
            <p className="text-base text-muted-foreground">{runtimeText}</p>
          </div>
          <div className="pt-2">
            <p className="text-base text-muted-foreground">
              &copy; {new Date().getFullYear()} Eden. 版权所有.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
