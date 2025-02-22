
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { LogoAnimation } from "@/components/home/LogoAnimation";
import { HeroSection } from "@/components/home/HeroSection";
import { FeaturesSection } from "@/components/home/FeaturesSection";
import { PricingSection } from "@/components/home/PricingSection";
import { TestimonialsSection } from "@/components/home/TestimonialsSection";
import { ReviewsSection } from "@/components/home/ReviewsSection";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const Index = () => {
  const [showContent, setShowContent] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        
        if (user) {
          // If user is authenticated and they explicitly navigated to '/', 
          // redirect them to dashboard
          if (window.location.pathname === '/') {
            navigate('/dashboard');
            return;
          }
        }

        setTimeout(() => setShowContent(true), 500);
      } catch (error) {
        console.error('Error in auth check:', error);
        setShowContent(true);
      }
    };

    checkAuth();
  }, [navigate]);

  const handleStartSubscription = () => {
    navigate("/payment");
  };

  return (
    <div className="min-h-screen bg-white">
      <LogoAnimation showContent={showContent} />

      <div className={`transition-opacity duration-500 ${showContent ? 'opacity-100' : 'opacity-0'}`}>
        <HeroSection onStartTrial={handleStartSubscription} />
        <FeaturesSection />
        <PricingSection onStartTrial={handleStartSubscription} />
        <TestimonialsSection />
        <ReviewsSection />
      </div>
    </div>
  );
};

export default Index;
