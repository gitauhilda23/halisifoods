import CategoryCard from '../CategoryCard';
import categoryImage from '@assets/generated_images/Kenyan_ingredients_category_image_cff4edb2.png';

export default function CategoryCardExample() {
  return (
    <div className="max-w-md">
      <CategoryCard
        name="Kenyan Recipes"
        image={categoryImage}
        ebookCount={15}
        slug="traditional"
      />
    </div>
  );
}
