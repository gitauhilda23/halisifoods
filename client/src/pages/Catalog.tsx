import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { useState } from "react";
import breakfastCover from "@assets/generated_images/Breakfast_recipes_eBook_cover_9d71df24.png";
import mainDishCover from "@assets/generated_images/Main_dishes_eBook_cover_27176a57.png";
import vegetarianCover from "@assets/generated_images/Vegetarian_recipes_eBook_cover_bb33c52b.png";
import snacksCover from "@assets/generated_images/Snacks_eBook_cover_ede3e266.png";

export default function Catalog() {
  const [priceRange, setPriceRange] = useState([0, 50]);
  const [sortBy, setSortBy] = useState("popularity");

  const allProducts = [
    {
      id: "1",
      title: "Kenyan Breakfast Delights",
      description: "Start your day with traditional Kenyan breakfast recipes including mandazi, chai, and more.",
      price: 12.99,
      image: breakfastCover,
      category: "Breakfast",
      recipeCount: 25,
    },
    {
      id: "2",
      title: "Classic Main Dishes",
      description: "Master the art of preparing authentic Kenyan main courses like pilau, ugali, and nyama choma.",
      price: 15.99,
      image: mainDishCover,
      category: "Main Dishes",
      recipeCount: 35,
    },
    {
      id: "3",
      title: "Vegetarian Favorites",
      description: "Discover delicious plant-based Kenyan recipes featuring fresh vegetables and traditional spices.",
      price: 11.99,
      image: vegetarianCover,
      category: "Vegetarian",
      recipeCount: 28,
    },
    {
      id: "4",
      title: "Snacks & Street Food",
      description: "Learn to make popular Kenyan snacks and street food favorites at home.",
      price: 9.99,
      image: snacksCover,
      category: "Snacks",
      recipeCount: 20,
    },
    {
      id: "5",
      title: "Traditional Swahili Cuisine",
      description: "Explore coastal flavors with authentic Swahili recipes from Mombasa and beyond.",
      price: 14.99,
      image: mainDishCover,
      category: "Main Dishes",
      recipeCount: 30,
    },
    {
      id: "6",
      title: "Quick Weeknight Dinners",
      description: "Easy and delicious Kenyan recipes perfect for busy weeknights.",
      price: 10.99,
      image: vegetarianCover,
      category: "Quick & Easy",
      recipeCount: 22,
    },
  ];

  const categories = [
    "Breakfast",
    "Main Dishes",
    "Vegetarian",
    "Snacks",
    "Quick & Easy",
    "Traditional",
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Header cartItemCount={2} />
      
      <main className="flex-1">
        <div className="bg-muted py-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <h1 className="font-heading text-4xl font-bold mb-4" data-testid="text-catalog-title">
              Recipe Collections
            </h1>
            <p className="text-muted-foreground text-lg">
              Browse our complete collection of authentic Kenyan recipe eBooks
            </p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex flex-col lg:flex-row gap-8">
            <aside className="lg:w-1/4">
              <div className="sticky top-24 space-y-6">
                <div>
                  <h3 className="font-heading font-semibold text-lg mb-4">Filters</h3>
                  
                  <div className="space-y-6">
                    <div>
                      <Label className="font-semibold mb-3 block">Price Range</Label>
                      <Slider
                        value={priceRange}
                        onValueChange={setPriceRange}
                        max={50}
                        step={1}
                        className="mb-2"
                        data-testid="slider-price-range"
                      />
                      <div className="flex justify-between text-sm text-muted-foreground">
                        <span data-testid="text-price-min">${priceRange[0]}</span>
                        <span data-testid="text-price-max">${priceRange[1]}</span>
                      </div>
                    </div>

                    <div>
                      <Label className="font-semibold mb-3 block">Category</Label>
                      <div className="space-y-2">
                        {categories.map((category) => (
                          <div key={category} className="flex items-center gap-2">
                            <Checkbox id={category} data-testid={`checkbox-category-${category.toLowerCase().replace(/\s/g, '-')}`} />
                            <Label htmlFor={category} className="cursor-pointer font-normal">
                              {category}
                            </Label>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <Label className="font-semibold mb-3 block">Diet Type</Label>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <Checkbox id="vegetarian" data-testid="checkbox-diet-vegetarian" />
                          <Label htmlFor="vegetarian" className="cursor-pointer font-normal">
                            Vegetarian
                          </Label>
                        </div>
                        <div className="flex items-center gap-2">
                          <Checkbox id="vegan" data-testid="checkbox-diet-vegan" />
                          <Label htmlFor="vegan" className="cursor-pointer font-normal">
                            Vegan
                          </Label>
                        </div>
                        <div className="flex items-center gap-2">
                          <Checkbox id="gluten-free" data-testid="checkbox-diet-gluten-free" />
                          <Label htmlFor="gluten-free" className="cursor-pointer font-normal">
                            Gluten-Free
                          </Label>
                        </div>
                      </div>
                    </div>

                    <Button variant="outline" className="w-full" data-testid="button-clear-filters">
                      Clear Filters
                    </Button>
                  </div>
                </div>
              </div>
            </aside>

            <div className="lg:w-3/4">
              <div className="flex justify-between items-center mb-6">
                <p className="text-muted-foreground" data-testid="text-product-count">
                  Showing {allProducts.length} results
                </p>
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-48" data-testid="select-sort">
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

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {allProducts.map((product) => (
                  <ProductCard key={product.id} {...product} />
                ))}
              </div>

              <div className="mt-12 flex justify-center gap-2">
                <Button variant="outline" disabled data-testid="button-pagination-prev">
                  Previous
                </Button>
                <Button variant="default" data-testid="button-pagination-1">1</Button>
                <Button variant="outline" data-testid="button-pagination-2">2</Button>
                <Button variant="outline" data-testid="button-pagination-3">3</Button>
                <Button variant="outline" data-testid="button-pagination-next">
                  Next
                </Button>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
