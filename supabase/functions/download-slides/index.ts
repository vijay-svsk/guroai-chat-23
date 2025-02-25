
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import * as pptxgen from "https://esm.sh/pptxgenjs@3.12.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('Starting PPTX generation...');
    const { slidesData } = await req.json();

    if (!slidesData || !slidesData.slides) {
      throw new Error('Invalid slides data provided');
    }

    console.log(`Processing ${slidesData.slides.length} slides...`);

    // Create a new presentation
    const pres = new pptxgen();
    
    // Set default slide properties
    pres.defineLayout({ name: 'CUSTOM', width: 10, height: 5.625 });
    pres.layout = 'CUSTOM';

    // Generate slides based on the data structure
    slidesData.slides.forEach((slideData: any, index: number) => {
      console.log(`Creating slide ${index + 1} of type: ${slideData.type}`);
      const slide = pres.addSlide();
      
      try {
        switch (slideData.type.toLowerCase()) {
          case 'title':
            createTitleSlide(slide, slideData.content);
            break;
          case 'content':
            createContentSlide(slide, slideData.content);
            break;
          case 'bullets':
            createBulletsSlide(slide, slideData.content);
            break;
          default:
            console.log(`Using default template for slide type: ${slideData.type}`);
            createDefaultSlide(slide, slideData.content);
        }

        // Add speaker notes if available
        if (slideData.notes) {
          slide.addNotes(slideData.notes);
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
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
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
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});

function createTitleSlide(slide: any, content: { title: string; subtitle?: string }) {
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

function createContentSlide(slide: any, content: { title: string; text: string }) {
  slide.addText(content.title || 'Content', {
    x: '10%',
    y: '10%',
    w: '80%',
    fontSize: 32,
    bold: true
  });

  slide.addText(content.text || '', {
    x: '10%',
    y: '30%',
    w: '80%',
    fontSize: 20,
    align: 'left'
  });
}

function createBulletsSlide(slide: any, content: { title: string; points: string[] }) {
  slide.addText(content.title || 'Key Points', {
    x: '10%',
    y: '10%',
    w: '80%',
    fontSize: 32,
    bold: true
  });

  const points = Array.isArray(content.points) ? content.points : [];
  points.forEach((point, index) => {
    slide.addText(point, {
      x: '15%',
      y: `${30 + (index * 10)}%`,
      w: '75%',
      fontSize: 20,
      bullet: true
    });
  });
}

function createDefaultSlide(slide: any, content: { title: string; body: string }) {
  slide.addText(content.title || 'Slide', {
    x: '10%',
    y: '10%',
    w: '80%',
    fontSize: 32,
    bold: true
  });

  slide.addText(content.body || '', {
    x: '10%',
    y: '30%',
    w: '80%',
    fontSize: 20
  });
}
