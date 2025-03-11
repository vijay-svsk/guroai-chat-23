
import { BookOpen, PenTool, CheckCircle } from "lucide-react";
import { FeatureCard } from "./FeatureCard";

export const FeaturesSection = () => (
  <section className="py-20 px-4 bg-gray-50">
    <div className="max-w-6xl mx-auto">
      <h2 className="text-3xl md:text-4xl font-bold text-guro-blue text-center mb-12">
        Why Choose GuroAI?
      </h2>
      <div className="grid md:grid-cols-3 gap-8">
        <FeatureCard 
          icon={<BookOpen className="w-12 h-12 text-guro-blue" />}
          title="Smart Lesson Planning"
          description="AI-powered system that creates custom lesson plans based on your needs"
        />
        <FeatureCard 
          icon={<PenTool className="w-12 h-12 text-guro-blue" />}
          title="Customizable Templates"
          description="Easily modify and adapt lesson plans to fit your teaching style"
        />
        <FeatureCard 
          icon={<CheckCircle className="w-12 h-12 text-guro-blue" />}
          title="Time-Saving Solution"
          description="Create comprehensive lesson plans in minutes, not hours"
        />
      </div>
    </div>
  </section>
);
