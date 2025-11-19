import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import heroImage from "@assets/generated_images/Kenyan_cuisine_hero_background_a8cbd137.png";
import { X } from "lucide-react";

interface HeroSectionProps {
  showNewBookAlert?: boolean;
  onCloseAlert?: () => void;
}

export default function HeroSection({
  showNewBookAlert = true,
  onCloseAlert = () => {},
}: HeroSectionProps) {
  return (
    <section className="relative h-[80vh] min-h-[500px] flex items-center justify-center overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${heroImage})` }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/50 to-black/60" />
     
      {/* SMALL & PERFECTLY FLOATING NEW BOOKS ALERT */}
      {showNewBookAlert && (
        <div className="fixed top-5 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 bg-red-600 text-white px-4 py-1.5 rounded-full shadow-lg text-xs font-semibold animate-pulse">
          <span className="w-2 h-2 bg-white rounded-full animate-ping"></span>
          NEW BOOKS ALERT →
          <button
            onClick={onCloseAlert}
            className="ml-2 hover:bg-white/20 rounded-full p-0.5 transition"
            aria-label="Close alert"
          >
            <X className="w-3 h-3" />
          </button>
        </div>
      )}

      {/* Rest of your hero content unchanged */}
      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* ... all your existing hero content ... */}
      </div>
    </section>
  );
}