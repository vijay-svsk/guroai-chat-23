
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
            content: `You are an AI assistant for GuroAI, an AI-powered educational platform that helps teachers with lesson planning tools.
            
Here's information about GuroAI:
- GuroAI is built for teachers and educational professionals
- It offers AI-powered lesson planning tools
- It can generate complete lesson plans based on teacher inputs
- It helps teachers save time and create more engaging content
- It has features for creating slide presentations 
- The name "Guro" means "teacher" in Filipino
- The platform offers monthly subscription options
- Users can chat with GuroAI for assistance with educational content
- GuroAI can analyze and explain documents uploaded by teachers
- It is a modern web application focused on helping educators
- It has an intuitive, user-friendly interface designed for teachers

Answer users' questions about GuroAI in a friendly, helpful manner. If you don't know specific details like pricing or exact features, be honest that you have limited information. Always prioritize being helpful to potential users of the platform.`,
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
