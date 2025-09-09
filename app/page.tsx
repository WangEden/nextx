import React from 'react'
import { HeroSection } from "@/components/HeroSection";
import { FeaturesSection } from "@/components/FeaturesSection";
import { AboutSection } from "@/components/AboutSection";
import { CTASection } from "@/components/CTASection";
import { getAllPosts, seededShuffle } from "@/lib/posts";

export default async function page() {
  const posts = getAllPosts();
  const shuffled = [...posts].sort(() => Math.random() - 0.5);
  const randomSix = shuffled.slice(0, 6);

  return (
    <div className=''>
      <HeroSection posts={randomSix}/>
      <FeaturesSection posts={randomSix} />
      <AboutSection />
      <CTASection />
    </div>
  )
}
