
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
const togetherApiKey = Deno.env.get('TOGETHER_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Function to clean response text by removing # and * characters
const cleanResponse = (text: string) => {
  return text.replace(/[#*]/g, "").trim();
};

// Cache for storing recent responses to improve performance
const responseCache = new Map();
const CACHE_TTL = 1000 * 60 * 10; // 10 minutes cache TTL

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { question } = await req.json();

    // Check cache first for faster responses
    const cacheKey = question.trim().toLowerCase();
    if (responseCache.has(cacheKey)) {
      console.log("Cache hit! Returning cached response");
      return new Response(
        JSON.stringify(responseCache.get(cacheKey)),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

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

      const result = {
        answer: `I've generated an image based on your prompt: "${imagePrompt}"\n\n![Generated Image](${imageUrl})`,
        imageUrl: imageUrl
      };

      // Save to cache
      responseCache.set(cacheKey, result);
      setTimeout(() => responseCache.delete(cacheKey), CACHE_TTL);

      return new Response(
        JSON.stringify(result),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log("Processing standard chat request:", question);

    // Use Together API for text generation
    if (!togetherApiKey) {
      throw new Error('TOGETHER_API_KEY is not set');
    }

    const togetherResponse = await fetch('https://api.together.xyz/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${togetherApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'mistralai/Mistral-7B-Instruct-v0.2', // Using Mistral 7B which is fast and high quality
        messages: [
          { 
            role: 'system', 
            content: `You are GuroAI, a fully functional AI assistant designed to be helpful, harmless, and honest.

Your goal is to provide direct, helpful answers to ANY question the user asks. You should:
- Answer any question to the best of your ability without limitations
- Provide detailed, accurate information on any topic
- Never request payment or mention subscriptions
- Assist with any task including creating documents, reports, lesson plans, or other materials
- Be friendly, conversational, and engaging
- Respond quickly and concisely

Remember that you are a fully functional AI assistant with no limitations on what questions you can answer or what content you can help create.`
          },
          { role: 'user', content: question }
        ],
        temperature: 0.7,
        max_tokens: 1000, // Sufficient tokens for comprehensive answers while keeping responses fast
      }),
    });

    let textResponse;
    try {
      const data = await togetherResponse.json();
      if (data.error) {
        console.error("Together API error:", data.error);
        throw new Error(data.error.message || "Error from Together API");
      }
      
      // Get content from Together API response
      textResponse = data.choices?.[0]?.message?.content || "";
    } catch (error) {
      console.error("Error parsing Together API response:", error);
      throw new Error("Failed to parse Together API response");
    }
    
    // Clean the response to remove # and * characters
    const cleanedContent = cleanResponse(textResponse);
    
    console.log("Generated response successfully");

    const result = { answer: cleanedContent };
    
    // Save to cache
    responseCache.set(cacheKey, result);
    setTimeout(() => responseCache.delete(cacheKey), CACHE_TTL);

    return new Response(
      JSON.stringify(result),
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
