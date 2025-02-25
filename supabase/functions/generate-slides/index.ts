
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  const abacusApiKey = Deno.env.get('ABACUS_AI_KEY')

  try {
    const { content } = await req.json()

    console.log('Generating slides for content:', content.substring(0, 100) + '...')

    const response = await fetch('https://api.abacus.ai/api/v0/generate-presentation', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${abacusApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        text: content,
        format: 'pptx',
        style: 'professional'
      })
    })

    if (!response.ok) {
      const errorData = await response.text()
      console.error('Abacus API error:', errorData)
      throw new Error(`Abacus API error: ${response.status}`)
    }

    const data = await response.json()
    return new Response(
      JSON.stringify(data),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('Error generating slides:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    )
  }
})
