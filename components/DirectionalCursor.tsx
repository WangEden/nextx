"use client";

import { useEffect, useRef } from "react";

const TARGET = "data-directional-cursor-target";
const NATIVE_TARGETS = "input, textarea, select, iframe, [contenteditable]:not([contenteditable='false']), :disabled, [aria-disabled='true'], dialog[open], [popover]";
const DEFAULT_ANGLE = -135;

export function DirectionalCursor() {
  const cursorRef = useRef<HTMLSpanElement>(null);
  const arrowRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    const cursor = cursorRef.current;
    const arrow = arrowRef.current;
    if (!cursor || !arrow) return;

    const mouse = matchMedia("(any-hover: hover) and (any-pointer: fine)");
    const reduced = matchMedia("(prefers-reduced-motion: reduce)");
    const highContrast = matchMedia("(forced-colors: active)");
    const settings = [mouse, reduced, highContrast];
    let lastTarget: Element | null = null;
    let paintedTarget: Element | null = null;
    let origin: { x: number; y: number } | undefined;
    let angle = DEFAULT_ANGLE;
    let pending: PointerEvent | undefined;
    let frame = 0;

    const clearTarget = () => {
      paintedTarget?.removeAttribute(TARGET);
      paintedTarget = null;
    };

    const hide = () => {
      cancelAnimationFrame(frame);
      frame = 0;
      pending = undefined;
      origin = undefined;
      lastTarget = null;
      cursor.hidden = true;
      clearTarget();
    };

    const paint = () => {
      frame = 0;
      const event = pending;
      pending = undefined;
      const target = event?.target;
      if (!event || !(target instanceof Element) || !target.isConnected) { hide(); return; }

      const x = event.clientX;
      const y = event.clientY;
      if (!origin) origin = { x, y };
      const dx = x - origin.x;
      const dy = y - origin.y;
      if (dx * dx + dy * dy >= 4) {
        const heading = Math.atan2(dy, dx) * 180 / Math.PI;
        // Turn through the shorter arc, including when crossing -180/180.
        angle += (((heading - angle) % 360 + 540) % 360) - 180;
        origin = { x, y };
      }

      if (target !== lastTarget) {
        clearTarget();
        lastTarget = target;
        if (!target.closest(NATIVE_TARGETS)) {
          const keyword = getComputedStyle(target).cursor.split(",").pop()?.trim();
          if (keyword === "auto" || keyword === "default" || keyword === "pointer") {
            paintedTarget = target;
            target.setAttribute(TARGET, "");
            cursor.toggleAttribute("data-interactive", keyword === "pointer");
          }
        }
      }

      cursor.hidden = !paintedTarget;
      if (!paintedTarget) return;
      cursor.style.transform = `translate3d(${x}px, ${y}px, 0)`;
      arrow.style.transform = `rotate(${angle}deg)`;
    };

    const track = (event: PointerEvent) => {
      if (event.pointerType !== "mouse" || !mouse.matches || reduced.matches || highContrast.matches) {
        if (!cursor.hidden || frame) hide();
        return;
      }
      pending = event;
      if (!frame) frame = requestAnimationFrame(paint);
    };
    const leave = (event: PointerEvent) => { if (!event.relatedTarget) hide(); };

    window.addEventListener("pointermove", track, { capture: true, passive: true });
    window.addEventListener("pointerover", track, { capture: true, passive: true });
    window.addEventListener("pointerout", leave, { capture: true, passive: true });
    window.addEventListener("pointercancel", hide);
    window.addEventListener("blur", hide);
    document.addEventListener("visibilitychange", hide);
    settings.forEach((query) => query.addEventListener("change", hide));
    return () => {
      window.removeEventListener("pointermove", track, true);
      window.removeEventListener("pointerover", track, true);
      window.removeEventListener("pointerout", leave, true);
      window.removeEventListener("pointercancel", hide);
      window.removeEventListener("blur", hide);
      document.removeEventListener("visibilitychange", hide);
      settings.forEach((query) => query.removeEventListener("change", hide));
      hide();
    };
  }, []);

  return <span ref={cursorRef} className="directional-cursor" aria-hidden="true" hidden>
    <svg ref={arrowRef} width="24" height="24" viewBox="0 0 24 24">
      <path d="M4.1 5.6C3.2 3.5 5.1 1.8 7.1 2.7l13.5 6.2c1.9.9 1.9 3.4 0 4.3L7.1 19.4c-2 .9-3.9-.8-3-2.9l1.8-4.3a3 3 0 0 0 0-2.3Z" strokeWidth="1.7" strokeLinejoin="round" />
    </svg>
  </span>;
}
