// app/api/visitor/route.ts
import { NextRequest, NextResponse } from "next/server";

type DailyStats = {
  date: string;   // "YYYY-MM-DD"
  count: number;  // 今日访问数
};

// 简单内存变量（示例）——在真正部署时建议换成 Redis / DB
let stats: DailyStats = {
  date: getTodayStr(),
  count: 0,
};

function getTodayStr() {
  const now = new Date();
  // 取本地日期（简单写法，可以按需改成你所在时区）
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function getTodayCounter() {
  const today = getTodayStr();
  if (stats.date !== today) {
    // 日期变了 -> 自动重置
    stats = {
      date: today,
      count: 0,
    };
  }
  return stats;
}

export async function POST(req: NextRequest) {
  const { isNewVisitor } = (await req.json()) as { isNewVisitor: boolean };

  const todayStats = getTodayCounter();

  if (isNewVisitor) {
    todayStats.count += 1;
  }

  return NextResponse.json(
    {
      today: todayStats.date,
      todayCount: todayStats.count,
    },
    {
      headers: {
        "Cache-Control": "no-store",
      },
    }
  );
}
