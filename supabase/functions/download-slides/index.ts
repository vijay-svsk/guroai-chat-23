
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { slidesData } = await req.json()

    if (!slidesData) {
      return new Response(
        JSON.stringify({ error: 'No slides data provided' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      )
    }

    // Get the PPTX file from Abacus AI API
    const response = await fetch('https://api.abacus.ai/v0/download-slides', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${Deno.env.get('ABACUS_AI_KEY')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ slides: slidesData }),
    });

    if (!response.ok) {
      throw new Error(`Failed to download slides: ${response.statusText}`);
    }

    const pptxBuffer = await response.arrayBuffer();

    return new Response(
      pptxBuffer,
      { 
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
          'Content-Disposition': 'attachment; filename="presentation.pptx"'
        },
        status: 200 
      }
    );
  } catch (error) {
    console.error('Error in download-slides function:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to generate PPTX file' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    )
  }
})
