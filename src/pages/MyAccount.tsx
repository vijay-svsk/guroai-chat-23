
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { ArrowLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { LessonPlan } from "@/types/lesson-plan";
import { LessonPlanDetails } from "@/components/lesson-plans/LessonPlanDetails";
import { LessonPlanCard } from "@/components/lesson-plans/LessonPlanCard";
import { SavedQuiz } from "@/types/quiz-types";
import { QuizCard } from "@/components/quiz/QuizCard";
import { QuizDetails } from "@/components/quiz/QuizDetails";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const MyAccount = () => {
  const [lessonPlans, setLessonPlans] = useState<LessonPlan[]>([]);
  const [quizzes, setQuizzes] = useState<SavedQuiz[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedPlan, setSelectedPlan] = useState<LessonPlan | null>(null);
  const [selectedQuiz, setSelectedQuiz] = useState<SavedQuiz | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) {
          navigate('/auth');
          return;
        }

        // Fetch lesson plans
        const { data: lessonPlansData, error: lessonPlansError } = await supabase
          .from('lesson_plans')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });

        if (lessonPlansError) throw lessonPlansError;
        setLessonPlans(lessonPlansData || []);

        // Fetch quizzes
        const { data: quizzesData, error: quizzesError } = await supabase
          .from('quizzes')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });

        if (quizzesError) throw quizzesError;
        setQuizzes(quizzesData || []);
      } catch (error) {
        console.error('Error fetching user data:', error);
        toast({
          title: "Error",
          description: "Failed to fetch saved data. Please try again.",
          duration: 3000
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, [navigate, toast]);

  const handleViewLessonPlan = (plan: LessonPlan) => {
    setSelectedPlan(plan);
    setSelectedQuiz(null);
  };

  const handleViewQuiz = (quiz: SavedQuiz) => {
    setSelectedQuiz(quiz);
    setSelectedPlan(null);
  };

  const handleBackToDashboard = () => {
    navigate('/dashboard');
  };

  const handleBackToList = () => {
    setSelectedPlan(null);
    setSelectedQuiz(null);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          {(selectedPlan || selectedQuiz) ? (
            <Button 
              variant="ghost" 
              onClick={handleBackToList}
              className="flex items-center text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Saved Items
            </Button>
          ) : (
            <Button 
              variant="ghost" 
              onClick={handleBackToDashboard}
              className="flex items-center text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>
          )}
        </div>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-gray-900">
              {selectedPlan ? 'Lesson Plan Details' : 
               selectedQuiz ? 'Quiz Details' :
               'My Saved Items'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-center py-8">Loading saved items...</div>
            ) : selectedPlan ? (
              <LessonPlanDetails plan={selectedPlan} />
            ) : selectedQuiz ? (
              <QuizDetails quiz={selectedQuiz} />
            ) : (
              <Tabs defaultValue="lesson-plans">
                <TabsList className="mb-6">
                  <TabsTrigger value="lesson-plans">Lesson Plans</TabsTrigger>
                  <TabsTrigger value="quizzes">Quizzes</TabsTrigger>
                </TabsList>
                
                <TabsContent value="lesson-plans">
                  {lessonPlans.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      No lesson plans saved yet. Create your first lesson plan from the dashboard!
                    </div>
                  ) : (
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                      {lessonPlans.map((plan) => (
                        <LessonPlanCard
                          key={plan.id}
                          plan={plan}
                          onView={handleViewLessonPlan}
                        />
                      ))}
                    </div>
                  )}
                </TabsContent>
                
                <TabsContent value="quizzes">
                  {quizzes.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      No quizzes saved yet. Generate your first quiz from the Generate Quizzes page!
                    </div>
                  ) : (
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                      {quizzes.map((quiz) => (
                        <QuizCard
                          key={quiz.id}
                          quiz={quiz}
                          onView={handleViewQuiz}
                        />
                      ))}
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            )}
          </CardContent>
        </Card>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-gray-900">Account Settings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Button
                variant="destructive"
                onClick={() => navigate('/delete-account')}
                className="w-full sm:w-auto"
              >
                Delete Account
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default MyAccount;
