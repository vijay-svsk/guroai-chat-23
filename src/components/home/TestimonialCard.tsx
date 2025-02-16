
import { Star } from "lucide-react";
import { Card } from "@/components/ui/card";

interface TestimonialCardProps {
  quote: string;
  author: string;
  role: string;
  rating: number;
}

export const TestimonialCard = ({ quote, author, role, rating }: TestimonialCardProps) => (
  <Card className="p-8 hover:shadow-lg transition-shadow duration-300">
    <div className="flex gap-1 mb-4">
      {[...Array(rating)].map((_, i) => (
        <Star key={i} className="w-5 h-5 fill-guro-green text-guro-green" />
      ))}
    </div>
    <p className="text-gray-600 italic mb-6">{quote}</p>
    <div>
      <p className="font-semibold text-guro-blue">{author}</p>
      <p className="text-sm text-gray-500">{role}</p>
    </div>
  </Card>
);
