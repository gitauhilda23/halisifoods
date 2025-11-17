import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import heroImage from "@assets/generated_images/Kenyan_cuisine_hero_background_a8cbd137.png";

export default function HeroSection() {
  return (
    <section className="relative h-[80vh] min-h-[500px] flex items-center justify-center overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${heroImage})` }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/50 to-black/60" />
      
      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6" data-testid="text-hero-title">
          Discover Authentic Kenyan Cuisine
        </h1>
        <p className="text-xl sm:text-2xl text-white/90 mb-8 max-w-2xl mx-auto" data-testid="text-hero-subtitle">
          Traditional recipes passed down through generations, now available as instant digital downloads
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/catalog">
            <Button size="lg" variant="default" className="text-lg" data-testid="button-hero-browse">
              Download ebook
            </Button>
          </Link>
          <Link href="/about">
            <Button
              size="lg"
              variant="outline"
              className="text-lg bg-white/10 backdrop-blur-sm border-white/30 text-white hover:bg-white/20"
              data-testid="button-hero-learn"
            >
              Learn More
            </Button>
          </Link>
        </div>
        <div className="mt-12 flex flex-wrap justify-center gap-8 text-white/80">
          <div className="text-center">
            <div className="text-3xl font-heading font-bold text-primary">200+</div>
            <div className="text-sm">Authentic Recipes</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-heading font-bold text-primary">50+</div>
            <div className="text-sm">Recipe Collections</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-heading font-bold text-primary">10K+</div>
            <div className="text-sm">Happy Customers</div>
          </div>
        </div>
      </div>
    </section>
  );
}
