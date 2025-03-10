
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { useNavigate, useLocation } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { CheckCircle2, Check } from "lucide-react";

const Payment = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubscribe = async () => {
    try {
      setIsProcessing(true);
      window.location.href = 'https://checkout.xendit.co/od/guroai.online';
    } catch (error) {
      console.error("Payment error:", error);
      toast({
        title: "Payment Error",
        description: "There was a problem initiating the payment. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  // Check if user was redirected after a canceled payment
  const paymentCanceled = new URLSearchParams(location.search).get('canceled') === 'true';
  if (paymentCanceled) {
    toast({
      title: "Payment Canceled",
      description: "Your payment was not completed. You can try again whenever you're ready.",
      variant: "destructive",
    });
  }

  const features = [
    {
      title: "Comprehensive Lesson Plans",
      details: [
        "Choose between 7Es or 4As teaching methodologies",
        "DepEd PMES-compliant content",
        "Customizable to your teaching style",
        "Download as Word documents in seconds",
        "Includes objectives, activities, and assessments"
      ]
    },
    {
      title: "Educational Resources & Tools",
      details: [
        "Generate professional PowerPoint presentations",
        "Create comprehensive quizzes with answer keys",
        "Generate PMES Annotations instantly",
        "AI-powered lesson customization",
        "Save hours of preparation time weekly"
      ]
    }
  ];

  const exclusiveBenefits = [
    "Generate lesson plans 6x faster than with other AI tools",
    "DepEd PMES-compliant content guaranteed",
    "Designed for international curriculum standards",
    "Priority access to all future features",
    "Responsive and intuitive user interface",
    "Accessible on all devices 24/7",
    "Regular updates and improvements",
    "Personalized teaching resources"
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="max-w-4xl w-full">
        <CardHeader className="text-center pb-2">
          <CardTitle className="text-2xl sm:text-3xl font-bold text-guro-blue">
            Unlock Full Access to GuroAI
          </CardTitle>
          <p className="text-lg sm:text-xl text-gray-600 mt-2">
            Your All-in-One AI-Powered Teaching Assistant
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid sm:grid-cols-2 gap-6 mt-4">
            {features.map((format, idx) => (
              <div key={idx} className="space-y-3">
                <h3 className="text-lg font-semibold text-guro-blue flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-green-500 flex-shrink-0" />
                  {format.title}
                </h3>
                <ul className="space-y-2">
                  {format.details.map((detail, i) => (
                    <li key={i} className="flex items-start gap-2 text-gray-600 text-sm sm:text-base">
                      <span className="text-green-500 font-bold mt-0.5">✓</span>
                      {detail}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="bg-[#f0faff] p-4 sm:p-6 rounded-lg space-y-3 border border-blue-100">
            <h3 className="text-lg font-semibold text-center text-guro-blue">
              Exclusive Benefits
            </h3>
            <ul className="grid sm:grid-cols-2 gap-2 sm:gap-3">
              {exclusiveBenefits.map((benefit, i) => (
                <li key={i} className="flex items-start gap-2 text-gray-600 text-sm sm:text-base">
                  <Check className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <span>{benefit}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-gray-50 p-4 sm:p-6 rounded-lg space-y-3">
            <h3 className="text-lg font-semibold text-center text-guro-blue">
              Easy 3-Step Process
            </h3>
            <div className="grid sm:grid-cols-3 gap-3 text-center">
              <div className="p-3 bg-white rounded-lg shadow-sm">
                <div className="font-bold text-guro-blue mb-1">1. Input Details</div>
                <p className="text-gray-600 text-sm">Enter subject, grade level, topic, and custom instructions</p>
              </div>
              <div className="p-3 bg-white rounded-lg shadow-sm">
                <div className="font-bold text-guro-blue mb-1">2. Choose Format</div>
                <p className="text-gray-600 text-sm">Select either 7Es or 4As teaching methodology</p>
              </div>
              <div className="p-3 bg-white rounded-lg shadow-sm">
                <div className="font-bold text-guro-blue mb-1">3. Generate & Download</div>
                <p className="text-gray-600 text-sm">Get your complete lesson plan in seconds</p>
              </div>
            </div>
          </div>

          <div className="text-center space-y-3 mt-2">
            <div className="text-2xl sm:text-3xl font-bold text-guro-blue">
              ₱299<span className="text-lg text-gray-500">/month</span>
            </div>
            <p className="text-gray-600 max-w-2xl mx-auto text-sm sm:text-base">
              Subscribe today and join thousands of teachers saving 5+ hours every week on lesson planning.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button 
                onClick={() => navigate('/learn-more')}
                variant="outline"
                size="lg"
                className="w-full sm:w-auto sm:px-8 border-guro-blue text-guro-blue hover:bg-guro-blue/10"
                disabled={isProcessing}
              >
                Learn More
              </Button>
              <Button 
                onClick={handleSubscribe}
                size="lg"
                className="w-full sm:w-auto sm:px-8 bg-guro-blue hover:bg-guro-blue/90"
                disabled={isProcessing}
              >
                {isProcessing ? "Redirecting to Payment..." : "Subscribe Now"}
              </Button>
            </div>
            
            {isProcessing && (
              <p className="text-sm text-blue-600 animate-pulse">
                You're being redirected to our secure payment page...
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Payment;
