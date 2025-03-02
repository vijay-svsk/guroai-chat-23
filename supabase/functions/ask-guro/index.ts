
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const perplexityApiKey = Deno.env.get('PERPLEXITY_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Function to clean response text by removing # and * characters
const cleanResponse = (text: string) => {
  return text.replace(/[#*]/g, "").trim();
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { question } = await req.json();

    // Check if this is an image generation request
    if (question.toLowerCase().startsWith('generate an image')) {
      // For image generation, we'll use a different approach since Perplexity doesn't support image generation directly
      // We'll use a text response that explains this limitation
      return new Response(
        JSON.stringify({
          answer: "I'm sorry, but image generation is currently not supported in this version. Please ask me a question I can help you with instead.",
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // If not an image request, proceed with Perplexity API
    const response = await fetch('https://api.perplexity.ai/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${perplexityApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama-3.1-sonar-small-128k-online',  // Using llama 3.1 small model (8B parameters)
        messages: [
          { 
            role: 'system', 
            content: 'You are GuroAI, a helpful AI teaching assistant that helps create lesson plans and educational content.' 
          },
          { role: 'user', content: question }
        ],
        temperature: 0.2,
        top_p: 0.9,
        max_tokens: 1000,
        stream: false,
      }),
    });

    const data = await response.json();
    
    if (data.error) {
      throw new Error(data.error.message || 'Error from Perplexity API');
    }

    // Clean the response to remove # and * characters
    const cleanedContent = cleanResponse(data.choices[0].message.content);

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
