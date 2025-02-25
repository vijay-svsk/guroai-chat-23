
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
    const abacusApiKey = Deno.env.get('ABACUS_AI_KEY');
    if (!abacusApiKey) {
      throw new Error('ABACUS_AI_KEY not found in environment variables');
    }

    const { slidesData } = await req.json();
    if (!slidesData) {
      throw new Error('No slides data provided');
    }

    console.log('Making request to Abacus AI API for PPTX download...');
    
    const response = await fetch('https://api.abacus.ai/v0/download-slides', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${abacusApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        slidesData: slidesData
      }),
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('Abacus AI API error:', errorData);
      throw new Error(`Abacus AI API error: ${response.statusText}`);
    }

    const pptxBuffer = await response.arrayBuffer();
    console.log('Successfully downloaded PPTX');

    return new Response(pptxBuffer, {
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
        'Content-Disposition': 'attachment; filename="presentation.pptx"'
      },
    });
  } catch (error) {
    console.error('Error in download-slides function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    );
  }
});
