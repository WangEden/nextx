// components/AutoSunsetTheme.tsx
"use client";

import { useEffect, useRef } from "react";
import { useTheme } from "next-themes";
import SunCalc from "suncalc";

export default function AutoSunsetTheme() {
  const { setTheme } = useTheme();
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    let cancelled = false;

    function applyThemeBySun(lat: number, lon: number) {
      const now = new Date();
      const { sunrise, sunset } = SunCalc.getTimes(now, lat, lon);

      const isNight = now < sunrise || now >= sunset;
      setTheme(isNight ? "dark" : "light");

      // 计算下一次切换的时间点
      const next = isNight
        ? // 夜间 -> 下一次切换在明天的日出
          SunCalc.getTimes(new Date(now.getTime() + 24 * 3600 * 1000), lat, lon).sunrise
        : // 白天 -> 下一次切换在今天的日落
          sunset;

      const delay = Math.max(0, next.getTime() - now.getTime()) + 500; // +500ms 裁边
      if (timerRef.current) window.clearTimeout(timerRef.current);
      timerRef.current = window.setTimeout(() => applyThemeBySun(lat, lon), delay);
    }

    function fallbackToSystem() {
      // 如果拿不到定位，就跟随系统（系统有“随日落”选项的会自己切）
      // 这里不需要 setTheme("system")，ThemeProvider 默认已经是 system，
      // 但你也可以显式设一下：
      setTheme("system");
    }

    // 拿地理位置（用户若拒绝/超时，会退回系统主题）
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        if (cancelled) return;
        const { latitude, longitude } = pos.coords;
        applyThemeBySun(latitude, longitude);
      },
      () => {
        if (!cancelled) fallbackToSystem();
      },
      { enableHighAccuracy: false, timeout: 5000, maximumAge: 60_000 }
    );

    // 页面切回前台时重算一次（跨天/跨时区）
    const onVis = () => {
      if (document.visibilityState === "visible") {
        if (timerRef.current) window.clearTimeout(timerRef.current);
        navigator.geolocation.getCurrentPosition(
          (pos) => applyThemeBySun(pos.coords.latitude, pos.coords.longitude),
          fallbackToSystem
        );
      }
    };
    document.addEventListener("visibilitychange", onVis);

    return () => {
      cancelled = true;
      document.removeEventListener("visibilitychange", onVis);
      if (timerRef.current) window.clearTimeout(timerRef.current);
    };
  }, [setTheme]);

  return null;
}
