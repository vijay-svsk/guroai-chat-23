
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell, WidthType, HeadingLevel } from "npm:docx";

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

    console.log('Received quiz content length:', content.length);

    // Parse content into instructions and questions
    const lines = content.split('\n');
    let instructions = '';
    let currentQuestion = '';
    let currentOptions = [];
    const questions = [];

    // Extract instructions line
    if (lines.length > 0 && lines[0].startsWith('Instructions:')) {
      instructions = lines[1] || 'Answer the following questions:';
    }

    // Process questions and options
    for (const line of lines) {
      if (line.match(/^\d+\./)) {
        // This is a new question
        if (currentQuestion) {
          questions.push({
            question: currentQuestion,
            options: currentOptions.length > 0 ? currentOptions : null
          });
        }
        currentQuestion = line.replace(/^\d+\.\s*/, '');
        currentOptions = [];
      } else if (line.match(/^\s+[A-D]\./)) {
        // This is an option
        currentOptions.push(line.trim());
      }
    }

    // Add the last question
    if (currentQuestion) {
      questions.push({
        question: currentQuestion,
        options: currentOptions.length > 0 ? currentOptions : null
      });
    }

    // Create document
    const doc = new Document({
      sections: [{
        properties: {},
        children: [
          new Paragraph({
            text: "Quiz",
            heading: HeadingLevel.HEADING_1,
            spacing: { after: 200 }
          }),
          new Paragraph({
            children: [
              new TextRun({ text: "Instructions: ", bold: true }),
              new TextRun({ text: instructions })
            ],
            spacing: { after: 400 }
          }),
          ...questions.flatMap((q, index) => {
            const questionParagraphs = [
              new Paragraph({
                children: [
                  new TextRun({ text: `${index + 1}. ${q.question}`, bold: false })
                ],
                spacing: { before: 200, after: 200 }
              })
            ];

            if (q.options && q.options.length > 0) {
              questionParagraphs.push(
                ...q.options.map(option => 
                  new Paragraph({
                    children: [new TextRun({ text: option })],
                    indent: { left: 720 },  // 0.5 inch indent
                    spacing: { after: 120 }
                  })
                )
              );
            }

            return questionParagraphs;
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
    console.error('Error in generate-quiz-docx function:', error);
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
