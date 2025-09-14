import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// 点赞 +1
export async function POST(req: Request) {
  const { slug } = await req.json();
  const post = await prisma.post.upsert({
    where: { slug },
    update: { likes: { increment: 1 } },
    create: { slug, likes: 1 },
  });
  return NextResponse.json({ likes: post.likes });
}

// 获取点赞数
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const slug = searchParams.get("slug")!;
  const post = await prisma.post.findUnique({ where: { slug } });
  return NextResponse.json({ likes: post?.likes ?? 0 });
}
