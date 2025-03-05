
import { Star } from "lucide-react";

export const FeaturedReview = () => {
  return (
    <div className="mt-16 bg-white p-8 rounded-xl shadow-sm">
      <div className="flex justify-center mb-4">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star key={star} className="h-8 w-8 text-yellow-400 fill-yellow-400" />
        ))}
      </div>
      <p className="text-gray-700 text-lg italic">
        "As a principal, I've recommended GuroAI to all our teachers. The quality of lesson plans has improved dramatically, and our teachers are spending less time on paperwork and more time engaging with students. The curriculum compliance alone makes it worth every penny."
      </p>
      <p className="mt-4 font-semibold text-guro-blue">- Maria Santos, Elementary School Principal, Philippines</p>
    </div>
  );
};
