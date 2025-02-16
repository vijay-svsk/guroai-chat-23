
import { ReviewCard } from "./ReviewCard";

export const ReviewsSection = () => (
  <section className="py-20 px-4">
    <div className="max-w-4xl mx-auto text-center">
      <h2 className="text-3xl md:text-4xl font-bold text-guro-blue mb-12">
        Why Teachers Love GuroAI
      </h2>
      <div className="space-y-8">
        <ReviewCard 
          title="Superior AI Understanding"
          description="Unlike generic AI tools, GuroAI is specifically trained on educational content and teaching methodologies, resulting in more relevant and practical lesson plans."
        />
        <ReviewCard 
          title="Affordable Excellence"
          description="Premium quality lesson plans at a fraction of the cost of other platforms. We believe quality education tools should be accessible to all teachers."
        />
        <ReviewCard 
          title="Latest AI Technology"
          description="Our platform leverages the most advanced AI models to ensure you get cutting-edge lesson planning assistance that's continually improving."
        />
      </div>
    </div>
  </section>
);
