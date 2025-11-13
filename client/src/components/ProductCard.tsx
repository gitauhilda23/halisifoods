import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ShoppingCart, Eye } from "lucide-react";
import { Link } from "wouter";

declare global {
  interface Window {
    payWithPaystack: (options: {
      email: string;
      phone: string;
      amount: number;
      recipeId: number;
      recipeName: string;
      onSuccess: (url: string) => void;
      onClose: () => void;
    }) => void;
  }
}

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

  const handleBuyNow = () => {
    const email = prompt("Enter your email (for receipt & download link)")?.trim();
    if (!email || !email.includes("@") || !email.includes(".")) {
      alert("Please enter a valid email.");
      return;
    }

    const phone = prompt("Enter your phone number (e.g. 0712345678)")?.trim();
    if (!phone || phone.length < 9 || !/^\d+$/.test(phone)) {
      alert("Please enter a valid phone number (digits only).");
      return;
    }

    window.payWithPaystack({
      email,
      phone,
      amount: price,
      recipeId: id,
      recipeName: title,
      onSuccess: (downloadUrl) => {
        alert("Payment successful! 🎉 Download starting now...");
        window.location.href = downloadUrl;
      },
      onClose: () => {
        alert("Payment cancelled. You can try again.");
      }
    });
  };

  return (
    <Card className="group overflow-hidden hover-elevate transition-all" data-testid={`card-product-${id}`}>
      <CardHeader className="p-0">
        <div className="relative aspect-[3/4] overflow-hidden bg-muted">
          <img src={image} alt={title} className="w-full h-full object-cover transition-transform group-hover:scale-105" />
          {category && <Badge className="absolute top-3 left-3" variant="secondary">{category}</Badge>}
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <Link href={`/product/${id}`}>
              <Button size="sm" variant="secondary">
                <Eye className="h-4 w-4 mr-1" /> Quick View
              </Button>
            </Link>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-4">
        <Link href={`/product/${id}`}>
          <h3 className="font-heading font-semibold text-lg mb-2 hover:text-primary transition-colors">{title}</h3>
        </Link>
        <p className="text-sm text-muted-foreground line-clamp-2 mb-3">{description}</p>
        {recipeCount && <p className="text-xs text-muted-foreground mb-2">{recipeCount} recipes included</p>}
        <div className="flex items-center justify-between">
          <span className="text-2xl font-heading font-bold text-primary">KSh {price}</span>
        </div>
      </CardContent>

      <CardFooter className="p-4 pt-0 flex gap-3">
        <Button
          className="flex-1"
          variant="outline"
          onClick={() => console.log(`Added ${title} to cart`)}
        >
          <ShoppingCart className="h-4 w-4 mr-2" />
          Add to Cart
        </Button>

        <Button
          className="flex-1 bg-yellow-500 hover:bg-yellow-600 text-black font-bold text-lg"
          onClick={handleBuyNow}
        >
          Buy Now
        </Button>
      </CardFooter>
    </Card>
  );
}