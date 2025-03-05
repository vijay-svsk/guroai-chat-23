
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
    const { formData, questions } = await req.json();
    
    // Create the prompt based on form data and questions
    const prompt = `
Generate a Table of Specification (TOS) based on Bloom's Taxonomy for a ${formData.examType} quiz on ${formData.topic} for ${formData.gradeLevel} ${formData.subject}.
The quiz has ${formData.numberOfItems} questions.

Here are the questions to analyze:
${questions.map((q, i) => `${i+1}. ${q.question}`).join('\n')}

Create a TOS that categorizes these questions according to Bloom's Taxonomy levels:
1. Knowledge/Remembering
2. Comprehension/Understanding
3. Application/Applying
4. Analysis/Analyzing
5. Synthesis/Evaluating
6. Evaluation/Creating

Format the output as valid JSON with the following structure:
{
  "domains": [
    {
      "level": "Knowledge/Remembering",
      "numberOfItems": 5,
      "percentage": 25
    },
    ...other domains...
  ],
  "totalItems": 20
}

Ensure that:
1. The number of items across all domains sums to the total number of items (${formData.numberOfItems})
2. The percentages add up to 100%
3. The distribution is appropriate for the ${formData.gradeLevel} level and ${formData.subject} subject
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
            content: "You are an expert educational assessment specialist. Create accurate and detailed Tables of Specification based on Bloom's Taxonomy."
          },
          { role: "user", content: prompt }
        ],
        temperature: 0.3,
      }),
    });

    if (!openaiResponse.ok) {
      const error = await openaiResponse.json();
      throw new Error(error.error?.message || "Failed to generate TOS");
    }

    const data = await openaiResponse.json();
    const tosContent = data.choices[0].message.content;
    
    // Extract the JSON from the response
    let tos;
    try {
      // Find JSON in the response (handling potential text before/after JSON)
      const jsonMatch = tosContent.match(/(\{[\s\S]*\})/);
      if (jsonMatch) {
        tos = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error("Could not extract JSON from response");
      }
    } catch (e) {
      console.error("Error parsing TOS JSON:", e);
      throw new Error("Failed to parse the generated TOS");
    }

    return new Response(JSON.stringify({ tos }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error in generate-tos function:", error);
    return new Response(
      JSON.stringify({ error: error.message || "An error occurred" }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
