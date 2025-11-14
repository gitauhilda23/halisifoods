// client/src/pages/ProductDetail.tsx
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Star, ShoppingCart, Download, Heart, X } from "lucide-react";
import { useState, useEffect } from "react";
import { useParams } from "wouter";
import { toast } from "sonner";

interface Ebook {
  id: string;
  title: string;
  description?: string;
  price: number;
  coverUrl: string;
  pdfUrl?: string;
  category?: string;
  recipeCount?: number;
}

export default function ProductDetail() {
  const { id } = useParams();
  const [liveEbooks, setLiveEbooks] = useState<Ebook[]>([]);
  const [product, setProduct] = useState<Ebook | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Ebook[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

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
        setLiveEbooks(uploaded);
        const current = uploaded.find((p: Ebook) => p.id === id);
        setProduct(current || null);
        const related = uploaded.filter((p: Ebook) => p.id !== id).slice(0, 3);
        setRelatedProducts(related);
      }
    };
    loadEbooks();
    window.addEventListener("storage", loadEbooks);
    return () => window.removeEventListener("storage", loadEbooks);
  }, [id]);

  const handleAddToCart = () => {
    if (!product) return;
    const cart = JSON.parse(localStorage.getItem("cart") || "[]");
    if (cart.find((item: any) => item.id === product.id)) {
      toast.warning("Already in cart!");
      return;
    }
    cart.push({
      id: product.id,
      title: product.title,
      priceKES: product.price,
      image: product.coverUrl,
    });
    localStorage.setItem("cart", JSON.stringify(cart));
    window.dispatchEvent(new Event("cartUpdated"));
    toast.success(`${product.title} added to cart!`);
  };

  const handleBuyNow = () => {
    if (!product) return;
    setEmail("");
    setPhone("");
    setShowModal(true);
  };

  const processPayment = () => {
    if (!product) return;
    if (!email.includes("@")) return toast.error("Enter valid email");
    if (phone.length < 10) return toast.error("Enter valid M-PESA number");

    (window as any).payWithPaystack({
      email,
      phone,
      amount: product.price,
      recipeId: product.id,
      recipeName: product.title,
      metadata: { pdfUrl: product.pdfUrl },
      onSuccess: (url: string) => {
        if (url && url !== "#") {
          toast.success("Payment successful! Download starting...");
          window.open(url, "_blank");
        } else {
          toast.error("PDF not found. Contact support.");
        }
        setShowModal(false);
      },
      onClose: () => {
        setShowModal(false);
      }
    });
  };

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header cartItemCount={0} />
        <main className="flex-1 flex items-center justify-center">
          <p className="text-lg text-muted-foreground">Product not found.</p>
        </main>
        <Footer />
      </div>
    );
  }

  const ingredients = ["Wheat flour", "Coconut milk", "Sugar", "Cardamom", "Yeast", "Vegetable oil", "Tea leaves", "Milk"];

  return (
    <div className="min-h-screen flex flex-col">
      <Header cartItemCount={0} />
      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
            <div className="sticky top-24 self-start">
              <div className="aspect-[3/4] bg-muted rounded-md overflow-hidden">
                <img src={product.coverUrl} alt={product.title} className="w-full h-full object-cover" />
              </div>
            </div>
            <div>
              <Badge className="mb-4">{product.category}</Badge>
              <h1 className="font-heading text-4xl font-bold mb-4">{product.title}</h1>
              <div className="flex items-center gap-2 mb-6">
                <div className="flex gap-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className={`h-5 w-5 ${i < 4 ? 'fill-primary text-primary' : 'text-muted'}`} />
                  ))}
                </div>
                <span className="text-sm text-muted-foreground">4.8 (124 reviews)</span>
              </div>
              <div className="text-4xl font-heading font-bold text-primary mb-6">
                KSh {product.price.toLocaleString()}
              </div>
              <p className="text-muted-foreground mb-6 leading-relaxed">{product.description}</p>
              <div className="mb-6">
                <p className="font-semibold mb-2">What's Included:</p>
                <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                  <li>{product.recipeCount} detailed recipes</li>
                  <li>Step-by-step instructions with photos</li>
                  <li>Ingredient lists and substitutions</li>
                  <li>Cooking tips and techniques</li>
                  <li>Instant PDF download</li>
                </ul>
              </div>
              <div className="flex gap-3 mb-6">
                <Button size="lg" className="flex-1" onClick={handleAddToCart}>
                  <ShoppingCart className="h-5 w-5 mr-2" /> Add to Cart
                </Button>
                <Button size="lg" variant="outline" onClick={() => toast.info("Wishlist coming soon!")}>
                  <Heart className="h-5 w-5" />
                </Button>
              </div>
              <Button
                size="lg"
                className="w-full bg-green-600 hover:bg-green-700 text-white"
                onClick={handleBuyNow}
              >
                Buy Now — KSh {product.price.toLocaleString()}
              </Button>
              <div className="flex items-center gap-2 text-sm text-muted-foreground mt-4">
                <Download className="h-4 w-4" />
                <span>Instant digital download after purchase</span>
              </div>
            </div>
          </div>

          <Tabs defaultValue="details" className="mb-16">
            <TabsList className="w-full justify-start">
              <TabsTrigger value="details">Details</TabsTrigger>
              <TabsTrigger value="ingredients">Key Ingredients</TabsTrigger>
              <TabsTrigger value="reviews">Reviews</TabsTrigger>
            </TabsList>
            <TabsContent value="details" className="mt-6">
              <div className="prose max-w-none">
                <h3 className="font-heading text-xl font-semibold mb-4">About This Collection</h3>
                <p className="text-muted-foreground leading-relaxed">
                  This eBook brings you authentic Kenyan recipes, carefully curated and tested for home cooks.
                </p>
              </div>
            </TabsContent>
            <TabsContent value="ingredients" className="mt-6">
              <h3 className="font-heading text-xl font-semibold mb-4">Common Ingredients</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {ingredients.map((ingredient, index) => (
                  <Badge key={index} variant="secondary" className="justify-center py-2">
                    {ingredient}
                  </Badge>
                ))}
              </div>
            </TabsContent>
            <TabsContent value="reviews" className="mt-6">
              <div className="space-y-6">
                <div className="flex items-start gap-4 pb-6 border-b">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="font-semibold">Amina K.</span>
                      <div className="flex gap-1">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star key={i} className="h-4 w-4 fill-primary text-primary" />
                        ))}
                      </div>
                    </div>
                    <p className="text-muted-foreground">Absolutely love this! My mandazi turned out perfect.</p>
                    <p className="text-sm text-muted-foreground mt-2">October 15, 2025</p>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>

          {relatedProducts.length > 0 && (
            <section>
              <h2 className="font-heading text-3xl font-bold mb-8">You May Also Like</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {relatedProducts.map((p) => (
                  <ProductCard
                    key={p.id}
                    id={p.id}
                    title={p.title}
                    description={p.description || "Authentic Kenyan recipes"}
                    price={0}
                    priceKES={p.price}
                    image={p.coverUrl}
                    category={p.category}
                    recipeCount={p.recipeCount}
                    pdfUrl={p.pdfUrl}
                  />
                ))}
              </div>
            </section>
          )}
        </div>
      </main>
      <Footer />

      {/* PAYMENT MODAL */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 max-w-md w-full relative">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
            >
              <X className="w-5 h-5" />
            </button>
            <h3 className="text-xl font-bold mb-4">Complete Purchase</h3>
            <div className="space-y-4">
              <div>
                <Label>Email</Label>
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  autoFocus
                />
              </div>
              <div>
                <Label>M-PESA Number</Label>
                <Input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))}
                  placeholder="07xxxxxxxx"
                  maxLength={10}
                />
              </div>
              <div className="pt-4 space-y-2">
                <Button onClick={processPayment} className="w-full bg-green-600 hover:bg-green-700">
                  Pay KSh {product.price.toLocaleString()} via M-Pesa
                </Button>
                <Button variant="outline" onClick={() => setShowModal(false)} className="w-full">
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}