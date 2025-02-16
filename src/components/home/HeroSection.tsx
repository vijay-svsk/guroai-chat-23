
import { Button } from "@/components/ui/button";

interface HeroSectionProps {
  onStartTrial: () => void;
}

export const HeroSection = ({ onStartTrial }: HeroSectionProps) => (
  <section className="relative h-screen flex flex-col items-center justify-center space-y-8 px-4">
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      <div className="absolute top-20 left-20 w-64 h-64 bg-guro-green/10 rounded-full blur-3xl animate-float" />
      <div className="absolute bottom-20 right-20 w-64 h-64 bg-guro-blue/10 rounded-full blur-3xl animate-float" style={{ animationDelay: "1s" }} />
    </div>

    <h1 className="text-5xl md:text-7xl font-bold text-guro-blue text-center animate-fade-in">
      Teaching Made Easy with AI
    </h1>
    <p className="text-xl md:text-2xl text-gray-600 text-center max-w-2xl animate-fade-in" style={{ animationDelay: "0.2s" }}>
      Generate personalized lesson plans in seconds with our AI-powered platform
    </p>
    <div className="flex flex-col sm:flex-row gap-4 animate-fade-in px-6 w-full sm:w-auto" style={{ animationDelay: "0.4s" }}>
      <Button 
        onClick={onStartTrial}
        className="bg-guro-blue hover:bg-guro-blue/90 text-white px-8 py-6 rounded-lg text-lg transition-all duration-300 hover:scale-105"
      >
        Start Free Trial
      </Button>
      <Button variant="outline" className="border-guro-blue text-guro-blue hover:bg-guro-blue/5 px-8 py-6 rounded-lg text-lg transition-all duration-300 hover:scale-105">
        Learn More
      </Button>
    </div>
  </section>
);
