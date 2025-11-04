import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { Calendar, ArrowRight } from "lucide-react";

export interface BlogCardProps {
  id: string;
  title: string;
  excerpt: string;
  image: string;
  date: string;
  author: string;
}

export default function BlogCard({ id, title, excerpt, image, date, author }: BlogCardProps) {
  return (
    <Card className="overflow-hidden hover-elevate transition-all group" data-testid={`card-blog-${id}`}>
      <CardHeader className="p-0">
        <div className="relative aspect-video overflow-hidden bg-muted">
          <img
            src={image}
            alt={title}
            className="w-full h-full object-cover transition-transform group-hover:scale-105"
            data-testid={`img-blog-${id}`}
          />
        </div>
      </CardHeader>
      <CardContent className="p-6">
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
          <Calendar className="h-4 w-4" />
          <span data-testid={`text-blog-date-${id}`}>{date}</span>
          <span>•</span>
          <span data-testid={`text-blog-author-${id}`}>{author}</span>
        </div>
        <Link href={`/blog/${id}`}>
          <h3 className="font-heading font-semibold text-xl mb-3 hover:text-primary transition-colors" data-testid={`text-blog-title-${id}`}>
            {title}
          </h3>
        </Link>
        <p className="text-muted-foreground mb-4 line-clamp-3" data-testid={`text-blog-excerpt-${id}`}>
          {excerpt}
        </p>
        <Link href={`/blog/${id}`}>
          <Button variant="ghost" className="px-0" data-testid={`button-blog-read-${id}`}>
            Read More
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
}
