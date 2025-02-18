
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { FileText, ArrowLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface LessonPlan {
  id: string;
  created_at: string;
  subject: string;
  topic: string;
  method: string;
  grade_level: string | null;
  language: string | null;
  content: string;
}

const MyAccount = () => {
  const [lessonPlans, setLessonPlans] = useState<LessonPlan[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const fetchLessonPlans = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) {
          navigate('/auth');
          return;
        }

        const { data, error } = await supabase
          .from('lesson_plans')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });

        if (error) throw error;
        setLessonPlans(data || []);
      } catch (error) {
        console.error('Error fetching lesson plans:', error);
        toast({
          title: "Error",
          description: "Failed to fetch lesson plans. Please try again.",
          duration: 3000
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchLessonPlans();
  }, [navigate, toast]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleViewLessonPlan = (lessonPlan: LessonPlan) => {
    navigate('/lesson-plan-ai', {
      state: {
        ...lessonPlan,
        existingContent: lessonPlan.content
      }
    });
  };

  const handleBackToDashboard = () => {
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <Button 
            variant="ghost" 
            onClick={handleBackToDashboard}
            className="flex items-center text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>
        </div>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-gray-900">My Saved Lesson Plans</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-center py-8">Loading lesson plans...</div>
            ) : lessonPlans.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                No lesson plans saved yet. Create your first lesson plan from the dashboard!
              </div>
            ) : (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {lessonPlans.map((plan) => (
                  <Card key={plan.id} className="hover:shadow-lg transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center space-x-2">
                          <FileText className="w-5 h-5 text-blue-600" />
                          <h3 className="font-semibold text-lg text-gray-900">{plan.subject}</h3>
                        </div>
                        <span className="text-xs text-gray-500">{formatDate(plan.created_at)}</span>
                      </div>
                      <div className="mt-4 space-y-2">
                        <p className="text-sm text-gray-600">Topic: {plan.topic}</p>
                        <p className="text-sm text-gray-600">Method: {plan.method.toUpperCase()}</p>
                        {plan.grade_level && (
                          <p className="text-sm text-gray-600">Grade Level: {plan.grade_level}</p>
                        )}
                        {plan.language && (
                          <p className="text-sm text-gray-600">Language: {plan.language}</p>
                        )}
                      </div>
                      <Button
                        className="w-full mt-4"
                        onClick={() => handleViewLessonPlan(plan)}
                      >
                        View Lesson Plan
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default MyAccount;
