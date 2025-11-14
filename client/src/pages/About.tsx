// client/src/pages/About.tsx
import { Button } from "@/components/ui/button";

export default function About() {
  return (
    <>
      {/* Hero */}
      <section className="bg-gradient-to-b from-amber-50 to-white py-24">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h1 className="text-5xl md:text-6xl font-heading font-bold text-gray-900 mb-6">
            About Halisi Foods & Recipes
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            My Foods & Recipes brings you authentic Kenyan cuisine through comprehensive digital
            cookbooks. Discover traditional recipes and modern twists, all in one place.
          </p>
        </div>
      </section>

      {/* Our Story – full width, clean, beautiful */}
      <section className="py-20 bg-background">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-4xl font-heading font-semibold mb-8">Our Story</h2>
          <div className="text-lg text-muted-foreground space-y-6 leading-relaxed">
            <p>
              Born from a passion for preserving Kenya’s rich culinary heritage, Halisi Foods & Recipes
              started as a simple collection of family recipes and grew into the most complete digital
              cookbook platform for Kenyan cuisine.
            </p>
            <p>
              Every recipe is tested, photographed, and presented with the same love our grandmothers
              put into Sunday lunch. From nyama choma secrets to the perfect ugali ratio – we’ve got you.
            </p>
            <p>
              We’re here to keep the flavors of home alive, one delicious recipe at a time.
            </p>
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="bg-muted py-16">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <h3 className="text-2xl font-heading font-semibold mb-4">Stay in the Kitchen Loop</h3>
          <p className="text-muted-foreground mb-8">
            Get new recipes and cooking tips delivered to your inbox.
          </p>
          <form className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Your email"
              className="flex-1 px-4 py-3 rounded-lg border border-input bg-background"
            />
            <Button type="submit" className="bg-yellow-500 hover:bg-yellow-600 text-black font-medium">
              Subscribe
            </Button>
          </form>
          <p className="text-sm text-muted-foreground mt-4">
            We respect your privacy. Unsubscribe anytime.
          </p>
        </div>
      </section>
    </>
  );
}