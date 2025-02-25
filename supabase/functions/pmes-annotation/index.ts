
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { content } = await req.json();

    if (!content) {
      throw new Error('No lesson plan content provided');
    }

    console.log('Received lesson plan for PMES annotation');

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
            content: `You are a highly experienced teacher and PMES (Philippine Professional Standards for Teachers) expert. 
            Your task is to analyze lesson plans and provide detailed annotations based on PMES standards.
            
            Focus on these key PMES domains and competencies:
            1. Content Knowledge and Pedagogy
            2. Learning Environment
            3. Diversity of Learners
            4. Curriculum and Planning
            5. Assessment and Reporting
            6. Community Linkages and Professional Engagement
            7. Personal Growth and Professional Development
            
            For each lesson plan, provide:
            1. A brief summary of the lesson plan's strengths
            2. Specific annotations for each PMES domain relevant to the lesson plan
            3. Concrete suggestions for improvement
            4. An overall rating from 1-5 for PMES alignment
            
            Format your response with clear headings and bullet points for readability.`
          },
          { 
            role: 'user', 
            content: `Please analyze and annotate the following lesson plan according to PMES standards:\n\n${content}`
          }
        ],
        temperature: 0.5,
        max_tokens: 2000,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('OpenAI API error:', errorData);
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    const annotations = data.choices[0].message.content;

    console.log('Successfully generated PMES annotations');

    return new Response(
      JSON.stringify({ annotations }),
      { 
        status: 200, 
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json' 
        }
      }
    );
  } catch (error) {
    console.error('Error in pmes-annotation function:', error);
    
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500, 
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json' 
        }
      }
    );
  }
});
