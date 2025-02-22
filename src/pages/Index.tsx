
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
import { checkSubscriptionStatus } from "@/services/subscription-service";

const Index = () => {
  const [showContent, setShowContent] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const checkAuthAndSubscription = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        
        if (user) {
          const hasActiveSubscription = await checkSubscriptionStatus(user.id);

          if (hasActiveSubscription) {
            // User is authenticated and has active subscription - redirect to dashboard
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

    checkAuthAndSubscription();
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
