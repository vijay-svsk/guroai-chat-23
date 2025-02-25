
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { PresentationEx } from "https://cdn.sheetjs.com/xlsx-0.19.3/package/xlsx.mjs";

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
    console.log('Starting slides generation...');
    
    // Get the form data
    const formData = await req.formData();
    const file = formData.get('file');
    const instructions = formData.get('instructions') || '';

    if (!file || !(file instanceof File)) {
      throw new Error('No file provided or invalid file format');
    }

    console.log(`Processing file: ${file.name} (${file.size} bytes)`);
    console.log(`File type: ${file.type}`);

    // Read the file content
    const fileContent = await file.text();
    console.log('File content loaded successfully');

    // Process the content to extract sections
    const sections = processContent(fileContent);
    console.log('Content processed into sections');

    // Generate slide data structure
    const slidesData = generateSlideStructure(sections, instructions);
    console.log('Slide structure generated');

    // Return the slides data
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

function processContent(content: string) {
  const sections: Record<string, any> = {
    title: '',
    objectives: [],
    reviewingLesson: '',
    motivation: {
      instructions: '',
      questions: []
    },
    examples: {
      content: '',
      discussion: ''
    },
    newConcepts1: [],
    newConcepts2: [],
    mastery: {
      instructions: '',
      criteria: []
    },
    practicalApplication: [],
    generalization: '',
    evaluation: {
      instructions: '',
      questions: []
    },
    assignment: ''
  };

  // Extract sections from content using regex patterns
  const lines = content.split('\n');
  let currentSection = '';

  for (const line of lines) {
    if (line.includes('TOPIC:')) {
      sections.title = line.split('TOPIC:')[1].trim();
    } else if (line.includes('Objectives')) {
      currentSection = 'objectives';
    } else if (line.includes('Reviewing previous lesson')) {
      currentSection = 'reviewingLesson';
    } else if (line.includes('Establishing the purpose')) {
      currentSection = 'motivation';
    }
    // Add content to appropriate section
    // ... Continue parsing other sections based on content structure
  }

  return sections;
}

function generateSlideStructure(sections: Record<string, any>, instructions: string) {
  return {
    slides: [
      {
        type: 'title',
        content: {
          title: sections.title,
          subtitle: instructions || 'Lesson Presentation'
        }
      },
      {
        type: 'objectives',
        content: {
          title: 'Objectives',
          items: sections.objectives.slice(0, 3)
        }
      },
      // ... Generate remaining slides according to structure
      {
        type: 'assignment',
        content: {
          title: 'Assignment',
          text: sections.assignment
        }
      }
    ]
  };
}
