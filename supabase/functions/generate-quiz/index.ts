
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import "https://deno.land/x/xhr@0.1.0/mod.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight request
  if (req.method === "OPTIONS") {
    return new Response(null, {
      headers: corsHeaders,
    });
  }

  try {
    const { formData } = await req.json();
    
    // Create the prompt based on form data
    const prompt = `
Generate a ${formData.examType} quiz for ${formData.subject} at the ${formData.gradeLevel} level on the topic: ${formData.topic}.
The quiz should have ${formData.numberOfItems} questions.
${formData.instructions ? `Additional instructions: ${formData.instructions}` : ''}

For the output, please provide:
1. A clear instruction for the quiz
2. ${formData.numberOfItems} well-written questions

${formData.examType === "multiple-choice" ? "For multiple choice questions, provide 4 options (A, B, C, D) for each question." : ""}
${formData.examType === "true-false" ? "For true or false questions, provide statements that can be clearly evaluated as true or false." : ""}
${formData.examType === "fill-in-the-blanks" ? "For fill in the blanks, use underscores to indicate where words should be filled in." : ""}
${formData.examType === "matching-type" ? "For matching type questions, provide two columns - one with items to match and another with options." : ""}

Format the output as valid JSON with the following structure:
{
  "instructions": "string with instructions for students",
  "questions": [
    {
      "question": "the question text",
      ${formData.examType === "multiple-choice" ? '"options": ["option A", "option B", "option C", "option D"],' : ''}
      "answer": "the correct answer"
    }
  ]
}
`;

    // Call OpenAI API
    const openaiResponse = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${Deno.env.get("OPENAI_API_KEY")}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: "You are an expert educational quiz generator. Create high-quality quiz questions appropriate for the specified grade level and subject. Format your output exactly as requested."
          },
          { role: "user", content: prompt }
        ],
        temperature: 0.7,
      }),
    });

    if (!openaiResponse.ok) {
      const error = await openaiResponse.json();
      throw new Error(error.error?.message || "Failed to generate quiz");
    }

    const data = await openaiResponse.json();
    const quizContent = data.choices[0].message.content;
    
    // Extract the JSON from the response
    let quiz;
    try {
      // Find JSON in the response (handling potential text before/after JSON)
      const jsonMatch = quizContent.match(/(\{[\s\S]*\})/);
      if (jsonMatch) {
        quiz = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error("Could not extract JSON from response");
      }
    } catch (e) {
      console.error("Error parsing quiz JSON:", e);
      throw new Error("Failed to parse the generated quiz");
    }

    return new Response(JSON.stringify({ quiz }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error in generate-quiz function:", error);
    return new Response(
      JSON.stringify({ error: error.message || "An error occurred" }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
