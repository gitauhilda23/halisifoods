import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ShoppingCart, Eye } from "lucide-react";
import { Link } from "wouter";

export interface ProductCardProps {
  id: string;
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
  return (
    <Card className="group overflow-hidden hover-elevate transition-all" data-testid={`card-product-${id}`}>
      <CardHeader className="p-0">
        <div className="relative aspect-[3/4] overflow-hidden bg-muted">
          <img
            src={image}
            alt={title}
            className="w-full h-full object-cover transition-transform group-hover:scale-105"
            data-testid={`img-product-${id}`}
          />
          {category && (
            <Badge className="absolute top-3 left-3" variant="secondary" data-testid={`badge-category-${id}`}>
              {category}
            </Badge>
          )}
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
            <Link href={`/product/${id}`}>
              <Button size="sm" variant="secondary" data-testid={`button-quick-view-${id}`}>
                <Eye className="h-4 w-4 mr-1" />
                Quick View
              </Button>
            </Link>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-4">
        <Link href={`/product/${id}`}>
          <h3 className="font-heading font-semibold text-lg mb-2 hover:text-primary transition-colors" data-testid={`text-product-title-${id}`}>
            {title}
          </h3>
        </Link>
        <p className="text-sm text-muted-foreground line-clamp-2 mb-3" data-testid={`text-product-description-${id}`}>
          {description}
        </p>
        {recipeCount && (
          <p className="text-xs text-muted-foreground mb-2">
            {recipeCount} recipes included
          </p>
        )}
        <div className="flex items-center justify-between">
          <span className="text-2xl font-heading font-bold text-primary" data-testid={`text-product-price-${id}`}>
            ${price.toFixed(2)}
          </span>
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Button
          className="w-full"
          variant="default"
          onClick={() => console.log(`Added ${title} to cart`)}
          data-testid={`button-add-to-cart-${id}`}
        >
          <ShoppingCart className="h-4 w-4 mr-2" />
          Add to Cart
        </Button>
      </CardFooter>
    </Card>
  );
}
