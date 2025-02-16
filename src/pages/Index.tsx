
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { LogoAnimation } from "@/components/home/LogoAnimation";
import { HeroSection } from "@/components/home/HeroSection";
import { FeaturesSection } from "@/components/home/FeaturesSection";
import { PricingSection } from "@/components/home/PricingSection";
import { TestimonialsSection } from "@/components/home/TestimonialsSection";
import { ReviewsSection } from "@/components/home/ReviewsSection";

const Index = () => {
  const [showContent, setShowContent] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowContent(true);
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  const handleStartTrial = () => {
    navigate("/payment");
  };

  return (
    <div className="min-h-screen bg-white">
      <LogoAnimation showContent={showContent} />

      <div className={`transition-opacity duration-1000 ${showContent ? 'opacity-100' : 'opacity-0'}`}>
        <HeroSection onStartTrial={handleStartTrial} />
        <FeaturesSection />
        <PricingSection onStartTrial={handleStartTrial} />
        <TestimonialsSection />
        <ReviewsSection />
      </div>
    </div>
  );
};

export default Index;
