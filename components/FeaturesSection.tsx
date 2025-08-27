import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Zap, Shield, Globe, Users, Code, Smartphone } from "lucide-react";

const features = [
  {
    icon: Zap,
    title: "Lightning Fast",
    description: "Optimized performance with cutting-edge technology for blazing fast load times.",
    badge: "Performance"
  },
  {
    icon: Shield,
    title: "Secure by Design",
    description: "Enterprise-grade security measures to protect your data and users.",
    badge: "Security"
  },
  {
    icon: Globe,
    title: "Global Reach",
    description: "Deploy worldwide with our global CDN and multi-region infrastructure.",
    badge: "Scalability"
  },
  {
    icon: Users,
    title: "Team Collaboration",
    description: "Work seamlessly with your team using our collaborative tools and workflows.",
    badge: "Productivity"
  },
  {
    icon: Code,
    title: "Developer Friendly",
    description: "Clean APIs, comprehensive documentation, and powerful development tools.",
    badge: "DX"
  },
  {
    icon: Smartphone,
    title: "Mobile First",
    description: "Responsive design that looks perfect on any device, anywhere.",
    badge: "Design"
  }
];

export function FeaturesSection() {
  return (
    <section id="services" className="py-16 sm:py-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl sm:text-4xl">
            往期回顾
          </h2>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
            Everything you need to build modern, scalable applications with confidence.
          </p>
        </div>

        <div className="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => {
            const IconComponent = feature.icon;
            return (

              <Card key={index} className="relative overflow-hidden hover:shadow-lg bg-card/60 backdrop-blur-sm border-border/30 transform transition duration-500 ease-elastic hover:scale-102">
              {/* <Card key={index} className="relative overflow-hidden hover:shadow-lg transition-shadow bg-card/60 backdrop-blur-sm border-border/30"> */}
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                        <IconComponent className="h-5 w-5" />
                      </div>
                      <CardTitle className="text-lg">{feature.title}</CardTitle>
                    </div>
                    <Badge variant="secondary">{feature.badge}</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}