
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { firstPrompt, secondPrompt } = await req.json()
    const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY')

    if (!OPENAI_API_KEY) {
      throw new Error('OPENAI_API_KEY is not set')
    }

    // Generate first image for review
    const firstResponse = await fetch('https://api.openai.com/v1/images/generations', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "dall-e-3",
        prompt: firstPrompt,
        n: 1,
        size: "1024x1024",
      }),
    })

    if (!firstResponse.ok) {
      throw new Error(`Failed to generate first image: ${await firstResponse.text()}`)
    }

    // Generate second image for motivation
    const secondResponse = await fetch('https://api.openai.com/v1/images/generations', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "dall-e-3",
        prompt: secondPrompt,
        n: 1,
        size: "1024x1024",
      }),
    })

    if (!secondResponse.ok) {
      throw new Error(`Failed to generate second image: ${await secondResponse.text()}`)
    }

    const firstImageData = await firstResponse.json()
    const secondImageData = await secondResponse.json()

    return new Response(
      JSON.stringify({
        reviewImage: firstImageData.data[0].url,
        motivationImage: secondImageData.data[0].url,
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
    )
  } catch (error) {
    console.error('Error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    )
  }
})
