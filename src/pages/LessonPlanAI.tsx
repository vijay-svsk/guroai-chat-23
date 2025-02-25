
import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { LessonPlanHeader } from "@/components/lesson-plan/LessonPlanHeader";
import { LessonPlanContent } from "@/components/lesson-plan/LessonPlanContent";
import { useLessonPlan } from "@/hooks/use-lesson-plan";
import { useLessonPlanDownload } from "@/hooks/use-lesson-plan-download";
import type { FormData } from "@/types/lesson-plan-ai";

const LessonPlanAI = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const formData = location.state as FormData;
  const { toast } = useToast();
  
  const {
    isLoading,
    response,
    isEditing,
    reviewImage,
    motivationImage,
    setResponse,
    setIsEditing,
    generateLessonPlan,
  } = useLessonPlan();

  const { downloadTxt } = useLessonPlanDownload();

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

  useEffect(() => {
    if (!formData) {
      navigate("/dashboard");
      return;
    }
    generateLessonPlan(formData);
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
            onRegenerate={() => generateLessonPlan(formData)}
            onEdit={() => setIsEditing(!isEditing)}
            onDownload={() => downloadTxt(response, formData.subject, formData.method)}
          />
          <CardContent className="space-y-6">
            <LessonPlanContent
              isLoading={isLoading}
              isEditing={isEditing}
              response={response}
              onResponseChange={(value) => setResponse(value)}
              onSave={handleSaveLessonPlan}
              onDownloadTxt={() => downloadTxt(response, formData.subject, formData.method)}
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
