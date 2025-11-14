// client/src/pages/Home.tsx
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import HeroSection from "@/components/HeroSection";
import ProductCard from "@/components/ProductCard";
import CategoryCard from "@/components/CategoryCard";
import TestimonialCard from "@/components/TestimonialCard";
import BlogCard from "@/components/BlogCard";
import NewsletterSection from "@/components/NewsletterSection";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { useState, useEffect } from "react";
import { Link } from "wouter";
import { toast, Toaster } from "sonner";

// Static category & blog images (kept)
import categoryImage from "@assets/generated_images/Kenyan_ingredients_category_image_cff4edb2.png";
import blogImage from "@assets/generated_images/Traditional_cooking_blog_image_a3fe7a34.png";

interface Ebook {
  id: string;
  title: string;
  description?: string;
  price: number;
  priceKES: number;
  image: string;
  coverUrl?: string;
  pdfUrl?: string;
  category?: string;
  recipeCount?: number;
}

export default function Home() {
  const [liveEbooks, setLiveEbooks] = useState<Ebook[]>([]);

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
          priceKES: typeof book.price === "string"
            ? parseInt(book.price.replace(/[^0-9]/g, ""), 10) || 0
            : book.price,
          image: book.coverUrl,
          coverUrl: book.coverUrl,
          pdfUrl: book.pdfUrl,
          description: book.description || `Authentic ${book.title} recipes`,
          category: book.category || "Uncategorized",
          recipeCount: book.recipeCount || 20,
        }));
        setLiveEbooks(uploaded);
      }
    };
    loadEbooks();
    window.addEventListener("storage", loadEbooks);
    return () => window.removeEventListener("storage", loadEbooks);
  }, []);

  const handleAddToCart = (product: Ebook) => {
    const cart = JSON.parse(localStorage.getItem("cart") || "[]");
    if (cart.find((item: any) => item.id === product.id)) {
      toast.warning("Already in cart!");
      return;
    }
    cart.push({
      id: product.id,
      title: product.title,
      priceKES: product.priceKES,
      image: product.coverUrl || product.image,
    });
    localStorage.setItem("cart", JSON.stringify(cart));
    window.dispatchEvent(new Event("cartUpdated"));
    toast.success(`${product.title} added to cart!`);
  };

  // ONLY LIVE eBOOKS — NO DUMMIES
  const featuredProducts = liveEbooks.slice(0, 4);

  const categories = [
    { name: "Traditional Dishes", image: categoryImage, ebookCount: 15, slug: "traditional" },
    { name: "Modern Fusion", image: categoryImage, ebookCount: 8, slug: "fusion" },
    { name: "Quick & Easy", image: categoryImage, ebookCount: 12, slug: "quick" },
  ];

  const testimonials = [
    {
      name: "Amina Hassan",
      location: "Nairobi, Kenya",
      comment: "These recipes brought back childhood memories! The instructions are clear and authentic. My family loves every dish I've made.",
      rating: 5,
      initials: "AH",
    },
    {
      name: "James Ochieng",
      location: "Mombasa, Kenya",
      comment: "As someone living abroad, these eBooks help me stay connected to home. The recipes are exactly how my grandmother used to make them.",
      rating: 5,
      initials: "JO",
    },
    {
      name: "Sarah Mitchell",
      location: "London, UK",
      comment: "I discovered Kenyan cuisine through these books and I'm hooked! Every recipe has been a success. Worth every penny.",
      rating: 5,
      initials: "SM",
    },
  ];

  const blogPosts = [
    {
      id: "1",
      title: "The Art of Perfect Nyama Choma",
      excerpt: "Learn the traditional techniques for grilling the perfect nyama choma...",
      image: blogImage,
      date: "Nov 1, 2025",
      author: "Chef Wanjiku",
    },
    {
      id: "2",
      title: "Essential Kenyan Spices Guide",
      excerpt: "Discover the aromatic world of Kenyan spices...",
      image: blogImage,
      date: "Oct 28, 2025",
      author: "Maria Njeri",
    },
    {
      id: "3",
      title: "Making Ugali: A Step-by-Step Guide",
      excerpt: "Master the technique of making perfect ugali every time...",
      image: blogImage,
      date: "Oct 25, 2025",
      author: "Chef Wanjiku",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Header cartItemCount={0} />
      <main className="flex-1">
        <HeroSection />
        <Toaster position="top-center" richColors />

        {/* Featured Products */}
        <section className="py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="font-heading text-3xl sm:text-4xl font-bold mb-4">
                {liveEbooks.length > 0 ? "Available eBooks" : "No eBooks Available"}
              </h2>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                {liveEbooks.length > 0
                  ? "Fresh from our kitchen — add to cart and pay securely"
                  : "Check back soon for new recipe collections"}
              </p>
            </div>

            {liveEbooks.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {featuredProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    id={product.id}
                    title={product.title}
                    description={product.description || "Authentic Kenyan recipes"}
                    price={0}
                    priceKES={product.priceKES}
                    image={product.coverUrl || product.image}
                    category={product.category}
                    recipeCount={product.recipeCount}
                    pdfUrl={product.pdfUrl}
                    onAddToCart={() => handleAddToCart(product)}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-muted-foreground text-lg">
                  No eBooks available yet. Check back soon!
                </p>
              </div>
            )}

            {liveEbooks.length > 0 && (
              <div className="text-center mt-8">
                <Button size="lg" asChild>
                  <Link href="/catalog">
                    View All eBooks <ArrowRight className="w-4 h-4 ml-2" />
                  </Link>
                </Button>
              </div>
            )}
          </div>
        </section>

        {/* Categories */}
        <section className="py-16 px-4 sm:px-6 lg:px-8 bg-muted">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="font-heading text-3xl sm:text-4xl font-bold mb-4">
                Browse by Category
              </h2>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                Find the perfect recipes for any occasion
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {categories.map((category) => (
                <CategoryCard key={category.slug} {...category} />
              ))}
            </div>
          </div>
        </section>

        <NewsletterSection />

        {/* Testimonials */}
        <section className="py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="font-heading text-3xl sm:text-4xl font-bold mb-4">
                What Our Customers Say
              </h2>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                Join thousands of satisfied customers who love our recipes
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {testimonials.map((testimonial, index) => (
                <TestimonialCard key={index} {...testimonial} />
              ))}
            </div>
          </div>
        </section>

        {/* Blog */}
        <section className="py-16 px-4 sm:px-6 lg:px-8 bg-muted">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="font-heading text-3xl sm:text-4xl font-bold mb-4">
                Recipe Tips & Stories
              </h2>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                Explore cooking techniques and culinary traditions
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {blogPosts.map((post) => (
                <BlogCard key={post.id} {...post} />
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}