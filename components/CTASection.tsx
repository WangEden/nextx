"use client";

import { useState } from "react";
import emailjs from "@emailjs/browser";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ArrowRight, Mail, CheckCircle, Github } from "lucide-react";
import { PopupNotification } from "@/components/PopupNotification";


export function CTASection() {
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [notification, setNotification] = useState<{
    visible: boolean;
    message: string;
    type: "info" | "warning" | "error";
  }>({
    visible: false,
    message: "",
    type: "info",
  });

  const EMAILJS_SERVICE_ID = "service_gyyr9pe";
  const EMAILJS_TEMPLATE_ID = "template_3ihkvpg";
  const EMAILJS_PUBLIC_KEY = "u6oSiAzl8RE1qUZ0g";

  const handleSubmit = async () => {
    if (!message.trim()) return;
    try {
      setStatus("sending");
      await emailjs.send(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID,
        {
          message: message.trim(),
          source: "CTASection",
          page_url: typeof window !== "undefined" ? window.location.href : "",
          sent_at: new Date().toLocaleString(),
        },
        { publicKey: EMAILJS_PUBLIC_KEY }
      );
      setStatus("sent");
      setMessage("");
      setNotification({
        visible: true,
        message: "已发送，感谢你的留言",
        type: "info",
      });
    } catch {
      setStatus("error");
      setNotification({
        visible: true,
        message: "发送失败，请稍后再试",
        type: "warning",
      });
    }
  };

  const handlePopupComplete = () => {
    setNotification((prev) => ({ ...prev, visible: false }));
  };

  return (
    <section className="py-16 sm:py-24 relative overflow-hidden">
      {/* Gradient overlay that blends with the radial background */}
      <div className="absolute inset-0 bg-gradient-primary/90 backdrop-blur-sm"></div>

      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 border border-white/10 rounded-full animate-spin" style={{ animationDuration: '20s' }} />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 border border-white/10 rounded-full animate-spin" style={{ animationDuration: '25s', animationDirection: 'reverse' }} />
      </div>
      <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center animate-in slide-in-from-bottom-8 duration-800">
          {/* 顶部徽标条：用 muted 背景 + 主色图标/文字 */}
          <div className="mb-6 flex items-center justify-center">
            <div className="flex items-center space-x-2 rounded-full bg-muted/60 px-4 py-2 text-sm text-muted-foreground ring-1 ring-border/40 backdrop-blur">
              <Mail className="h-4 w-4 text-primary" />
              <span>联系Eden</span>
            </div>
          </div>

          {/* 标题/文案：用语义色 */}
          <h2 className="mb-4 text-3xl sm:text-4xl font-semibold text-foreground">
            联系我
          </h2>
          <p className="mx-auto mb-6 max-w-2xl text-lg text-muted-foreground">
            有任何问题欢迎来 GitHub 仓库提 issue，或者直接在这里留言
          </p>

          <div className="mb-8 flex items-center justify-center gap-3 text-sm text-muted-foreground">
            <a
              href="https://github.com/WangEden/nextx"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-muted/60 px-4 py-2 ring-1 ring-border/40 backdrop-blur transition-colors hover:text-primary"
            >
              <Github className="h-4 w-4" />
              前往 GitHub 仓库
            </a>
          </div>

          {/* 表单：Input/按钮走主题，避免白底白字 */}
          <div className="mx-auto mb-8 flex max-w-2xl flex-col gap-4 animate-in slide-in-from-bottom-4 duration-600 delay-200">
            <Textarea
              value={message}
              onChange={(event) => setMessage(event.target.value)}
              placeholder="写下你的问题或想法…"
              rows={6}
              className="
                bg-background/70
                text-foreground
                placeholder:text-muted-foreground
                border-border/50
                focus-visible:ring-primary/40
                focus:border-primary/60
                transition-colors
              "
            />
            <div className="flex flex-col items-center justify-center gap-2 sm:flex-row">
              <Button
                onClick={handleSubmit}
                disabled={status === "sending" || !message.trim()}
                className="
                  whitespace-nowrap
                  bg-primary text-primary-foreground
                  hover:bg-primary/90
                  transition-all duration-300
                  shadow-lg hover:shadow-xl
                  hover:scale-[1.02]
                "
              >
                {status === "sending" ? "发送中..." : "发送留言"}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              {status === "sent" && (
                <span className="inline-flex items-center gap-2 text-sm text-emerald-500">
                  <CheckCircle className="h-4 w-4" />
                  已发送
                </span>
              )}
            </div>
          </div>

          {/* 优势点：用 muted-foreground；图标用绿色但在暗色略亮 */}
          <div className="flex items-center justify-center space-x-6 text-sm text-muted-foreground animate-in fade-in duration-600 delay-400">
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-4 w-4 text-emerald-500 dark:text-emerald-400" />
              <span>欢迎交流</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-4 w-4 text-emerald-500 dark:text-emerald-400" />
              <span>尽量回复</span>
            </div>
          </div>
        </div>
      </div>

      <PopupNotification
        isVisible={notification.visible}
        onComplete={handlePopupComplete}
        message={notification.message}
        type={notification.type}
      />
    </section>
  );
}
