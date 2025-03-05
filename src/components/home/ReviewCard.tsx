
import { Card } from "@/components/ui/card";
import { Star, User } from "lucide-react";

interface ReviewCardProps {
  title: string;
  description: string;
  teacherName?: string;
  location?: string;
  rating?: number;
}

export const ReviewCard = ({ 
  title, 
  description, 
  teacherName, 
  location, 
  rating = 5 
}: ReviewCardProps) => (
  <Card className="p-8 text-left hover:shadow-lg transition-shadow duration-300 border-t-4 border-t-guro-green h-full">
    <div className="flex mb-3">
      {[...Array(rating)].map((_, star) => (
        <Star key={star} className="h-4 w-4 text-yellow-400 fill-yellow-400" />
      ))}
    </div>
    <h3 className="text-xl font-semibold text-guro-blue mb-3">{title}</h3>
    <p className="text-gray-600 mb-4">{description}</p>
    {teacherName && (
      <div className="flex items-center mt-auto pt-4 border-t border-gray-100">
        <div className="bg-gray-100 rounded-full p-2 mr-3">
          <User className="h-4 w-4 text-guro-blue" />
        </div>
        <div>
          <p className="font-medium text-guro-blue">{teacherName}</p>
          {location && <p className="text-sm text-gray-500">{location}</p>}
        </div>
      </div>
    )}
  </Card>
);
