"use client";

import { useEffect, useRef, type RefObject } from "react";
import { usePathname } from "next/navigation";
import { observeGlass, type GlassShape } from "@/lib/glass-refraction";
import { ambientBackdrop } from "@/lib/site-images";

export function useGlassLens<T extends HTMLElement>(shape: GlassShape) {
  const ref = useRef<T>(null);
  useEffect(() => {
    if (ref.current) return observeGlass(ref.current, shape);
  }, [shape]);
  return ref;
}

const SAMPLE_SIZE = 24;
const clamp = (value: number) => Math.max(0, Math.min(1, value));

// Sample the active hero photo once per image load. The dock reads this tiny
// luma grid as it crosses the photo; no screenshot or second image request.
export function useDockInk(ref: RefObject<HTMLDivElement | null>, pathname: string) {
  useEffect(() => {
    const dock = ref.current;
    const image = document.querySelector<HTMLImageElement>("img[data-glass-scene]");
    if (!dock || !image) return;
    let luminance: Float32Array | undefined;
    let frame = 0;

    const reset = () => {
      delete dock.dataset.glassTone;
      dock.style.removeProperty("--glass-dock-opacity");
    };

    const update = () => {
      frame = 0;
      if (!luminance || !image.naturalWidth) return;
      const scene = image.getBoundingClientRect();
      const bounds = dock.getBoundingClientRect();
      const middle = bounds.top + bounds.height / 2;
      if (!scene.width || !scene.height || middle < scene.top || middle > scene.bottom) {
        if (dock.dataset.glassTone) reset();
        return;
      }
      const scale = Math.max(scene.width / image.naturalWidth, scene.height / image.naturalHeight);
      const width = image.naturalWidth * scale;
      const height = image.naturalHeight * scale;
      const [x, y] = getComputedStyle(image).objectPosition.split(" ");
      const left = scene.left + (scene.width - width) * (x?.endsWith("%") ? parseFloat(x) / 100 : 0.5);
      const top = scene.top + (scene.height - height) * (y?.endsWith("%") ? parseFloat(y) / 100 : 0.5);
      let sum = 0, low = 1, high = 0;
      for (let i = 0; i < 7; i++) {
        for (let j = 0; j < 3; j++) {
          const sx = Math.round(clamp((bounds.left + bounds.width * ((i + 0.5) / 7) - left) / width) * (SAMPLE_SIZE - 1));
          const sy = Math.round(clamp((bounds.top + bounds.height * ((j + 0.5) / 3) - top) / height) * (SAMPLE_SIZE - 1));
          const light = luminance[sy * SAMPLE_SIZE + sx];
          sum += light;
          low = Math.min(low, light);
          high = Math.max(high, light);
        }
      }
      const tone = sum / 21 * 0.80 + 0.05 > 0.50 ? "light" : "dark";
      const opacity = (0.23 + Math.min(0.30, (high - low) * 0.36)).toFixed(2);
      if (dock.dataset.glassTone !== tone) dock.dataset.glassTone = tone;
      if (dock.style.getPropertyValue("--glass-dock-opacity") !== opacity) {
        dock.style.setProperty("--glass-dock-opacity", opacity);
      }
    };

    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    const sample = () => {
      if (!image.naturalWidth) return;
      const canvas = document.createElement("canvas");
      canvas.width = canvas.height = SAMPLE_SIZE;
      const context = canvas.getContext("2d", { willReadFrequently: true });
      if (!context) return;
      try {
        context.drawImage(image, 0, 0, SAMPLE_SIZE, SAMPLE_SIZE);
        const { data } = context.getImageData(0, 0, SAMPLE_SIZE, SAMPLE_SIZE);
        luminance = new Float32Array(SAMPLE_SIZE ** 2);
        for (let i = 0; i < luminance.length; i++) {
          luminance[i] = (0.2126 * data[4 * i] + 0.7152 * data[4 * i + 1] + 0.0722 * data[4 * i + 2]) / 255;
        }
      } catch { luminance = undefined; reset(); } // Cross-origin covers retain the theme default.
      schedule();
    };

    if (image.complete) sample();
    image.addEventListener("load", sample);
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      image.removeEventListener("load", sample);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      cancelAnimationFrame(frame);
      reset();
    };
  }, [ref, pathname]);
}

export function LiquidGlassEnvironment() {
  const isHome = usePathname() === "/";
  return <>
    <div className="site-backdrop" aria-hidden="true">
      <img src={ambientBackdrop} alt="" fetchPriority={isHome ? "high" : "low"} decoding="async" />
    </div>
    <svg className="glass-filter-defs" aria-hidden="true" xmlns="http://www.w3.org/2000/svg">
      <defs id="glass-lens-definitions" />
    </svg>
  </>;
}
