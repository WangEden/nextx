import Link from "next/link";
import { ArrowDown, ArrowUpRight, BookOpen } from "lucide-react";

export function HeroSection({ postCount }: { postCount: number }) {
  return <section className="home-hero">
    <div className="journal-shell home-hero__content">
      <p className="eyebrow hero-reveal"><span className="status-dot" />WELCOME TO MY LITTLE UNIVERSE</p>
      <h1 className="home-hero__title hero-reveal">掬水月在手，<br />弄花香满衣<span>。</span></h1>
      <p className="home-hero__quote-source hero-reveal">于良史<span aria-hidden="true"> · </span>《春山夜月》</p>
      <div className="home-hero__actions hero-reveal">
        <Link href="/archives" className="hero-button hero-button--primary"><BookOpen size={17} />走进我的文库<ArrowUpRight size={17} /></Link>
        <Link href="/about" className="hero-button hero-button--glass">认识一下<ArrowUpRight size={17} /></Link>
      </div>
      <div className="home-hero__footer hero-reveal"><span>工程实践 <i /> 技术原理 <i /> 长期思考</span><a href="#services">{postCount} 篇笔记，持续生长<ArrowDown size={15} /></a></div>
    </div>
    <span className="home-hero__coordinate" aria-hidden="true">EXPLORE. CREATE. REPEAT.</span>
  </section>;
}
