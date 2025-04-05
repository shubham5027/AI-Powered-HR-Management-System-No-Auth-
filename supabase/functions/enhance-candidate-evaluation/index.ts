import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const EDEN_AI_API_KEY = Deno.env.get('EDEN_AI_API_KEY')
const DEEPSEEK_API_KEY = Deno.env.get('DEEPSEEK_API_KEY')
const GEMINI_API_KEY = Deno.env.get('GEMINI_API_KEY')

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { action, data } = await req.json()

    switch (action) {
      case 'parse_resume':
        return await parseResume(req, data)
      case 'extract_keywords':
        return await extractKeywords(req, data)
      case 'recognize_entities':
        return await recognizeEntities(req, data)
      case 'document_qa':
        return await documentQA(req, data)
      case 'analyze_with_deepseek':
        return await analyzeWithDeepseek(req, data)
      case 'analyze_with_gemini':
        return await analyzeWithGemini(req, data)
      default:
        throw new Error(`Unknown action: ${action}`)
    }
  } catch (error) {
    console.error('Error processing request:', error.message)
    return new Response(
      JSON.stringify({ error: error.message || 'Unknown error' }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400 
      }
    )
  }
})

async function parseResume(req: Request, data: any) {
  const { fileUrl } = data
  if (!fileUrl) {
    throw new Error('File URL is required for resume parsing')
  }

  // Download the file from the URL first
  const fileResponse = await fetch(fileUrl)
  const fileBlob = await fileResponse.blob()
  
  // Create FormData and append the file
  const formData = new FormData()
  formData.append('providers', 'affinda')
  formData.append('file', fileBlob, 'resume.pdf')
  
  const response = await fetch('https://api.edenai.run/v2/ocr/resume_parser', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${EDEN_AI_API_KEY}`,
    },
    body: formData
  })

  const result = await response.json()
  
  return new Response(
    JSON.stringify(result),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  )
}

async function extractKeywords(req: Request, data: any) {
  const { text, language = 'en' } = data
  if (!text) {
    throw new Error('Text is required for keyword extraction')
  }

  const response = await fetch('https://api.edenai.run/v2/text/keyword_extraction', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${EDEN_AI_API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      providers: 'openai',
      text,
      language
    })
  })

  const result = await response.json()
  
  return new Response(
    JSON.stringify(result),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  )
}

async function recognizeEntities(req: Request, data: any) {
  const { text, language = 'en' } = data
  if (!text) {
    throw new Error('Text is required for named entity recognition')
  }

  const response = await fetch('https://api.edenai.run/v2/text/named_entity_recognition', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${EDEN_AI_API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      providers: 'openai',
      text,
      language
    })
  })

  const result = await response.json()
  
  return new Response(
    JSON.stringify(result),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  )
}

async function documentQA(req: Request, data: any) {
  const { fileUrl, queries } = data
  if (!fileUrl || !queries) {
    throw new Error('File URL and queries are required for document QA')
  }

  // Download the file from the URL first
  const fileResponse = await fetch(fileUrl)
  const fileBlob = await fileResponse.blob()
  
  // Create FormData and append the file
  const formData = new FormData()
  formData.append('providers', 'extracta')
  formData.append('file', fileBlob, 'document.pdf')
  formData.append('queries', JSON.stringify(queries))
  
  const response = await fetch('https://api.edenai.run/v2/ocr/custom_document_parsing_async', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${EDEN_AI_API_KEY}`,
    },
    body: formData
  })

  const result = await response.json()
  
  return new Response(
    JSON.stringify(result),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  )
}

async function analyzeWithDeepseek(req: Request, data: any) {
  const { messages } = data
  if (!messages || !Array.isArray(messages)) {
    throw new Error('Valid messages array is required for Deepseek analysis')
  }

  const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${DEEPSEEK_API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model: 'deepseek-chat',
      messages
    })
  })

  const result = await response.json()
  
  return new Response(
    JSON.stringify(result),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  )
}

async function analyzeWithGemini(req: Request, data: any) {
  const { prompt, model = 'gemini-1.5-flash' } = data
  if (!prompt) {
    throw new Error('Prompt is required for Gemini analysis')
  }

  if (!GEMINI_API_KEY) {
    throw new Error('GEMINI_API_KEY is not configured')
  }

  const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${GEMINI_API_KEY}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      contents: [
        {
          parts: [
            {
              text: prompt
            }
          ]
        }
      ],
      generationConfig: {
        temperature: 0.7,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 2048,
      }
    })
  })

  const result = await response.json()
  
  return new Response(
    JSON.stringify(result),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  )
}
