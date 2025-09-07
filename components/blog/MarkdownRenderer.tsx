'use client';

import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import remarkBreaks from 'remark-breaks';
import './MarkdownRenderer.css';

interface MarkdownRendererProps {
  content: string;
  extractStrategy?: 'auto' | 'strip-frontmatter' | 'after-first-dash' | 'after-last-dash';
}

export type ExtractStrategy = 'auto' | 'strip-frontmatter' | 'after-first-dash' | 'after-last-dash';

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
        remarkPlugins={[remarkGfm, remarkBreaks]}
        rehypePlugins={[rehypeRaw]}
        components={{
          a: ({ node, ...props }) => <a {...props} target="_blank" rel="noopener noreferrer" />,
          u: ({ node, ...props }) => <u {...props} style={{ textDecoration: "underline" }} />,
          h2: ({node, ...props}) => <h2 {...props}>♪² {props.children}</h2>,
          h3: ({node, ...props}) => <h3 {...props}>♪³ {props.children}</h3>,
          h4: ({node, ...props}) => <h4 {...props}>♪⁴ {props.children}</h4>,
          h5: ({node, ...props}) => <h5 {...props}>♪⁵ {props.children}</h5>,
          h6: ({node, ...props}) => <h6 {...props}>♪⁶ {props.children}</h6>,
        }}
      />
    </div>
  );
};
