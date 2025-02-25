
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

    const formData = await req.formData();
    const file = formData.get('file');
    const instructions = formData.get('instructions') || '';

    if (!file || !(file instanceof File)) {
      throw new Error('No file provided or invalid file format');
    }

    console.log('Processing file:', file.name, 'size:', file.size);

    // Read file as ArrayBuffer and convert to base64
    const fileArrayBuffer = await file.arrayBuffer();
    const uint8Array = new Uint8Array(fileArrayBuffer);
    const base64Content = btoa(String.fromCharCode.apply(null, uint8Array));

    console.log('Making request to Abacus AI API...');
    
    const response = await fetch('https://api.abacus.ai/v0/generate-slides', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${abacusApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        content: base64Content,
        fileName: file.name,
        instructions: instructions,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Abacus AI API error:', errorText);
      throw new Error(`Abacus AI API error: ${response.statusText}`);
    }

    const data = await response.json();
    console.log('Successfully generated slides');

    return new Response(JSON.stringify(data), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
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
