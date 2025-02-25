
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const formData = await req.formData();
    const subject = formData.get('subject')?.toString() || '';
    const gradeLevel = formData.get('gradeLevel')?.toString() || '';
    const topic = formData.get('topic')?.toString() || '';
    const instructions = formData.get('instructions')?.toString() || '';
    const file = formData.get('file');

    let contentPrompt = `Create a detailed presentation outline for a ${gradeLevel} ${subject} class about ${topic}.`;
    
    if (file) {
      const content = await file.text();
      contentPrompt += `\nUse this additional content as reference: ${content}`;
    }

    if (instructions) {
      contentPrompt += `\nAdditional instructions: ${instructions}`;
    }

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: [
          {
            role: 'system',
            content: `You are an expert teacher and presentation creator. Create engaging and educational slide presentations.
            For each slide, specify its type (title, content, bullets) and content.
            Return the presentation as a JSON object with this structure:
            {
              "slides": [
                {
                  "type": "title|content|bullets",
                  "content": {
                    "title": "string",
                    "subtitle?": "string",
                    "text?": "string",
                    "points?": ["string"]
                  },
                  "notes": "string"
                }
              ]
            }`
          },
          { role: 'user', content: contentPrompt }
        ],
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.statusText}`);
    }

    const data = await response.json();
    const slidesContent = data.choices[0].message.content;
    
    try {
      // Parse the response to ensure it's valid JSON
      const parsedSlides = JSON.parse(slidesContent);
      return new Response(JSON.stringify(parsedSlides), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    } catch (parseError) {
      console.error('Error parsing OpenAI response:', parseError);
      throw new Error('Failed to parse slides data from OpenAI');
    }

  } catch (error) {
    console.error('Error in generate-slides-with-chatgpt function:', error);
    return new Response(
      JSON.stringify({ 
        error: 'Failed to generate slides', 
        details: error.message 
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});
