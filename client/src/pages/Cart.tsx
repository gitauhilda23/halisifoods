// client/src/pages/Cart.tsx
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { X, ShoppingCart } from "lucide-react";
import { useState, useEffect } from "react";
import { Link } from "wouter";
import { toast } from "sonner";

interface CartItem {
  id: string;
  title: string;
  priceKES: number;
  image: string;
}

export default function Cart() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  useEffect(() => {
    const loadCart = () => {
      const saved = localStorage.getItem("cart");
      if (saved) {
        setCartItems(JSON.parse(saved));
      }
    };
    loadCart();
    window.addEventListener("cartUpdated", loadCart);
    return () => window.removeEventListener("cartUpdated", loadCart);
  }, []);

  const removeFromCart = (id: string) => {
    const updated = cartItems.filter(item => item.id !== id);
    localStorage.setItem("cart", JSON.stringify(updated));
    setCartItems(updated);
    window.dispatchEvent(new Event("cartUpdated"));
    toast.success("Removed from cart");
  };

  const baseTotal = cartItems.reduce((sum, item) => sum + item.priceKES, 0);
  const discount = cartItems.length >= 3 ? 400 : cartItems.length >= 2 ? 100 : 0;
  const finalTotal = Math.max(baseTotal - discount, 0);

  const handleCheckout = () => {
    if (cartItems.length === 0) return toast.error("Cart is empty");
    if (!email.includes("@")) return toast.error("Enter valid email");
    if (phone.length < 10) return toast.error("Enter valid M-PESA number");

    const items = cartItems.map(item => ({
      recipeId: item.id,
      recipeName: item.title,
      amount: item.priceKES, // ← KES (as in admin)
    }));

    (window as any).payWithPaystackCart({
      email,
      phone,
      items,
      onSuccess: () => {
        toast.success(`Paid KSh ${finalTotal.toLocaleString()}! Downloading...`);
        cartItems.forEach(item => {
          const saved = localStorage.getItem("halisi-ebooks");
          if (saved) {
            const ebooks = JSON.parse(saved);
            const ebook = ebooks.find((e: any) => e.id === item.id);
            if (ebook?.pdfUrl) {
              window.open(ebook.pdfUrl, "_blank");
            }
          }
        });
        localStorage.removeItem("cart");
        setCartItems([]);
        window.dispatchEvent(new Event("cartUpdated"));
      },
      onClose: () => {
        toast.info("Payment cancelled");
      }
    });
  };

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header cartItemCount={0} />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <ShoppingCart className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <p className="text-lg text-muted-foreground">Your cart is empty</p>
            <Button asChild className="mt-4">
              <Link href="/">Continue Shopping</Link>
            </Button>
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
          <h1 className="text-3xl font-bold mb-8">Your Cart</h1>

          <div className="space-y-4 mb-8">
            {cartItems.map(item => (
              <div key={item.id} className="flex items-center gap-4 p-4 border rounded-lg">
                <img src={item.image} alt={item.title} className="w-16 h-16 object-cover rounded" />
                <div className="flex-1">
                  <h3 className="font-medium">{item.title}</h3>
                  <p className="text-sm text-muted-foreground">Digital download</p>
                </div>
                <p className="font-semibold">KSh {item.priceKES.toLocaleString()}</p>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => removeFromCart(item.id)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>

          <div className="border-t pt-6 space-y-4">
            <div className="flex justify-between text-lg">
              <span>Subtotal</span>
              <span>KSh {baseTotal.toLocaleString()}</span>
            </div>
            {discount > 0 && (
              <div className="flex justify-between text-green-600">
                <span>Discount ({cartItems.length}+ items)</span>
                <span>- KSh {discount.toLocaleString()}</span>
              </div>
            )}
            <div className="flex justify-between text-xl font-bold">
              <span>Total</span>
              <span>KSh {finalTotal.toLocaleString()}</span>
            </div>
          </div>

          <div className="mt-8 space-y-4">
            <div>
              <Label>Email</Label>
              <Input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="you@example.com"
              />
            </div>
            <div>
              <Label>M-PESA Number</Label>
              <Input
                type="tel"
                value={phone}
                onChange={e => setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))}
                placeholder="07xxxxxxxx"
                maxLength={10}
              />
            </div>
          </div>

          <Button
            onClick={handleCheckout}
            className="w-full mt-6 bg-green-600 hover:bg-green-700 text-white"
            size="lg"
          >
            Pay KSh {finalTotal.toLocaleString()} via M-Pesa
          </Button>

          <div className="text-center mt-4">
            <Button variant="link" asChild>
              <Link href="/">Continue Shopping</Link>
            </Button>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
