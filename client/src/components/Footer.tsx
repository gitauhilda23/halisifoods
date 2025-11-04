import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Facebook, Instagram, Twitter, Youtube } from "lucide-react";
import { SiVisa, SiMastercard, SiPaypal } from "react-icons/si";

export default function Footer() {
  return (
    <footer className="bg-card border-t mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          <div>
            <h3 className="font-heading font-semibold text-lg mb-4">About Us</h3>
            <p className="text-muted-foreground text-sm mb-4">
              My Foods & Recipes brings you authentic Kenyan cuisine through comprehensive digital cookbooks. Discover traditional recipes and modern twists.
            </p>
            <div className="font-heading text-lg font-bold text-primary">
              My Foods & Recipes
            </div>
          </div>

          <div>
            <h3 className="font-heading font-semibold text-lg mb-4">Quick Links</h3>
            <div className="flex flex-col gap-2">
              <Link href="/catalog">
                <Button variant="ghost" className="w-full justify-start px-0" data-testid="link-footer-shop">
                  Shop Recipes
                </Button>
              </Link>
              <Link href="/blog">
                <Button variant="ghost" className="w-full justify-start px-0" data-testid="link-footer-blog">
                  Blog
                </Button>
              </Link>
              <Link href="/about">
                <Button variant="ghost" className="w-full justify-start px-0" data-testid="link-footer-about">
                  About
                </Button>
              </Link>
              <Link href="/contact">
                <Button variant="ghost" className="w-full justify-start px-0" data-testid="link-footer-contact">
                  Contact
                </Button>
              </Link>
            </div>
          </div>

          <div>
            <h3 className="font-heading font-semibold text-lg mb-4">Support</h3>
            <div className="flex flex-col gap-2">
              <Link href="/faq">
                <Button variant="ghost" className="w-full justify-start px-0" data-testid="link-footer-faq">
                  FAQs
                </Button>
              </Link>
              <Link href="/shipping">
                <Button variant="ghost" className="w-full justify-start px-0" data-testid="link-footer-shipping">
                  Delivery Info
                </Button>
              </Link>
              <Link href="/returns">
                <Button variant="ghost" className="w-full justify-start px-0" data-testid="link-footer-returns">
                  Returns Policy
                </Button>
              </Link>
              <Link href="/privacy">
                <Button variant="ghost" className="w-full justify-start px-0" data-testid="link-footer-privacy">
                  Privacy Policy
                </Button>
              </Link>
            </div>
          </div>

          <div>
            <h3 className="font-heading font-semibold text-lg mb-4">Newsletter</h3>
            <p className="text-muted-foreground text-sm mb-4">
              Get new recipes and cooking tips delivered to your inbox.
            </p>
            <div className="flex gap-2 mb-4">
              <Input
                type="email"
                placeholder="Your email"
                data-testid="input-newsletter-email"
              />
              <Button variant="default" data-testid="button-newsletter-submit">
                Subscribe
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              We respect your privacy. Unsubscribe anytime.
            </p>
          </div>
        </div>

        <div className="border-t pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex gap-3">
            <Button size="icon" variant="ghost" data-testid="link-social-facebook">
              <Facebook className="h-5 w-5" />
            </Button>
            <Button size="icon" variant="ghost" data-testid="link-social-instagram">
              <Instagram className="h-5 w-5" />
            </Button>
            <Button size="icon" variant="ghost" data-testid="link-social-twitter">
              <Twitter className="h-5 w-5" />
            </Button>
            <Button size="icon" variant="ghost" data-testid="link-social-youtube">
              <Youtube className="h-5 w-5" />
            </Button>
          </div>

          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground">We accept:</span>
            <SiVisa className="h-8 w-8 text-muted-foreground" />
            <SiMastercard className="h-8 w-8 text-muted-foreground" />
            <SiPaypal className="h-8 w-8 text-muted-foreground" />
          </div>
        </div>

        <div className="text-center mt-6 text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} My Foods & Recipes. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
