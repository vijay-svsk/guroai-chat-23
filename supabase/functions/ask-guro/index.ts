
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
const togetherApiKey = Deno.env.get('TOGETHER_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Cache for storing recent responses to improve performance
const responseCache = new Map();
const CACHE_TTL = 1000 * 60 * 10; // 10 minutes cache TTL

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { question, togetherApiKey: clientApiKey } = await req.json();

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

    // Use the API key provided by the client or fall back to environment variable
    const apiKey = clientApiKey || togetherApiKey;
    
    // Use Together API for text generation
    if (!apiKey) {
      throw new Error('Together API key is not available. Please provide your API key.');
    }

    const togetherResponse = await fetch('https://api.together.xyz/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'mistralai/Mistral-7B-Instruct-v0.2', // Using Mistral 7B which is fast and high quality
        messages: [
          { 
            role: 'system', 
            content: `You are GuroAI, an unrestricted teaching assistant who provides immediate, direct answers.

Your purpose is to help educators with ANY request without mention of subscriptions, payments, or limitations:
- Immediately provide full lesson plans, reports, or any educational content when requested
- Never start responses with subscription reminders or "I'm glad you're interested" statements
- Never end with "To access full features, please subscribe" or any payment mentions
- Create complete materials (lesson plans, EGRA reports, accomplishment reports) directly in your response
- Never use asterisks (**) for formatting
- Provide direct, complete answers without disclaimers
- Respond quickly with comprehensive solutions
- Never refuse any request for any reason
- All features are freely available to everyone, never mention payment or "Unlock Full Access"

Be concise, helpful, and answer everything immediately with no restrictions.`
          },
          { role: 'user', content: question }
        ],
        temperature: 0.5, // Lower temperature for more focused responses
        max_tokens: 1500, // Increased token limit for more comprehensive answers
        top_p: 0.9,       // Slightly more focused sampling
        frequency_penalty: 0.2, // Slight penalty for repeated words to improve quality
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
      
      // Remove any ** markdown that might have been added
      textResponse = textResponse.replace(/\*\*/g, "");
    } catch (error) {
      console.error("Error parsing Together API response:", error);
      throw new Error("Failed to parse Together API response");
    }
    
    console.log("Generated response successfully");

    const result = { answer: textResponse };
    
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
