
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { generatePrompt, cleanResponse, extractImagePrompts } from "@/utils/prompt-utils";
import type { FormData } from "@/types/lesson-plan-ai";
import { generateFallbackLessonPlan } from "@/utils/fallback-utils";

export const useLessonPlan = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [response, setResponse] = useState<string>("");
  const [isEditing, setIsEditing] = useState(false);
  const [reviewImage, setReviewImage] = useState<string>("");
  const [motivationImage, setMotivationImage] = useState<string>("");
  const [usedFallback, setUsedFallback] = useState(false);
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
        title: "Notice",
        description: "Unable to generate lesson images. Proceeding with text only.",
        variant: "default",
      });
    }
  };

  const generateLessonPlan = async (formData: FormData) => {
    setIsLoading(true);
    setUsedFallback(false);

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
      
      // Use fallback mechanism
      const fallbackLessonPlan = generateFallbackLessonPlan(formData);
      setResponse(fallbackLessonPlan);
      setUsedFallback(true);
      
      toast({
        title: "Using Fallback Template",
        description: "We've generated a template for you to customize. AI generation was unavailable.",
        duration: 5000,
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
    usedFallback,
    setResponse,
    setIsEditing,
    generateLessonPlan,
  };
};
