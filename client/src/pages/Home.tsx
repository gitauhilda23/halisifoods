import Header from "@/components/Header";
import Footer from "@/components/Footer";
import HeroSection from "@/components/HeroSection";
import CategoryCard from "@/components/CategoryCard";
import NewsletterSection from "@/components/NewsletterSection";
import { Button } from "@/components/ui/button";
import { ArrowRight, Download, Flame, Sparkles } from "lucide-react";
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
  isFlashSale?: boolean;
}

const fixedEbooks = ["Baby Meal Recipes eBook", "No Wheat No Sugar Recipes", "Herbal Tea Recipes"];
const kenyanNames = ["Mukami", "Judith", "Wandera", "Amina", "Otieno", "Fatuma", "Kevin", "Njoki", "Shiro", "Brian", "Zainab", "Mercy", "Victor", "Linet", "Hassan", "Grace", "Dennis", "Faith", "Pauline", "Kelvin", "Naomi", "Abdi", "Winnie", "Juma", "Esther", "Moses", "Gladys", "Ibrahim", "Caroline", "Samuel", "Peris", "Caren", "Wanjiku", "Kamau", "Anyango", "Chebet", "Kipchoge", "Wangari", "Ochieng"];
const timeVariations = ["just now", "1 minute ago", "2 minutes ago", "3 minutes ago", "4 minutes ago", "5 minutes ago", "6 minutes ago", "7 minutes ago", "8 minutes ago", "9 minutes ago", "10 minutes ago", "12 minutes ago", "15 minutes ago"];

export default function Home() {
  const [liveEbooks, setLiveEbooks] = useState<Ebook[]>([]);
  const [currentSale, setCurrentSale] = useState({ name: "Mukami", ebook: "Baby Meal Recipes eBook", time: "3 minutes ago" });
  const [showPopup, setShowPopup] = useState(false);

  // ←←← FIXED LINE — this was the only bug
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
          isFlashSale: book.isFlashSale === true,
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
    cart.push({
      id: ebook.id,
      title: ebook.title,
      priceKES: ebook.price,
      image: ebook.coverUrl,
      isFlashSale: ebook.isFlashSale,
      isBestSeller: ebook.isBestSeller,
    });
    localStorage.setItem("cart", JSON.stringify(cart));
    window.dispatchEvent(new Event("cartUpdated"));
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
    { name: "Baby Meal Recipes", image: categoryImage, ebookCount: liveEbooks.filter(b => b.category === "Baby Meal Recipes").length || 8, slug: "baby" },
    { name: "Healthy & Quick", image: categoryImage, ebookCount: liveEbooks.filter(b => b.category === "Quick and Easy").length || 12, slug: "quick" },
  ];

  const EbookCard = ({ book }: { book: Ebook }) => (
    <div className="relative group bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100 hover:shadow-2xl transition-all duration-300">
      <div className="absolute top-3 left-3 z-10 flex flex-col gap-2">
        {book.isFlashSale && (
          <span className="bg-red-600 text-white px-3 py-1.5 rounded-full text-xs font-bold shadow-lg animate-pulse">
            50% OFF
          </span>
        )}
        {book.isBestSeller && (
          <span className="bg-orange-600 text-white px-3 py-1.5 rounded-full text-xs font-bold shadow-lg flex items-center gap-1">
            <Flame className="w-4 h-4" /> BEST SELLER
          </span>
        )}
        {book.isFreeEbook && (
          <span className="bg-green-600 text-white px-3 py-1.5 rounded-full text-xs font-bold shadow-lg flex items-center gap-1">
            <Sparkles className="w-4 h-4" /> FREE GIFT
          </span>
        )}
      </div>
      <img
        src={book.coverUrl || "/placeholder.jpg"}
        alt={book.title}
        className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-500"
      />
      <div className="p-5">
        <h3 className="font-bold text-lg line-clamp-2 mb-3 text-gray-800">{book.title}</h3>
        {book.isFreeEbook ? (
          <Button className="w-full bg-green-600 hover:bg-green-700 text-white font-bold" onClick={() => handleFreeDownload(book)}>
            <Download className="w-5 h-5 mr-2" />
            Download Free
          </Button>
        ) : (
          <Button className="w-full bg-amber-600 hover:bg-amber-700 text-white font-bold" onClick={() => handleAddToCart(book)}>
            KSh {book.price} → Add to Cart
          </Button>
        )}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col">
      <Header cartItemCount={0} />
      <main className="flex-1">
        <HeroSection showNewBookAlert={showHeroAlert} onCloseAlert={() => setShowHeroAlert(false)} />
        <Toaster position="top-center" richColors />

        {regularPaid.length > 0 && (
          <section className="py-16 bg-gray-50">
            <div className="max-w-7xl mx-auto px-6">
              
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-8">
                {regularPaid.map(book => <EbookCard key={book.id} book={book} />)}
              </div>
            </div>
          </section>
        )}

        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-6">
            <h2 className="text-4xl font-bold text-center mb-12 text-gray-800">Shop by Category</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
              {categories.map(cat => <CategoryCard key={cat.slug} {...cat} />)}
            </div>
          </div>
        </section>

        {bestSellers.length > 0 && (
          <section className="py-16 bg-orange-50">
            <div className="max-w-7xl mx-auto px-6">
              
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-8">
                {bestSellers.map(book => <EbookCard key={book.id} book={book} />)}
              </div>
            </div>
          </section>
        )}

        {freeEbooks.length > 0 && (
          <section className="py-20 bg-gradient-to-b from-amber-50 to-white">
            <div className="max-w-7xl mx-auto px-6 text-center">
              
             
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-8">
                {freeEbooks.map(book => <EbookCard key={book.id} book={book} />)}
              </div>
            </div>
          </section>
        )}

        <NewsletterSection />
      </main>

      <a href="https://wa.me/254740919839" target="_blank" rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-50 w-16 h-16 bg-green-500 rounded-full shadow-2xl flex items-center justify-center hover:scale-110 transition">
        <img src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg" alt="WhatsApp" className="w-10 h-10" />
      </a>

      {showPopup && (
        <div className="fixed bottom-24 left-6 z-40 animate-in slide-in-from-bottom">
          <div className="bg-white rounded-2xl shadow-2xl p-4 flex items-center gap-4 border">
            <div className="w-12 h-12 bg-gray-200 rounded-full border-2 border-dashed" />
            <div>
              <p className="font-bold">{currentSale.name} just bought</p>
              <p className="text-amber-600 font-bold text-sm truncate max-w-40">{currentSale.ebook}</p>
              <p className="text-xs text-gray-500">{currentSale.time}</p>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}