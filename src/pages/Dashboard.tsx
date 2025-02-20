import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import ReactConfetti from "react-confetti";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { TeachingPreferencesForm } from "@/components/dashboard/TeachingPreferencesForm";
import { TeachingMethodSelection } from "@/components/dashboard/TeachingMethodSelection";
import { checkSubscriptionStatus } from "@/services/subscription-service";

const Dashboard = () => {
  const [email, setEmail] = useState("");
  const [formData, setFormData] = useState({
    subject: "",
    gradeLevel: "",
    topic: "",
    language: "",
    customInstructions: ""
  });
  const [showConfetti, setShowConfetti] = useState(true);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast({
          title: "Authentication Required",
          description: "Please log in to access GuroAI",
          duration: 3000,
        });
        navigate('/auth');
        return;
      }

      setEmail(user.email || "");

      // Check subscription status but only show warning
      try {
        const hasActiveSubscription = await checkSubscriptionStatus(user.id);
        if (!hasActiveSubscription) {
          toast({
            title: "Subscription Notice",
            description: "Your subscription has expired. Some features may be limited.",
            duration: 5000,
          });
        }
      } catch (error) {
        console.error('Error checking subscription:', error);
      }
    };

    checkAuth();
  }, [navigate, toast]);

  const handleMyAccount = () => {
    navigate("/my-account");
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleMethodSelect = (method: "7es" | "4as") => {
    if (!formData.subject || !formData.gradeLevel || !formData.topic || !formData.language) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields before generating a lesson plan.",
        duration: 3000
      });
      return;
    }

    if (method === "4as") {
      navigate("/four-as-ai", {
        state: {
          ...formData,
          method
        }
      });
    } else {
      navigate("/lesson-plan-ai", {
        state: {
          ...formData,
          method
        }
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {showConfetti && (
        <ReactConfetti 
          recycle={false} 
          numberOfPieces={200} 
          onConfettiComplete={() => setShowConfetti(false)} 
        />
      )}

      <DashboardHeader email={email} onMyAccount={handleMyAccount} />

      <main className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto space-y-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-guro-blue mb-4">
              Let's Personalize Your Experience
            </h1>
            <p className="text-xl text-gray-600">
              Help us understand your teaching needs
            </p>
          </div>

          <Card className="bg-white shadow-xl">
            <CardHeader>
              <CardTitle className="text-2xl font-semibold text-guro-blue">
                Teaching Preferences
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <TeachingPreferencesForm 
                formData={formData} 
                onInputChange={handleInputChange} 
              />

              <div className="pt-6">
                <TeachingMethodSelection onMethodSelect={handleMethodSelect} />
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
