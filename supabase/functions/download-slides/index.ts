
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import * as pptxgen from "https://esm.sh/pptxgenjs@3.12.0";

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
    console.log('Starting PPTX generation...');
    const { slidesData } = await req.json();

    if (!slidesData || !slidesData.slides) {
      throw new Error('Invalid slides data provided');
    }

    console.log('Received slides data:', JSON.stringify(slidesData));

    // Create a new presentation
    const pres = new pptxgen();
    
    // Set default slide properties
    pres.defineLayout({ name: 'CUSTOM', width: 10, height: 5.625 });
    pres.layout = 'CUSTOM';

    // Generate slides based on the data structure
    console.log('Generating slides...');
    slidesData.slides.forEach((slideData: any, index: number) => {
      console.log(`Creating slide ${index + 1} of type: ${slideData.type}`);
      const slide = pres.addSlide();
      
      try {
        switch (slideData.type) {
          case 'title':
            createTitleSlide(slide, slideData.content);
            break;
          case 'objectives':
            createObjectivesSlide(slide, slideData.content);
            break;
          case 'content':
            createContentSlide(slide, slideData.content);
            break;
          // Add more slide types as needed
          default:
            console.log(`Unknown slide type: ${slideData.type}`);
        }
      } catch (error) {
        console.error(`Error creating slide ${index + 1}:`, error);
        // Continue with next slide instead of failing completely
      }
    });

    // Generate the PPTX file
    console.log('Generating final PPTX file...');
    const pptxBuffer = await pres.write('base64');
    console.log('PPTX file generated successfully');

    return new Response(
      JSON.stringify({ pptxData: pptxBuffer }),
      { 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        } 
      }
    );

  } catch (error) {
    console.error('Error in download-slides function:', error);
    return new Response(
      JSON.stringify({ 
        error: 'Failed to generate PPTX', 
        details: error.message 
      }),
      { 
        status: 500, 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        } 
      }
    );
  }
});

function createTitleSlide(slide: any, content: { title: string; subtitle: string }) {
  if (!content) {
    console.warn('No content provided for title slide');
    return;
  }
  
  slide.addText(content.title || 'Untitled Presentation', {
    x: '10%',
    y: '40%',
    w: '80%',
    fontSize: 44,
    bold: true,
    align: 'center'
  });

  if (content.subtitle) {
    slide.addText(content.subtitle, {
      x: '10%',
      y: '60%',
      w: '80%',
      fontSize: 24,
      align: 'center'
    });
  }
}

function createObjectivesSlide(slide: any, content: { title: string; items: string[] }) {
  if (!content) {
    console.warn('No content provided for objectives slide');
    return;
  }

  slide.addText(content.title || 'Objectives', {
    x: '10%',
    y: '10%',
    w: '80%',
    fontSize: 32,
    bold: true
  });

  if (Array.isArray(content.items)) {
    content.items.forEach((item: string, index: number) => {
      slide.addText(item, {
        x: '15%',
        y: `${30 + (index * 15)}%`,
        w: '70%',
        fontSize: 24,
        bullet: true
      });
    });
  }
}

function createContentSlide(slide: any, content: { title: string; text: string }) {
  if (!content) {
    console.warn('No content provided for content slide');
    return;
  }

  slide.addText(content.title || 'Content', {
    x: '10%',
    y: '10%',
    w: '80%',
    fontSize: 32,
    bold: true
  });

  if (content.text) {
    slide.addText(content.text, {
      x: '10%',
      y: '30%',
      w: '80%',
      fontSize: 20
    });
  }
}

