
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import "https://deno.land/x/xhr@0.1.0/mod.ts";

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
    const formData = await req.formData();
    const file = formData.get('file');
    const instructions = formData.get('instructions');

    if (!file) {
      throw new Error('No file provided');
    }

    // Here we'll use the existing Abacus AI integration to generate slides
    // The exact implementation will depend on the Abacus AI API specifications
    const response = await fetch('https://api.abacus.ai/v0/generate-slides', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${Deno.env.get('ABACUS_AI_KEY')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        file: file,
        instructions: instructions || '',
      }),
    });

    if (!response.ok) {
      throw new Error(`Abacus AI API error: ${response.statusText}`);
    }

    const data = await response.json();

    return new Response(
      JSON.stringify(data),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );
  } catch (error) {
    console.error('Error in generate-slides function:', error);
    
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    );
  }
});
