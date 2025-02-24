
import { supabase } from "@/integrations/supabase/client";
import { FormData, GeneratedContent } from "@/types/lesson-plan-types";
import { generatePrompt, cleanResponse } from "@/utils/lesson-plan-utils";

export const generateLessonImages = async (data: FormData): Promise<GeneratedContent | null> => {
  try {
    const { data: imageData, error } = await supabase.functions.invoke('generate-lesson-images', {
      body: {
        subject: data.subject,
        topic: data.topic,
        previousTopic: data.previousTopic || data.topic
      }
    });

    if (error) throw error;
    return imageData;
  } catch (error) {
    console.error("Error generating images:", error);
    throw error;
  }
};

export const generateFullLessonPlan = async (formData: FormData, imageContent: GeneratedContent) => {
  let prompt = generatePrompt(formData);
  
  const reviewSection = `
Observe the image below:
[Image URL: ${imageContent.reviewImage}]

Let's review our previous lesson with these questions:
${imageContent.content.reviewQuestions.map((q, i) => `${i + 1}. ${q}`).join("\n")}
`;

  const motivationSection = `
Now, let's look at this image that introduces our new lesson:
[Image URL: ${imageContent.motivationImage}]

Let's explore this image with some higher-order thinking questions:
${imageContent.content.hotsQuestions.map((q, i) => `${i + 1}. ${q}`).join("\n")}
`;

  const integrationSection = `
Integration with ${imageContent.content.integration.connectedSubject}:

${imageContent.content.integration.discussion.join("\n\n")}
`;

  prompt = prompt
    .replace("{REVIEW_SECTION}", reviewSection)
    .replace("{MOTIVATION_SECTION}", motivationSection)
    .replace("{INTEGRATION_SECTION}", integrationSection);

  const { data, error } = await supabase.functions.invoke('generate-lesson-plan', {
    body: { prompt }
  });

  if (error) throw error;
  return cleanResponse(data.generatedText);
};

export const saveLessonPlan = async (
  content: string,
  formData: FormData
) => {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    throw new Error("User not authenticated");
  }

  const { error } = await supabase
    .from('lesson_plans')
    .insert({
      user_id: user.id,
      content,
      subject: formData.subject,
      grade_level: formData.gradeLevel,
      topic: formData.topic,
      language: formData.language,
      method: formData.method
    });

  if (error) throw error;
};
