import { ImageWithFallback } from "@/components/figma/ImageWithFallback";
import elaina2 from "@/public/imgs/elaina2.jpg";

const stats = [
  { number: "10M+", label: "Users worldwide" },
  { number: "99.9%", label: "Uptime guarantee" },
  { number: "150+", label: "Countries served" },
  { number: "24/7", label: "Expert support" }
];

export function AboutSection() {
  return (
    <section id="about" className="py-16 sm:py-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="lg:grid lg:grid-cols-2 lg:gap-16 lg:items-center">
          <div>
            <h2 className="text-3xl sm:text-4xl">
              Trusted by millions of users worldwide
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              We've been building exceptional digital experiences for over a decade. 
              Our platform powers some of the world's most innovative companies and helps 
              teams ship better products faster.
            </p>
            
            <div className="mt-8 grid grid-cols-2 gap-6">
              {stats.map((stat, index) => (
                <div key={index} className="text-center lg:text-left">
                  <div className="text-2xl font-bold text-primary">{stat.number}</div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </div>
              ))}
            </div>

            <div className="mt-8">
              <p className="text-muted-foreground">
                "This platform has transformed how we build and deploy our applications. 
                The developer experience is unmatched, and the performance gains are incredible."
              </p>
              <div className="mt-4 flex items-center">
                <div className="flex-shrink-0">
                  <ImageWithFallback
                    src={elaina2.src}
                    alt="Customer testimonial"
                    className="h-10 w-10 rounded-full"
                  />
                </div>
                <div className="ml-4">
                  <div className="text-sm font-medium">Alex Chen</div>
                  <div className="text-sm text-muted-foreground">CTO, TechCorp</div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-12 lg:mt-0">
            <ImageWithFallback
              src={elaina2.src}
              alt="Team working together"
              className="w-full h-auto rounded-lg shadow-xl"
            />
          </div>
        </div>
      </div>
    </section>
  );
}