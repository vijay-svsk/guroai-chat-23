
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import "https://deno.land/x/xhr@0.1.0/mod.ts";

const slidesGPTApiKey = Deno.env.get('SLIDESGPT_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('Starting slides generation...');
    
    const formData = await req.formData();
    const file = formData.get('file');
    const instructions = formData.get('instructions') || '';

    if (!file || !(file instanceof File)) {
      throw new Error('No file provided or invalid file format');
    }

    console.log(`Processing file: ${file.name} (${file.size} bytes)`);
    console.log(`Instructions: ${instructions}`);

    // Read file content
    const fileContent = await file.text();
    
    // Call SlidesGPT API to generate slides structure
    console.log('Calling SlidesGPT API...');
    const slidesGPTResponse = await fetch('https://api.slidesgpt.com/v1/generate', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${slidesGPTApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        content: fileContent,
        instructions: instructions,
        outputFormat: 'json',
        slideCount: 33, // Maintaining the previous requirement
        includeNotes: true,
      }),
    });

    if (!slidesGPTResponse.ok) {
      const errorData = await slidesGPTResponse.json();
      console.error('SlidesGPT API Error:', errorData);
      throw new Error(`SlidesGPT API error: ${errorData.message || 'Unknown error'}`);
    }

    const slidesData = await slidesGPTResponse.json();
    console.log('Successfully generated slides data');

    return new Response(
      JSON.stringify(slidesData),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error generating slides:', error);
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
