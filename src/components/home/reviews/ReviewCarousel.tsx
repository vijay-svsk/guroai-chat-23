
import { useMemo, useRef } from "react";
import { ReviewCard } from "../ReviewCard";
import { Review } from "@/data/reviews";

interface ReviewCarouselProps {
  reviews: Review[];
  currentPage: number;
  itemsPerPage: number;
  isAnimating: boolean;
  activeTab: string;
}

export const ReviewCarousel = ({ 
  reviews, 
  currentPage, 
  itemsPerPage,
  isAnimating,
  activeTab
}: ReviewCarouselProps) => {
  const carouselRef = useRef<HTMLDivElement>(null);
  
  // Pre-calculate current reviews for better performance
  const currentReviews = useMemo(() => {
    return reviews.slice(
      currentPage * itemsPerPage,
      (currentPage + 1) * itemsPerPage
    );
  }, [reviews, currentPage, itemsPerPage]);

  return (
    <div ref={carouselRef} className="overflow-hidden">
      <div 
        className={`grid md:grid-cols-2 lg:grid-cols-3 gap-6 transition-all duration-700 ease-in-out ${isAnimating ? 'opacity-0' : 'opacity-100'}`}
      >
        {currentReviews.map((review, index) => (
          <ReviewCard 
            key={`${activeTab}-${currentPage}-${index}`}
            title={review.title}
            description={review.description}
            teacherName={review.teacherName}
            location={review.location}
            rating={5}
          />
        ))}
      </div>
    </div>
  );
};
