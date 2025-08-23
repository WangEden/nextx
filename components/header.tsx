"use client";

import { Button } from "./ui/button";
import { Menu, Moon, Sun, X, Home, Info, Briefcase, Mail, ArrowRight } from "lucide-react";
import { useState, useEffect } from "react";

export function Header() {
  const [isDark, setIsDark] = useState(false);
  const [isPanelOpen, setIsPanelOpen] = useState(false);

  useEffect(() => {
    const isDarkMode = document.documentElement.classList.contains('dark');
    setIsDark(isDarkMode);
  }, []);

  useEffect(() => {
    // Prevent body scroll when panel is open
    if (isPanelOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    // Cleanup on unmount
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isPanelOpen]);

  const toggleDarkMode = () => {
    document.documentElement.classList.toggle('dark');
    setIsDark(!isDark);
  };

  const togglePanel = () => {
    setIsPanelOpen(!isPanelOpen);
  };

  const closePanel = () => {
    setIsPanelOpen(false);
  };

  const navItems = [
    { href: "#home", label: "Home", icon: Home },
    { href: "#about", label: "About", icon: Info },
    { href: "#services", label: "Services", icon: Briefcase },
    { href: "#contact", label: "Contact", icon: Mail },
  ];

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b border-border/20 backdrop-blur-md">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center cursor-pointer" onClick={closePanel}>
              <div className="flex-shrink-0">
                <h1 className="text-xl font-bold text-primary bg-gradient-primary bg-clip-text text-transparent">
                  Your Brand
                </h1>
              </div>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:block">
              <div className="flex items-center space-x-8">
                {navItems.map((item) => (
                  <a
                    key={item.href}
                    href={item.href}
                    className="text-foreground hover:text-primary transition-colors cursor-pointer relative group"
                  >
                    {item.label}
                    <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-primary group-hover:w-full transition-all duration-300"></span>
                  </a>
                ))}
              </div>
            </nav>

            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleDarkMode}
                className="w-9 h-9 cursor-pointer hover:bg-gradient-primary hover:text-white transition-all duration-300"
              >
                {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
              </Button>

              <Button className="hidden md:inline-flex bg-gradient-primary hover:bg-gradient-secondary transition-all duration-300 cursor-pointer">
                Get Started
              </Button>

              {/* Panel toggle button */}
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden cursor-pointer hover:bg-gradient-primary hover:text-white transition-all duration-300"
                onClick={togglePanel}
              >
                <Menu className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Collapsible Navigation Panel */}
      {isPanelOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 cursor-pointer animate-in fade-in duration-200"
            onClick={closePanel}
          />

          {/* Sliding Panel */}
          <div
            className={`fixed top-0 left-0 h-full w-80 bg-background/95 backdrop-blur-md border-r shadow-2xl z-50 cursor-default transition-transform duration-300 ease-out ${
              isPanelOpen ? 'translate-x-0' : '-translate-x-full'
            }`}
          >
            <div className="flex flex-col h-full">
              {/* Panel Header */}
              <div className="flex items-center justify-between p-6 border-b bg-gradient-primary">
                <h2 className="text-xl font-bold text-white">Navigation</h2>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={closePanel}
                  className="text-white hover:bg-white/20 cursor-pointer"
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>

              {/* Navigation Items */}
              <div className="flex-1 p-6">
                <nav className="space-y-4">
                  {navItems.map((item, index) => {
                    const IconComponent = item.icon;
                    return (
                      <a
                        key={item.href}
                        href={item.href}
                        onClick={closePanel}
                        className="flex items-center space-x-3 p-3 rounded-lg hover:bg-muted/50 transition-colors cursor-pointer group"
                        style={{ animationDelay: `${index * 100}ms` }}
                      >
                        <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-gradient-primary text-white group-hover:bg-gradient-secondary transition-all duration-300">
                          <IconComponent className="h-5 w-5" />
                        </div>
                        <span className="font-medium group-hover:text-primary transition-colors">
                          {item.label}
                        </span>
                        <ArrowRight className="h-4 w-4 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
                      </a>
                    );
                  })}
                </nav>
              </div>

              {/* Panel Footer */}
              <div className="p-6 border-t border-border/30">
                <Button 
                  className="w-full bg-gradient-primary hover:bg-gradient-secondary transition-all duration-300 cursor-pointer"
                  onClick={closePanel}
                >
                  Get Started
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
                <p className="text-xs text-muted-foreground text-center mt-3">
                  © 2025 Your Brand. All rights reserved.
                </p>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}