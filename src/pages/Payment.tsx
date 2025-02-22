
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { useNavigate, useLocation } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { CheckCircle2 } from "lucide-react";

const Payment = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();

  useEffect(() => {
    const timer = setTimeout(() => {
      // Redirect to Xendit checkout after user has had time to read the value proposition
      window.location.href = 'https://checkout.xendit.co/od/guroai.online';
    }, 10000); // 10 second delay before redirect

    return () => clearTimeout(timer);
  }, []);

  const features = [
    {
      title: "7Es Format Lesson Plans",
      details: [
        "Content & Performance Standards",
        "Learning Competencies & MELC",
        "Comprehensive Objectives (Cognitive, Psychomotor, Affective)",
        "Detailed Subject Matter & References",
        "7-step Procedure (Preliminaries to Generalization)",
        "Evaluation & Assignment sections"
      ]
    },
    {
      title: "4As Format Lesson Plans",
      details: [
        "Content & Performance Standards",
        "Learning Competencies & MELC",
        "Clear Learning Objectives",
        "Activity-Based Learning Structure",
        "Analysis & Abstraction Components",
        "Application & Assessment"
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
            Your AI-Powered Lesson Planning Assistant
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
            <Button 
              size="lg"
              className="w-full md:w-auto md:px-8 bg-guro-blue hover:bg-guro-blue/90"
            >
              Subscribe to GuroAI - ₱299/month
            </Button>
            <p className="text-sm text-gray-500">
              You will be redirected to our secure payment page in a few seconds...
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Payment;
