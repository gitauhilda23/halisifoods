// src/pages/Cart.tsx
import { useState, useEffect } from 'react';
import { Link } from 'wouter';
import { Trash2 } from 'lucide-react';
import { Button } from "@/components/ui/button";

export default function Cart() {
  const [cart, setCart] = useState<any[]>([]);
  const user = JSON.parse(localStorage.getItem('user') || 'null');

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('cart') || '[]');
    setCart(saved);
  }, []);

  const removeFromCart = (id: number) => {
    const updated = cart.filter(item => item.id !== id);
    setCart(updated);
    localStorage.setItem('cart', JSON.stringify(updated));
    window.dispatchEvent(new Event('cartUpdated'));
  };

  // 100% NaN-PROOF TOTAL
  const totalKES = cart.reduce((sum, item) => sum + (Number(item.priceKES) || 0), 0);

  const checkout = () => {
    if (totalKES === 0) return alert("Your cart is empty!");

    const email = user?.email || prompt("Your email:") || "customer@gmail.com";
    const phone = prompt("M-Pesa phone (07xxxxxxxx):") || "0712345678";

    if (!email.includes("@") || phone.length < 10) {
      alert("Enter valid email & phone");
      return;
    }

    const items = cart.map(item => ({
      recipeId: item.id,
      recipeName: item.title,
      amount: Number(item.priceKES)
    }));

    (window as any).payWithPaystackCart({
      email,
      phone,
      items,
      onSuccess: (urls: string[]) => {
        alert(`PAID KSh ${totalKES.toLocaleString()}! ${urls.length} eBooks downloading...`);
        urls.forEach(url => window.open(url, '_blank'));
        localStorage.removeItem('cart');
        setCart([]);
        window.dispatchEvent(new Event('cartUpdated'));
      },
      onClose: () => alert("Payment cancelled")
    });
  };

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 pt-24 px-6">
        <div className="max-w-2xl mx-auto text-center">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">Your cart is empty</h1>
          <p className="text-gray-600 mb-8">Add some delicious recipe books!</p>
          <Link href="/">
            <Button className="bg-black hover:bg-gray-800 text-white px-12 py-6 text-lg">
              Continue Shopping
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-20 px-6">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-900 text-center mb-2">Your Cart</h1>
        {user && <p className="text-center text-gray-600 mb-10">Hi, {user.name} — your items are saved</p>}

        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          {cart.map((item, index) => (
            <div key={item.id} className={`flex items-center gap-6 p-6 ${index !== cart.length - 1 ? 'border-b border-gray-100' : ''}`}>
              <img src={item.image} alt={item.title} className="w-24 h-24 rounded-lg object-cover border border-gray-200" />
              
              <div className="flex-1">
                <h3 className="text-xl font-semibold text-gray-900">{item.title}</h3>
                <p className="text-sm text-gray-500 mt-1">Digital download • Instant access</p>
              </div>

              <div className="text-right">
                <p className="text-2xl font-bold text-gray-900">KSh {Number(item.priceKES).toLocaleString()}</p>
                <button
                  onClick={() => removeFromCart(item.id)}
                  className="text-red-600 hover:text-red-700 text-sm font-medium mt-2 flex items-center gap-1"
                >
                  <Trash2 className="w-4 h-4" /> Remove
                </button>
              </div>
            </div>
          ))}

          <div className="bg-gray-50 p-8 border-t border-gray-200">
            <div className="flex justify-between items-center mb-6">
              <span className="text-2xl font-bold text-gray-900">Total</span>
              <span className="text-3xl font-bold text-gray-900">KSh {totalKES.toLocaleString()}</span>
            </div>

            <Button 
              onClick={checkout}
              className="w-full bg-black hover:bg-gray-800 text-white py-7 text-xl font-semibold rounded-xl"
            >
              Pay KSh {totalKES.toLocaleString()} via M-Pesa
            </Button>

            <Link href="/" className="block mt-4">
              <Button variant="outline" className="w-full py-6 text-lg border-gray-300">
                ← Continue Shopping
              </Button>
            </Link>
          </div>
        </div>

        <p className="text-center text-sm text-gray-500 mt-8">
          Secure payment • Instant download • No hidden fees
        </p>
      </div>
    </div>
  );
}