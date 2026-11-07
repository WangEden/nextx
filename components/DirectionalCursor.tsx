"use client";

import { useEffect, useRef } from "react";

const TARGET = "data-directional-cursor-target";
const NATIVE_TARGETS = "input, textarea, select, iframe, [contenteditable]:not([contenteditable='false']), :disabled, [aria-disabled='true'], dialog[open], [popover]";
const DEFAULT_ANGLE = -135;
const STEERING_DISTANCE = 8;
const REVERSAL_DISTANCE = 14;
const ANGLE_DEADBAND = 6;
const TURN_RESPONSE_MS = 26;

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
    let targetAngle = DEFAULT_ANGLE;
    let displayedAngle = DEFAULT_ANGLE;
    let lastTurnFrame: number | undefined;
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
      lastTurnFrame = undefined;
      lastTarget = null;
      cursor.hidden = true;
      clearTarget();
    };

    const steer = (x: number, y: number) => {
      if (!origin) origin = { x, y };
      const dx = x - origin.x;
      const dy = y - origin.y;
      const distanceSquared = dx * dx + dy * dy;
      if (distanceSquared < STEERING_DISTANCE ** 2) return;

      const heading = Math.atan2(dy, dx) * 180 / Math.PI;
      // Unwrap against the last accepted heading, so a reversal keeps its chosen arc.
      const turn = (((heading - targetAngle) % 360 + 540) % 360) - 180;
      if (Math.abs(turn) > 100 && distanceSquared < REVERSAL_DISTANCE ** 2) return;
      origin = { x, y };
      if (Math.abs(turn) >= ANGLE_DEADBAND) targetAngle += turn;
    };

    const paint = (now: number) => {
      frame = 0;
      const event = pending;
      pending = undefined;
      if (event) {
        const target = event.target;
        if (!(target instanceof Element) || !target.isConnected) { hide(); return; }

        const x = event.clientX;
        const y = event.clientY;
        steer(x, y);

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

        if (!paintedTarget) {
          cursor.hidden = true;
          lastTurnFrame = undefined;
          return;
        }
        if (cursor.hidden) displayedAngle = targetAngle;
        cursor.hidden = false;
        cursor.style.transform = `translate3d(${x}px, ${y}px, 0)`;
      }

      if (!paintedTarget?.isConnected) { hide(); return; }
      // Only the angle eases; the hotspot is always the most recent pointer position.
      const elapsed = lastTurnFrame === undefined ? 16.67 : Math.min(now - lastTurnFrame, 32);
      const remaining = targetAngle - displayedAngle;
      const settled = Math.abs(remaining) < 0.45;
      displayedAngle = settled ? targetAngle : displayedAngle + remaining * (1 - Math.exp(-elapsed / TURN_RESPONSE_MS));
      arrow.style.transform = `rotate(${displayedAngle.toFixed(2)}deg)`;
      lastTurnFrame = settled ? undefined : now;
      if (!settled) frame = requestAnimationFrame(paint);
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
