"use client";

import type { PointerEvent } from "react";

export function moveGlassHighlight(event: PointerEvent<HTMLElement>) {
  if (event.pointerType === "touch") return;
  const bounds = event.currentTarget.getBoundingClientRect();
  event.currentTarget.style.setProperty("--glass-x", `${event.clientX - bounds.left}px`);
  event.currentTarget.style.setProperty("--glass-y", `${event.clientY - bounds.top}px`);
}

export function LiquidGlassEnvironment() {
  return <>
    <div className="site-backdrop" aria-hidden="true" />
    <svg className="glass-filter-defs" aria-hidden="true" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <filter id="liquid-refraction" x="0%" y="0%" width="100%" height="100%" colorInterpolationFilters="sRGB">
          <feTurbulence type="fractalNoise" baseFrequency="0.012 0.018" numOctaves="2" seed="7" result="noise" />
          <feGaussianBlur in="noise" stdDeviation="3" result="smoothNoise" />
          <feDisplacementMap in="SourceGraphic" in2="smoothNoise" scale="9" xChannelSelector="R" yChannelSelector="G" />
        </filter>
      </defs>
    </svg>
  </>;
}
