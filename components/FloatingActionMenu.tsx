"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ChevronUp, X, List, ArrowUp, Share2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { createPortal } from "react-dom";

interface ActionButton {
  id: string;
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
}

interface FloatingActionMenuProps {
  onNotification?: (message: string, type: 'warning' | 'error' | 'info') => void;
}

export function FloatingActionMenu({ onNotification }: FloatingActionMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // 回到顶部
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setIsOpen(false);
  };

  // 滚动到“目录”或者文章的第一个小节
  const scrollToTOC = () => {
    const tocById =
      document.getElementById('table-of-contents') ||
      document.getElementById('toc');

    const firstHeading =
      document.querySelector('.markdown-rendered h2, .markdown-rendered h3') as
        | HTMLElement
        | null;

    const target = (tocById as HTMLElement | null) || firstHeading;

    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else {
      onNotification?.('没有找到目录或小节标题', 'info');
    }

    setIsOpen(false);
  };

  const shareArticle = () => {
    const url = window.location.href;
    const title = document.title;

    if (navigator.share) {
      navigator
        .share({ title, url })
        .then(() => {
          onNotification?.("分享成功", "info");
        })
        .catch((error) => {
          if (error.name !== "AbortError") {
            copyToClipboard(url);
          }
        });
    } else {
      copyToClipboard(url);
    }

    setIsOpen(false);
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      onNotification?.("链接已复制到剪贴板", "info");
    } catch {
      onNotification?.("复制链接失败", "error");
    }
  };

  const actionButtons: ActionButton[] = [
    { id: 'toc',  icon: <List className="w-5 h-5" />,  label: '目录 / 小节', onClick: scrollToTOC },
    { id: 'top',  icon: <ArrowUp className="w-5 h-5" />, label: '回到顶部',   onClick: scrollToTop },
    { id: 'share',icon: <Share2 className="w-5 h-5" />,  label: '分享文章',   onClick: shareArticle },
  ];

  if (!mounted) return null;   // 避免 SSR / hydration 报错

  return createPortal(
    <div className="fixed bottom-6 right-4 md:bottom-8 md:right-8 z-50 pointer-events-none">
      <div className="relative flex flex-col items-center pointer-events-auto">
        {/* 展开的按钮 */}
        <AnimatePresence>
          {isOpen && (
            <div className="flex flex-col gap-3 mb-3">
              {actionButtons.map((action, index) => (
                <motion.div
                  key={action.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 12 }}
                  transition={{
                    duration: 0.2,
                    delay: index * 0.05,
                    ease: [0.4, 0, 0.2, 1],
                  }}
                  className="relative group"
                >
                  {/* 文本气泡 */}
                  <motion.div
                    initial={{ opacity: 0, x: 8 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 8 }}
                    transition={{ duration: 0.15, delay: index * 0.05 + 0.1 }}
                    className="absolute right-full mr-3 top-1/2 -translate-y-1/2 whitespace-nowrap pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                  >
                    <div className="px-3 py-1.5 bg-background/90 backdrop-blur-sm border border-border/40 rounded-full shadow-lg">
                      <span className="text-xs text-foreground">
                        {action.label}
                      </span>
                    </div>
                  </motion.div>

                  {/* 子按钮 */}
                  <Button
                    onClick={action.onClick}
                    className="
                      w-11 h-11 md:w-12 md:h-12 rounded-full p-0 
                      bg-black/80 text-white 
                      dark:bg-white/20 dark:text-black
                      shadow-xl hover:shadow-2xl  
                      transition-all duration-200 hover:scale-105 border-0
                    "
                    aria-label={action.label}
                  >
                    {action.icon}
                  </Button>
                </motion.div>
              ))}
            </div>
          )}
        </AnimatePresence>

        {/* 主按钮 */}
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          transition={{ duration: 0.2 }}
        >
          <Button
            onClick={() => setIsOpen(v => !v)}
            aria-label="打开快速操作菜单"
            className="
              w-12 h-12 md:w-14 md:h-14 rounded-full p-0 
              bg-background/85 hover:bg-gradient-primary 
              backdrop-blur-md border border-border/40 
              shadow-xl transition-all duration-300 group
            "
          >
            <AnimatePresence mode="wait">
              {isOpen ? (
                <motion.div
                  key="close"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <X className="w-5 h-5 md:w-6 md:h-6 text-foreground group-hover:text-white transition-colors duration-300" />
                </motion.div>
              ) : (
                <motion.div
                  key="open"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <ChevronUp className="w-5 h-5 md:w-6 md:h-6 text-foreground group-hover:text-white transition-colors duration-300" />
                </motion.div>
              )}
            </AnimatePresence>
          </Button>
        </motion.div>
      </div>
    </div>,
    document.body
  );
}
