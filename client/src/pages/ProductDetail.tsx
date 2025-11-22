// client/src/pages/ProductDetail.tsx
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Star, ShoppingCart, Download, Heart, X, Zap, Sparkles, Tag } from "lucide-react";
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
  isFreeEbook?: boolean;
  isBestSeller?: boolean;
  isFlashSale?: boolean;
  bundleDiscount?: number;
  megaBundleDiscount?: number;
}

interface Discount {
  id: string;
  code: string;
  type: "percentage" | "fixed" | "bxgy";
  value: number;
  minBooks?: number;
  getFree?: number;
  appliesTo: "all" | string[];
  requireLogin: boolean;
  isActive: boolean;
}

export default function ProductDetail() {
  const { id } = useParams();
  const [liveEbooks, setLiveEbooks] = useState<Ebook[]>([]);
  const [discounts, setDiscounts] = useState<Discount[]>([]);
  const [product, setProduct] = useState<Ebook | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Ebook[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  useEffect(() => {
    const loadData = () => {
      const savedEbooks = localStorage.getItem("halisi-ebooks");
      const savedDiscounts = localStorage.getItem("halisi-discounts");

      if (savedEbooks) {
        const uploaded = JSON.parse(savedEbooks).map((book: any) => ({
          id: book.id,
          title: book.title,
          price: typeof book.price === "string" ? parseInt(book.price.replace(/[^0-9]/g, ""), 10) || 0 : book.price,
          coverUrl: book.coverUrl,
          pdfUrl: book.pdfUrl,
          description: book.description || `Authentic ${book.title} recipes`,
          category: book.category || "Uncategorized",
          recipeCount: book.recipeCount || 20,
          isFreeEbook: book.isFreeEbook ?? false,
          isBestSeller: book.isBestSeller ?? false,
          isFlashSale: book.isFlashSale ?? false,
          bundleDiscount: book.bundleDiscount ?? 0,
          megaBundleDiscount: book.megaBundleDiscount ?? 0,
        }));
        setLiveEbooks(uploaded);
        const current = uploaded.find((p: Ebook) => p.id === id);
        setProduct(current || null);
        const related = uploaded.filter((p: Ebook) => p.id !== id).slice(0, 3);
        setRelatedProducts(related);
      }

      if (savedDiscounts) {
        setDiscounts(JSON.parse(savedDiscounts).filter((d: Discount) => d.isActive));
      }
    };

    loadData();
    window.addEventListener("storage", loadData);
    return () => window.removeEventListener("storage", loadData);
  }, [id]);

  const getFinalPrice = () => {
    if (!product) return 0;
    let final = product.price;
    if (product.isFlashSale) final = Math.round(final * 0.5);
    return final;
  };

  const handleAddToCart = () => {
    if (!product) return;

    const cart = JSON.parse(localStorage.getItem("cart") || "[]");
    if (cart.find((item: any) => item.id === product.id)) {
      toast.warning("Already in cart!");
      return;
    }

    const finalPrice = getFinalPrice();

    cart.push({
      id: product.id,
      title: product.title,
      priceKES: finalPrice, // ← THIS IS CRITICAL: store discounted price
      image: product.coverUrl,
      isFlashSale: product.isFlashSale,
      bundleDiscount: product.bundleDiscount ?? 0,
      megaBundleDiscount: product.megaBundleDiscount ?? 0,
    });

    localStorage.setItem("cart", JSON.stringify(cart));
    window.dispatchEvent(new Event("cartUpdated"));
    toast.success(`${product.title} added to cart!`);
  };

  const handleBuyNow = () => {
    if (!product) return;
    handleAddToCart(); // Add to cart first
    setEmail("");
    setPhone("");
    setShowModal(true);
  };

  const processPayment = () => {
    if (!product) return;
    if (!email.includes("@")) return toast.error("Enter valid email");
    if (phone.length < 10) return toast.error("Enter valid M-PESA number");

    const finalPrice = getFinalPrice();

    (window as any).payWithPaystack({
      key: 'pk_live_b1bc14d3250387de5175b9ebb291d9101904c741',
      email: email,
      amount: finalPrice * 1, // ← Paystack needs cents
      currency: "KES",
      ref: 'HALISI_' + Date.now(),
      channels: ['mobile_money', 'card'],
      metadata: {
        custom_fields: [{
          display_name: "Payment Method",
          variable_name: "payment_method",
          value: "mobile_money"
        }]
      },
      callback: function(response: any) {
        toast.success("Payment successful! Download starting...");
        if (product.pdfUrl) {
          const link = document.createElement("a");
          link.href = product.pdfUrl;
          link.download = `${product.title}.pdf`;
          link.click();
        }
        setShowModal(false);
      },
      onClose: () => {
        toast.info("Payment cancelled");
        setShowModal(false);
      }
    });
  };

  // Find active discounts that apply to this product
  const eligibleDiscounts = discounts.filter(d => 
    d.isActive && 
    (d.appliesTo === "all" || d.appliesTo.includes(id!))
  );

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
              <div className="aspect-[3/4] bg-muted rounded-md overflow-hidden relative">
                <img src={product.coverUrl} alt={product.title} className="w-full h-full object-cover" />
                
                {/* DISCOUNT BADGES */}
                {product.isFlashSale && (
                  <div className="absolute top-4 left-4 bg-red-600 text-white px-4 py-2 rounded-full font-bold text-sm shadow-lg animate-pulse">
                    <Zap className="w-5 h-5 inline mr-1" /> 50% OFF FLASH SALE
                  </div>
                )}
                {(product.bundleDiscount ?? 0) > 0 && (
                  <div className="absolute top-14 left-4 bg-purple-600 text-white px-4 py-2 rounded-full font-bold text-sm shadow-lg">
                    <Sparkles className="w-5 h-5 inline mr-1" /> Buy 2+ save {product.bundleDiscount}%
                  </div>
                )}
                {(product.megaBundleDiscount ?? 0) > 0 && (
                  <div className="absolute top-24 left-4 bg-yellow-600 text-white px-4 py-2 rounded-full font-bold text-sm shadow-lg">
                    Buy 3+ save KSh {product.megaBundleDiscount}
                  </div>
                )}
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

              {/* PRICE WITH DISCOUNT */}
              <div className="mb-6">
                {product.isFlashSale ? (
                  <div>
                    <span className="text-2xl line-through text-muted-foreground">KSh {product.price.toLocaleString()}</span>
                    <span className="text-5xl font-bold text-red-600 ml-4">
                      KSh {getFinalPrice().toLocaleString()}
                    </span>
                    <p className="text-green-600 font-bold mt-2">50% OFF — Limited Time!</p>
                  </div>
                ) : (
                  <div className="text-5xl font-bold text-primary">
                    KSh {product.price.toLocaleString()}
                  </div>
                )}
              </div>

              {/* ELIGIBLE DISCOUNT CODES */}
              {eligibleDiscounts.length > 0 && (
                <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-lg">
                  <p className="font-semibold text-amber-900 flex items-center gap-2 mb-2">
                    <Tag className="w-5 h-5" /> Eligible Discount Codes
                  </p>
                  <div className="space-y-2">
                    {eligibleDiscounts.map(d => (
                      <div key={d.id} className="flex items-center justify-between bg-white px-4 py-2 rounded-md border">
                        <code className="font-bold text-amber-700">{d.code}</code>
                        <span className="text-sm">
                          {d.type === "bxgy" 
                            ? `Buy ${d.minBooks} Get ${d.getFree} ${d.value === 100 ? "FREE" : `${d.value}% off`}`
                            : d.type === "percentage" ? `${d.value}% off` : `KSh ${d.value} off`}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

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
                Buy Now — KSh {getFinalPrice().toLocaleString()}
              </Button>

              <div className="flex items-center gap-2 text-sm text-muted-foreground mt-4">
                <Download className="h-4 w-4" />
                <span>Instant digital download after purchase</span>
              </div>
            </div>
          </div>

          {/* Tabs & Related Products (unchanged) */}
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

      {/* PAYMENT MODAL */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 max-w-md w-full relative">
            <button onClick={() => setShowModal(false)} className="absolute top-4 right-4 text-gray-500 hover:text-gray-700">
              <X className="w-5 h-5" />
            </button>
            <h3 className="text-xl font-bold mb-4">Complete Purchase</h3>
            <div className="space-y-4">
              <div>
                <Label>Email</Label>
                <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" autoFocus />
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
                  Pay KSh {getFinalPrice().toLocaleString()} via M-Pesa & More
                </Button>
                <Button variant="outline" onClick={() => setShowModal(false)} className="w-full">
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}