
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
      console.error('ABACUS_AI_KEY not found');
      return new Response(
        JSON.stringify({ error: 'API key configuration error' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
      );
    }

    const formData = await req.formData();
    const file = formData.get('file');
    const instructions = formData.get('instructions') || '';

    if (!file || !(file instanceof File)) {
      console.error('Invalid file input');
      return new Response(
        JSON.stringify({ error: 'No file provided or invalid file format' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      );
    }

    console.log(`Processing file: ${file.name} (${file.size} bytes)`);
    console.log(`File type: ${file.type}`);

    // Convert file to base64
    const arrayBuffer = await file.arrayBuffer();
    const bytes = new Uint8Array(arrayBuffer);
    const base64Content = btoa(String.fromCharCode(...bytes));

    console.log('File converted to base64, making request to Abacus AI API...');
    
    const response = await fetch('https://api.abacus.ai/v0/generate-slides', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${abacusApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        content: base64Content,
        fileName: file.name,
        instructions,
      }),
    });

    const responseText = await response.text();
    console.log(`Abacus API response status: ${response.status}`);
    console.log('Response body:', responseText);

    if (!response.ok) {
      console.error('Abacus AI API error:', responseText);
      return new Response(
        JSON.stringify({ 
          error: 'Failed to generate slides',
          details: response.statusText,
          status: response.status 
        }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }, 
          status: response.status 
        }
      );
    }

    let data;
    try {
      data = JSON.parse(responseText);
    } catch (e) {
      console.error('Error parsing JSON response:', e);
      return new Response(
        JSON.stringify({ error: 'Invalid response from AI service' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
      );
    }

    console.log('Successfully generated slides');
    return new Response(
      JSON.stringify(data),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in generate-slides function:', error);
    return new Response(
      JSON.stringify({ 
        error: 'An unexpected error occurred', 
        message: error.message,
        stack: error.stack 
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    );
  }
});
