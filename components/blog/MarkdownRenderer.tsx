'use client';
// components/blog/MarkdownRenderer.tsx

import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import remarkBreaks from 'remark-breaks';

import { visit } from 'unist-util-visit';
import type { 
  Root, 
  Text, 
  Link as MdastLink, 
  Image, 
  Parent 
} from 'mdast';

import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';

import { CodeBlock, SyntaxCodeBlock } from '@/components/blog/CodeBlock';
type CodeMeta = {
  language: string;
  title?: string;
  showLineNumbers?: boolean;
  variant?: 'basic' | 'syntax';
};

import './MarkdownRenderer.css';

interface MarkdownRendererProps {
  content: string;
  extractStrategy?: 'auto' | 'strip-frontmatter' | 'after-first-dash' | 'after-last-dash';
}

export type ExtractStrategy = 'auto' | 'strip-frontmatter' | 'after-first-dash' | 'after-last-dash';

/** 统一的 slug 规则：去首尾空格，空白->连字符。保持中文/括号/破折号等字符不变，确保 id 与 href 完全一致 */
const slugify = (s: string) => s.trim().replace(/\s+/g, '-').replace(/[^\u4e00-\u9fa5\w\-]/g, "");

/** 从 React children 提取纯文本（用于计算标题 id） */
const toText = (children: React.ReactNode): string =>
  React.Children.toArray(children)
    .map((child: any) => {
      if (typeof child === 'string' || typeof child === 'number') return String(child);
      if (React.isValidElement(child)) return toText(child.props?.children);
      return '';
    })
    .join('');

/** remark 插件：把 [[#标题]] 转成标准的内部锚点 [标题](#slug) */
function remarkWikiLink() {
  return (tree: Root) => {
    visit(tree, 'text', (node: Text, index, parent) => {
      if (!parent || typeof index !== 'number') return;
      const value = node.value;
      const regex = /\[\[#(.+?)\]\]/g;
      let m: RegExpExecArray | null;
      let last = 0;
      const out: any[] = [];

      while ((m = regex.exec(value))) {
        if (m.index > last) out.push({ type: 'text', value: value.slice(last, m.index) });
        const title = m[1];
        const href = `#${slugify(title)}`;
        const linkNode: MdastLink = {
          type: 'link',
          url: href,
          children: [{ type: 'text', value: title }],
        };
        out.push(linkNode);
        last = m.index + m[0].length;
      }
      if (out.length) {
        if (last < value.length) out.push({ type: 'text', value: value.slice(last) });
        parent.children.splice(index, 1, ...out);
        return index + out.length;
      }
    });
  };
}

/** ⭐ 把“单行的 $$...$$”改成行内公式（remark-math 之后执行） */
function remarkInlineSingleLineBlockMath() {
  return (tree: Root) => {
    visit(tree, 'math', (node: any, index, parent) => {
      if (!parent || typeof index !== 'number') return;
      const v: string = node.value || '';
      // 没有换行 → 认为是行内
      if (!v.includes('\n')) {
        parent.children[index] = { type: 'inlineMath', value: v };
      }
    });
  };
}

/** 自定义 <a>：内部锚点(#xxx) → 平滑滚动；外链 → 新开页 */
const Anchor: React.FC<React.AnchorHTMLAttributes<HTMLAnchorElement>> = ({
  href,
  onClick,
  className,
  ...props
}) => {
  const isHash = !!href && href.startsWith('#');
  const isExternal = !!href && /^(https?:)?\/\//.test(href);

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (isHash && href) {
      e.preventDefault();
      const idRaw = href.slice(1);
      const id = decodeURIComponent(idRaw);
      const esc = (window as any).CSS?.escape
        ? (window as any).CSS.escape
        : (s: string) => s;

      const target =
        document.getElementById(id) || document.querySelector(`#${esc(id)}`);

      if (target) {
        (target as HTMLElement).scrollIntoView({
          behavior: 'smooth',
          block: 'start',
          inline: 'nearest',
        });
        // 更新地址栏 hash
        history.replaceState(null, '', `#${encodeURIComponent(id)}`);
      }
    }
    onClick?.(e);
  };

  return (
    <a
      href={href}
      onClick={handleClick}
      className={`wikilink ${className || ''}`}
      {...(!isHash && isExternal ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
      {...props}
    />
  );
};

/** remark 插件: 把 ![[xxx.png]] 转成标准 image 节点 */
function remarkWikiImage() {
  return (tree: Root) => {
    visit(tree, 'text', (node, index, parent) => {
      if (!parent || typeof index !== 'number') return;

      const value = node.value;
      const regex = /!\[\[([^|\]]+\.(?:png|jpg|jpeg|gif|svg))\]\]/gi;
      let m: RegExpExecArray | null;
      let last = 0;
      const out: any[] = [];

      while ((m = regex.exec(value))) {
        if (m.index > last) out.push({ type: 'text', value: value.slice(last, m.index) });

        const filename = m[1].trim();
        const imgNode: Image = {
          type: 'image',
          url: `/imgs/assets/${filename}`, // 👈 拼接路径
          title: null,
          alt: filename,
        };
        out.push(imgNode);

        last = m.index + m[0].length;
      }

      if (out.length) {
        if (last < value.length) out.push({ type: 'text', value: value.slice(last) });
        parent.children.splice(index, 1, ...out);
        return index + out.length;
      }
    });
  };
}

/** 把 ==...== 转换为 HTML <mark class="hl">...<mark> */
export function remarkHighlight() {
  return (tree: Root) => {
    visit(tree, 'text', (node: Text, index, parent: Parent | undefined) => {
      if (!parent || typeof index !== 'number') return;
      const value = node.value;
      // 支持同一节点多处高亮；不跨段落；避免空匹配
      const regex = /==(.+?)==/g;

      let m: RegExpExecArray | null;
      let last = 0;
      const out: any[] = [];

      while ((m = regex.exec(value))) {
        if (m.index > last) {
          out.push({ type: 'text', value: value.slice(last, m.index) });
        }
        const inner = m[1];
        // 用 raw HTML（我们已启用 rehypeRaw）
        out.push({
          type: 'html',
          value: `<mark class="hl">${inner.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</mark>`,
        });
        last = m.index + m[0].length;
      }

      if (out.length) {
        if (last < value.length) out.push({ type: 'text', value: value.slice(last) });
        parent.children.splice(index, 1, ...out);
        return index + out.length;
      }
    });
  };
}

function parseInfo(className?: string, metastring?: string): CodeMeta {
  const language = /language-([\w+-]+)/.exec(className || '')?.[1] || 'text';
  const meta = metastring || '';

  const titleMatch = /(?:^|\s)title=(?:"([^"]+)"|'([^']+)'|([^\s]+))/i.exec(meta);
  const title = titleMatch?.[1] ?? titleMatch?.[2] ?? titleMatch?.[3];

  const showLineNumbers = /\b(ln|linenumbers|lineNumbers)\b/i.test(meta);

  // 选择款式：支持几种写法
  // 1) variant=syntax | variant=basic
  // 2) 直接写关键字：syntax / pretty / fancy → 视为 SyntaxCodeBlock
  // 3) 否则默认 basic
  let variant: 'basic' | 'syntax' = 'basic';
  if (/\bvariant\s*=\s*(syntax|basic)\b/i.test(meta)) {
    variant = /variant\s*=\s*(syntax|basic)/i.exec(meta)![1].toLowerCase() as 'basic' | 'syntax';
  } else if (/\b(syntax|pretty|fancy)\b/i.test(meta)) {
    variant = 'syntax';
  }

  return { language, title, showLineNumbers, variant };
}

/** 行内代码：只能返回 <code> */
const InlineCode: React.FC<React.ComponentPropsWithoutRef<'code'>> = ({ children, ...props }) => {
  return (
    <code className="inline-code" {...props}>
      {children}
    </code>
  );
};

/** 块级代码：覆盖 <pre>，取出内部 <code> 的 className / metastring / 文本，交给两个 CodeBlock 之一 */
const BlockCode: React.FC<React.ComponentPropsWithoutRef<'pre'>> = ({ children, ...props }) => {
  const child = React.Children.toArray(children)[0] as React.ReactElement<any> | undefined;

  const className: string | undefined = child?.props?.className;
  const metastring: string | undefined = child?.props?.metastring; // react-markdown 传进来的 meta
  const raw = child?.props?.children ?? '';
  const code = String(Array.isArray(raw) ? raw.join('') : raw);

  const { language, title, showLineNumbers, variant } = parseInfo(className, metastring);

  return (
    <div className="not-prose w-full max-w-full min-w-0 overflow-x-auto" {...props}>
      {variant === 'syntax' ? (
        <SyntaxCodeBlock language={language} title={title} showLineNumbers={true}>
          {code}
        </SyntaxCodeBlock>
      ) : (
        <CodeBlock language={language} title={title} showLineNumbers={true}>
          {code}
        </CodeBlock>
      )}
    </div>
  );
};

/** 提取主要内容：移除 frontmatter 或指定分隔线前的内容 */
export function extractContent(raw: string, strategy: ExtractStrategy = 'auto'): string {
  if (!raw) return raw;

  // 1) 优先检测显式注释标记 <!-- content-start --> ... <!-- content-end -->
  const marker = raw.match(/<!--\s*content-start\s*-->([\s\S]*?)<!--\s*content-end\s*-->/i);
  if (marker) return marker[1].trim();

  // 2) 如果选择 strip-frontmatter 或 auto，尝试移除开头的 YAML frontmatter（以 --- 包裹）
  if (strategy === 'strip-frontmatter' || strategy === 'auto') {
    // 只匹配位于文档开头的 frontmatter
    const fmRegex = /^---\s*[\r\n]+([\s\S]*?)[\r\n]+---\s*[\r\n]*/;
    const fmMatch = raw.match(fmRegex);
    if (fmMatch) {
      // fmMatch[0] 是整个 frontmatter 区块（包括首尾 --- 行）
      return raw.slice(fmMatch[0].length).trim();
    }
  }

  // 3) after-first-dash：找到第一行单独的 ---，返回其后的内容
  if (strategy === 'after-first-dash' || strategy === 'auto') {
    const lineDashRe = /^---\s*$/m;
    const first = lineDashRe.exec(raw);
    if (first) {
      // 找到该行的结束位置（下一个换行符），从下一行开始截取
      const idx = first.index;
      const newlinePos = raw.indexOf('\n', idx + first[0].length);
      const start = newlinePos === -1 ? idx + first[0].length : newlinePos + 1;
      return raw.slice(start).trim();
    }
  }

  // 4) after-last-dash：用 split 找到最后一个 --- 后面的部分
  if (strategy === 'after-last-dash') {
    const parts = raw.split(/^[ \t]*---[ \t]*$/m);
    if (parts.length > 1) {
      return parts[parts.length - 1].trim();
    }
    return raw;
  }

  // 5) fallback：没有命中任何规则就返回原文
  return raw;
}

export const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ 
  content, 
  extractStrategy = 'auto'
}) => {
  const mainContent = extractContent(content, extractStrategy);

  return (
    <div className="markdown-rendered">
      <ReactMarkdown
        children={mainContent}
        remarkPlugins={[
          remarkGfm,                    // 支持表格、任务列表等 GitHub 风格扩展
          remarkBreaks, 
          remarkWikiLink,
          remarkMath,                   // 解析 $ 和 $$
          remarkInlineSingleLineBlockMath, // ⭐单行 $$ 转行内
          remarkWikiImage,    
          remarkHighlight,              // 支持 ==高亮==
        ]}
        rehypePlugins={[
          rehypeRaw,
          rehypeKatex
        ]}
        components={{
          a: ({ node, ...props }) => <Anchor {...(props as any)} />,
          u: ({ node, ...props }) => <u {...props} style={{ textDecoration: 'underline' }} />,
          h2: ({ node, ...props }) => {
            const text = toText(props.children);
            const id = slugify(text);
            return <h2 id={id}>♪² {props.children}</h2>;
          },
          h3: ({ node, ...props }) => {
            const text = toText(props.children);
            const id = slugify(text);
            return <h3 id={id}>♪³ {props.children}</h3>;
          },
          h4: ({ node, ...props }) => {
            const text = toText(props.children);
            const id = slugify(text);
            return <h4 id={id}>♪⁴ {props.children}</h4>;
          },
          h5: ({ node, ...props }) => {
            const text = toText(props.children);
            const id = slugify(text);
            return <h5 id={id}>♪⁵ {props.children}</h5>;
          },
          h6: ({ node, ...props }) => {
            const text = toText(props.children);
            const id = slugify(text);
            return <h6 id={id}>♪⁶ {props.children}</h6>;
          },
          img: ({ node, ...props }) => (
            <img {...props} className="markdown-img" alt={props.alt || ''} />
          ),
          pre: BlockCode,   // ✅ 块级代码渲染：交给你的 CodeBlock
          code: InlineCode, // ✅ 行内代码渲染：保持 <code>
        }}
      />
    </div>
  );
};
