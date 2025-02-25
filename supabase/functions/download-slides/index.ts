
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

    // Create a new presentation
    const pres = new pptxgen();
    
    // Set default slide properties
    pres.defineLayout({ name: 'CUSTOM', width: 10, height: 5.625 });
    pres.layout = 'CUSTOM';

    // Generate slides based on the data structure
    slidesData.slides.forEach((slideData: any, index: number) => {
      const slide = pres.addSlide();
      
      switch (slideData.type) {
        case 'title':
          createTitleSlide(slide, slideData.content);
          break;
        case 'objectives':
          createObjectivesSlide(slide, slideData.content);
          break;
        // ... Handle other slide types
      }
    });

    // Generate the PPTX file
    const pptxBuffer = await pres.write('base64');
    console.log('PPTX file generated successfully');

    return new Response(
      JSON.stringify({ pptxData: pptxBuffer }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error generating PPTX:', error);
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

function createTitleSlide(slide: any, content: { title: string; subtitle: string }) {
  slide.addText(content.title, {
    x: '10%',
    y: '40%',
    w: '80%',
    fontSize: 44,
    bold: true,
    align: 'center'
  });

  slide.addText(content.subtitle, {
    x: '10%',
    y: '60%',
    w: '80%',
    fontSize: 24,
    align: 'center'
  });
}

function createObjectivesSlide(slide: any, content: { title: string; items: string[] }) {
  slide.addText(content.title, {
    x: '10%',
    y: '10%',
    w: '80%',
    fontSize: 32,
    bold: true
  });

  content.items.forEach((item: string, index: number) => {
    slide.addText(`${index + 1}. ${item}`, {
      x: '15%',
      y: `${30 + (index * 15)}%`,
      w: '70%',
      fontSize: 24,
      bullet: true
    });
  });
}
