import Header from "@/components/Header";
import Footer from "@/components/Footer";
import HeroSection from "@/components/HeroSection";
import ProductCard from "@/components/ProductCard";
import CategoryCard from "@/components/CategoryCard";
import TestimonialCard from "@/components/TestimonialCard";
import BlogCard from "@/components/BlogCard";
import NewsletterSection from "@/components/NewsletterSection";
import breakfastCover from "@assets/generated_images/Breakfast_recipes_eBook_cover_9d71df24.png";
import mainDishCover from "@assets/generated_images/Main_dishes_eBook_cover_27176a57.png";
import vegetarianCover from "@assets/generated_images/Vegetarian_recipes_eBook_cover_bb33c52b.png";
import snacksCover from "@assets/generated_images/Snacks_eBook_cover_ede3e266.png";
import categoryImage from "@assets/generated_images/Kenyan_ingredients_category_image_cff4edb2.png";
import blogImage from "@assets/generated_images/Traditional_cooking_blog_image_a3fe7a34.png";

export default function Home() {
  const featuredProducts = [
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
  ];

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
      excerpt: "Learn the traditional techniques for grilling the perfect nyama choma, from selecting the right cuts to achieving that smoky flavor that makes this dish legendary.",
      image: blogImage,
      date: "Nov 1, 2025",
      author: "Chef Wanjiku",
    },
    {
      id: "2",
      title: "Essential Kenyan Spices Guide",
      excerpt: "Discover the aromatic world of Kenyan spices and learn how to use them to create authentic flavors in your cooking.",
      image: blogImage,
      date: "Oct 28, 2025",
      author: "Maria Njeri",
    },
    {
      id: "3",
      title: "Making Ugali: A Step-by-Step Guide",
      excerpt: "Master the technique of making perfect ugali every time with this comprehensive guide to Kenya's beloved staple food.",
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

        <section className="py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="font-heading text-3xl sm:text-4xl font-bold mb-4" data-testid="text-featured-title">
                Featured Recipe Collections
              </h2>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                Explore our most popular eBook collections featuring authentic Kenyan recipes
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredProducts.map((product) => (
                <ProductCard key={product.id} {...product} />
              ))}
            </div>
          </div>
        </section>

        <section className="py-16 px-4 sm:px-6 lg:px-8 bg-muted">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="font-heading text-3xl sm:text-4xl font-bold mb-4" data-testid="text-categories-title">
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

        <section className="py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="font-heading text-3xl sm:text-4xl font-bold mb-4" data-testid="text-testimonials-title">
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

        <section className="py-16 px-4 sm:px-6 lg:px-8 bg-muted">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="font-heading text-3xl sm:text-4xl font-bold mb-4" data-testid="text-blog-title">
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
