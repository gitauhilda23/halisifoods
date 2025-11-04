import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Star, ShoppingCart, Download, Heart } from "lucide-react";
import { useState } from "react";
import breakfastCover from "@assets/generated_images/Breakfast_recipes_eBook_cover_9d71df24.png";
import mainDishCover from "@assets/generated_images/Main_dishes_eBook_cover_27176a57.png";
import vegetarianCover from "@assets/generated_images/Vegetarian_recipes_eBook_cover_bb33c52b.png";

export default function ProductDetail() {
  const [quantity, setQuantity] = useState(1);

  const product = {
    id: "1",
    title: "Kenyan Breakfast Delights",
    description: "Start your day the Kenyan way with this comprehensive collection of traditional breakfast recipes. From the beloved mandazi to aromatic chai, this eBook brings you authentic recipes that have been passed down through generations.",
    price: 12.99,
    image: breakfastCover,
    category: "Breakfast",
    recipeCount: 25,
    rating: 4.8,
    reviewCount: 124,
  };

  const relatedProducts = [
    {
      id: "2",
      title: "Classic Main Dishes",
      description: "Master the art of preparing authentic Kenyan main courses.",
      price: 15.99,
      image: mainDishCover,
      category: "Main Dishes",
      recipeCount: 35,
    },
    {
      id: "3",
      title: "Vegetarian Favorites",
      description: "Delicious plant-based Kenyan recipes.",
      price: 11.99,
      image: vegetarianCover,
      category: "Vegetarian",
      recipeCount: 28,
    },
  ];

  const ingredients = [
    "Wheat flour",
    "Coconut milk",
    "Sugar",
    "Cardamom",
    "Yeast",
    "Vegetable oil",
    "Tea leaves",
    "Milk",
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Header cartItemCount={2} />
      
      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
            <div className="sticky top-24 self-start">
              <div className="aspect-[3/4] bg-muted rounded-md overflow-hidden">
                <img
                  src={product.image}
                  alt={product.title}
                  className="w-full h-full object-cover"
                  data-testid="img-product-detail"
                />
              </div>
            </div>

            <div>
              <Badge className="mb-4" data-testid="badge-product-category">
                {product.category}
              </Badge>
              <h1 className="font-heading text-4xl font-bold mb-4" data-testid="text-product-detail-title">
                {product.title}
              </h1>
              
              <div className="flex items-center gap-2 mb-6">
                <div className="flex gap-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`h-5 w-5 ${i < Math.floor(product.rating) ? 'fill-primary text-primary' : 'text-muted'}`}
                    />
                  ))}
                </div>
                <span className="text-sm text-muted-foreground" data-testid="text-product-rating">
                  {product.rating} ({product.reviewCount} reviews)
                </span>
              </div>

              <div className="text-4xl font-heading font-bold text-primary mb-6" data-testid="text-product-detail-price">
                ${product.price.toFixed(2)}
              </div>

              <p className="text-muted-foreground mb-6 leading-relaxed" data-testid="text-product-detail-description">
                {product.description}
              </p>

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

              <div className="flex items-center gap-4 mb-6">
                <div className="flex items-center gap-2">
                  <Label className="font-semibold">Quantity:</Label>
                  <Input
                    type="number"
                    min="1"
                    value={quantity}
                    onChange={(e) => setQuantity(parseInt(e.target.value))}
                    className="w-20"
                    data-testid="input-quantity"
                  />
                </div>
              </div>

              <div className="flex gap-3 mb-6">
                <Button
                  size="lg"
                  className="flex-1"
                  onClick={() => console.log("Added to cart")}
                  data-testid="button-product-add-to-cart"
                >
                  <ShoppingCart className="h-5 w-5 mr-2" />
                  Add to Cart
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  onClick={() => console.log("Added to wishlist")}
                  data-testid="button-product-wishlist"
                >
                  <Heart className="h-5 w-5" />
                </Button>
              </div>

              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Download className="h-4 w-4" />
                <span>Instant digital download after purchase</span>
              </div>
            </div>
          </div>

          <Tabs defaultValue="details" className="mb-16">
            <TabsList className="w-full justify-start">
              <TabsTrigger value="details" data-testid="tab-details">Details</TabsTrigger>
              <TabsTrigger value="ingredients" data-testid="tab-ingredients">Key Ingredients</TabsTrigger>
              <TabsTrigger value="reviews" data-testid="tab-reviews">Reviews</TabsTrigger>
            </TabsList>
            <TabsContent value="details" className="mt-6">
              <div className="prose max-w-none">
                <h3 className="font-heading text-xl font-semibold mb-4">About This Collection</h3>
                <p className="text-muted-foreground leading-relaxed">
                  This comprehensive eBook is your guide to authentic Kenyan breakfast cuisine. Each recipe has been carefully tested and includes detailed instructions, making it easy for both beginners and experienced cooks to create delicious meals.
                </p>
                <p className="text-muted-foreground leading-relaxed mt-4">
                  Whether you're looking to reconnect with your Kenyan roots or explore new culinary horizons, this collection offers something for everyone. From sweet treats to savory staples, you'll find recipes that bring the vibrant flavors of Kenya to your table.
                </p>
              </div>
            </TabsContent>
            <TabsContent value="ingredients" className="mt-6">
              <h3 className="font-heading text-xl font-semibold mb-4">Common Ingredients Used</h3>
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
                    <p className="text-muted-foreground">
                      Absolutely love this collection! The recipes are authentic and easy to follow. My mandazi turned out perfect on the first try.
                    </p>
                    <p className="text-sm text-muted-foreground mt-2">October 15, 2025</p>
                  </div>
                </div>
                <div className="flex items-start gap-4 pb-6 border-b">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="font-semibold">John M.</span>
                      <div className="flex gap-1">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star key={i} className={`h-4 w-4 ${i < 4 ? 'fill-primary text-primary' : 'text-muted'}`} />
                        ))}
                      </div>
                    </div>
                    <p className="text-muted-foreground">
                      Great recipes with clear instructions. Would have loved more photos, but overall very satisfied with the purchase.
                    </p>
                    <p className="text-sm text-muted-foreground mt-2">October 10, 2025</p>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>

          <section>
            <h2 className="font-heading text-3xl font-bold mb-8" data-testid="text-related-title">
              You May Also Like
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedProducts.map((product) => (
                <ProductCard key={product.id} {...product} />
              ))}
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}

function Label({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <label className={className}>{children}</label>;
}
