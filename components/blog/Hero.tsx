import React from 'react';
import { ImageWithFallback } from '../figma/ImageWithFallback';
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, Eye, BookOpen, Tag } from "lucide-react";

interface HeroProps {
  title: string;
  subtitle: string;
  categories: { name: string; icon: React.ReactNode; colorClass?: string }[];
  date: string;
  readingTime: string;
  views: number;
  coverImage: string;
}

export const Hero: React.FC<HeroProps> = ({ 
    title, 
    subtitle, 
    categories, 
    date, 
    readingTime, 
    views, 
    coverImage 
}) => (
    <section className="relative h-[50vh]">
        {/* Hero Section with Cover Image */}
        <div className="absolute inset-0">
            <ImageWithFallback 
                src={coverImage} 
                alt="Blog cover" 
                className="w-full h-full object-cover" />
            {/* Dark overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-black/30"></div>
        </div>

        <div className="relative z-10 flex items-center h-full">
            <div className="container mx-auto px-6 lg:px-12">
                <div className="max-w-2xl">
                    <div className="flex flex-wrap gap-3 mb-6">
                        {categories.map((c) => (
                        <Badge 
                            key={c.name} 
                            className={`bg-white/20 text-white border-white/30 rounded-xl px-4 py-2 backdrop-blur-sm hover:bg-white/30 transition-colors ${c.colorClass || ""}`}>
                            {c.icon} 
                            {c.name}
                        </Badge>
                        ))}
                    </div>
                    
                    {/* Title */}
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">{title}</h1>

                    {/* Subtitle */}
                    <p className="text-xl text-white/90 mb-8 leading-relaxed">{subtitle}</p>

                    {/* Meta information */}
                    <div className="flex flex-wrap items-center gap-6 text-white/80">
                        <div className="flex items-center gap-2"><Calendar className="w-4 h-4" /> <span>{date}</span></div>
                        <div className="flex items-center gap-2"><Clock className="w-4 h-4" /> <span>{readingTime}</span></div>
                        <div className="flex items-center gap-2"><Eye className="w-4 h-4" /> <span>{views} views</span></div>
                    </div>
                    </div>
        </div>
        </div>
    </section>
);
