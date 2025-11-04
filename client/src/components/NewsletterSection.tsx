import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Mail } from "lucide-react";
import { useState } from "react";

export default function NewsletterSection() {
  const [email, setEmail] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Newsletter signup:", email);
    setEmail("");
  };

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <Card className="bg-primary text-primary-foreground border-primary-border">
          <CardContent className="p-8 md:p-12">
            <div className="text-center mb-6">
              <Mail className="h-12 w-12 mx-auto mb-4" />
              <h2 className="font-heading text-3xl font-bold mb-3" data-testid="text-newsletter-title">
                Get Fresh Recipes Weekly
              </h2>
              <p className="text-primary-foreground/90 max-w-2xl mx-auto" data-testid="text-newsletter-subtitle">
                Join thousands of food lovers and receive new Kenyan recipes, cooking tips, and exclusive offers delivered to your inbox.
              </p>
            </div>
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <Input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-white text-foreground flex-1"
                required
                data-testid="input-newsletter-signup"
              />
              <Button
                type="submit"
                variant="secondary"
                size="lg"
                data-testid="button-newsletter-signup"
              >
                Subscribe
              </Button>
            </form>
            <p className="text-center text-sm text-primary-foreground/70 mt-4">
              We respect your privacy. Unsubscribe anytime.
            </p>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
