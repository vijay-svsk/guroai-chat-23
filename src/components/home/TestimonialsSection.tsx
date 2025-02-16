
import { TestimonialCard } from "./TestimonialCard";

export const TestimonialsSection = () => (
  <section className="py-20 px-4 bg-gray-50">
    <div className="max-w-6xl mx-auto">
      <h2 className="text-3xl md:text-4xl font-bold text-guro-blue text-center mb-12">
        What Teachers Are Saying
      </h2>
      <div className="grid md:grid-cols-3 gap-8">
        <TestimonialCard 
          quote="GuroAI's lesson plans are more tailored to my students' needs than any other AI tool I've used. And at this price point, it's an absolute steal!"
          author="Sarah Chen"
          role="High School Science Teacher"
          rating={5}
        />
        <TestimonialCard 
          quote="The quality of content is outstanding. I'm getting better results than with general AI tools, and it's specifically designed for education. Amazing value for money."
          author="Michael Rodriguez"
          role="Elementary School Teacher"
          rating={5}
        />
        <TestimonialCard 
          quote="Finally, an AI tool that truly understands education! The lesson plans are incredibly detailed and pedagogically sound. The affordable pricing makes it accessible to all teachers."
          author="Emily Thompson"
          role="Middle School Math Teacher"
          rating={5}
        />
      </div>
    </div>
  </section>
);
