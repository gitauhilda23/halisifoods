import Header from "@/components/Header";
import Footer from "@/components/Footer";
import HeroSection from "@/components/HeroSection";
import ProductCard from "@/components/ProductCard";
import CategoryCard from "@/components/CategoryCard";
import NewsletterSection from "@/components/NewsletterSection";
import { Button } from "@/components/ui/button";
import { ArrowRight, Download, Flame } from "lucide-react";
import { useState, useEffect } from "react";
import { Link } from "wouter";
import { toast, Toaster } from "sonner";
import categoryImage from "@assets/generated_images/Kenyan_ingredients_category_image_cff4edb2.png";

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

const fixedEbooks = ["Baby Meal Recipes eBook", "No Wheat No Sugar Recipes", "Herbal Tea Recipes"];
const kenyanNames = ["Mukami", "Judith", "Wandera", "Amina", "Otieno", "Fatuma", "Kevin", "Njoki", "Shiro", "Brian", "Zainab", "Mercy", "Victor", "Linet", "Hassan", "Grace", "Dennis", "Faith", "Pauline", "Kelvin", "Naomi", "Abdi", "Winnie", "Juma", "Esther", "Moses", "Gladys", "Ibrahim", "Caroline", "Samuel", "Peris", "Caren", "Wanjiku", "Kamau", "Anyango", "Chebet", "Kipchoge", "Wangari", "Ochieng"];
const timeVariations = ["just now", "1 minute ago", "2 minutes ago", "3 minutes ago", "4 minutes ago", "5 minutes ago", "6 minutes ago", "7 minutes ago", "8 minutes ago", "9 minutes ago", "10 minutes ago", "12 minutes ago", "15 minutes ago"];

export default function Home() {
  const [liveEbooks, setLiveEbooks] = useState<Ebook[]>([]);
  const [currentSale, setCurrentSale] = useState({ name: "Mukami", ebook: "Baby Meal Recipes eBook", time: "3 minutes ago" });
  const [showPopup, setShowPopup] = useState(false);
  const [showHeroAlert, setShowHeroAlert] = useState(true);

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

  useEffect(() => {
    const trigger = () => {
      const randomName = kenyanNames[Math.floor(Math.random() * kenyanNames.length)];
      const randomEbook = fixedEbooks[Math.floor(Math.random() * fixedEbooks.length)];
      const randomTime = timeVariations[Math.floor(Math.random() * timeVariations.length)];
      setCurrentSale({ name: randomName, ebook: randomEbook, time: randomTime });
      setShowPopup(true);
      setTimeout(() => setShowPopup(false), 5500);
    };
    const interval = setInterval(trigger, 12000);
    setTimeout(trigger, 7000);
    return () => clearInterval(interval);
  }, []);

  const bestSellers = liveEbooks.filter(b => b.isBestSeller && !b.isFreeEbook);
  const freeEbooks = liveEbooks.filter(b => b.isFreeEbook);
  const regularPaid = liveEbooks.filter(b => !b.isBestSeller && !b.isFreeEbook);

  const handleAddToCart = (ebook: Ebook) => {
    const cart = JSON.parse(localStorage.getItem("cart") || "[]");
    if (cart.some((i: any) => i.id === ebook.id)) {
      toast.warning("Already in cart!");
      return;
    }
    cart.push({ id: ebook.id, title: ebook.title, priceKES: ebook.price, image: ebook.coverUrl });
    localStorage.setItem("cart", JSON.stringify(cart));
    window.dispatchEventListener(new Event("cartUpdated"));
    toast.success(`${ebook.title} added to cart!`);
  };

  const handleFreeDownload = (ebook: Ebook) => {
    if (!ebook.pdfUrl) return;
    const link = document.createElement("a");
    link.href = ebook.pdfUrl;
    link.download = `${ebook.title}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success(`"${ebook.title}" downloaded!`);
  };

  const categories = [
    { name: "Kenyan Recipes", image: categoryImage, ebookCount: liveEbooks.filter(b => b.category === "Kenyan Recipes").length || 15, slug: "traditional" },
    { name: "Baby Meal Recipes", image: categoryImage, ebookCount: liveEbooks.filter(b => b.category === "Baby Meal Recipes").length || 8, slug: "fusion" },
    { name: "Healthy Recipes", image: categoryImage, ebookCount: liveEbooks.filter(b => b.category === "Quick and Easy").length || 12, slug: "quick" },
  ];

  return (
    <div className="min-h-screen flex flex-col relative">
      <Header cartItemCount={0} />

      <main className="flex-1">
        <HeroSection showNewBookAlert={showHeroAlert} onCloseAlert={() => setShowHeroAlert(false)} />
        <Toaster position="top-center" richColors />

        {/* PREMIUM EBOOKS - SAME SIZE AS FREE */}
        {regularPaid.length > 0 && (
          <section className="py-16 bg-white">
            <div className="max-w-7xl mx-auto px-6">
            
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
                {regularPaid.map((book) => (
                  <div key={book.id} className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-200">
                    <img src={book.coverUrl || ""} alt={book.title} className="w-full h-56 object-cover" />
                    <div className="p-4">
                      <h3 className="font-bold text-base line-clamp-2 mb-3">{book.title}</h3>
                      <Button 
                        className="w-full text-sm bg-amber-600 hover:bg-amber-700" 
                        size="sm" 
                        onClick={() => handleAddToCart(book)}
                      >
                        KSh {book.price} – Add to Cart
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* CATEGORIES */}
        <section className="py-16 bg-muted">
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {categories.map((cat) => (
                <CategoryCard key={cat.slug} {...cat} />
              ))}
            </div>
          </div>
        </section>

        {/* BEST SELLERS - SAME SIZE AS FREE */}
        {bestSellers.length > 0 && (
          <section className="py-16 bg-orange-50">
            <div className="max-w-7xl mx-auto px-6">
              <h2 className="text-2xl font-bold text-center mb-8 text-orange-800 flex items-center justify-center gap-2">
                <Flame className="w-7 h-7 text-orange-600" />
               
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
                {bestSellers.map((book) => (
                  <div key={book.id} className="bg-white rounded-xl shadow-md overflow-hidden border border-orange-200">
                    <img src={book.coverUrl || ""} alt={book.title} className="w-full h-56 object-cover" />
                    <div className="p-4">
                      <h3 className="font-bold text-base line-clamp-2 mb-3">{book.title}</h3>
                      <Button 
                        className="w-full text-sm bg-amber-600 hover:bg-amber-700" 
                        size="sm" 
                        onClick={() => handleAddToCart(book)}
                      >
                        KSh {book.price} – Add to Cart
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* FREE EBOOKS - REFERENCE SIZE */}
        {freeEbooks.length > 0 && (
          <section className="py-16 bg-amber-50">
            <div className="max-w-7xl mx-auto px-6">
              <h2 className="text-2xl font-bold text-center mb-8">
              
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
                {freeEbooks.map((book) => (
                  <div key={book.id} className="bg-white rounded-xl shadow-md overflow-hidden border border-amber-200">
                    <img src={book.coverUrl} alt={book.title} className="w-full h-56 object-cover" />
                    <div className="p-4">
                      <h3 className="font-bold text-base line-clamp-2 mb-3">{book.title}</h3>
                      <Button className="w-full text-sm bg-green-600 hover:bg-green-700" size="sm" onClick={() => handleFreeDownload(book)}>
                        <Download className="w-4 h-4 mr-1" /> Free Download
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        <NewsletterSection />
      </main>

      {/* Floating WhatsApp */}
      <a
        href="https://wa.me/254740919839"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-50 w-16 h-16 bg-green-500 rounded-full shadow-2xl flex items-center justify-center hover:bg-green-600 hover:scale-110 transition-all duration-300"
      >
        <img src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg" alt="WhatsApp" className="w-10 h-10" />
      </a>

      {/* Fake Sales Popup */}
      {showPopup && (
        <div className="fixed bottom-24 left-6 z-40 animate-in slide-in-from-bottom fade-in duration-500">
          <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 p-4 flex items-center gap-4 max-w-xs">
            <div className="w-12 h-12 bg-gray-300 rounded-full border-2 border-dashed border-gray-400 flex-shrink-0" />
            <div className="leading-tight">
              <p className="text-sm font-bold text-gray-800">{currentSale.name} just bought</p>
              <p className="text-xs font-medium text-amber-600 truncate">{currentSale.ebook}</p>
              <p className="text-xs text-gray-500">{currentSale.time}</p>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}