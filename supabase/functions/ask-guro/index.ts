
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

    // Use Together API for text generation
    const response = await fetch('https://api.together.xyz/v1/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'mistralai/Mixtral-8x7B-Instruct-v0.1',
        prompt: `<s>[INST] You are GuroAI, a helpful AI teaching assistant that helps create lesson plans and educational content. Answer this question without asking for subscriptions or adding any extra marketing: ${question} [/INST]</s>`,
        max_tokens: 1000,
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
