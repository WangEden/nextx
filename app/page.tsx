import React from 'react'
import { HeroSection } from "@/components/HeroSection";
import { FeaturesSection } from "@/components/FeaturesSection";
import { CTASection } from "@/components/CTASection";
import { getAllPosts, seededShuffle } from "@/lib/posts";

export default async function page() {
  const posts = getAllPosts();
  const randomSix = seededShuffle(posts, 42).slice(0, 6);

  return (
    <main className="home-page">
      <HeroSection posts={posts}/>
      <FeaturesSection posts={randomSix} />
      <CTASection />
    </main>
  )
}
