// client/src/pages/Catalog.tsx
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { useState, useEffect } from "react";

interface Ebook {
  id: string;
  title: string;
  price: number;        // KES as number (e.g. 1299)
  coverUrl: string;
  pdfUrl?: string;
  description?: string;
  category?: string;
  recipeCount?: number;
}

export default function Catalog() {
  const [priceRange, setPriceRange] = useState([0, 5000]);
  const [sortBy, setSortBy] = useState("popularity");
  const [ebooks, setEbooks] = useState<Ebook[]>([]);

  // Load LIVE eBooks from Admin
  useEffect(() => {
    const loadEbooks = () => {
      const saved = localStorage.getItem("halisi-ebooks");
      if (saved) {
        const uploaded = JSON.parse(saved).map((book: any) => ({
          id: book.id,
          title: book.title,
          price: typeof book.price === "string"
            ? parseInt(book.price.replace(/[^0-9]/g, ""), 10) || 0
            : book.price,
          coverUrl: book.coverUrl,
          pdfUrl: book.pdfUrl,
          description: book.description || `Authentic ${book.title} recipes`,
          category: book.category || "Uncategorized",
          recipeCount: book.recipeCount || 20,
        }));
        setEbooks(uploaded);
      }
    };
    loadEbooks();
    window.addEventListener("storage", loadEbooks);
    return () => window.removeEventListener("storage", loadEbooks);
  }, []);

  // NO STATIC FALLBACKS — ONLY LIVE FROM ADMIN
  const allProducts = ebooks;

  // Apply filters & sort
  const filteredAndSorted = allProducts
    .filter((p) => p.price >= priceRange[0] && p.price <= priceRange[1])
    .sort((a, b) => {
      if (sortBy === "price-low") return a.price - b.price;
      if (sortBy === "price-high") return b.price - a.price;
      if (sortBy === "newest") return b.id.localeCompare(a.id);
      return 0;
    });

  const categories = Array.from(new Set(ebooks.map(p => p.category).filter(Boolean)));

  return (
    <div className="min-h-screen flex flex-col">
      <Header cartItemCount={2} />

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
                      <Slider
                        value={priceRange}
                        onValueChange={setPriceRange}
                        max={5000}
                        step={100}
                        className="mb-2"
                      />
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
                              <Label htmlFor={category} className="cursor-pointer font-normal">
                                {category}
                              </Label>
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
                <p className="text-muted-foreground">
                  Showing {filteredAndSorted.length} results
                </p>
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
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredAndSorted.map((product) => (
                    <ProductCard
                      key={product.id}
                      id={product.id}
                      title={product.title}
                      description={product.description || "Authentic Kenyan recipes"}
                      price={0} // Not used
                      priceKES={product.price}
                      image={product.coverUrl}
                      category={product.category}
                      recipeCount={product.recipeCount}
                      pdfUrl={product.pdfUrl}
                    />
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