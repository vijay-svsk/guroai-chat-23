
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

  try {
    const { question } = await req.json()
    const DEEPSEEK_API_KEY = Deno.env.get('DEEPSEEK_API_KEY')

    if (!DEEPSEEK_API_KEY) {
      console.error('DeepSeek API key not configured')
      throw new Error('DeepSeek API key not configured')
    }

    console.log('Sending question to DeepSeek:', question)

    const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${DEEPSEEK_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: "deepseek-chat",
        messages: [
          {
            role: "system",
            content: "You are GuroAI, a friendly and knowledgeable AI assistant focused on providing clear, accurate, and helpful responses. Your responses should be informative yet conversational."
          },
          {
            role: "user",
            content: question
          }
        ],
        temperature: 0.7,
        max_tokens: 2000
      }),
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => null)
      console.error('DeepSeek API error:', errorData || response.statusText)
      throw new Error(errorData?.error?.message || 'Failed to get response from DeepSeek')
    }

    const data = await response.json()
    console.log('Received response from DeepSeek')

    if (!data.choices?.[0]?.message?.content) {
      console.error('Invalid response format:', data)
      throw new Error('Invalid response format from DeepSeek')
    }

    return new Response(
      JSON.stringify({ 
        answer: data.choices[0].message.content 
      }),
      { 
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json' 
        } 
      }
    )
  } catch (error) {
    console.error('Error in ask-guro function:', error)
    return new Response(
      JSON.stringify({ 
        error: error.message || 'An unexpected error occurred'
      }),
      { 
        status: 500,
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json' 
        } 
      }
    )
  }
})
