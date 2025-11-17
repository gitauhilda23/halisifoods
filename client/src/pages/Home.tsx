import Header from "@/components/Header";
import Footer from "@/components/Footer";
import HeroSection from "@/components/HeroSection";
import ProductCard from "@/components/ProductCard";
import CategoryCard from "@/components/CategoryCard";
import NewsletterSection from "@/components/NewsletterSection";
import BlogCard from "@/components/BlogCard";
import { Button } from "@/components/ui/button";
import { ArrowRight, Download } from "lucide-react";
import { useState, useEffect } from "react";
import { Link } from "wouter";
import { toast, Toaster } from "sonner";
import categoryImage from "@assets/generated_images/Kenyan_ingredients_category_image_cff4edb2.png";
import blogImage from "@assets/generated_images/Traditional_cooking_blog_image_a3fe7a34.png";

interface Ebook {
  id: string;
  title: string;
  price: number;
  coverUrl?: string;
  pdfUrl?: string;
  category?: string;
  isFreeEbook?: boolean;
  isBestSeller?: boolean;
}

// Only these 3 eBooks will ever appear
const fixedEbooks = [
  "Baby Meal Recipes eBook",
  "No Wheat No Sugar Recipes",
  "Herbal Tea Recipes"
];

const kenyanNames = [
  "Mukami", "Judith", "Wandera", "Amina", "Otieno", "Fatuma", "Kevin", "Njoki",
  "Shiro", "Brian", "Zainab", "Mercy", "Victor", "Linet", "Hassan", "Grace",
  "Dennis", "Faith", "Pauline", "Kelvin", "Naomi", "Abdi", "Winnie", "Juma",
  "Esther", "Moses", "Gladys", "Ibrahim", "Caroline", "Samuel", "Peris", "Caren",
  "Wanjiku", "Kamau", "Anyango", "Chebet", "Kipchoge", "Wangari", "Ochieng"
];

const timeVariations = [
  "just now", "1 minute ago", "2 minutes ago", "3 minutes ago", "4 minutes ago",
  "5 minutes ago", "6 minutes ago", "7 minutes ago", "8 minutes ago", "9 minutes ago",
  "10 minutes ago", "12 minutes ago", "15 minutes ago"
];

export default function Home() {
  const [liveEbooks, setLiveEbooks] = useState<Ebook[]>([]);
  const [currentSale, setCurrentSale] = useState<{
    name: string;
    ebook: string;
    time: string;
  }>({
    name: "Mukami",
    ebook: "Baby Meal Recipes eBook",
    time: "3 minutes ago"
  });
  const [showPopup, setShowPopup] = useState(false);

  // Load ebooks
  useEffect(() => {
    const loadEbooks = () => {
      const saved = localStorage.getItem("halisi-ebooks");
      if (saved) {
        const parsed = JSON.parse(saved).map((book: any) => ({
          id: book.id,
          title: book.title,
          price: book.price || 0,
          coverUrl: book.coverUrl,
          pdfUrl: book.pdfUrl,
          category: book.category || "Uncategorized",
          isFreeEbook: book.isFreeEbook === true,
          isBestSeller: book.isBestSeller === true,
        }));
        setLiveEbooks(parsed);
      }
    };
    loadEbooks();
    window.addEventListener("storage", loadEbooks);
    return () => window.removeEventListener("storage", loadEbooks);
  }, []);

  // Fake sales popup – names change, eBooks stay the same 3
  useEffect(() => {
    const trigger = () => {
      const randomName = kenyanNames[Math.floor(Math.random() * kenyanNames.length)];
      const randomEbook = fixedEbooks[Math.floor(Math.random() * fixedEbooks.length)];
      const randomTime = timeVariations[Math.floor(Math.random() * timeVariations.length)];

      setCurrentSale({
        name: randomName,
        ebook: randomEbook,
        time: randomTime
      });
      setShowPopup(true);
      setTimeout(() => setShowPopup(false), 5500);
    };

    const interval = setInterval(trigger, 12000);
    setTimeout(trigger, 7000);

    return () => clearInterval(interval);
  }, []);

  const freeEbooks = liveEbooks.filter(book => book.isFreeEbook);
  const paidEbooks = liveEbooks.filter(book => !book.isFreeEbook);
  const featuredPaid = paidEbooks.slice(0, 8);

  const handleAddToCart = (ebook: Ebook) => {
    const cart = JSON.parse(localStorage.getItem("cart") || "[]");
    if (cart.some((item: any) => item.id === ebook.id)) {
      toast.warning("Already in cart!");
      return;
    }
    cart.push({ id: ebook.id, title: ebook.title, priceKES: ebook.price, image: ebook.coverUrl });
    localStorage.setItem("cart", JSON.stringify(cart));
    window.dispatchEvent(new Event("cartUpdated"));
    toast.success(`${ebook.title} added to cart!`);
  };

  const categories = [
    { name: "Kenyan Recipes", image: categoryImage, ebookCount: 15, slug: "traditional" },
    { name: "Baby Meal Recipes", image: categoryImage, ebookCount: 8, slug: "fusion" },
    { name: "Healthy Recipes", image: categoryImage, ebookCount: 12, slug: "quick" },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Header cartItemCount={0} />
      <main className="flex-1">
        <HeroSection />
        <Toaster position="top-center" richColors />

        {/* Your other sections (premium, free ebooks, blog, social proof, etc.) */}

        {/* BROWSE BY CATEGORY */}
        <section className="py-20 bg-muted relative">
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {categories.map((cat) => (
                <CategoryCard key={cat.slug} {...cat} />
              ))}
            </div>

            {/* WhatsApp icon + fake sales popup right next to it on the left */}
            <div className="flex items-end justify-end mt-8 gap-4">
              {/* Fake sales popup – appears left of WhatsApp */}
              {showPopup && (
                <div className="animate-in slide-in-from-bottom fade-in duration-400">
                  <div className="bg-white rounded-full shadow-2xl border border-gray-200 px-5 py-3 flex items-center gap-3 max-w-xs">
                    <div className="w-10 h-10 bg-gray-300 rounded-full border-2 border-dashed border-gray-400 flex-shrink-0" />
                    <div className="leading-tight">
                      <p className="text-sm font-bold text-gray-800">
                        {currentSale.name} just bought
                      </p>
                      <p className="text-xs font-medium text-amber-600 truncate max-w-40">
                        {currentSale.ebook}
                      </p>
                      <p className="text-xs text-gray-500">{currentSale.time}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* WhatsApp icon */}
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg"
                alt="Chat with us on WhatsApp"
                className="h-12 md:h-16 object-contain flex-shrink-0"
              />
            </div>
          </div>
        </section>

        {/* Rest of your sections */}
        <NewsletterSection />
      </main>
      <Footer />
    </div>
  );
}