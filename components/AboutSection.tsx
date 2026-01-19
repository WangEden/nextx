import { ImageWithFallback } from "@/components/figma/ImageWithFallback";
import elaina2 from "@/public/imgs/elaina2.jpg";

const stats = [
  { number: "10M+", label: "累积文章字数" },
  { number: "99.9%", label: "平均文章完读率" },
  { number: "150+", label: "累积文章数量" },
  { number: "24/7", label: "在线时段" }
];

export function AboutSection() {
  return (
    <section id="about" className="py-16 sm:py-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="lg:grid lg:grid-cols-2 lg:gap-16 lg:items-center">
          <div>
            <h2 className="text-3xl sm:text-4xl">
              Eden
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Eden，一名六边形战士
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
                "(由于还不知道该放什么内容，上面的数据都是假的..., haha)"
              </p>
              <div className="mt-4 flex items-center">
                <div className="flex-shrink-0">
                  <ImageWithFallback
                    src={elaina2.src}
                    alt="Customer testimonial"
                    className="h-10 w-10 rounded-full transform transition duration-500 ease-elastic hover:scale-110"
                  />
                </div>
                <div className="ml-4">
                  <div className="text-sm font-medium">Eden</div>
                  <div className="text-sm text-muted-foreground">Eden工作室</div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-12 lg:mt-0">
            <ImageWithFallback
              src={elaina2.src}
              alt="Team working together"
              className="w-full h-auto rounded-lg shadow-xl transform transition duration-500 ease-elastic hover:scale-105"
            />
          </div>
        </div>
      </div>
    </section>
  );
}