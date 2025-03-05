
import { ReviewCarousel } from "./reviews/ReviewCarousel";
import { ReviewCarouselControls } from "./reviews/ReviewCarouselControls";
import { ReviewFilterTabs } from "./reviews/ReviewFilterTabs";
import { FeaturedReview } from "./reviews/FeaturedReview";
import { useReviewsState } from "./reviews/useReviewsState";

export const ReviewsSection = () => {
  const {
    activeTab,
    currentPage,
    isAnimating,
    filteredReviews,
    itemsPerPage,
    totalPages,
    nextPage,
    prevPage,
    handleTabChange,
    handlePageSelect
  } = useReviewsState();

  return (
    <section className="py-20 px-4">
      <div className="max-w-5xl mx-auto text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-guro-blue mb-4">
          What Teachers Around the World Are Saying
        </h2>
        <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
          Join educators from across the globe who are transforming their teaching process with GuroAI
        </p>
        
        <ReviewFilterTabs activeTab={activeTab} onTabChange={handleTabChange} />
        
        <div className="relative">
          <ReviewCarousel 
            reviews={filteredReviews}
            currentPage={currentPage}
            itemsPerPage={itemsPerPage}
            isAnimating={isAnimating}
            activeTab={activeTab}
          />

          <ReviewCarouselControls
            totalPages={totalPages}
            currentPage={currentPage}
            isAnimating={isAnimating}
            onPrevPage={prevPage}
            onNextPage={nextPage}
            onPageSelect={handlePageSelect}
          />
        </div>
        
        <FeaturedReview />
      </div>
    </section>
  );
};
