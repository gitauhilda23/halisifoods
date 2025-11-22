// client/src/pages/Catalog.tsx
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Download, Flame, Sparkles } from "lucide-react";
import { useState, useEffect } from "react";
import { toast } from "sonner";

interface Ebook {
  id: string;
  title: string;
  price: number;
  coverUrl: string;
  pdfUrl?: string;
  description?: string;
  category?: string;
  recipeCount?: number;
  isFreeEbook?: boolean;
  isBestSeller?: boolean;
  isFlashSale?: boolean;
}

export default function Catalog() {
  const [priceRange, setPriceRange] = useState([0, 5000]);
  const [sortBy, setSortBy] = useState("popularity");
  const [ebooks, setEbooks] = useState<Ebook[]>([]);

  useEffect(() => {
    const loadEbooks = () => {
      const saved = localStorage.getItem("halisi-ebooks");
      if (saved) {
        const uploaded = JSON.parse(saved).map((book: any) => ({
          id: book.id,
          title: book.title,
          price: typeof book.price === "string" ? parseInt(book.price.replace(/[^0-9]/g, ""), 10) || 0 : book.price,
          coverUrl: book.coverUrl,
          pdfUrl: book.pdfUrl,
          description: book.description || `Authentic ${book.title} recipes`,
          category: book.category || "Uncategorized",
          recipeCount: book.recipeCount || 20,
          isFreeEbook: book.isFreeEbook === true,
          isBestSeller: book.isBestSeller === true,
          isFlashSale: book.isFlashSale === true,
        }));
        setEbooks(uploaded);
      }
    };
    loadEbooks();
    window.addEventListener("storage", loadEbooks);
    return () => window.removeEventListener("storage", loadEbooks);
  }, []);

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
      isFreeEbook: ebook.isFreeEbook,
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

  const filteredAndSorted = ebooks
    .filter((p) => p.price >= priceRange[0] && p.price <= priceRange[1])
    .sort((a, b) => {
      if (sortBy === "price-low") return a.price - b.price;
      if (sortBy === "price-high") return b.price - a.price;
      if (sortBy === "newest") return b.id.localeCompare(a.id);
      return 0;
    });

  const categories = Array.from(new Set(ebooks.map(p => p.category).filter(Boolean)));

  // REUSABLE CARD WITH TAGS — SAME AS HOMEPAGE
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
        <h3 className="font-bold text-lg line-clamp-2 mb-2 text-gray-800">{book.title}</h3>
        <p className="text-sm text-gray-600 mb-4">{book.recipeCount || 20} recipes included</p>

        {book.isFreeEbook ? (
          <Button
            className="w-full bg-green-600 hover:bg-green-700 text-white font-bold"
            onClick={() => handleFreeDownload(book)}
          >
            <Download className="w-5 h-5 mr-2" />
            Download Free
          </Button>
        ) : (
          <Button
            className="w-full bg-amber-600 hover:bg-amber-700 text-white font-bold"
            onClick={() => handleAddToCart(book)}
          >
            KSh {book.price} → Add to Cart
          </Button>
        )}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col">
      <Header cartItemCount={JSON.parse(localStorage.getItem("cart") || "[]").length} />
      <main className="flex-1">
        <div className="bg-muted py-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <h1 className="font-heading text-4xl font-bold mb-4">
              Recipe Collections
            </h1>
            <p className="text-muted-foreground text-lg">
              Browse our complete collection of authentic Kenyan recipe eBooks
            </p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Filters */}
            <aside className="lg:w-1/4">
              <div className="sticky top-24 space-y-6">
                <div>
                  <h3 className="font-heading font-semibold text-lg mb-4">Filters</h3>
                  <div className="space-y-6">
                    <div>
                      <Label className="font-semibold mb-3 block">Price Range (KES)</Label>
                      <Slider value={priceRange} onValueChange={setPriceRange} max={5000} step={100} className="mb-2" />
                      <div className="flex justify-between text-sm text-muted-foreground">
                        <span>KSh {priceRange[0].toLocaleString()}</span>
                        <span>KSh {priceRange[1].toLocaleString()}</span>
                      </div>
                    </div>

                    {categories.length > 0 && (
                      <div>
                        <Label className="font-semibold mb-3 block">Category</Label>
                        <div className="space-y-2">
                          {categories.map((category) => (
                            <div key={category} className="flex items-center gap-2">
                              <Checkbox id={category} />
                              <Label htmlFor={category} className="cursor-pointer font-normal">{category}</Label>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    <Button variant="outline" className="w-full" onClick={() => setPriceRange([0, 5000])}>
                      Clear Filters
                    </Button>
                  </div>
                </div>
              </div>
            </aside>

            {/* Products */}
            <div className="lg:w-3/4">
              <div className="flex justify-between items-center mb-6">
                <p className="text-muted-foreground">Showing {filteredAndSorted.length} results</p>
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="popularity">Most Popular</SelectItem>
                    <SelectItem value="price-low">Price: Low to High</SelectItem>
                    <SelectItem value="price-high">Price: High to Low</SelectItem>
                    <SelectItem value="newest">Newest First</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {filteredAndSorted.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                  {filteredAndSorted.map((book) => (
                    <EbookCard key={book.id} book={book} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-16">
                  <p className="text-lg text-muted-foreground">
                    No eBooks found. Upload your first eBook in Admin to see it here.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}