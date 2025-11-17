import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Facebook, Instagram, Twitter, Globe } from "lucide-react";  // Removed Smartphone
import { SiVisa, SiMastercard, SiPaypal } from "react-icons/si";

export default function Footer() {
  return (
    <footer className="bg-card border-t mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

        {/* ─────── All your columns stay exactly the same ─────── */}
        {/* (About Us, Quick Links, Support, Newsletter – unchanged) */}
        {/* ... your existing grid code ... */}

        <div className="border-t pt-8 flex flex-col md:flex-row justify-between items-center gap-6">

          {/* SOCIAL ICONS – YouTube replaced with Google Business */}
          <div className="flex gap-4">
            <Button size="icon" variant="ghost" asChild>
              <a href="https://facebook.com/halisi" target="_blank" rel="noopener noreferrer">
                <Facebook className="h-5 w-5" />
              </a>
            </Button>
            <Button size="icon" variant="ghost" asChild>
              <a href="https://instagram.com/halisi" target="_blank" rel="noopener noreferrer">
                <Instagram className="h-5 w-5" />
              </a>
            </Button>
            <Button size="icon" variant="ghost" asChild>
              <a href="https://twitter.com/halisi" target="_blank" rel="noopener noreferrer">
                <Twitter className="h-5 w-5" />
              </a>
            </Button>

            {/* Google Business (replaces YouTube) */}
            <Button size="icon" variant="ghost" asChild>
              <a href="https://g.page/halisi-foods" target="_blank" rel="noopener noreferrer">
                <Globe className="h-5 w-5" />
              </a>
            </Button>
          </div>

          {/* PAYMENT METHODS – ONLY THE WORD "M-PESA" (no icon, no phone) */}
          <div className="flex items-center gap-5">
            <span className="text-sm text-muted-foreground">We accept:</span>
            <SiVisa className="h-8 w-8 text-muted-foreground" />
            <SiMastercard className="h-8 w-8 text-muted-foreground" />
            <SiPaypal className="h-8 w-8 text-muted-foreground" />
            
            {/* M-PESA – WORD ONLY, BOLD, GREEN, PERFECT SIZE */}
            <span className="font-bold text-grey-600 text-lg tracking-wider">
              M-PESA
            </span>
          </div>
        </div>

        <div className="text-center mt-6 text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} Halisi foods & Recipes. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}