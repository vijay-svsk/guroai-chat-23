
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell, WidthType } from "npm:docx";

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

    // Split content into lines and process them
    const lines = content.split('\n');
    const tableRows = [];
    let currentHeader = '';
    let currentContent = [];

    for (const line of lines) {
      if (line.trim() === '') continue;

      // Check if line is a header (e.g., "Content Standard:", "Performance Standard:")
      if (line.includes(':') && !line.startsWith(' ')) {
        // If we have accumulated content, add it to table
        if (currentHeader) {
          tableRows.push(new TableRow({
            children: [
              new TableCell({
                children: [new Paragraph({ children: [new TextRun({ text: currentHeader, bold: true })] })],
                width: { size: 30, type: WidthType.PERCENTAGE }
              }),
              new TableCell({
                children: currentContent.map(text => 
                  new Paragraph({ children: [new TextRun({ text })] })
                ),
                width: { size: 70, type: WidthType.PERCENTAGE }
              })
            ]
          }));
        }
        currentHeader = line.trim();
        currentContent = [];
      } else {
        currentContent.push(line.trim());
      }
    }

    // Add the last section
    if (currentHeader) {
      tableRows.push(new TableRow({
        children: [
          new TableCell({
            children: [new Paragraph({ children: [new TextRun({ text: currentHeader, bold: true })] })],
            width: { size: 30, type: WidthType.PERCENTAGE }
          }),
          new TableCell({
            children: currentContent.map(text => 
              new Paragraph({ children: [new TextRun({ text })] })
            ),
            width: { size: 70, type: WidthType.PERCENTAGE }
          })
        ]
      }));
    }

    // Create the document with the table
    const doc = new Document({
      sections: [{
        properties: {},
        children: [
          new Table({
            rows: tableRows,
            width: { size: 100, type: WidthType.PERCENTAGE }
          })
        ]
      }]
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
