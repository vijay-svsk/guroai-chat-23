
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { generatePrompt, cleanResponse, extractImagePrompts } from "@/utils/prompt-utils";
import type { FormData } from "@/types/lesson-plan-ai";

export const useLessonPlan = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [response, setResponse] = useState<string>("");
  const [isEditing, setIsEditing] = useState(false);
  const [reviewImage, setReviewImage] = useState<string>("");
  const [motivationImage, setMotivationImage] = useState<string>("");
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

  const generateLessonPlan = async (formData: FormData) => {
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

  return {
    isLoading,
    response,
    isEditing,
    reviewImage,
    motivationImage,
    setResponse,
    setIsEditing,
    generateLessonPlan,
  };
};
