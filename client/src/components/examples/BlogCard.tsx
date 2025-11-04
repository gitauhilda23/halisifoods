import BlogCard from '../BlogCard';
import blogImage from '@assets/generated_images/Traditional_cooking_blog_image_a3fe7a34.png';

export default function BlogCardExample() {
  return (
    <div className="max-w-md">
      <BlogCard
        id="1"
        title="The Art of Perfect Nyama Choma"
        excerpt="Learn the traditional techniques for grilling the perfect nyama choma, from selecting the right cuts to achieving that smoky flavor that makes this dish legendary."
        image={blogImage}
        date="Nov 1, 2025"
        author="Chef Wanjiku"
      />
    </div>
  );
}
