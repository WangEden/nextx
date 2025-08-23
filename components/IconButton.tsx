"use client";

import { LucideIcon } from "lucide-react";
import Link from "next/link";

interface IconButtonProps {
  icon: LucideIcon;
  label: string;
  href: string;
}

export default function IconButton({ icon: Icon, label, href }: IconButtonProps) {
  return (
    <Link
      href={href}
      className="group relative flex items-center h-[50px] w-[50px] hover:w-[100px] hover:h-[52px]
      bg-white rounded-full cursor-pointer shadow-lg overflow-hidden transition-all duration-300 no-underline px-3"
    >
      {/* 图标居中 */}
      <div className="absolute left-0 w-[50px] h-[50px] flex items-center justify-center">
        <Icon className="w-5 h-5 text-gray-800" />
      </div>

      {/* 文本在 hover 后显示，50px 以内展示 */}
      <span
        className="ml-[35px] font-medium text-base text-gray-800 opacity-0 
        group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap overflow-hidden text-ellipsis"
        style={{ maxWidth: "50px" }}
      >
        {label}
      </span>
    </Link>
  );
}
