export type GlassShape = "dock" | "card";

const SVG_NS = "http://www.w3.org/2000/svg";
const MAP_RESOLUTION = 320;
const MAX_CACHED_LENSES = 24;

function appendSvg(parent: SVGElement, name: string, attributes: Record<string, string | number>) {
  const node = document.createElementNS(SVG_NS, name);
  for (const [key, value] of Object.entries(attributes)) node.setAttribute(key, String(value));
  parent.append(node);
  return node;
}

// Sample inward along the rounded rectangle's normal. The center magnifies
// slightly and the curved rim does most of the bending.
function makeRimMap(width: number, height: number, radius: number, shape: GlassShape) {
  const halfWidth = width / 2;
  const halfHeight = height / 2;
  const corner = Math.min(radius, halfWidth, halfHeight);
  const rim = Math.min(shape === "dock" ? 24 : 32, halfWidth, halfHeight);
  const strength = rim * (shape === "dock" ? 1.02 : 0.92);
  const magnification = 0.024;
  const scale = 2 * (strength + Math.max(halfWidth, halfHeight) * magnification);
  const ratio = Math.min(1, MAP_RESOLUTION / Math.max(width, height));
  const canvas = document.createElement("canvas");
  canvas.width = Math.max(1, Math.round(width * ratio));
  canvas.height = Math.max(1, Math.round(height * ratio));
  const ctx = canvas.getContext("2d");
  if (!ctx) return null;
  const image = ctx.createImageData(canvas.width, canvas.height);

  for (let y = 0; y < canvas.height; y++) {
    const dy = ((y + 0.5) / canvas.height) * height - halfHeight;
    const qy = Math.abs(dy) - halfHeight + corner;
    for (let x = 0; x < canvas.width; x++) {
      const dx = ((x + 0.5) / canvas.width) * width - halfWidth;
      const qx = Math.abs(dx) - halfWidth + corner;
      const cx = Math.max(qx, 0);
      const cy = Math.max(qy, 0);
      const length = Math.hypot(cx, cy);
      const distance = corner - length - Math.min(Math.max(qx, qy), 0);
      const bend = strength * Math.pow(1 - Math.min(rim, Math.max(0, distance)) / rim, 2.6);
      const nx = length ? cx / length : Number(qx > qy);
      const ny = length ? cy / length : Number(qy >= qx);
      const offset = (y * canvas.width + x) * 4;
      image.data[offset] = 255 * (0.5 - (nx * Math.sign(dx) * bend + dx * magnification) / scale);
      image.data[offset + 1] = 255 * (0.5 - (ny * Math.sign(dy) * bend + dy * magnification) / scale);
      image.data[offset + 2] = 128;
      image.data[offset + 3] = 255;
    }
  }
  ctx.putImageData(image, 0, 0);
  return { href: canvas.toDataURL("image/png"), scale };
}

let nextId = 0;

function createLens(defs: SVGElement, width: number, height: number, radius: number, shape: GlassShape) {
  const map = makeRimMap(width, height, radius, shape);
  if (!map) return null;
  const filter = appendSvg(defs, "filter", {
    id: `glass-rim-${++nextId}`,
    x: "0%", y: "0%", width: "100%", height: "100%",
    "color-interpolation-filters": "sRGB",
  });
  appendSvg(filter, "feImage", {
    href: map.href, x: 0, y: 0, width: "100%", height: "100%",
    preserveAspectRatio: "none", result: "rim-map",
  });

  const channels = [
    ["red", 1.15, "1 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 1 0"],
    ["green", 1, "0 0 0 0 0  0 1 0 0 0  0 0 0 0 0  0 0 0 1 0"],
    ["blue", 0.85, "0 0 0 0 0  0 0 0 0 0  0 0 1 0 0  0 0 0 1 0"],
  ] as const;
  for (const [channel, dispersion, values] of channels) {
    appendSvg(filter, "feDisplacementMap", {
      in: "SourceGraphic", in2: "rim-map", scale: (map.scale * dispersion).toFixed(2),
      xChannelSelector: "R", yChannelSelector: "G", result: `${channel}-bend`,
    });
    appendSvg(filter, "feColorMatrix", { in: `${channel}-bend`, type: "matrix", values, result: channel });
  }
  appendSvg(filter, "feBlend", { in: "red", in2: "green", mode: "screen", result: "rg" });
  appendSvg(filter, "feBlend", { in: "rg", in2: "blue", mode: "screen" });
  return filter;
}

function createController(defs: SVGElement) {
  const shapes = new Map<HTMLElement, { shape: GlassShape; key?: string }>();
  const lenses = new Map<string, SVGElement>();
  const visible = new Set<HTMLElement>();
  const queue = new Set<HTMLElement>();
  const desktop = matchMedia("(min-width: 641px) and (hover: hover) and (pointer: fine)");
  const transparency = matchMedia("(prefers-reduced-transparency: reduce)");
  let frame = 0;

  const clear = (element: HTMLElement) => {
    const entry = shapes.get(element);
    if (entry) entry.key = undefined;
    element.style.removeProperty("--glass-lens");
  };

  function schedule() {
    if (frame || !queue.size || !desktop.matches || transparency.matches) return;
    frame = requestAnimationFrame(() => {
      frame = 0;
      const started = performance.now();
      for (const element of queue) {
        queue.delete(element);
        if (visible.has(element)) sync(element);
        if (performance.now() - started >= 5) break;
      }
      schedule();
    });
  }

  function sync(element: HTMLElement) {
    const entry = shapes.get(element);
    if (!entry || !element.offsetWidth || !element.offsetHeight) return;
    const width = Math.round(element.offsetWidth / 4) * 4;
    const height = Math.round(element.offsetHeight / 4) * 4;
    const radius = parseFloat(getComputedStyle(element).borderTopLeftRadius) || 0;
    const key = `${entry.shape}:${width}:${height}:${radius}`;
    if (entry.key === key) return;
    const lens = lenses.get(key) ?? createLens(defs, width, height, radius, entry.shape);
    if (!lens) return;
    lenses.delete(key);
    lenses.set(key, lens);
    entry.key = key;
    element.style.setProperty("--glass-lens", `url(#${lens.id})`);

    if (lenses.size > MAX_CACHED_LENSES) {
      const active = new Set([...shapes.values()].map(({ key }) => key));
      for (const [cachedKey, node] of lenses) {
        if (active.has(cachedKey)) continue;
        node.remove();
        lenses.delete(cachedKey);
        if (lenses.size <= MAX_CACHED_LENSES) break;
      }
    }
  }

  const resize = new ResizeObserver((entries) => {
    entries.forEach(({ target }) => queue.add(target as HTMLElement));
    schedule();
  });
  const intersection = new IntersectionObserver((entries) => {
    for (const { target, isIntersecting } of entries) {
      const element = target as HTMLElement;
      if (!shapes.has(element)) continue;
      if (isIntersecting) {
        visible.add(element);
        resize.observe(element, { box: "border-box" });
        queue.add(element);
      } else {
        visible.delete(element);
        resize.unobserve(element);
        queue.delete(element);
        clear(element);
      }
    }
    schedule();
  }, { rootMargin: "48px 0px" });

  const updateSupport = () => {
    cancelAnimationFrame(frame);
    frame = 0;
    queue.clear();
    visible.forEach((element) => {
      if (desktop.matches && !transparency.matches) queue.add(element);
      else clear(element);
    });
    schedule();
  };
  desktop.addEventListener("change", updateSupport);
  transparency.addEventListener("change", updateSupport);

  return {
    observe(element: HTMLElement, shape: GlassShape) {
      shapes.set(element, { shape });
      intersection.observe(element);
      return () => {
        intersection.unobserve(element);
        resize.unobserve(element);
        visible.delete(element);
        queue.delete(element);
        clear(element);
        shapes.delete(element);
      };
    },
  };
}

let controller: ReturnType<typeof createController> | undefined;

export function observeGlass(element: HTMLElement, shape: GlassShape) {
  // Some engines accept the URL syntax but don't paint SVG backdrop filters.
  if (!/Chrom(?:e|ium)\//.test(navigator.userAgent) ||
      !CSS.supports("backdrop-filter", "url(#glass-rim)")) return;
  const defs = document.querySelector<SVGElement>("#glass-lens-definitions");
  if (!defs) return;
  controller ??= createController(defs);
  return controller.observe(element, shape);
}
