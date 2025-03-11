
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

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
      if (!openAIApiKey) {
        throw new Error('OPENAI_API_KEY is not set');
      }

      const imagePrompt = question.replace(/^generate an image( about)?/i, '').trim();
      
      // Make request to OpenAI DALL-E API for image generation
      const imageResponse = await fetch('https://api.openai.com/v1/images/generations', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${openAIApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: "dall-e-3",
          prompt: imagePrompt,
          n: 1,
          size: "1024x1024"
        }),
      });

      const imageData = await imageResponse.json();
      
      if (imageData.error) {
        throw new Error(imageData.error.message || 'Error generating image');
      }

      const imageUrl = imageData.data?.[0]?.url;
      if (!imageUrl) {
        throw new Error('No image was generated');
      }

      // Return both the image URL and a descriptive message
      return new Response(
        JSON.stringify({
          answer: `I've generated an image based on your prompt: "${imagePrompt}"\n\n![Generated Image](${imageUrl})`,
          imageUrl: imageUrl
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // If not an image request, proceed with regular chat completion using GPT-4o
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o', // Using GPT-4o (which is the latest model replacing previous 4.5)
        messages: [
          { 
            role: 'system', 
            content: 'You are GuroAI, a powerful AI assistant for teachers and educators. You are here to help with ANY question or request users have, including creating lesson plans, teaching materials, accomplishment reports, quizzes, or any educational content. You should NEVER mention subscriptions, payments, or redirecting users to "unlock" features. Users in this chat already have full access to all features. Provide direct, helpful, and detailed responses to any query, and offer to help create any type of educational content they need. Your goal is to be as useful as possible and provide complete answers without redirecting users elsewhere.'
          },
          { role: 'user', content: question }
        ],
        temperature: 0.7,
        max_tokens: 1000,
      }),
    });

    const data = await response.json();
    if (data.error) {
      throw new Error(data.error.message);
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
