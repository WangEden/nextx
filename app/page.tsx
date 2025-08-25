import React from 'react'
import { HeroSection } from "@/components/HeroSection";
import { FeaturesSection } from "@/components/FeaturesSection";
import { AboutSection } from "@/components/AboutSection";
import { CTASection } from "@/components/CTASection";

export default function page() {
  return (
    <div className=''>
      <HeroSection />
      <FeaturesSection />
      <AboutSection />
      <CTASection />
    </div>
  )
}
