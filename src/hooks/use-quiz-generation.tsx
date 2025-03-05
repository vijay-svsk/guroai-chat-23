
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import type { QuizFormData, Quiz, TableOfSpecification } from "@/types/quiz-types";

export const useQuizGeneration = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isTosLoading, setIsTosLoading] = useState(false);
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [tableOfSpecification, setTableOfSpecification] = useState<TableOfSpecification | null>(null);
  const { toast } = useToast();

  const generateQuiz = async (formData: QuizFormData) => {
    setIsLoading(true);
    setQuiz(null);
    setTableOfSpecification(null);

    try {
      const { data, error } = await supabase.functions.invoke("generate-quiz", {
        body: { formData },
      });

      if (error) throw error;
      if (!data || !data.quiz) throw new Error("No quiz data received");

      setQuiz(data.quiz);
      
      toast({
        title: "Success!",
        description: "Your quiz has been generated.",
        duration: 3000,
      });
    } catch (error) {
      console.error("Error generating quiz:", error);
      toast({
        title: "Error",
        description: "Failed to generate quiz. Please try again.",
        variant: "destructive",
        duration: 5000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const generateTOS = async (formData: QuizFormData) => {
    if (!quiz || !quiz.questions || quiz.questions.length === 0) {
      toast({
        title: "Error",
        description: "Please generate a quiz first before creating a TOS.",
        variant: "destructive",
        duration: 3000,
      });
      return;
    }

    setIsTosLoading(true);

    try {
      const { data, error } = await supabase.functions.invoke("generate-tos", {
        body: { 
          formData,
          questions: quiz.questions
        },
      });

      if (error) throw error;
      if (!data || !data.tos) throw new Error("No TOS data received");

      setTableOfSpecification(data.tos);
      
      toast({
        title: "Success!",
        description: "Table of Specification has been generated.",
        duration: 3000,
      });
    } catch (error) {
      console.error("Error generating TOS:", error);
      toast({
        title: "Error",
        description: "Failed to generate Table of Specification. Please try again.",
        variant: "destructive",
        duration: 5000,
      });
    } finally {
      setIsTosLoading(false);
    }
  };

  return {
    isLoading,
    isTosLoading,
    quiz,
    tableOfSpecification,
    generateQuiz,
    generateTOS,
  };
};
