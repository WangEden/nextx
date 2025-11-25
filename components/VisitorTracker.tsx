// components/VisitorTracker.tsx
"use client";

import { useEffect, useState } from "react";
import { PopupNotification } from "@/components/PopupNotification";

function getTodayKey() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function VisitorTracker() {
  const [visible, setVisible] = useState(false);
  const [message, setMessage] = useState("");

// 组件挂载时只跑一次
  useEffect(() => {
    // 防止 SSR 阶段访问 window
    if (typeof window === "undefined") return;

    const todayKey = getTodayKey();
    const storageKey = `visited-${todayKey}`;

    const hasVisitedToday = window.localStorage.getItem(storageKey) === "1";
    const isNewVisitor = !hasVisitedToday;

    fetch("/api/visitor", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isNewVisitor }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (isNewVisitor) {
          // 记下今天访问过了
          window.localStorage.setItem(storageKey, "1");

          const count = data.todayCount as number;
          setMessage(`你是今天第 ${count} 位访问本站的访客，欢迎你！`);
          setVisible(true);
        }
      })
      .catch((err) => {
        console.error("visitor api error:", err);
      });
  }, []);

  return (
    <PopupNotification
      isVisible={visible}
      onComplete={() => setVisible(false)}
      message={message}
      type="info"
      topOffset={80}
      duration={3000}
      shake={false}
    />
  );
}
