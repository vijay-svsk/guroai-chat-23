
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { Document, Packer, Paragraph, TextRun } from "npm:docx";

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
      throw new Error('Content is required');
    }

    console.log('Received content length:', content.length);

    // Create a new document
    const doc = new Document({
      sections: [{
        properties: {},
        children: content.split('\n').map(line => 
          new Paragraph({
            children: [
              new TextRun({
                text: line || ' ', // Handle empty lines
                size: 24, // 12pt font
              }),
            ],
          })
        ),
      }],
    });

    console.log('Document created successfully');

    // Generate the docx file
    const buffer = await Packer.toBuffer(doc);
    console.log('Buffer generated, size:', buffer.byteLength);

    // Convert buffer to base64
    const base64 = btoa(String.fromCharCode(...new Uint8Array(buffer)));
    console.log('Base64 conversion complete');

    return new Response(
      JSON.stringify({ docxBase64: base64 }),
      { 
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      }
    );
  } catch (error) {
    console.error('Error in generate-lesson-plan-docx function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      }
    );
  }
});
