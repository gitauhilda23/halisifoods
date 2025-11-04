import { Card } from "@/components/ui/card";
import { Link } from "wouter";
import { Badge } from "@/components/ui/badge";

export interface CategoryCardProps {
  name: string;
  image: string;
  ebookCount: number;
  slug: string;
}

export default function CategoryCard({ name, image, ebookCount, slug }: CategoryCardProps) {
  return (
    <Link href={`/catalog?category=${slug}`}>
      <Card className="group overflow-hidden hover-elevate cursor-pointer transition-all" data-testid={`card-category-${slug}`}>
        <div className="relative aspect-video overflow-hidden">
          <img
            src={image}
            alt={name}
            className="w-full h-full object-cover transition-transform group-hover:scale-110"
            data-testid={`img-category-${slug}`}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
            <h3 className="font-heading text-2xl font-bold mb-2" data-testid={`text-category-name-${slug}`}>
              {name}
            </h3>
            <Badge variant="secondary" data-testid={`badge-category-count-${slug}`}>
              {ebookCount} eBooks
            </Badge>
          </div>
        </div>
      </Card>
    </Link>
  );
}
