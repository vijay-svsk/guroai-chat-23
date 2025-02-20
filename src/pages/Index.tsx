
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
    const checkAuthAndSubscription = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        // Check if user has an active subscription
        const { data: subscription, error } = await supabase
          .from('subscriptions')
          .select('*')
          .eq('user_id', user.id)
          .single();

        if (error) {
          console.error('Error checking subscription:', error);
          return;
        }

        if (subscription?.status === 'active') {
          // User is authenticated and has active subscription - redirect to dashboard
          navigate('/dashboard');
          return;
        }
      }

      // Show content for new users or users without active subscription
      setShowContent(true);
    };

    checkAuthAndSubscription();
  }, [navigate]);

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
