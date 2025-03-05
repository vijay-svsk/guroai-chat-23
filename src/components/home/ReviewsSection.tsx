
import { ReviewCard } from "./ReviewCard";
import { Star } from "lucide-react";

export const ReviewsSection = () => (
  <section className="py-20 px-4">
    <div className="max-w-5xl mx-auto text-center">
      <h2 className="text-3xl md:text-4xl font-bold text-guro-blue mb-4">
        Why Teachers Love GuroAI
      </h2>
      <p className="text-xl text-gray-600 mb-12 max-w-3xl mx-auto">
        Join thousands of Filipino teachers who are transforming their teaching process
      </p>
      
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        <ReviewCard 
          title="Complete Teaching Solution"
          description="GuroAI provides everything I need in one place. I can generate lesson plans, presentations, and quizzes all from a single platform. It's been a game-changer for my teaching process."
        />
        <ReviewCard 
          title="Superior DepEd Compliance"
          description="Unlike other AI tools, GuroAI truly understands DepEd requirements. My lesson plans are always perfectly aligned with PMES standards, which has improved my classroom observation ratings."
        />
        <ReviewCard 
          title="Incredible Time-Saver"
          description="What used to take me hours now takes seconds. I'm creating high-quality lesson plans and materials in minutes, giving me more time to focus on my students and my own well-being."
        />
        <ReviewCard 
          title="Affordable Excellence"
          description="The value is unbeatable. For the price of a few coffees per month, I get access to tools that save me countless hours and help me deliver better quality teaching materials."
        />
        <ReviewCard 
          title="Constantly Improving"
          description="GuroAI keeps getting better with new features like PowerPoint generation and quiz creation being added regularly. I'm excited to see what they'll add next!"
        />
        <ReviewCard 
          title="Perfect for Filipino Teachers"
          description="Finally, an AI solution that understands our curriculum and teaching requirements. GuroAI is clearly designed with Filipino teachers in mind, unlike generic AI tools."
        />
      </div>
      
      <div className="mt-12 bg-white p-8 rounded-xl shadow-sm">
        <div className="flex justify-center mb-4">
          {[1, 2, 3, 4, 5].map((star) => (
            <Star key={star} className="h-8 w-8 text-yellow-400 fill-yellow-400" />
          ))}
        </div>
        <p className="text-gray-700 text-lg italic">
          "As a principal, I've recommended GuroAI to all our teachers. The quality of lesson plans has improved dramatically, and our teachers are spending less time on paperwork and more time engaging with students. The DepEd PMES compliance alone makes it worth every peso."
        </p>
        <p className="mt-4 font-semibold text-guro-blue">- Maria Santos, Elementary School Principal</p>
      </div>
    </div>
  </section>
);
