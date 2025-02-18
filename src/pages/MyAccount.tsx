
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { FileText, ArrowLeft, Download, RefreshCw, Edit } from "lucide-react";
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
  const [selectedPlan, setSelectedPlan] = useState<LessonPlan | null>(null);
  const [isEditing, setIsEditing] = useState(false);
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

  const handleViewLessonPlan = (plan: LessonPlan) => {
    setSelectedPlan(plan);
    setIsEditing(false);
  };

  const handleBackToDashboard = () => {
    navigate('/dashboard');
  };

  const handleBackToList = () => {
    setSelectedPlan(null);
    setIsEditing(false);
  };

  const handleDownload = () => {
    if (!selectedPlan) return;
    
    const element = document.createElement("a");
    const file = new Blob([selectedPlan.content], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = `lesson_plan_${selectedPlan.subject.toLowerCase()}_${selectedPlan.method}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    
    toast({
      title: "Downloaded!",
      description: "Your lesson plan has been downloaded as a text file.",
      duration: 3000
    });
  };

  const handleDownloadDocx = async () => {
    if (!selectedPlan) return;

    try {
      const { data, error } = await supabase.functions.invoke('generate-lesson-plan-docx', {
        body: { content: selectedPlan.content }
      });

      if (error) throw error;

      const element = document.createElement("a");
      element.href = `data:application/vnd.openxmlformats-officedocument.wordprocessingml.document;base64,${data.docxBase64}`;
      element.download = `lesson_plan_${selectedPlan.subject.toLowerCase()}_${selectedPlan.method}.docx`;
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);

      toast({
        title: "Downloaded!",
        description: "Your lesson plan has been downloaded as a Word document.",
        duration: 3000
      });
    } catch (error) {
      console.error("Error generating DOCX:", error);
      toast({
        title: "Error",
        description: "Failed to generate Word document. Please try again.",
        variant: "destructive",
        duration: 3000
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          {selectedPlan ? (
            <Button 
              variant="ghost" 
              onClick={handleBackToList}
              className="flex items-center text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Lesson Plans
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
              {selectedPlan ? 'Lesson Plan Details' : 'My Saved Lesson Plans'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-center py-8">Loading lesson plans...</div>
            ) : selectedPlan ? (
              <div className="space-y-6">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-xl font-semibold">{selectedPlan.subject}</h3>
                    <p className="text-sm text-gray-500">Created on {formatDate(selectedPlan.created_at)}</p>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" onClick={handleDownload}>
                      <Download className="w-4 h-4 mr-2" />
                      Download TXT
                    </Button>
                    <Button variant="outline" onClick={handleDownloadDocx}>
                      <FileText className="w-4 h-4 mr-2" />
                      Download DOCX
                    </Button>
                  </div>
                </div>
                <div className="grid gap-4 mb-6">
                  <div className="bg-white p-4 rounded-lg border">
                    <h4 className="font-medium mb-2">Details</h4>
                    <div className="grid grid-cols-2 gap-4">
                      <p className="text-sm text-gray-600">Topic: {selectedPlan.topic}</p>
                      <p className="text-sm text-gray-600">Method: {selectedPlan.method.toUpperCase()}</p>
                      {selectedPlan.grade_level && (
                        <p className="text-sm text-gray-600">Grade Level: {selectedPlan.grade_level}</p>
                      )}
                      {selectedPlan.language && (
                        <p className="text-sm text-gray-600">Language: {selectedPlan.language}</p>
                      )}
                    </div>
                  </div>
                </div>
                <div className="bg-white border rounded-md p-4">
                  <pre className="whitespace-pre-wrap font-sans text-gray-800">
                    {selectedPlan.content}
                  </pre>
                </div>
              </div>
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
