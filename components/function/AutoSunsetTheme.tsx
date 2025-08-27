// components/AutoSunsetTheme.tsx
"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import SunCalc from "suncalc";

export default function AutoSunsetTheme() {
  const { theme, resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Hook 1：标记 mounted（只负责标记，不 return 提前）
  useEffect(() => {
    setMounted(true);
  }, []);

  // Hook 2：仅当 mounted 且 theme === 'system' 时，根据日出日落设置一次
  useEffect(() => {
    if (!mounted) return;       // 确保在客户端
    if (theme !== "system") return; // 用户已手动选择则不干预

    const applyOnce = (lat: number, lon: number) => {
      const now = new Date();
      const { sunrise, sunset } = SunCalc.getTimes(now, lat, lon);
      const isNight = now < sunrise || now >= sunset;
      const target: "light" | "dark" = isNight ? "dark" : "light";

      if (resolvedTheme !== target) setTheme(target); // 只有不一致才切，避免闪烁
    };

    const fallbackToSystem = () => {
      // 不做强制设置，保持 system（让系统自己管）
    };

    // 尝试获取一次定位
    navigator.geolocation.getCurrentPosition(
      (pos) => applyOnce(pos.coords.latitude, pos.coords.longitude),
      () => fallbackToSystem(),
      { enableHighAccuracy: false, timeout: 5000, maximumAge: 60_000 }
    );

    // 页面重新可见且仍处于 system 时，再尝试按太阳位置调整一次
    const onVis = () => {
      if (document.visibilityState !== "visible") return;
      if (theme !== "system") return;

      navigator.geolocation.getCurrentPosition(
        (pos) => applyOnce(pos.coords.latitude, pos.coords.longitude),
        () => fallbackToSystem()
      );
    };

    document.addEventListener("visibilitychange", onVis);
    return () => document.removeEventListener("visibilitychange", onVis);
  }, [mounted, theme, resolvedTheme, setTheme]);

  // 渲染什么都行，这个组件只是副作用
  return null;
}
