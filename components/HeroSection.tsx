import { Button } from "@/components/ui/button";
import { ArrowRight, Play, Sparkles } from "lucide-react";
import { ImageWithFallback } from "@/components/figma/ImageWithFallback";
import elaina1 from "@/public/imgs/elaina1.jpg";

export function HeroSection() {
  return (
    <section id="home" className="relative overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="relative z-10 pb-8 sm:pb-16 md:pb-20 lg:pb-28 xl:pb-32">
          <main className="mt-10 mx-auto max-w-7xl px-4 sm:mt-12 sm:px-6 md:mt-16 lg:mt-20 lg:px-8 xl:mt-28">
            <div className="text-center lg:text-left lg:grid lg:grid-cols-12 lg:gap-8">
              <div className="lg:col-span-6 animate-in slide-in-from-bottom-8 duration-800">
                <div className="flex items-center justify-center lg:justify-start mb-4">
                  <div className="flex items-center space-x-2 bg-gradient-primary px-4 py-2 rounded-full text-white text-sm cursor-pointer hover:bg-gradient-secondary transition-all duration-300">
                    <Sparkles className="h-4 w-4" />
                    <span>新的特性可用</span>
                  </div>
                </div>

                <h1 className="text-4xl tracking-tight sm:text-5xl md:text-6xl">
                  <span className="block">Build amazing</span>
                  <span className="block bg-gradient-primary bg-clip-text text-transparent">
                    digital experiences
                  </span>
                </h1>
                <p className="mt-3 text-base text-muted-foreground sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl lg:mx-0">
                  Create stunning websites and applications with our modern tools and expert guidance. 
                  Transform your ideas into reality with cutting-edge technology.
                </p>
                <div className="mt-5 sm:mt-8 sm:flex sm:justify-center lg:justify-start gap-4">
                  <Button size="lg" className="w-full sm:w-auto bg-gradient-primary hover:bg-gradient-secondary transition-all duration-300 cursor-pointer shadow-lg hover:shadow-xl hover:scale-105 transform">
                    开始使用
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="lg" className="mt-3 sm:mt-0 w-full sm:w-auto border-2 hover:bg-gradient-primary hover:text-white hover:border-transparent transition-all duration-300 cursor-pointer hover:scale-105 transform">
                    <Play className="mr-2 h-4 w-4" />
                    观看演示
                  </Button>
                </div>

                {/* Stats */}
                <div className="mt-8 flex items-center justify-center lg:justify-start space-x-8 text-sm text-muted-foreground animate-in slide-in-from-bottom-4 duration-800 delay-400">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-gradient-primary rounded-full"></div>
                    <span>10M+ Users</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-gradient-secondary rounded-full"></div>
                    <span>99.9% Uptime</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-gradient-accent rounded-full"></div>
                    <span>24/7 Support</span>
                  </div>
                </div>
              </div>

              <div className="mt-12 lg:mt-0 lg:col-span-6 animate-in slide-in-from-right-8 duration-800 delay-200">
                <div className="relative cursor-grab active:cursor-grabbing">
                  <div className="absolute -inset-4 bg-gradient-primary/20 rounded-lg blur opacity-30"></div>
                  <ImageWithFallback
                    src={elaina1.src}
                    alt="Team collaboration"
                    className="relative w-full h-auto rounded-lg shadow-2xl hover:shadow-3xl transition-shadow duration-300"
                  />
                  
                  {/* Floating elements */}
                  {/* <div className="absolute -top-4 -right-4 w-8 h-8 bg-gradient-secondary rounded-full shadow-lg animate-in zoom-in-50 duration-500 delay-1000" /> */}
                  {/* <div className="absolute -bottom-4 -left-4 w-6 h-6 bg-gradient-accent rounded-full shadow-lg animate-in zoom-in-50 duration-500 delay-1200" /> */}
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </section>
  );
}