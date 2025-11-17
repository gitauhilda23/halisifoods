// client/src/pages/Home.tsx
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import HeroSection from "@/components/HeroSection";
import ProductCard from "@/components/ProductCard";
import CategoryCard from "@/components/CategoryCard";
import NewsletterSection from "@/components/NewsletterSection";
import { Button } from "@/components/ui/button";
import { ArrowRight, Download } from "lucide-react";
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

export default function Home() {
  const [liveEbooks, setLiveEbooks] = useState<Ebook[]>([]);

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

        {/* PREMIUM EBOOKS */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-6">
            {paidEbooks.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
                {featuredPaid.map((book) => (
                  <ProductCard
                    key={book.id}
                    id={book.id}
                    title={book.title}
                    priceKES={book.price}
                    image={book.coverUrl || ""}
                    category={book.category}
                    onAddToCart={() => handleAddToCart(book)}
                  />
                ))}
              </div>
            )}

            {paidEbooks.length > 8 && (
              <div className="text-center">
                <Button size="lg" asChild>
                  <Link href="/catalog">
                    View All {paidEbooks.length} eBooks <ArrowRight className="ml-2" />
                  </Link>
                </Button>
              </div>
            )}
          </div>
        </section>

        {/* BROWSE BY CATEGORY */}
        <section className="py-20 bg-muted">
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {categories.map((cat) => (
                <CategoryCard key={cat.slug} {...cat} />
              ))}
            </div>
          </div>
        </section>

        {/* FREE EBOOKS — NO HEADING, NO GREEN, SAME BUTTON STYLE */}
        {freeEbooks.length > 0 && (
          <section className="py-20 bg-white">
            <div className="max-w-7xl mx-auto px-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                {freeEbooks.map((book) => (
                  <div
                    key={book.id}
                    className="group bg-card rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border"
                  >
                    <div className="relative">
                      <img
                        src={book.coverUrl}
                        alt={book.title}
                        className="w-full h-80 object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute top-3 left-3 bg-amber-600 text-white px-4 py-1.5 rounded-full text-xs font-bold">
                        FREE
                      </div>
                    </div>

                    <div className="p-6">
                      <h3 className="font-bold text-lg mb-2 line-clamp-2">{book.title}</h3>
                      <p className="text-sm text-muted-foreground mb-6">{book.category}</p>

                      {/* SAME STYLE AS ADD TO CART — AMBER, SMALLER */}
                      <Button
                        className="w-full bg-amber-600 hover:bg-amber-700 text-white font-medium"
                        size="lg"
                        onClick={() => {
                          const link = document.createElement("a");
                          link.href = book.pdfUrl!;
                          link.download = `${book.title.replace(/[^a-z0-9]/gi, '_')}_Free.pdf`;
                          document.body.appendChild(link);
                          link.click();
                          document.body.removeChild(link);
                          toast.success(`"${book.title}" downloaded!`);
                        }}
                      >
                        <Download className="w-4 h-4 mr-2" />
                        Free Download
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
      <Footer />
    </div>
  );
}