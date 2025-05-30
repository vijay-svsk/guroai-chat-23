
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Loader2, FileCheck, FileWarning, ArrowRight } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";

const PMESAnnotation = () => {
  const [lessonPlan, setLessonPlan] = useState("");
  const [annotations, setAnnotations] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  // Check authentication status when component mounts
  useEffect(() => {
    const checkAuth = async () => {
      const { data } = await supabase.auth.getSession();
      setIsAuthenticated(!!data.session);

      // If authenticated, check subscription
      if (data.session) {
        try {
          const userId = data.session.user.id;
          const hasSubscription = await checkSubscriptionStatus(userId);
          setIsSubscribed(hasSubscription);
        } catch (error) {
          console.error("Error checking subscription:", error);
        }
      }
    };
    
    checkAuth();
  }, []);

  // Helper function to check subscription status
  const checkSubscriptionStatus = async (userId: string) => {
    const { data: subscription, error } = await supabase
      .from('subscriptions')
      .select('*')
      .eq('user_id', userId)
      .maybeSingle();

    if (error) {
      console.error('Error checking subscription:', error);
      return false;
    }

    if (!subscription) {
      return false;
    }

    // Check if subscription has expired (more than 1 month since start_date)
    const endDate = new Date(subscription.end_date);
    const now = new Date();

    return subscription.status === 'active' && now < endDate;
  };

  const handleAnnotate = async () => {
    if (!lessonPlan.trim()) {
      toast({
        title: "Error",
        description: "Please paste your lesson plan first",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    setAnnotations("");

    try {
      const { data, error } = await supabase.functions.invoke("pmes-annotation", {
        body: { content: lessonPlan },
      });

      if (error) throw error;

      setAnnotations(data.annotations);
      
      toast({
        title: "Success!",
        description: "Your lesson plan has been annotated",
        duration: 3000,
      });
    } catch (error) {
      console.error("Error annotating lesson plan:", error);
      toast({
        title: "Error",
        description: "Failed to annotate lesson plan. Please try again.",
        variant: "destructive",
        duration: 3000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAskGuro = () => {
    // If authenticated and subscribed, navigate directly to ask-guro
    if (isAuthenticated && isSubscribed) {
      navigate('/ask-guro');
    } else {
      // Redirect to login or subscription page
      navigate('/ask-guro');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <Card className="bg-white shadow-xl">
          <CardHeader className="border-b pb-6">
            <CardTitle className="text-3xl font-bold text-[#023d54]">
              PMES Lesson Plan Annotation
            </CardTitle>
            <CardDescription className="text-lg mt-2">
              Paste your lesson plan below to receive AI-powered PMES annotations and suggestions
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6 pt-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Input Section */}
              <div className="space-y-4">
                <div>
                  <Label htmlFor="lesson-plan" className="text-base font-medium text-gray-700">
                    Your Lesson Plan
                  </Label>
                  <Textarea
                    id="lesson-plan"
                    placeholder="Paste your lesson plan here..."
                    className="min-h-[400px] mt-2 font-mono text-sm"
                    value={lessonPlan}
                    onChange={(e) => setLessonPlan(e.target.value)}
                    disabled={isLoading}
                  />
                </div>
                <div className="flex justify-end">
                  <Button 
                    onClick={handleAnnotate} 
                    disabled={isLoading || !lessonPlan.trim()}
                    className="bg-[#023d54] hover:bg-[#023d54]/90"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Analyzing...
                      </>
                    ) : (
                      <>
                        Annotate Lesson Plan
                        <FileCheck className="ml-2 h-4 w-4" />
                      </>
                    )}
                  </Button>
                </div>
              </div>

              {/* Output Section */}
              <div className="space-y-4">
                <div>
                  <Label htmlFor="annotations" className="text-base font-medium text-gray-700">
                    PMES Annotations
                  </Label>
                  <div 
                    id="annotations" 
                    className={`bg-gray-50 border rounded-md p-4 min-h-[400px] mt-2 ${
                      !annotations && 'flex items-center justify-center text-gray-500'
                    }`}
                  >
                    {isLoading ? (
                      <div className="flex flex-col items-center justify-center w-full h-full">
                        <Loader2 className="h-8 w-8 animate-spin text-[#023d54] mb-4" />
                        <p>Analyzing your lesson plan...</p>
                      </div>
                    ) : annotations ? (
                      <div className="whitespace-pre-wrap">{annotations}</div>
                    ) : (
                      <div className="flex flex-col items-center justify-center text-center">
                        <FileWarning className="h-12 w-12 text-gray-400 mb-4" />
                        <p>Paste your lesson plan and click "Annotate Lesson Plan" to receive PMES annotations</p>
                      </div>
                    )}
                  </div>
                </div>
                
                {/* Ask GuroAI Button - Only show when annotations are available */}
                {annotations && (
                  <div className="flex justify-center mt-4">
                    <Button 
                      onClick={handleAskGuro} 
                      className="bg-[#8cd09b] hover:bg-[#7bc08b] text-[#023d54] font-semibold px-6 py-3 rounded-lg transition-all"
                    >
                      Ask GuroAI
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PMESAnnotation;
