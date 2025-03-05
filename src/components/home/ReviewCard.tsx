
import { Card } from "@/components/ui/card";
import { Star } from "lucide-react";

interface ReviewCardProps {
  title: string;
  description: string;
}

export const ReviewCard = ({ title, description }: ReviewCardProps) => (
  <Card className="p-8 text-left hover:shadow-lg transition-shadow duration-300 border-t-4 border-t-guro-green">
    <div className="flex mb-3">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star key={star} className="h-4 w-4 text-yellow-400 fill-yellow-400" />
      ))}
    </div>
    <h3 className="text-xl font-semibold text-guro-blue mb-3">{title}</h3>
    <p className="text-gray-600">{description}</p>
  </Card>
);
