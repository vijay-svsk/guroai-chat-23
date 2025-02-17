
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useNavigate, useLocation } from "react-router-dom";
import ReactConfetti from "react-confetti";
import type { Database } from "@/integrations/supabase/types";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { PreviousLessonPlans } from "@/components/dashboard/PreviousLessonPlans";
import { LessonPlanForm } from "@/components/dashboard/LessonPlanForm";

type LessonPlan = Database['public']['Tables']['lesson_plans']['Row'];

const Dashboard = () => {
  const [email, setEmail] = useState("");
  const [previousLessonPlans, setPreviousLessonPlans] = useState<LessonPlan[]>([]);
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
  const location = useLocation();

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setEmail(user.email || "");
        const { data: lessonPlans, error } = await supabase
          .from('lesson_plans')
          .select('*')
          .order('created_at', { ascending: false });

        if (!error && lessonPlans) {
          setPreviousLessonPlans(lessonPlans);
        }
      }
    };
    getUser();

    if (location.state?.fromPayment) {
      toast({
        title: "Welcome to GuroAI Premium!",
        description: "Thank you for subscribing. Let's create some amazing lesson plans!",
        duration: 5000,
      });
    }
  }, [location.state, toast]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.reload();
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

  const viewPreviousLessonPlan = (lessonPlan: LessonPlan) => {
    navigate("/lesson-plan-ai", {
      state: {
        ...lessonPlan,
        isExisting: true
      }
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {showConfetti && <ReactConfetti recycle={false} numberOfPieces={200} onConfettiComplete={() => setShowConfetti(false)} />}
      
      <DashboardHeader email={email} onLogout={handleLogout} />

      <main className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto space-y-8">
          <PreviousLessonPlans 
            lessonPlans={previousLessonPlans}
            onViewPlan={viewPreviousLessonPlan}
          />
          
          <LessonPlanForm 
            formData={formData}
            onInputChange={handleInputChange}
            onMethodSelect={handleMethodSelect}
          />
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
