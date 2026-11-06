import media from "./site-images.generated.json";

const images: Record<string, { src: string; width: number }[]> = media.images;

export const ambientBackdrop = media.backdrop;
export const archiveScene = "/imgs/default/pexels-stywo-1668246.jpg";
export const edenAvatar = "/imgs/elaina2.jpg";

export function siteImage(source: string, sizes: string) {
  const variants = images[source];
  if (!variants?.length) return { src: source };

  return {
    src: variants[Math.min(1, variants.length - 1)].src,
    srcSet: variants.map(({ src, width }) => `${src} ${width}w`).join(", "),
    sizes,
  };
}
