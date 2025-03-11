
import { Card } from "@/components/ui/card";

interface ReviewCardProps {
  title: string;
  description: string;
}

export const ReviewCard = ({ title, description }: ReviewCardProps) => (
  <Card className="p-8 text-left hover:shadow-lg transition-shadow duration-300">
    <h3 className="text-xl font-semibold text-guro-blue mb-4">{title}</h3>
    <p className="text-gray-600">{description}</p>
  </Card>
);
