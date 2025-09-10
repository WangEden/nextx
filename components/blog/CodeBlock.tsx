import { useState } from 'react';
import { Copy, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { copyToClipboard as copyUtil } from '@/lib/copyToClipboard';

interface CodeBlockProps {
  children: string;
  language?: string;
  title?: string;
  showLineNumbers?: boolean;
  onCopyError?: (message: string) => void;
}

export function CodeBlock({ 
  children, 
  language = 'javascript', 
  title,
  showLineNumbers = true,
  onCopyError
}: CodeBlockProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    const success = await copyUtil(children);
    
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } else {
      if (onCopyError) {
        onCopyError('Copy failed. Please select and copy the text manually.');
      } else {
        // Fallback alert if no error handler provided
        alert('Copy failed. Please select and copy the text manually.');
      }
    }
  };

  const lines = children.split('\n');

  return (
    <div className="relative group not-prose min-w-0 max-w-full overflow-x-auto">
      {/* Header with title and language indicator */}
      {title && (
        <div className="flex items-center justify-between px-4 py-2 bg-muted/50 border border-border rounded-t-lg border-b-0">
          <span className="text-sm font-medium text-foreground">{title}</span>
          {language && (
            <span className="text-xs px-2 py-1 bg-accent text-accent-foreground rounded">
              {language}
            </span>
          )}
        </div>
      )}
      
      {/* Code container */}
      <div className="relative bg-card border border-border rounded-lg shadow-sm overflow-hidden max-w-full overflow-x-auto">
        {!title && (
          <>
            {/* Language indicator for blocks without titles */}
            {language && (
              <div className="absolute top-3 left-4 z-10">
                <span className="text-xs px-2 py-1 bg-muted text-muted-foreground rounded border">
                  {language}
                </span>
              </div>
            )}
          </>
        )}

        {/* Copy button */}
        <Button
          onClick={handleCopy}
          variant="ghost"
          size="sm"
          className={
            `absolute top-3 right-3 z-10 transition-all duration-200 h-8 \
            w-18 p-0 bg-muted/80 hover:bg-muted border border-border/50`}
        >
          {copied ? (
            <Check className="h-3.5 w-3.5 text-green-600" />
          ) : (
            <Copy className="h-3.5 w-3.5 text-muted-foreground" />
          )}
          <span>{copied ? '已复制' : '复制'}</span>
        </Button>

        {/* Code content */}
        <pre className={`break-words block w-full max-w-full overflow-x-auto whitespace-pre p-4 text-sm leading-relaxed ${title ? 'rounded-b-lg' : 'rounded-lg'} ${!title && language ? 'pt-12' : ''}`}>
          <code className="text-foreground font-mono inline-block w-fit">
            {showLineNumbers ? (
              <div className="grid grid-cols-[auto,1fr] gap-x-4 min-w-fit">
                {lines.map((line, index) => (
                  <div key={index} className="table-row">
                    <span className="table-cell select-none text-muted-foreground pr-4 text-right w-8 border-r border-border/30">
                      {index + 1}
                    </span>
                    <span className="table-cell pl-4">
                      <span className="syntax-highlighted">{line || ' '}</span>
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <span className="syntax-highlighted">{children}</span>
            )}
          </code>
        </pre>
      </div>
    </div>
  );
}

// Syntax highlighted code block with better colors
interface SyntaxCodeBlockProps extends CodeBlockProps {
  className?: string;
}

export function SyntaxCodeBlock({ 
  children, 
  language = 'javascript',
  title,
  showLineNumbers = false,
  className = '',
  onCopyError
}: SyntaxCodeBlockProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    const success = await copyUtil(children);
    
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } else {
      if (onCopyError) {
        onCopyError('Copy failed. Please select and copy the text manually.');
      } else {
        // Fallback alert if no error handler provided
        alert('Copy failed. Please select and copy the text manually.');
      }
    }
  };

  // Simple syntax highlighting for demo purposes
  const highlightCode = (code: string, lang: string) => {
    if (lang === 'javascript' || lang === 'typescript' || lang === 'jsx' || lang === 'tsx') {
      return code
        .replace(/(\/\/.*$)/gm, '<span class="syntax-comment">$1</span>')
        .replace(/(\/\*[\s\S]*?\*\/)/g, '<span class="syntax-comment">$1</span>')
        .replace(/\b(const|let|var|function|return|if|else|for|while|class|export|import|from|default|async|await|try|catch|throw|new)\b/g, '<span class="syntax-keyword">$1</span>')
        .replace(/\b(true|false|null|undefined)\b/g, '<span class="syntax-boolean">$1</span>')
        .replace(/\b(\d+)\b/g, '<span class="syntax-number">$1</span>')
        .replace(/(["'`])((?:\\.|(?!\1)[^\\])*?)\1/g, '<span class="syntax-string">$1$2$1</span>');
    }
    return code;
  };

  const lines = children.split('\n');
  const highlightedCode = highlightCode(children, language);

  return (
    <div className={`relative group ${className}`}>
      {/* Header with title and language indicator */}
      {title && (
        <div className="flex items-center justify-between px-4 py-3 bg-gradient-to-r from-muted/40 to-muted/60 border border-border rounded-t-lg border-b-0 backdrop-blur-sm">
          <div className="flex items-center gap-2">
            <div className="flex gap-1.5">
              <div className="w-3 h-3 rounded-full bg-destructive/70"></div>
              <div className="w-3 h-3 rounded-full bg-yellow-500/70"></div>
              <div className="w-3 h-3 rounded-full bg-green-500/70"></div>
            </div>
            <span className="text-sm font-medium text-foreground ml-2">{title}</span>
          </div>
          {language && (
            <span className="text-xs px-2 py-1 bg-gradient-primary text-white rounded-md font-medium">
              {language}
            </span>
          )}
        </div>
      )}
      
      {/* Code container */}
      <div className="code-block-wrapper relative bg-gradient-to-br from-card via-card to-muted/10 border border-border rounded-lg shadow-lg overflow-hidden backdrop-blur-sm">
        {!title && (
          <>
            {/* Language indicator for blocks without titles */}
            {language && (
              <div className="absolute top-3 left-4 z-10">
                <span className="text-xs px-3 py-1.5 bg-gradient-primary text-white rounded-md font-medium shadow-sm">
                  {language}
                </span>
              </div>
            )}
          </>
        )}

        {/* Copy button */}
        <Button
          onClick={handleCopy}
          variant="ghost"
          size="sm"
          className="absolute top-3 right-3 z-10 opacity-0 group-hover:opacity-100 transition-all duration-200 h-9 w-9 p-0 bg-gradient-to-r from-muted/90 to-muted hover:from-accent hover:to-accent/80 border border-border/50 shadow-sm hover:shadow-md backdrop-blur-sm"
        >
          {copied ? (
            <Check className="h-4 w-4 text-green-600" />
          ) : (
            <Copy className="h-4 w-4 text-muted-foreground group-hover:text-foreground transition-colors" />
          )}
        </Button>

        {/* Code content */}
        <pre className={`overflow-x-auto p-6 text-sm leading-relaxed font-mono ${title ? 'rounded-b-lg' : 'rounded-lg'} ${!title && language ? 'pt-16' : ''}`}>
          <code 
            className="text-foreground block"
            dangerouslySetInnerHTML={{ __html: highlightedCode }}
          />
        </pre>
      </div>
    </div>
  );
}