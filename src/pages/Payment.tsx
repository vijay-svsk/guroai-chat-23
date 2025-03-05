
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { useNavigate, useLocation } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { CheckCircle2, Sparkles } from "lucide-react";

const Payment = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();

  const handleSubscribe = () => {
    window.location.href = 'https://checkout.xendit.co/od/guroai.online';
  };

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

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="max-w-4xl w-full">
        <CardHeader className="text-center pb-2">
          <CardTitle className="text-3xl font-bold text-guro-blue">
            Unlock Full Access to GuroAI
          </CardTitle>
          <p className="text-xl text-gray-600 mt-2">
            Your All-in-One AI-Powered Teaching Assistant
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6 mt-6">
            {features.map((format, idx) => (
              <div key={idx} className="space-y-4">
                <h3 className="text-xl font-semibold text-guro-blue flex items-center gap-2">
                  <CheckCircle2 className="h-6 w-6 text-green-500" />
                  {format.title}
                </h3>
                <ul className="space-y-2">
                  {format.details.map((detail, i) => (
                    <li key={i} className="flex items-start gap-2 text-gray-600">
                      <span className="text-green-500 font-bold">✓</span>
                      {detail}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="bg-[#f0faff] p-6 rounded-lg space-y-4 border border-blue-100">
            <h3 className="text-xl font-semibold text-center text-guro-blue flex items-center justify-center gap-2">
              <Sparkles className="h-5 w-5 text-yellow-500" />
              Exclusive Benefits
              <Sparkles className="h-5 w-5 text-yellow-500" />
            </h3>
            <ul className="grid md:grid-cols-2 gap-4">
              <li className="flex items-start gap-2 text-gray-600">
                <span className="text-yellow-500 font-bold">★</span>
                <span>Generate lesson plans 6x faster than with other AI tools</span>
              </li>
              <li className="flex items-start gap-2 text-gray-600">
                <span className="text-yellow-500 font-bold">★</span>
                <span>DepEd PMES-compliant content guaranteed</span>
              </li>
              <li className="flex items-start gap-2 text-gray-600">
                <span className="text-yellow-500 font-bold">★</span>
                <span>Designed specifically for Philippine curriculum</span>
              </li>
              <li className="flex items-start gap-2 text-gray-600">
                <span className="text-yellow-500 font-bold">★</span>
                <span>Priority access to all future features</span>
              </li>
            </ul>
          </div>

          <div className="bg-gray-50 p-6 rounded-lg space-y-4">
            <h3 className="text-xl font-semibold text-center text-guro-blue">
              Easy 3-Step Process
            </h3>
            <div className="grid md:grid-cols-3 gap-4 text-center">
              <div className="p-4">
                <div className="font-bold text-guro-blue mb-2">1. Input Details</div>
                <p className="text-gray-600">Enter subject, grade level, topic, language, and any custom instructions</p>
              </div>
              <div className="p-4">
                <div className="font-bold text-guro-blue mb-2">2. Choose Format</div>
                <p className="text-gray-600">Select either 7Es or 4As teaching methodology</p>
              </div>
              <div className="p-4">
                <div className="font-bold text-guro-blue mb-2">3. Generate & Download</div>
                <p className="text-gray-600">Get your complete lesson plan in seconds</p>
              </div>
            </div>
          </div>

          <div className="text-center space-y-4">
            <div className="text-3xl font-bold text-guro-blue">
              ₱299<span className="text-xl text-gray-500">/month</span>
            </div>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Subscribe today and join thousands of teachers saving 5+ hours every week on lesson planning and materials creation.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button 
                onClick={() => navigate('/learn-more')}
                variant="outline"
                size="lg"
                className="w-full sm:w-auto sm:px-8 border-guro-blue text-guro-blue hover:bg-guro-blue/10"
              >
                Learn More
              </Button>
              <Button 
                onClick={handleSubscribe}
                size="lg"
                className="w-full sm:w-auto sm:px-8 bg-guro-blue hover:bg-guro-blue/90"
              >
                Subscribe to GuroAI - ₱299/month
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Payment;
