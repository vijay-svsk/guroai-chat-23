
import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { LogoAnimation } from "@/components/home/LogoAnimation";
import { HeroSection } from "@/components/home/HeroSection";
import { FeaturesSection } from "@/components/home/FeaturesSection";
import { PricingSection } from "@/components/home/PricingSection";
import { ReviewsSection } from "@/components/home/ReviewsSection";
import { ChatBox } from "@/components/home/ChatBox";
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
    <div className="min-h-screen bg-white flex flex-col w-full overflow-x-hidden">
      <LogoAnimation showContent={showContent} />

      <div className={`transition-opacity duration-500 flex-grow ${showContent ? 'opacity-100' : 'opacity-0'}`}>
        <HeroSection onStartTrial={handleStartSubscription} />
        <FeaturesSection />
        <PricingSection onStartTrial={handleStartSubscription} />
        <ReviewsSection />
      </div>

      <div className="bg-[#f7fbff] py-12 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-guro-blue mb-8">Have Questions? Ask Our AI Assistant</h2>
          <p className="text-lg text-gray-600 mb-8 max-w-3xl mx-auto">
            Unsure about how GuroAI can help you? Need clarification on features or pricing? 
            Our AI assistant is ready to answer all your questions instantly, no matter where you teach.
          </p>
          <div className="md:hidden">
            <ChatBox />
          </div>
        </div>
      </div>

      <footer className="bg-[#8cd09b] py-8 mt-12">
        <div className="container mx-auto px-4">
          <div className="text-center mb-6">
            <h3 className="text-guro-blue text-xl font-semibold mb-2">Join Educators Worldwide</h3>
            <p className="text-guro-blue/80">
              Teachers in over 30 countries are using GuroAI to transform their teaching experience
            </p>
          </div>
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
            <Link 
              to="/learn-more"
              className="text-guro-blue hover:underline font-medium"
            >
              Learn More
            </Link>
          </div>
          <div className="text-center mt-4 text-guro-blue">
            <p>&copy; {new Date().getFullYear()} GuroAI. All rights reserved.</p>
          </div>
        </div>
      </footer>

      {/* ChatBox component at the bottom of viewport in desktop */}
      <div className="hidden md:block">
        <ChatBox />
      </div>
    </div>
  );
};

export default Index;
