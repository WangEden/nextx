"use client";
// IconButtonGroup.tsx

import IconButton from "./IconButton";
import { Home, User, Book } from 'lucide-react';

const ItemData = [
  { name: "文库", href: "/archives", icon: Book },
  { name: "关于", href: "/about", icon: Home },
  { name: "我的", href: "/mine", icon: User },
];

export default function IconButtonGroup() {
  return (
    <div className="flex gap-3 items-center justify-center">
      {ItemData.map((item) => (
        <IconButton key={item.href} icon={item.icon} label={item.name} href={item.href} />
      ))}
    </div>
  );
}
