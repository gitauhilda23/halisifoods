// client/src/pages/Cart.tsx
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { X, ShoppingCart, Sparkles, Gift, Flame } from "lucide-react";
import { useState, useEffect } from "react";
import { Link } from "wouter";
import { toast } from "sonner";

interface CartItem {
  id: string;
  title: string;
  priceKES: number;
  image: string;
  isFlashSale?: boolean;
  isBestSeller?: boolean;
  isFreeEbook?: boolean;
}

interface Discount {
  id: string;
  type: "percentage" | "fixed" | "bxgy";
  value: number;
  minBooks?: number;
  getFree?: number;
  appliesTo: "all" | string[];
  isActive: boolean;
}

export default function Cart() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [discounts, setDiscounts] = useState<Discount[]>([]);
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  useEffect(() => {
    const savedCart = localStorage.getItem("cart");
    if (savedCart) setCartItems(JSON.parse(savedCart));

    const savedDiscounts = localStorage.getItem("halisi-discounts");
    if (savedDiscounts) {
      const all = JSON.parse(savedDiscounts);
      setDiscounts(all.filter((d: Discount) => d.isActive));
    }

    const reloadCart = () => {
      const saved = localStorage.getItem("cart");
      if (saved) setCartItems(JSON.parse(saved));
    };
    window.addEventListener("cartUpdated", reloadCart);
    return () => window.removeEventListener("cartUpdated", reloadCart);
  }, []);

  const removeFromCart = (id: string) => {
    const updated = cartItems.filter(i => i.id !== id);
    localStorage.setItem("cart", JSON.stringify(updated));
    setCartItems(updated);
    window.dispatchEvent(new Event("cartUpdated"));
    toast.success("Removed from cart");
  };

  // AUTO-APPLY BEST DISCOUNT (still works silently)
  const getBestDiscount = () => {
    let bestSavings = 0;
    discounts.forEach(d => {
      if (!d.isActive) return;
      const eligibleItems = d.appliesTo === "all"
        ? cartItems
        : cartItems.filter(item => (d.appliesTo as string[]).includes(item.id));
      if (eligibleItems.length === 0) return;

      let savings = 0;
      if (d.type === "percentage") {
        savings = eligibleItems.reduce((s, i) => s + i.priceKES, 0) * (d.value / 100);
      } else if (d.type === "fixed") {
        savings = d.value;
      } else if (d.type === "bxgy" && cartItems.length >= (d.minBooks || 0)) {
        const sorted = [...eligibleItems].sort((a, b) => a.priceKES - b.priceKES);
        const free = sorted.slice(0, d.getFree || 1);
        savings = free.reduce((s, i) => s + i.priceKES, 0); // full free books
      }
      if (savings > bestSavings) bestSavings = savings;
    });
    return bestSavings;
  };

  const autoSavings = getBestDiscount();
  const subtotal = cartItems.reduce((s, i) => s + i.priceKES, 0);
  const finalTotal = Math.max(subtotal - autoSavings, 0);

  // ONLY SHOW BUY X GET Y BANNER
  const bxgy = discounts.find(d => d.isActive && d.type === "bxgy");
  const needed = bxgy ? bxgy.minBooks! - cartItems.length : 0;

  const handleCheckout = () => {
    if (!email.includes("@")) return toast.error("Enter valid email");
    if (phone.length < 10) return toast.error("Enter valid M-PESA number");

    (window as any).payWithPaystack({
      key: 'pk_live_b1bc14d3250387de5175b9ebb291d9101904c741',
      email,
      amount: finalTotal * 1,
      currency: "KES",
      ref: 'HALISI_' + Date.now(),
      channels: ['mobile_money'],
      callback: () => {
        toast.success("Payment successful! Downloading your eBooks...");
        cartItems.forEach(item => {
          const ebooks = JSON.parse(localStorage.getItem("halisi-ebooks") || "[]");
          const ebook = ebooks.find((e: any) => e.id === item.id);
          if (ebook?.pdfUrl) {
            const a = document.createElement("a");
            a.href = ebook.pdfUrl;
            a.download = `${ebook.title}.pdf`;
            a.click();
          }
        });
        localStorage.removeItem("cart");
        setCartItems([]);
        window.dispatchEvent(new Event("cartUpdated"));
      },
      onClose: () => toast.info("Payment cancelled")
    });
  };

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header cartItemCount={0} />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <ShoppingCart className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <p className="text-lg">Your cart is empty</p>
            <Button asChild className="mt-4"><Link href="/">Shop Now</Link></Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header cartItemCount={cartItems.length} />
      <main className="flex-1 py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">Your Cart ({cartItems.length} items)</h1>

          {/* ONLY BUY X GET Y BANNER — NOTHING ELSE */}
          {bxgy && (
            <div className="mb-6 p-5 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl text-center font-bold text-lg flex items-center justify-center gap-3">
              <Sparkles className="w-6 h-6" />
              {needed > 0
                ? `Add ${needed} more book${needed > 1 ? "s" : ""} → Get ${bxgy.getFree} FREE!`
                : `Congratulations! You get ${bxgy.getFree} book${bxgy.getFree! > 1 ? "s" : ""} FREE!`
              }
              <Gift className="w-6 h-6" />
            </div>
          )}

          {/* Cart Items with tags */}
          <div className="space-y-4 mb-8">
            {cartItems.map(item => (
              <div key={item.id} className="flex items-center gap-4 p-4 border rounded-lg bg-card">
                <img src={item.image} alt={item.title} className="w-16 h-16 object-cover rounded" />
                <div className="flex-1">
                  <h3 className="font-medium">{item.title}</h3>
                  <div className="flex gap-2 mt-2">
                    {item.isFlashSale && <span className="text-xs bg-red-600 text-white px-3 py-1 rounded-full font-bold">50% OFF</span>}
                    {item.isBestSeller && <span className="text-xs bg-orange-600 text-white px-3 py-1 rounded-full font-bold flex items-center gap-1"><Flame className="w-3 h-3" /> BEST SELLER</span>}
                    {item.isFreeEbook && <span className="text-xs bg-green-600 text-white px-3 py-1 rounded-full font-bold">FREE GIFT</span>}
                  </div>
                </div>
                <p className="font-bold text-lg">KSh {item.priceKES.toLocaleString()}</p>
                <Button size="sm" variant="ghost" onClick={() => removeFromCart(item.id)}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>

          {/* Pricing */}
          <div className="border-t pt-6 space-y-3 text-lg">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>KSh {subtotal.toLocaleString()}</span>
            </div>
            {autoSavings > 0 && (
              <div className="flex justify-between text-green-600 font-bold text-xl">
                <span>Special Offer Applied!</span>
                <span>- KSh {autoSavings.toFixed(0)}</span>
              </div>
            )}
            <div className="flex justify-between text-3xl font-bold pt-6 border-t">
              <span>Total</span>
              <span className="text-green-600">KSh {finalTotal.toLocaleString()}</span>
            </div>
          </div>

          {/* Checkout */}
          <div className="mt-10 space-y-4">
            <div><Label>Email</Label><Input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="mama@example.com" /></div>
            <div><Label>M-PESA Number</Label><Input type="tel" value={phone} onChange={e => setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))} placeholder="07xxxxxxxx" maxLength={10} /></div>
          </div>

          <Button onClick={handleCheckout} className="w-full mt-8 bg-green-600 hover:bg-green-700 text-white text-2xl h-16" size="lg">
            Pay KSh {finalTotal.toLocaleString()} & Download Instantly
          </Button>

          <div className="text-center mt-6">
            <Button variant="ghost" asChild><Link href="/">Continue Shopping</Link></Button>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}