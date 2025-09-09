import fs from "fs";
import path from "path";
import matter from "gray-matter";

export type PostMeta = {
  slug: string;
  title: string;
  excerpt: string;
  author: string;
  date: string;
  tags: string[];
  category: string;
  cover: string;
  views: number;
  featured?: boolean;
  readTime?: string;
};
export type Post = PostMeta & { content: string };

const CONTENT_DIR = path.join(process.cwd(), "content", "posts");

// 允许的图片后缀
const ALLOWED_EXTS = [".jpg", ".jpeg", ".png", ".webp", ".gif"];
// 默认封面所在 URL 目录（对应文件系统的 public 子目录）
const DEFAULT_COVER_DIR_URL = "/imgs/articleCover/default";
const DEFAULT_COVER_DIR_FS = path.join(process.cwd(), "public", "imgs", "articleCover", "default");

// 仅把连续空白换成 -，保留中文
function slugify(s: string) {
  return s.trim().replace(/\s+/g, "-");
}

// 粗暴 hash（稳定“随机”）
function hashStr(s: string) {
  let h = 0;
  for (let i = 0; i < s.length; i++) {
    h = (h * 31 + s.charCodeAt(i)) | 0;
  }
  return Math.abs(h);
}

// 把以 / 开头的 URL 路径转换为 public 下的真实文件路径
function urlToFsPath(urlPath: string) {
  const clean = urlPath.replace(/^\/+/, ""); // 去掉开头的 /
  return path.join(process.cwd(), "public", clean);
}

// 检查一个 URL 路径是否存在（支持无扩展名时尝试多后缀）
function resolveExistingUrl(urlPath: string): string | null {
  if (!urlPath.startsWith("/")) {
    // 统一要求以 / 开头
    urlPath = "/" + urlPath;
  }

  const ext = path.extname(urlPath);
  if (ext) {
    const full = urlToFsPath(urlPath);
    return fs.existsSync(full) ? urlPath : null;
  }

  // 无扩展名：依次尝试
  for (const e of ALLOWED_EXTS) {
    const candidateUrl = urlPath + e;
    const full = urlToFsPath(candidateUrl);
    if (fs.existsSync(full)) return candidateUrl;
  }
  return null;
}

// 读取默认封面列表（只读一次，模块级缓存）
let DEFAULT_COVERS_CACHE: string[] | null = null;
function getDefaultCovers(): string[] {
  if (DEFAULT_COVERS_CACHE) return DEFAULT_COVERS_CACHE;
  if (!fs.existsSync(DEFAULT_COVER_DIR_FS)) {
    DEFAULT_COVERS_CACHE = [];
    return DEFAULT_COVERS_CACHE;
  }
  const files = fs
    .readdirSync(DEFAULT_COVER_DIR_FS)
    .filter((f) => ALLOWED_EXTS.includes(path.extname(f).toLowerCase()))
    .map((f) => `${DEFAULT_COVER_DIR_URL}/${f}`);
  DEFAULT_COVERS_CACHE = files;
  return files;
}

// 根据 front-matter 的 cover 和 slug，给出最终可用的 cover URL
function resolveCover(coverFromFm: string | undefined, slug: string): string {
  // 1) front-matter 给了 cover：先尝试它（兼容无扩展名）
  if (coverFromFm && coverFromFm.trim()) {
    const ok = resolveExistingUrl(coverFromFm.trim());
    if (ok) return ok;
  }

  // 2) 没给或不存在：从默认目录挑一张（按 slug 稳定选择）
  const defaults = getDefaultCovers();
  if (defaults.length > 0) {
    const idx = hashStr(slug) % defaults.length;
    return defaults[idx];
  }

  // 3) 兜底：给一个通用占位（请在 public 放一张）
  return "/imgs/articleCover/placeholder.jpg";
}

/**
 * 宽松解析 frontmatter（允许不在首行）
 */
function parseWithLooseFrontmatter(raw: string) {
  const fmRegex = /^[ \t]*---[ \t]*\r?\n([\s\S]*?)\r?\n[ \t]*---[ \t]*\r?\n?/m;
  const m = raw.match(fmRegex);
  if (m) {
    const yamlBlock = m[1];
    const body = raw.slice(m.index! + m[0].length);
    const reconstructed = `---\n${yamlBlock}\n---\n${body}`;
    return matter(reconstructed);
  }
  return matter(raw);
}

export function getAllPosts(): PostMeta[] {
  const files = fs.readdirSync(CONTENT_DIR).filter((f) => f.endsWith(".md"));

  const posts = files.map((file) => {
    const full = path.join(CONTENT_DIR, file);
    const raw = fs.readFileSync(full, "utf-8");
    const parsed = parseWithLooseFrontmatter(raw);

    const base = path.basename(file, ".md");
    const resolvedSlug =
      (parsed.data?.slug as string | undefined)?.toString().trim() ||
      slugify(base);

    const meta: PostMeta = {
      slug: resolvedSlug,
      title: (parsed.data?.title as string) ?? base,
      excerpt: (parsed.data?.excerpt as string) ?? "",
      author: (parsed.data?.author as string) ?? "Anonymous",
      date: (parsed.data?.date as string) ?? "",
      tags: (parsed.data?.tags as string[]) ?? [],
      category: (parsed.data?.category as string) ?? "General",
      // 🔽 关键：统一通过 resolveCover 产出可用封面
      cover: resolveCover(parsed.data?.cover as string | undefined, resolvedSlug),
      views: Number(parsed.data?.views ?? 0),
      featured: Boolean(parsed.data?.featured),
      readTime: (parsed.data?.readTime as string) ?? "",
    };

    return meta;
  });

  return posts.sort((a, b) => (a.date < b.date ? 1 : -1));
}

export function getPostBySlug(slug: string): Post | null {
  const files = fs.readdirSync(CONTENT_DIR).filter((f) => f.endsWith(".md"));

  for (const file of files) {
    const full = path.join(CONTENT_DIR, file);
    const raw = fs.readFileSync(full, "utf-8");
    const parsed = parseWithLooseFrontmatter(raw);

    const base = path.basename(file, ".md");
    const resolvedSlug =
      (parsed.data?.slug as string | undefined)?.toString().trim() ||
      slugify(base);

    if (resolvedSlug === slug) {
      const meta: PostMeta = {
        slug: resolvedSlug,
        title: (parsed.data?.title as string) ?? base,
        excerpt: (parsed.data?.excerpt as string) ?? "",
        author: (parsed.data?.author as string) ?? "Anonymous",
        date: (parsed.data?.date as string) ?? "",
        tags: (parsed.data?.tags as string[]) ?? [],
        category: (parsed.data?.category as string) ?? "General",
        // 🔽 同样用 resolveCover，保证详情页与列表一致
        cover: resolveCover(parsed.data?.cover as string | undefined, resolvedSlug),
        views: Number(parsed.data?.views ?? 0),
        featured: Boolean(parsed.data?.featured),
        readTime: (parsed.data?.readTime as string) ?? "",
      };

      return { ...meta, content: parsed.content.trim() };
    }
  }
  return null;
}

// lib/seeded.ts

// 简单可复现的 PRNG
function mulberry32(a: number) {
  return function () {
    a |= 0; a = a + 0x6D2B79F5 | 0;
    let t = Math.imul(a ^ a >>> 15, 1 | a);
    t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  };
}

export function hashString(s: string) {
  let h = 0;
  for (let i = 0; i < s.length; i++) {
    h = (h * 31 + s.charCodeAt(i)) | 0;
  }
  return Math.abs(h);
}

export function seededShuffle<T>(arr: T[], seed: number) {
  const copy = [...arr];
  const rnd = mulberry32(seed);
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(rnd() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}
