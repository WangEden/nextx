"use client";

import { useEffect, useMemo, useState } from "react";
import emailjs from "@emailjs/browser";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { ArrowRight, Mail, CheckCircle, Github } from "lucide-react";
import { PopupNotification } from "@/components/PopupNotification";

export function CTASection() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");

  // 蜜罐：人类不应填写，用于挡机器人（填了就直接丢弃）
  const [company, setCompany] = useState("");

  const [notification, setNotification] = useState<{
    visible: boolean;
    message: string;
    type: "info" | "warning" | "error";
  }>({ visible: false, message: "", type: "info" });

  const EMAILJS_SERVICE_ID = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID!;
  const EMAILJS_TEMPLATE_ID = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID!;
  const EMAILJS_PUBLIC_KEY = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY!;

  const pageUrl = useMemo(() => (typeof window !== "undefined" ? window.location.href : ""), []);
  const ua = useMemo(() => (typeof navigator !== "undefined" ? navigator.userAgent : ""), []);

  const isEmailValid = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim());
  const canSend =
    status !== "sending" &&
    name.trim().length >= 2 &&
    isEmailValid(email) &&
    message.trim().length >= 5;

  const handleSubmit = async () => {
    if (!canSend) return;

    // 蜜罐命中：静默丢弃
    if (company.trim()) {
      setStatus("sent");
      setMessage("");
      setNotification({ visible: true, message: "已发送，感谢你的留言", type: "info" });
      return;
    }

    try {
      setStatus("sending");

      const sentAt = new Date().toISOString();

      // await emailjs.send(
      //   EMAILJS_SERVICE_ID,
      //   EMAILJS_TEMPLATE_ID,
      //   {
      //     // 这些 key 必须与 EmailJS 模板变量一致
      //     name: name.trim(),
      //     email: email.trim(),
      //     message: message.trim(),
      //     page_url: pageUrl,
      //     sent_at: sentAt,
      //     ua,
      //   },
      //   { publicKey: EMAILJS_PUBLIC_KEY }
      // );

      await emailjs.send(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID,
        {
          // 用 EmailJS 常见字段名，避免 Outlook/MS Graph 误映射
          from_name: name.trim(),          // 发件人显示名（模板里用 {{from_name}}）
          reply_to: email.trim(),          // 回复地址（模板里用 {{reply_to}}）

          // 正文展示字段（模板里用 {{user_email}}）
          user_email: email.trim(),

          // 正文
          message: message.trim(),

          // 元信息
          page_url: pageUrl,
          sent_at: sentAt,
          ua,
        },
        { publicKey: EMAILJS_PUBLIC_KEY }
      );


      setStatus("sent");
      setMessage("");
      setNotification({ visible: true, message: "已发送，感谢你的留言", type: "info" });
    } catch {
      setStatus("error");
      setNotification({ visible: true, message: "发送失败，请稍后再试", type: "warning" });
    }
  };

  const handlePopupComplete = () => setNotification((prev) => ({ ...prev, visible: false }));

  return (
    <section className="py-16 sm:py-24 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-primary/90 backdrop-blur-sm"></div>

      <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <div className="mb-6 flex items-center justify-center">
            <div className="flex items-center space-x-2 rounded-full bg-muted/60 px-4 py-2 text-sm text-muted-foreground ring-1 ring-border/40 backdrop-blur">
              <Mail className="h-4 w-4 text-primary" />
              <span>联系Eden</span>
            </div>
          </div>

          <h2 className="mb-4 text-3xl sm:text-4xl font-semibold text-foreground">联系我</h2>
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

          <div className="mx-auto mb-8 flex max-w-2xl flex-col gap-4">
            {/* 蜜罐字段：视觉隐藏但不 display:none（避免被机器人跳过） */}
            <div className="absolute left-[-9999px] top-auto h-0 w-0 overflow-hidden" aria-hidden="true">
              <label>
                Company
                <input value={company} onChange={(e) => setCompany(e.target.value)} />
              </label>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="你的名字"
                className="bg-background/70 text-foreground placeholder:text-muted-foreground border-border/50 focus-visible:ring-primary/40"
              />
              <Input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="你的邮箱（用于回复）"
                className="bg-background/70 text-foreground placeholder:text-muted-foreground border-border/50 focus-visible:ring-primary/40"
              />
            </div>

            <Textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="写下你的问题或想法…（请输入不少于两个字）"
              rows={6}
              className="bg-background/70 text-foreground placeholder:text-muted-foreground border-border/50 focus-visible:ring-primary/40 focus:border-primary/60 transition-colors"
            />

            <div className="flex flex-col items-center justify-center gap-2 sm:flex-row">
              <Button
                onClick={handleSubmit}
                disabled={!canSend}
                className="whitespace-nowrap bg-primary text-primary-foreground hover:bg-primary/90 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-[1.02]"
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

            <div className="text-xs text-muted-foreground">
              发送后会邮件通知我；我会通过你填写的邮箱回复。页面地址会一并记录用于定位问题。
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
