
import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { FormData } from "@/types/lesson-plan-types";
import { generateLessonImages, generateFullLessonPlan, saveLessonPlan } from "@/services/lesson-plan-service";
import { LessonPlanActions } from "@/components/lesson-plan/LessonPlanActions";

const LessonPlanAI = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [response, setResponse] = useState<string>("");
  const [isEditing, setIsEditing] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const formData = location.state as FormData;
  const { toast } = useToast();

  const generateLessonPlan = async () => {
    if (!formData) return;
    setIsLoading(true);
    
    try {
      const imageContent = await generateLessonImages(formData);
      if (!imageContent) throw new Error("Failed to generate images and content");
      
      const generatedText = await generateFullLessonPlan(formData, imageContent);
      setResponse(generatedText);
      
      toast({
        title: "Success!",
        description: "Your lesson plan has been generated.",
        duration: 3000
      });
    } catch (error) {
      console.error("Error generating lesson plan:", error);
      toast({
        title: "Error",
        description: "Failed to generate lesson plan. Please try again.",
        variant: "destructive",
        duration: 3000
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveLessonPlan = async () => {
    try {
      await saveLessonPlan(response, formData);
      toast({
        title: "Success!",
        description: "Lesson plan saved successfully.",
        duration: 3000
      });
      navigate('/my-account');
    } catch (error) {
      console.error("Error saving lesson plan:", error);
      toast({
        title: "Error",
        description: "Failed to save lesson plan. Please try again.",
        variant: "destructive",
        duration: 3000
      });
    }
  };

  const handleDownloadTxt = () => {
    const element = document.createElement("a");
    const file = new Blob([response], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = `lesson_plan_${formData.subject.toLowerCase()}_${formData.method}.txt`;
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
    try {
      const { data, error } = await supabase.functions.invoke('generate-lesson-plan-docx', {
        body: { content: response }
      });

      if (error) throw error;

      const element = document.createElement("a");
      element.href = `data:application/vnd.openxmlformats-officedocument.wordprocessingml.document;base64,${data.docxBase64}`;
      element.download = `lesson_plan_${formData.subject.toLowerCase()}_${formData.method}.docx`;
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

  useEffect(() => {
    generateLessonPlan();
  }, [formData]);

  if (!formData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-2xl">
          <CardContent className="p-6">
            <p className="text-center text-gray-600">
              No lesson plan parameters provided. Please return to the dashboard and fill in the required information.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <Card className="bg-white shadow-xl">
          <CardHeader className="space-y-2">
            <CardTitle className="flex justify-between items-start">
              <div className="flex flex-col items-start">
                <div className="flex items-center gap-2">
                  <img 
                    src="/lovable-uploads/455a23fe-17a6-4eba-92d1-fc732a28b3e7.png" 
                    alt="GuroAI Logo" 
                    className="h-12 w-auto"
                    loading="eager"
                  />
                  <span className="text-[#0a1d2c] text-2xl font-bold">
                    GuroAI
                  </span>
                </div>
                <p className="text-sm text-[#0a1d2c] mt-1 font-normal">
                  Empowering educators, simplifying teaching—GuroAI, your partner in effortless lesson planning.
                </p>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {isLoading ? (
              <div className="text-center py-12">
                <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" />
                <p className="text-gray-600">Generating your lesson plan...</p>
              </div>
            ) : (
              <>
                <div className="bg-white border rounded-md p-4">
                  {isEditing ? (
                    <textarea
                      value={response}
                      onChange={e => setResponse(e.target.value)}
                      className="w-full h-[500px] p-4 border rounded-md font-mono text-sm"
                    />
                  ) : (
                    <pre className="whitespace-pre-wrap font-sans text-gray-800">
                      {response}
                    </pre>
                  )}
                </div>
                <LessonPlanActions 
                  isLoading={isLoading}
                  hasResponse={!!response}
                  onRegenerateClick={generateLessonPlan}
                  onEditClick={() => setIsEditing(!isEditing)}
                  onDownloadTxt={handleDownloadTxt}
                  onDownloadDocx={handleDownloadDocx}
                  onSave={handleSaveLessonPlan}
                />
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default LessonPlanAI;
