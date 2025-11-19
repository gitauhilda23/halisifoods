import Header from "@/components/Header";
import Footer from "@/components/Footer";
import BlogCard from "@/components/BlogCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search } from "lucide-react";
import blogImage from "@assets/generated_images/Traditional_cooking_blog_image_a3fe7a34.png";

export default function Blog() {
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
    {
      id: "4",
      title: "Coastal Cuisine: Swahili Cooking Traditions",
      excerpt: "Explore the rich culinary heritage of Kenya's coast with these traditional Swahili recipes and cooking methods.",
      image: blogImage,
      date: "Oct 20, 2025",
      author: "Hassan Ali",
    },
    {
      id: "5",
      title: "Vegetarian Kenyan Dishes You'll Love",
      excerpt: "Discover delicious meat-free options from Kenyan cuisine that are packed with flavor and nutrition.",
      image: blogImage,
      date: "Oct 15, 2025",
      author: "Maria Njeri",
    },
    {
      id: "6",
      title: "The History of Kenyan Tea Culture",
      excerpt: "From the highlands to your cup - learn about Kenya's tea traditions and how to brew the perfect chai.",
      image: blogImage,
      date: "Oct 10, 2025",
      author: "David Kimani",
    },
  ];

  const categories = [
    "All Posts",
    "Cooking Tips",
    "Traditional Recipes",
    "Ingredients",
    "Culture & History",
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Header cartItemCount={0} />
      
      <main className="flex-1">
        <div className="bg-muted py-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <h1 className="font-heading text-4xl font-bold mb-4" data-testid="text-blog-page-title">
              Recipe Tips & Stories
            </h1>
            <p className="text-muted-foreground text-lg">
              Explore cooking techniques, culinary traditions, and food stories from Kenya
            </p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex flex-col lg:flex-row gap-8">
            <aside className="lg:w-1/4">
              <div className="sticky top-24 space-y-6">
                <div>
                  <h3 className="font-heading font-semibold text-lg mb-4">Search</h3>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="search"
                      placeholder="Search articles..."
                      className="pl-9"
                      data-testid="input-blog-search"
                    />
                  </div>
                </div>

                <div>
                  <h3 className="font-heading font-semibold text-lg mb-4">Categories</h3>
                  <div className="space-y-2">
                    {categories.map((category) => (
                      <Button
                        key={category}
                        variant="ghost"
                        className="w-full justify-start"
                        data-testid={`button-category-${category.toLowerCase().replace(/\s/g, '-')}`}
                      >
                        {category}
                      </Button>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="font-heading font-semibold text-lg mb-4">Popular Tags</h3>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="secondary">Traditional</Badge>
                    <Badge variant="secondary">Quick Meals</Badge>
                    <Badge variant="secondary">Vegetarian</Badge>
                    <Badge variant="secondary">Spices</Badge>
                    <Badge variant="secondary">Street Food</Badge>
                  </div>
                </div>
              </div>
            </aside>

            <div className="lg:w-3/4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {blogPosts.map((post) => (
                  <BlogCard key={post.id} {...post} />
                ))}
              </div>

              <div className="mt-12 flex justify-center gap-2">
                <Button variant="outline" disabled data-testid="button-blog-pagination-prev">
                  Previous
                </Button>
                <Button variant="default" data-testid="button-blog-pagination-1">1</Button>
                <Button variant="outline" data-testid="button-blog-pagination-2">2</Button>
                <Button variant="outline" data-testid="button-blog-pagination-3">3</Button>
                <Button variant="outline" data-testid="button-blog-pagination-next">
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
