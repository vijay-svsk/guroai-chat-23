
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import type { ExamType } from "@/types/quiz-types";

interface SaveQuizParams {
  gradeLevel: string;
  subject: string;
  topic: string;
  examType: ExamType;
  quizData: string;
  tosData: string | null;
}

export const useSaveQuiz = () => {
  const [isSaving, setIsSaving] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const saveQuiz = async (params: SaveQuizParams) => {
    setIsSaving(true);
    
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast({
          title: "Authentication Required",
          description: "Please log in to save your quiz.",
          variant: "destructive",
          duration: 3000,
        });
        navigate('/auth');
        return;
      }

      const { error } = await supabase
        .from('quizzes')
        .insert([
          {
            user_id: user.id,
            grade_level: params.gradeLevel,
            subject: params.subject,
            topic: params.topic,
            exam_type: params.examType,
            quiz_data: params.quizData,
            tos_data: params.tosData
          }
        ]);

      if (error) throw error;

      toast({
        title: "Success!",
        description: "Quiz saved successfully. You can view it in My Account.",
        duration: 3000,
      });
    } catch (error) {
      console.error("Error saving quiz:", error);
      toast({
        title: "Error",
        description: "Failed to save quiz. Please try again.",
        variant: "destructive",
        duration: 5000,
      });
    } finally {
      setIsSaving(false);
    }
  };

  return { saveQuiz, isSaving };
};
