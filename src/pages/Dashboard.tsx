import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import ReactConfetti from "react-confetti";
import { GraduationCap, BookOpen, Languages, BookType, Award, Settings, User } from "lucide-react";

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
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setEmail(user.email || "");
      }
    };
    getUser();
  }, []);

  const handleMyAccount = () => {
    navigate("/my-account"); // Changed from "/auth" to "/my-account"
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

    navigate("/lesson-plan-ai", {
      state: {
        ...formData,
        method
      }
    });
  };

  return <div className="min-h-screen bg-gray-50">
      {showConfetti && <ReactConfetti recycle={false} numberOfPieces={200} onConfettiComplete={() => setShowConfetti(false)} />}

      {/* Header with user account info */}
      <header className="bg-[#0a1d2c] text-white">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center space-y-4 sm:space-y-0">
            <div className="flex items-center space-x-4">
              <img src="/lovable-uploads/24e7e402-845e-4126-b717-af2167b4ef23.png" alt="GuroAI Logo" className="h-12 w-12 rounded-md" loading="eager" />
              <div>
                <h2 className="text-xl font-semibold">Welcome to GuroAI!</h2>
                <p className="text-sm text-gray-300">{email}</p>
              </div>
            </div>
            <Button 
              variant="secondary" 
              onClick={handleMyAccount} 
              className="border-white text-slate-900 bg-green-400 hover:bg-green-300 w-fit mx-auto sm:mx-0 sm:w-fit"
            >
              <User className="w-4 h-4 mr-2" />
              <span>My Account</span>
            </Button>
          </div>
        </div>
      </header>

      {/* Main content */}
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
              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <BookOpen className="text-guro-blue w-6 h-6" />
                  <Input name="subject" placeholder="Subject (e.g., Mathematics, Science)" value={formData.subject} onChange={handleInputChange} className="flex-1" />
                </div>

                <div className="flex items-center space-x-4">
                  <GraduationCap className="text-guro-blue w-6 h-6" />
                  <Input name="gradeLevel" placeholder="Grade Level (e.g., Grade 7, High School)" value={formData.gradeLevel} onChange={handleInputChange} className="flex-1" />
                </div>

                <div className="flex items-center space-x-4">
                  <BookType className="text-guro-blue w-6 h-6" />
                  <Input name="topic" placeholder="Topic (e.g., Algebra, Chemical Bonds)" value={formData.topic} onChange={handleInputChange} className="flex-1" />
                </div>

                <div className="flex items-center space-x-4">
                  <Languages className="text-guro-blue w-6 h-6" />
                  <Input name="language" placeholder="Language Used (e.g., English, Filipino)" value={formData.language} onChange={handleInputChange} className="flex-1" />
                </div>

                <div className="flex items-center space-x-4">
                  <Settings className="text-guro-blue w-6 h-6" />
                  <Input 
                    name="customInstructions" 
                    placeholder="Custom Instructions (e.g., Include more group activities, Focus on visual learning)" 
                    value={formData.customInstructions} 
                    onChange={handleInputChange} 
                    className="flex-1"
                  />
                </div>
              </div>

              <div className="pt-6">
                <h3 className="text-lg font-medium text-guro-blue mb-4">
                  Select Your Teaching Method
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Button 
                    onClick={() => handleMethodSelect("7es")} 
                    className="h-auto p-6 bg-guro-blue hover:bg-guro-blue/90 flex flex-col items-center space-y-2 px-[24px]"
                  >
                    <Award className="w-8 h-8" />
                    <span className="text-lg font-semibold">7Es Method</span>
                    <div className="opacity-90 text-sm text-center">
                      <div>Elicit, Engage, Explore, Explain</div>
                      <div>Elaborate, Evaluate, Extend</div>
                    </div>
                  </Button>

                  <Button 
                    onClick={() => handleMethodSelect("4as")} 
                    variant="secondary" 
                    className="h-auto p-6 flex flex-col items-center space-y-2"
                  >
                    <Award className="w-8 h-8" />
                    <span className="text-lg font-semibold">4As Method</span>
                    <span className="text-sm opacity-90">
                      Activity, Analysis, Abstraction, Application
                    </span>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>;
};
export default Dashboard;
