
import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
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
    <div className="min-h-screen bg-white flex flex-col">
      <LogoAnimation showContent={showContent} />

      <div className={`transition-opacity duration-500 flex-grow ${showContent ? 'opacity-100' : 'opacity-0'}`}>
        <HeroSection onStartTrial={handleStartSubscription} />
        <FeaturesSection />
        <PricingSection onStartTrial={handleStartSubscription} />
        <TestimonialsSection />
        <ReviewsSection />
      </div>

      <footer className="bg-[#8cd09b] py-6 mt-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-center items-center space-y-4 md:space-y-0 md:space-x-8">
            <Link 
              to="/terms-of-service"
              className="text-guro-blue hover:underline font-medium"
            >
              Terms of Service
            </Link>
            <Link 
              to="/privacy-policy"
              className="text-guro-blue hover:underline font-medium"
            >
              Privacy Policy
            </Link>
          </div>
          <div className="text-center mt-4 text-guro-blue">
            <p>&copy; {new Date().getFullYear()} GuroAI. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
