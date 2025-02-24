
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import "https://deno.land/x/xhr@0.1.0/mod.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { subject, topic, previousTopic } = await req.json()
    const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY')

    if (!OPENAI_API_KEY) {
      throw new Error('OPENAI_API_KEY is not set')
    }

    // Generate review image
    const reviewPrompt = `Create an educational image that reviews or connects to prior knowledge about ${previousTopic} in ${subject}. The image should be clear, engaging, and suitable for students.`
    
    const reviewImageResponse = await fetch('https://api.openai.com/v1/images/generations', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: "dall-e-3",
        prompt: reviewPrompt,
        n: 1,
        size: "1024x1024"
      })
    })

    // Generate motivation image
    const motivationPrompt = `Create an educational image about ${topic} in ${subject} that connects with the previous topic ${previousTopic}. The image should be engaging, thought-provoking, and suitable for students.`
    
    const motivationImageResponse = await fetch('https://api.openai.com/v1/images/generations', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: "dall-e-3",
        prompt: motivationPrompt,
        n: 1,
        size: "1024x1024"
      })
    })

    const reviewImageData = await reviewImageResponse.json()
    const motivationImageData = await motivationImageResponse.json()

    // Generate questions using GPT-4
    const questionsPrompt = `For a lesson in ${subject} about ${topic}, with previous knowledge of ${previousTopic}, please provide:
    1. Three review questions about ${previousTopic} that connect to ${topic}
    2. Six Higher Order Thinking Skills (HOTS) questions about ${topic} that encourage critical thinking and connect to ${previousTopic}
    3. A two-paragraph discussion connecting ${topic} with another relevant subject area, showing clear integration and coherence.
    
    Format the response as JSON with the following structure:
    {
      "reviewQuestions": ["question1", "question2", "question3"],
      "hotsQuestions": ["question1", "question2", "question3", "question4", "question5", "question6"],
      "integration": {
        "connectedSubject": "subject name",
        "discussion": ["paragraph1", "paragraph2"]
      }
    }`

    const questionsResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: "gpt-4o",
        messages: [
          { role: "system", content: "You are an educational content creator specializing in creating engaging, interdisciplinary content." },
          { role: "user", content: questionsPrompt }
        ]
      })
    })

    const questionsData = await questionsResponse.json()
    const content = JSON.parse(questionsData.choices[0].message.content)

    return new Response(
      JSON.stringify({
        reviewImage: reviewImageData.data[0].url,
        motivationImage: motivationImageData.data[0].url,
        content
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('Error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    )
  }
})
