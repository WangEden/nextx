import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowRight, Mail, CheckCircle } from "lucide-react";

export function CTASection() {
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
              <span>Join the Revolution</span>
            </div>
          </div>

          {/* 标题/文案：用语义色 */}
          <h2 className="mb-4 text-3xl sm:text-4xl font-semibold text-foreground">
            Ready to get started?
          </h2>
          <p className="mx-auto mb-8 max-w-2xl text-lg text-muted-foreground">
            Join thousands of developers and teams who are already building amazing
            applications with our platform. Start your free trial today.
          </p>

          {/* 表单：Input/按钮走主题，避免白底白字 */}
          <div className="mx-auto mb-8 flex max-w-md flex-col gap-4 sm:flex-row animate-in slide-in-from-bottom-4 duration-600 delay-200">
            <Input
              type="email"
              placeholder="Enter your email"
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
            <Button
              className="
                whitespace-nowrap
                bg-primary text-primary-foreground
                hover:bg-primary/90
                transition-all duration-300
                shadow-lg hover:shadow-xl
                hover:scale-[1.02]
              "
            >
              Start Free Trial
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>

          {/* 优势点：用 muted-foreground；图标用绿色但在暗色略亮 */}
          <div className="flex items-center justify-center space-x-6 text-sm text-muted-foreground animate-in fade-in duration-600 delay-400">
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-4 w-4 text-emerald-500 dark:text-emerald-400" />
              <span>No credit card required</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-4 w-4 text-emerald-500 dark:text-emerald-400" />
              <span>14-day free trial</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}