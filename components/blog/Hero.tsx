import { ArrowDown, CalendarDays, Clock, Eye } from "lucide-react";
import { ImageWithFallback } from "../figma/ImageWithFallback";
import { siteImage } from "@/lib/site-images";

interface HeroProps {
  title: string;
  subtitle: string;
  categories: { name: string }[];
  date: string;
  readingTime: string;
  views: number;
  coverImage: string;
}

export function Hero({ title, subtitle, categories, date, readingTime, views, coverImage }: HeroProps) {
  return <section className="article-hero">
    <div className="article-hero__image"><ImageWithFallback {...siteImage(coverImage, "100vw")} alt="" data-glass-scene="article" fetchPriority="high" decoding="async" /></div>
    <div className="article-hero__scrim" />
    <div className="journal-shell article-hero__content">
      <p className="eyebrow">A PAGE FROM EDEN&apos;S JOURNAL</p>
      <div className="article-hero__tags">{categories.map((category) => <span key={category.name}>{category.name}</span>)}</div>
      <h1 className="article-hero__title" tabIndex={-1}>{title}</h1>
      {subtitle && <p className="article-hero__subtitle">{subtitle}</p>}
      <div className="article-hero__meta">
        {date && <span><CalendarDays size={15} /><time dateTime={date}>{date.replaceAll("-", ".")}</time></span>}
        {readingTime && <span><Clock size={15} />{readingTime}阅读</span>}
        <span><Eye size={15} />{views.toLocaleString()} 次浏览</span>
      </div>
      <a href="#article-body" className="article-hero__scroll">开始阅读<ArrowDown size={16} /></a>
    </div>
    <span className="article-hero__index" aria-hidden="true">EDENX / FIELD NOTES</span>
  </section>;
}
