
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  Table,
  TableRow,
  TableCell,
  WidthType,
} from "npm:docx";

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

    // Define the section headers for Column 1
    const sectionHeaders = [
      "A. Content Standard",
      "B. Performance Standard",
      "C. Learning Competencies",
      "D. MELC-Based Competency",
      "E. Objectives",
      "1. Cognitive",
      "2. Psychomotor",
      "3. Affective",
      "II. SUBJECT MATTER",
      "A. TOPIC",
      "B. REFERENCES",
      "C. MATERIALS",
      "III. Procedure",
      "A. PRELIMINARIES",
      "1. Reviewing previous lesson",
      "2. Establishing purpose (Motivation)",
      "B. PRESENTING EXAMPLES/INSTANCES",
      "C. DISCUSSING NEW CONCEPT AND SKILLS #1",
      "D. DISCUSSING NEW CONCEPT AND SKILLS #2",
      "E. DEVELOPING MASTERY",
      "F. PRACTICAL APPLICATION",
      "G. GENERALIZATION",
      "IV. EVALUATION",
      "V. ASSIGNMENT"
    ];

    // Parse content into sections
    const sections: { [key: string]: string } = {};
    let currentSection = "";
    let currentContent = "";
    
    content.split('\n').forEach((line) => {
      const trimmedLine = line.trim();
      if (sectionHeaders.some(header => 
        trimmedLine.toLowerCase().includes(header.toLowerCase().replace(/[^a-zA-Z\s]/g, '')))) {
        if (currentSection) {
          sections[currentSection] = currentContent.trim();
        }
        currentSection = trimmedLine;
        currentContent = "";
      } else {
        currentContent += line + "\n";
      }
    });
    if (currentSection) {
      sections[currentSection] = currentContent.trim();
    }

    // Create table with two columns
    const table = new Table({
      width: {
        size: 100,
        type: WidthType.PERCENTAGE,
      },
      columnWidths: [30, 70],
      margins: {
        top: 100,
        bottom: 100,
        right: 100,
        left: 100,
      },
    });

    // Add rows to table
    sectionHeaders.forEach((header) => {
      const row = new TableRow({
        children: [
          new TableCell({
            children: [new Paragraph({
              children: [new TextRun({ text: header, bold: true })],
            })],
            width: {
              size: 30,
              type: WidthType.PERCENTAGE,
            },
          }),
          new TableCell({
            children: [new Paragraph({
              children: [new TextRun({ 
                text: Object.entries(sections)
                  .find(([key]) => key.toLowerCase().includes(header.toLowerCase().replace(/[^a-zA-Z\s]/g, '')))
                  ?.[1] || " "
              })],
            })],
            width: {
              size: 70,
              type: WidthType.PERCENTAGE,
            },
          }),
        ],
      });
      table.addRow(row);
    });

    // Create document with the table
    const doc = new Document({
      sections: [{
        properties: {},
        children: [table],
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
