import { createHash } from "node:crypto";
import { mkdir, readdir, readFile, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const root = new URL("../", import.meta.url);
const publicDir = new URL("public/", root);
const output = new URL("imgs/web/", publicDir);
const archive = "/imgs/default/pexels-stywo-1668246.jpg";
const images = {};
const local = (url) => new URL(encodeURI(url.slice(1)), publicDir);

async function variants(source, widths, quality, { square = false, name } = {}) {
  const bytes = await readFile(local(source));
  const metadata = await sharp(bytes).metadata();
  const maxWidth = metadata.autoOrient?.width ?? metadata.width;
  const key = createHash("sha1").update(source).digest("hex").slice(0, 9);
  const sizes = [...new Set(widths.map((width) => Math.min(width, maxWidth)))];

  return Promise.all(sizes.map(async (width) => {
    const filename = `${name ?? key}-${width}.webp`;
    await sharp(bytes).rotate()
      .resize({ width, ...(square ? { height: width, fit: "cover" } : {}) })
      .webp({ quality, effort: 5 })
      .toFile(fileURLToPath(new URL(filename, output)));
    return { src: `/imgs/web/${filename}`, width };
  }));
}

await mkdir(output, { recursive: true });
images[archive] = await variants(archive, [768, 1280, 1920, 2560], 75, { name: "archive" });
for (const [source, name] of [["/imgs/elaina2.jpg", "eden"], ["/imgs/avatar/flower.jpg", "flower"]]) {
  images[source] = await variants(source, [80, 128], 76, { name, square: true });
}
for (const folder of ["articleCover", "default"]) {
  const files = (await readdir(new URL(`imgs/${folder}/`, publicDir))).sort();
  for (const file of files) {
    const source = `/imgs/${folder}/${file}`;
    if (!/\.(png|jpe?g|webp)$/i.test(file) || images[source]) continue;
    images[source] = await variants(source, [400, 800, 1440], 73);
  }
}
const [backdrop] = await variants(archive, [960], 54, { name: "ambient" });
await writeFile(new URL("lib/site-images.generated.json", root), JSON.stringify({ backdrop: backdrop.src, images }, null, 2) + "\n");
console.log(`Prepared ${Object.keys(images).length} responsive images and the ambient backdrop.`);
