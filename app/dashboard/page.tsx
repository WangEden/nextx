import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  ArrowRight,
  BookOpen,
  Bot,
  Brush,
  CalendarCheck,
  Code,
  Music2,
  Sparkles,
} from "lucide-react";

const appList = [
  {
    name: "Note Editor",
    description: "在线简单编辑Markdown文件",
    category: "效率",
    status: "Beta",
    tags: ["Markdown", "Online", "团队"],
    href: "/dashboard/",
    icon: BookOpen,
  },
  {
    name: "SVG Editor",
    description: "在线编辑矢量图",
    category: "设计",
    status: "Beta",
    tags: ["Design", "Tokens", "Handoff"],
    href: "/dashboard/",
    icon: Brush,
  },
  {
    name: "Painter Panel",
    description: "让iOS设备能使用Apple Pencil在线创作",
    category: "设计",
    status: "Beta",
    tags: ["Design", "Paint", "Pencil"],
    href: "/dashboard/",
    icon: Code,
  },
  // {
  //   name: "MuseSync",
  //   description: "音乐素材库与版权管理，项目级别的素材追踪。",
  //   category: "多媒体",
  //   status: "Preview",
  //   tags: ["Audio", "License", "Library"],
  //   href: "/dashboard/",
  //   icon: Music2,
  // },
  // {
  //   name: "AutoOps",
  //   description: "自动化流程编排，定时任务与团队通知集成。",
  //   category: "运营",
  //   status: "Beta",
  //   tags: ["Automation", "Webhook", "Scheduler"],
  //   href: "/dashboard/",
  //   icon: CalendarCheck,
  // },
  // {
  //   name: "Studio Bot",
  //   description: "创意辅助与资料整合机器人，快速生成项目摘要。",
  //   category: "AI",
  //   status: "Experiment",
  //   tags: ["Assistant", "Summary", "Ideas"],
  //   href: "/dashboard/",
  //   icon: Bot,
  // },
];

export default function Page() {
  return (
    <>
      <section className="py-16">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">应用中心</h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              此处存放一些可能用得到的简易工具
            </p>
          </div>
        </div>
      </section>

      <section className="pb-16">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-semibold">应用列表</h2>
            <span className="text-muted-foreground">{appList.length} apps</span>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {appList.map((app) => {
              const Icon = app.icon;
              return (
                <Link key={app.name} href={app.href} className="group block">
                  <Card className="cursor-pointer transition-all duration-300 hover:scale-[1.02] hover:shadow-xl bg-white/50 dark:bg-black/20 backdrop-blur-sm border-white/20 dark:border-white/10 overflow-hidden h-full">
                    <div className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500/15 via-sky-500/10 to-emerald-500/15 flex items-center justify-center">
                          <Icon className="w-6 h-6 text-blue-600" />
                        </div>
                        <Badge className="bg-white/60 text-foreground border-white/40 backdrop-blur-sm">
                          {app.status}
                        </Badge>
                      </div>

                      <h3 className="text-lg font-semibold mb-2 group-hover:text-primary transition-colors">
                        {app.name}
                      </h3>
                      <p className="text-muted-foreground text-sm line-clamp-3 mb-4">
                        {app.description}
                      </p>

                      <div className="flex flex-wrap gap-2 mb-6">
                        {app.tags.map((tag) => (
                          <Badge key={tag} variant="secondary" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>

                      <div className="flex items-center justify-between text-sm text-muted-foreground">
                        <span>{app.category}</span>
                        <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
                      </div>
                    </div>
                  </Card>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      <section className="pb-16">
        <div className="container mx-auto px-6 lg:px-12">
          <Card className="bg-white/40 dark:bg-black/10 backdrop-blur-sm border-white/20 dark:border-white/10 p-6">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div>
                <h3 className="text-xl font-semibold mb-2">更多应用即将上线</h3>
                <p className="text-muted-foreground">
                  持续完善工具矩阵，欢迎提出你想要的功能。
                </p>
              </div>
              <Badge className="bg-gradient-primary text-white border-0">
                <Sparkles className="w-4 h-4 mr-1" />
                Coming Soon
              </Badge>
            </div>
          </Card>
        </div>
      </section>
    </>
  );
}
