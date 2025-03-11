
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// No cleanup to preserve formatting
const cleanResponse = (text: string) => {
  return text.trim();
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Default to the provided API key if none is sent
    const { question, apiKey = "aaba53e54192b3dd8454bff28451d27c4f8e23de88600cce9d074f4db1dc0066" } = await req.json();

    // Check if the query is about creating a lesson plan
    const isLessonPlanQuery = 
      question.toLowerCase().includes("lesson plan") || 
      question.toLowerCase().includes("make a lesson") ||
      question.toLowerCase().includes("create a lesson");

    let prompt = '';
    
    if (isLessonPlanQuery) {
      prompt = `<s>[INST] You are GuroAI, an AI teaching assistant specializing in creating lesson plans. Create a detailed lesson plan using a 2-column format. Column 1 should list each section and Column 2 should contain the corresponding content. 

Include:
A. Content Standard
B. Performance Standard
C. Learning Competencies
D. MELC-Based Competency
E. Objectives (Cognitive, Psychomotor, Affective - 1 each)
II. Subject Matter (Topic, References, Materials)
III. Procedure with all subsections

For images, include descriptive prompts for DALL-E starting with "IMAGE PROMPT:" on their own lines.
The lesson plan should be comprehensive with content organized in 2 columns clearly labeled.

The user is asking: ${question} [/INST]</s>`;
    } else {
      prompt = `<s>[INST] You are GuroAI, a helpful AI teaching assistant that helps create lesson plans and educational content. Answer this question without asking for subscriptions or adding any extra marketing: ${question} [/INST]</s>`;
    }

    // Use Together API for text generation
    const response = await fetch('https://api.together.xyz/v1/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'mistralai/Mixtral-8x7B-Instruct-v0.1',
        prompt: prompt,
        max_tokens: isLessonPlanQuery ? 3000 : 1000,
        temperature: 0.7,
      }),
    });

    const data = await response.json();
    
    if (data.error) {
      throw new Error(data.error.message || 'Error from Together API');
    }

    // Clean the response
    const cleanedContent = cleanResponse(data.choices[0].text);

    return new Response(
      JSON.stringify({ answer: cleanedContent }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error:', error);
    return new Response(
      JSON.stringify({ 
        error: 'An error occurred while processing your request',
        details: error.message 
      }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});
