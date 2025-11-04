import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Star } from "lucide-react";

export interface TestimonialCardProps {
  name: string;
  location: string;
  comment: string;
  rating: number;
  initials: string;
}

export default function TestimonialCard({ name, location, comment, rating, initials }: TestimonialCardProps) {
  return (
    <Card className="h-full" data-testid={`card-testimonial-${name.toLowerCase().replace(/\s/g, '-')}`}>
      <CardContent className="p-6">
        <div className="flex gap-1 mb-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star
              key={i}
              className={`h-4 w-4 ${i < rating ? 'fill-primary text-primary' : 'text-muted'}`}
            />
          ))}
        </div>
        <p className="text-muted-foreground mb-6 italic" data-testid={`text-testimonial-comment-${name.toLowerCase().replace(/\s/g, '-')}`}>
          "{comment}"
        </p>
        <div className="flex items-center gap-3">
          <Avatar>
            <AvatarFallback className="bg-primary text-primary-foreground font-semibold">
              {initials}
            </AvatarFallback>
          </Avatar>
          <div>
            <div className="font-semibold" data-testid={`text-testimonial-name-${name.toLowerCase().replace(/\s/g, '-')}`}>
              {name}
            </div>
            <div className="text-sm text-muted-foreground" data-testid={`text-testimonial-location-${name.toLowerCase().replace(/\s/g, '-')}`}>
              {location}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
