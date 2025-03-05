
import { ChevronLeft, ChevronRight } from "lucide-react";

interface ReviewCarouselControlsProps {
  totalPages: number;
  currentPage: number;
  isAnimating: boolean;
  onPrevPage: () => void;
  onNextPage: () => void;
  onPageSelect: (pageIndex: number) => void;
}

export const ReviewCarouselControls = ({
  totalPages,
  currentPage,
  isAnimating,
  onPrevPage,
  onNextPage,
  onPageSelect
}: ReviewCarouselControlsProps) => {
  return (
    <>
      <button 
        onClick={onPrevPage}
        className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 lg:-translate-x-8 z-10 bg-white/80 hover:bg-white rounded-full p-2 shadow-md"
        aria-label="Previous reviews"
      >
        <ChevronLeft className="h-6 w-6 text-guro-blue" />
      </button>

      <button 
        onClick={onNextPage}
        className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 lg:translate-x-8 z-10 bg-white/80 hover:bg-white rounded-full p-2 shadow-md"
        aria-label="Next reviews"
      >
        <ChevronRight className="h-6 w-6 text-guro-blue" />
      </button>
      
      <div className="flex justify-center mt-8 gap-1">
        {[...Array(totalPages)].map((_, i) => (
          <button
            key={i}
            onClick={() => onPageSelect(i)}
            className={`w-2 h-2 rounded-full transition-all ${
              i === currentPage 
                ? 'bg-guro-blue w-6' 
                : 'bg-gray-300 hover:bg-gray-400'
            }`}
            aria-label={`Go to page ${i + 1}`}
          />
        ))}
      </div>
    </>
  );
};
