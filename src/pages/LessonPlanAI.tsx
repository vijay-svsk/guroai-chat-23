
import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { LessonPlanHeader } from "@/components/lesson-plan/LessonPlanHeader";
import { LessonPlanContent } from "@/components/lesson-plan/LessonPlanContent";
import { generatePrompt, cleanResponse, extractImagePrompts } from "@/utils/prompt-utils";
import type { FormData } from "@/types/lesson-plan-ai";

const LessonPlanAI = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [response, setResponse] = useState<string>("");
  const [isEditing, setIsEditing] = useState(false);
  const [reviewImage, setReviewImage] = useState<string>("");
  const [motivationImage, setMotivationImage] = useState<string>("");
  const location = useLocation();
  const navigate = useNavigate();
  const formData = location.state as FormData;
  const { toast } = useToast();

  const generateImages = async (text: string) => {
    const { firstPrompt, secondPrompt } = extractImagePrompts(text);
    if (!firstPrompt || !secondPrompt) return;

    try {
      const { data, error } = await supabase.functions.invoke(
        "generate-lesson-images",
        {
          body: { firstPrompt, secondPrompt },
        }
      );

      if (error) throw error;

      setReviewImage(data.reviewImage);
      setMotivationImage(data.motivationImage);
    } catch (error) {
      console.error("Error generating images:", error);
      toast({
        title: "Error",
        description: "Failed to generate lesson images. Proceeding with text only.",
        variant: "destructive",
      });
    }
  };

  const generateLessonPlan = async () => {
    if (!formData) return;
    setIsLoading(true);

    try {
      console.log("Generating lesson plan with prompt:", generatePrompt(formData));
      const { data, error } = await supabase.functions.invoke(
        "generate-lesson-plan",
        {
          body: { prompt: generatePrompt(formData) },
        }
      );

      if (error) {
        console.error("Supabase function error:", error);
        throw error;
      }

      if (!data || !data.generatedText) {
        throw new Error("No response received from the AI");
      }

      const cleanedResponse = cleanResponse(data.generatedText);
      setResponse(cleanedResponse);
      
      // Generate images after getting the lesson plan
      await generateImages(cleanedResponse);

      toast({
        title: "Success!",
        description: "Your lesson plan has been generated.",
        duration: 3000,
      });
    } catch (error) {
      console.error("Error generating lesson plan:", error);
      toast({
        title: "Error",
        description: "Failed to generate lesson plan. Please try again.",
        variant: "destructive",
        duration: 3000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveLessonPlan = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        toast({
          title: "Error",
          description: "Please log in to save lesson plans.",
          variant: "destructive",
          duration: 3000,
        });
        return;
      }

      const { error } = await supabase.from("lesson_plans").insert({
        user_id: user.id,
        content: response,
        subject: formData.subject,
        grade_level: formData.gradeLevel,
        topic: formData.topic,
        language: formData.language,
        method: formData.method,
      });

      if (error) throw error;

      toast({
        title: "Success!",
        description: "Lesson plan saved successfully.",
        duration: 3000,
      });
      navigate("/my-account");
    } catch (error) {
      console.error("Error saving lesson plan:", error);
      toast({
        title: "Error",
        description: "Failed to save lesson plan. Please try again.",
        variant: "destructive",
        duration: 3000,
      });
    }
  };

  const handleDownloadTxt = () => {
    const element = document.createElement("a");
    const file = new Blob([response], {
      type: "text/plain",
    });
    element.href = URL.createObjectURL(file);
    element.download = `lesson_plan_${formData.subject.toLowerCase()}_${formData.method}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    toast({
      title: "Downloaded!",
      description: "Your lesson plan has been downloaded as a text file.",
      duration: 3000,
    });
  };

  const handleDownloadDocx = async () => {
    try {
      const { data, error } = await supabase.functions.invoke(
        "generate-lesson-plan-docx",
        {
          body: { content: response },
        }
      );

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
        duration: 3000,
      });
    } catch (error) {
      console.error("Error generating DOCX:", error);
      toast({
        title: "Error",
        description: "Failed to generate Word document. Please try again.",
        variant: "destructive",
        duration: 3000,
      });
    }
  };

  useEffect(() => {
    if (!formData) {
      navigate("/dashboard");
      return;
    }
    generateLessonPlan();
  }, [formData]);

  if (!formData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-2xl">
          <CardContent className="p-6">
            <p className="text-center text-gray-600">
              No lesson plan parameters provided. Please return to the dashboard and
              fill in the required information.
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
          <LessonPlanHeader
            isLoading={isLoading}
            onRegenerate={generateLessonPlan}
            onEdit={() => setIsEditing(!isEditing)}
            onDownload={handleDownloadTxt}
          />
          <CardContent className="space-y-6">
            <LessonPlanContent
              isLoading={isLoading}
              isEditing={isEditing}
              response={response}
              onResponseChange={(value) => setResponse(cleanResponse(value))}
              onSave={handleSaveLessonPlan}
              onDownloadTxt={handleDownloadTxt}
              onDownloadDocx={handleDownloadDocx}
              reviewImage={reviewImage}
              motivationImage={motivationImage}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default LessonPlanAI;
