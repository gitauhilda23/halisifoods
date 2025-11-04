import ProductCard from '../ProductCard';
import breakfastCover from '@assets/generated_images/Breakfast_recipes_eBook_cover_9d71df24.png';

export default function ProductCardExample() {
  return (
    <div className="max-w-sm">
      <ProductCard
        id="1"
        title="Kenyan Breakfast Delights"
        description="Start your day with traditional Kenyan breakfast recipes including mandazi, chai, and more."
        price={12.99}
        image={breakfastCover}
        category="Breakfast"
        recipeCount={25}
      />
    </div>
  );
}
