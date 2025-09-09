// Header.tsx
"use client";

import { Button } from "./ui/button";
import { Menu, Moon, Sun, X, Home, Info, Briefcase, Mail, ArrowRight } from "lucide-react";
import { useState, useEffect, useRef} from "react";
import Link from "next/link";
import { useTheme } from "next-themes";           // ✅ 用这个
import { ImageWithFallback } from "@/components/figma/ImageWithFallback";
import elaina2 from "@/public/imgs/elaina2.jpg";

export default function Header() {
  const [mounted, setMounted] = useState(false);   // 避免 SSR 水合不一致
  const { resolvedTheme, setTheme } = useTheme();  // ✅ 由 next-themes 管理
  // const [isDark, setIsDark] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // 仅在客户端读取/同步当前主题
  useEffect(() => {
    setMounted(true);
  }, []);

  // 点击外部关闭 dropdown
  useEffect(() => {
    if (!isDropdownOpen) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isDropdownOpen]);

  const toggleTheme = () => {
    if (!mounted) return;
    resolvedTheme === "light" ? setTheme("dark") : setTheme("light");
    localStorage.removeItem("theme");
    // // 手动切换主题，通过修改 document.documentElement 的 class 来控制主题
    // const currentTheme = document.documentElement.classList.contains("dark") ? "dark" : "light";
    // if (currentTheme === "dark") {
    //   document.documentElement.classList.remove("dark");
    //   document.documentElement.classList.add("light");
    //   setIsDark(false);
    // } else {
    //   document.documentElement.classList.remove("light");
    //   document.documentElement.classList.add("dark");
    //   setIsDark(true);
    // }
  };

  const toggleDropdown = () => setIsDropdownOpen((v) => !v);
  const closeDropdown = () => setIsDropdownOpen(false);

  const navItems = [
    { href: "/archives", label: "笔记", icon: Home },
    { href: "/about", label: "关于", icon: Info },
    { href: "/dashboard", label: "面板", icon: Briefcase },
    { href: "/mine", label: "我的", icon: Mail },
  ];

  return (
    <>
    {/* 回主页按钮 */}
      <header className="sticky top-0 z-50 w-full border-b border-border/20 backdrop-blur-md">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center cursor-pointer ml-8" onClick={closeDropdown}>
              <div className="flex-shrink-0 mr-3">
                <ImageWithFallback
                  src={elaina2.src}
                  alt="avatar"
                  className="h-10 w-10 rounded-full transform transition duration-500 ease-elastic hover:scale-110"
                />
              </div>
              
              <div className="flex-shrink-0">
                <h1 className="text-xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                  <Link href="/">老王杂货铺</Link>
                </h1>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              {/* 导航栏 */}
              <nav className="hidden md:block">
                <div className="flex items-center space-x-8">
                  {navItems.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className="text-foreground hover:text-primary transition-colors cursor-pointer relative group"
                    >
                      {item.label}
                      <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-primary group-hover:w-full transition-all duration-300" />
                    </Link>
                  ))}
                </div>
              </nav>

            {/* 切换主题（mounted 后再渲染，避免水合不一致） */}
            {mounted && (
              <Button
                aria-label="Toggle theme"
                variant="ghost"
                size="icon"
                onClick={() => toggleTheme()}
                className="w-9 h-9 cursor-pointer hover:bg-black/10 hover:text-white transition-all duration-300"
              >
                {resolvedTheme === "light" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
              </Button>
            )}

            {/* 移动端下拉菜单（取代侧边栏抽屉） */}
            <div className="relative md:hidden" ref={dropdownRef}>
              <Button
                aria-label="Open menu"
                variant="ghost"
                size="icon"
                className="cursor-pointer hover:bg-black/10 hover:text-white transition-all duration-300"
                onClick={toggleDropdown}
              >
                {isDropdownOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
              </Button>

              {isDropdownOpen && (
                <div className="absolute right-0 top-full mt-2 w-72 bg-background/95 backdrop-blur-md border border-border/30 rounded-lg shadow-xl z-50 animate-dropdown-in">
                  {/* Dropdown Header */}
                  <div className="px-4 py-3 border-b border-border/30 bg-gradient-primary/10">
                    <h3 className="font-medium text-foreground">Navigation</h3>
                  </div>

                  {/* Navigation Items */}
                  <div className="py-2">
                    {navItems.map((item, index) => {
                      const IconComponent = item.icon;
                      return (
                        <Link
                          key={item.href}
                          href={item.href}
                          onClick={closeDropdown}
                          className="flex items-center px-4 py-3 text-foreground hover:bg-gradient-primary/10 hover:text-primary transition-colors cursor-pointer group"
                          style={{ animationDelay: `${index * 50}ms` }}
                        >
                          <div className="flex items-center justify-center w-8 h-8 rounded-md bg-gradient-primary/20 text-primary group-hover:bg-gradient-primary group-hover:text-white transition-all duration-200 mr-3">
                            <IconComponent className="h-4 w-4" />
                          </div>
                          <span className="font-medium">{item.label}</span>
                          <ArrowRight className="h-4 w-4 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
                        </Link>
                      );
                    })}
                  </div>

                  {/* Dropdown Footer */}
                  <div className="px-4 py-3 border-t border-border/30">
                    <Button
                      className="w-full bg-gradient-primary hover:bg-gradient-secondary transition-all duration-300 cursor-pointer text-sm"
                      onClick={closeDropdown}
                    >
                      Get Started
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>

          </div>
        </div>
      </header>
      </>
  );
}
