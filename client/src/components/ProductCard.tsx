// src/components/ProductCard.tsx
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ShoppingCart, Eye } from "lucide-react";
import { Link } from "wouter";
import { useState } from "react";
import PurchaseModal from "./PurchaseModal";

export interface ProductCardProps {
  id: number;
  title: string;
  description: string;
  price: number;
  image: string;
  category?: string;
  recipeCount?: number;
}

export default function ProductCard({
  id,
  title,
  description,
  price,
  image,
  category,
  recipeCount,
}: ProductCardProps) {
  const priceKES = Math.round(price * 82);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleAddToCart = () => {
    const cart = JSON.parse(localStorage.getItem("cart") || "[]");
    const exists = cart.find((item: any) => item.id === id);
    if (exists) {
      alert("Already in your cart");
      return;
    }
    cart.push({ id, title, priceKES, image });
    localStorage.setItem("cart", JSON.stringify(cart));
    window.dispatchEvent(new Event("cartUpdated"));
    alert(`${title} added to cart`);
  };

  const handleBuyNow = () => {
    setIsModalOpen(true);
  };

  // THIS IS THE ONLY CORRECT VERSION — USES YOUR WORKING window.payWithPaystack
  const handlePayment = ({ email, phone }: { email: string; phone: string }) => {
    window.payWithPaystack({
      email,
      phone,
      amount: priceKES,
      recipeId: id,
      recipeName: title,
      onSuccess: (downloadUrl: string) => {
        alert("Asante sana! Payment successful — download starting...");
        window.open(downloadUrl, "_blank");
      },
      onClose: () => {
        setIsModalOpen(false); // Just close modal silently — pure luxury
      }
    });
  };

  return (
    <>
      <Card className="group overflow-hidden border border-gray-200 rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300">
        <CardHeader className="p-0">
          <div className="relative aspect-[3/4] overflow-hidden bg-gray-50">
            <img
              src={image}
              alt={title}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            {category && (
              <Badge className="absolute top-3 left-3 bg-white/90 text-gray-700 border border-gray-300">
                {category}
              </Badge>
            )}
            <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
              <Link href={`/product/${id}`}>
                <Button size="sm" variant="secondary" className="bg-white/90 hover:bg-white">
                  <Eye className="h-4 w-4 mr-1" /> Quick View
                </Button>
              </Link>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-5">
          <Link href={`/product/${id}`}>
            <h3 className="font-medium text-lg text-gray-900 hover:text-gray-700 transition-colors line-clamp-2">
              {title}
            </h3>
          </Link>
          <p className="text-sm text-gray-600 mt-2 line-clamp-2">{description}</p>
          {recipeCount && (
            <p className="text-xs text-gray-500 mt-2">{recipeCount} recipes included</p>
          )}
          <div className="mt-4">
            <span className="text-2xl font-semibold text-gray-900">
              KSh {priceKES.toLocaleString()}
            </span>
          </div>
        </CardContent>

        <CardFooter className="p-5 pt-0 flex gap-3">
          <Button
            variant="outline"
            className="flex-1 border-gray-300 hover:border-gray-400"
            onClick={handleAddToCart}
          >
            <ShoppingCart className="h-4 w-4 mr-2" />
            Add to Cart
          </Button>
          <Button
            className="flex-1 bg-amber-600 hover:bg-amber-700 text-white font-medium"
            onClick={handleBuyNow}
          >
            Buy Now
          </Button>
        </CardFooter>
      </Card>

      <PurchaseModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handlePayment}
        packageName={title}
        price={priceKES}
      />
    </>
  );
}