
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import "https://deno.land/x/xhr@0.1.0/mod.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, openai-api-key",
};

serve(async (req) => {
  // Handle CORS preflight request
  if (req.method === "OPTIONS") {
    return new Response(null, {
      headers: corsHeaders,
    });
  }

  try {
    const { message, apiKey } = await req.json();

    // Basic API key validation
    if (!apiKey || !apiKey.startsWith("sk-")) {
      return new Response(
        JSON.stringify({ error: "Invalid API key format" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Call OpenAI API
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini", // Use a newer, cost-effective model
        messages: [
          {
            role: "system",
            content: `You are GuroAI Assistant, a helpful and knowledgeable AI designed to answer questions about GuroAI.

About GuroAI:
- GuroAI is an AI-powered tool that simplifies lesson planning for teachers
- It generates high-quality lesson plans, quizzes, slide presentations, reports, and more within seconds
- GuroAI is compliant with DepEd PMES guidelines and supports differentiated instruction, HOTs integration, and clear objectives
- Key features include Lesson Plan Customization (supporting 7Es and 4As formats or allows full customization)
- Integration of content within and across curriculum teaching areas
- Differentiated Activities tailored to meet diverse student needs
- PMES Annotation for compliance with DepEd standards
- Affordable Subscription at only 299 PHP per month, making it 6x faster and cheaper than other AI tools like ChatGPT
- Available for download via the Google Play Store

Subscription Information:
- The subscription fee is 299 PHP per month
- Gives access to all features including lesson plan generation, quizzes, and more

When answering questions:
- Provide clear, concise, and accurate responses
- Focus on GuroAI's features, subscription details, and benefits for teachers
- Always maintain a friendly and professional tone
- Emphasize how GuroAI makes teachers' work more efficient and aligned with educational standards`,
          },
          { role: "user", content: message },
        ],
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || "Failed to get response from OpenAI");
    }

    const data = await response.json();
    const answer = data.choices[0].message.content;

    return new Response(JSON.stringify({ answer }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error in chat function:", error);
    return new Response(
      JSON.stringify({ error: error.message || "An error occurred" }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
