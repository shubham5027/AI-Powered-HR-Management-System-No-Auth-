
import { supabase } from '@/integrations/supabase/client';

const API_BASE_URL = 'https://api.edenai.run/v2';

export interface TranscriptionResult {
  text: string;
  confidence: number;
}

export interface SentimentResult {
  sentiment: 'Positive' | 'Neutral' | 'Negative';
  score: number;
  segments?: Array<{
    text: string;
    sentiment: string;
    score: number;
  }>;
}

export interface KeywordExtractionResult {
  keywords: string[];
  importances: number[];
}

export interface InterviewAnalysisResult {
  transcription: TranscriptionResult;
  sentiment: SentimentResult;
  keywords: KeywordExtractionResult;
  recommendation: 'Hire' | 'Review' | 'Reject';
}

async function getApiKey(): Promise<string> {
  // Try to get API key from Supabase Edge Functions
  try {
    const { data, error } = await supabase.functions.invoke('get-eden-ai-key', {
      method: 'GET',
    });
    
    if (error) throw new Error(error.message);
    return data.apiKey;
  } catch (error) {
    console.error('Error getting Eden AI API key:', error);
    throw new Error('Failed to get Eden AI API key');
  }
}

export async function uploadAudioForTranscription(audioBlob: Blob): Promise<string> {
  try {
    // Generate a unique filename
    const filename = `interview_${Date.now()}.webm`;
    
    // Upload to Supabase Storage
    const { data, error } = await supabase.storage
      .from('interview-recordings')
      .upload(filename, audioBlob, {
        contentType: 'audio/webm',
        cacheControl: '3600',
      });
    
    if (error) throw error;
    
    // Get the public URL
    const { data: urlData } = supabase.storage
      .from('interview-recordings')
      .getPublicUrl(filename);
      
    return urlData.publicUrl;
  } catch (error) {
    console.error('Error uploading audio file:', error);
    throw new Error('Failed to upload audio recording');
  }
}

export async function transcribeAudio(audioUrl: string, language = 'en-US'): Promise<TranscriptionResult> {
  try {
    const apiKey = await getApiKey();
    
    const response = await fetch(`${API_BASE_URL}/audio/speech_to_text`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        providers: 'openai',
        file_url: audioUrl,
        language
      })
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Transcription failed');
    }
    
    const data = await response.json();
    
    // Extract OpenAI results
    const result = data.openai;
    
    return {
      text: result.text,
      confidence: result.confidence || 0.8 // Default if not provided
    };
  } catch (error) {
    console.error('Transcription error:', error);
    throw new Error('Failed to transcribe audio');
  }
}

export async function analyzeSentiment(text: string, language = 'en'): Promise<SentimentResult> {
  try {
    const apiKey = await getApiKey();
    
    const response = await fetch(`${API_BASE_URL}/text/sentiment_analysis`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        providers: 'openai',
        text,
        language
      })
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Sentiment analysis failed');
    }
    
    const data = await response.json();
    
    // Extract OpenAI results
    const result = data.openai;
    
    return {
      sentiment: result.sentiment as 'Positive' | 'Neutral' | 'Negative',
      score: result.sentiment_rate,
      segments: result.segments?.map((segment: any) => ({
        text: segment.text,
        sentiment: segment.sentiment,
        score: segment.sentiment_rate
      }))
    };
  } catch (error) {
    console.error('Sentiment analysis error:', error);
    throw new Error('Failed to analyze sentiment');
  }
}

export async function extractKeywords(text: string, language = 'en'): Promise<KeywordExtractionResult> {
  try {
    const apiKey = await getApiKey();
    
    const response = await fetch(`${API_BASE_URL}/text/keyword_extraction`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        providers: 'openai',
        text,
        language
      })
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Keyword extraction failed');
    }
    
    const data = await response.json();
    
    // Extract OpenAI results
    const result = data.openai;
    
    // Sort by importance and take top 5
    const items = result.items || [];
    items.sort((a: any, b: any) => b.importance - a.importance);
    const top5 = items.slice(0, 5);
    
    return {
      keywords: top5.map((item: any) => item.keyword),
      importances: top5.map((item: any) => item.importance)
    };
  } catch (error) {
    console.error('Keyword extraction error:', error);
    throw new Error('Failed to extract keywords');
  }
}

export async function determineRecommendation(sentimentScore: number, transcriptLength: number): Promise<'Hire' | 'Review' | 'Reject'> {
  // This is a simple logic that could be enhanced with more sophisticated analysis
  if (sentimentScore >= 0.7 && transcriptLength > 100) {
    return 'Hire';
  } else if (sentimentScore >= 0.4) {
    return 'Review';
  } else {
    return 'Reject';
  }
}

export async function saveInterviewResults(
  candidateId: string,
  interviewData: InterviewAnalysisResult
): Promise<void> {
  try {
    const { error } = await supabase
      .from('interviews')
      .insert({
        candidate_id: candidateId,
        feedback: JSON.stringify({
          transcription: interviewData.transcription,
          sentiment: interviewData.sentiment,
          keywords: interviewData.keywords,
          recommendation: interviewData.recommendation
        }),
        status: 'completed',
        rating: Math.ceil(interviewData.sentiment.score * 5), // Convert 0-1 to 1-5 scale
        scheduled_at: new Date().toISOString()
      });
      
    if (error) throw error;
  } catch (error) {
    console.error('Error saving interview results:', error);
    throw new Error('Failed to save interview results');
  }
}

export async function processInterview(audioBlob: Blob, candidateId: string): Promise<InterviewAnalysisResult> {
  try {
    // Upload audio file
    const audioUrl = await uploadAudioForTranscription(audioBlob);
    
    // Transcribe audio
    const transcription = await transcribeAudio(audioUrl);
    
    // Analyze sentiment
    const sentiment = await analyzeSentiment(transcription.text);
    
    // Extract keywords
    const keywords = await extractKeywords(transcription.text);
    
    // Determine recommendation
    const recommendation = await determineRecommendation(
      sentiment.score, 
      transcription.text.length
    );
    
    const result = {
      transcription,
      sentiment,
      keywords,
      recommendation
    };
    
    // Save results to database
    await saveInterviewResults(candidateId, result);
    
    return result;
  } catch (error) {
    console.error('Error processing interview:', error);
    throw error;
  }
}

// Added new functions for resume analysis
export async function extractTextFromResume(fileUrl: string): Promise<string> {
  try {
    const apiKey = await getApiKey();
    
    const response = await fetch(`${API_BASE_URL}/ocr/ocr`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        providers: 'google',
        file_url: fileUrl,
        language: 'en'
      })
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'OCR extraction failed');
    }
    
    const data = await response.json();
    
    // Extract Google OCR results
    const result = data.google;
    
    return result.text;
  } catch (error) {
    console.error('OCR extraction error:', error);
    throw new Error('Failed to extract text from resume');
  }
}

export async function extractEntitiesFromText(text: string): Promise<string[]> {
  try {
    const apiKey = await getApiKey();
    
    const response = await fetch(`${API_BASE_URL}/text/named_entity_recognition`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        providers: 'openai',
        text,
        language: 'en'
      })
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Entity extraction failed');
    }
    
    const data = await response.json();
    
    // Extract OpenAI results
    const result = data.openai;
    
    // Extract skills and experiences
    const skills: string[] = [];
    result.items.forEach((item: any) => {
      if (item.entity === 'SKILL' || item.entity === 'PRODUCT' || item.entity === 'ORG') {
        if (!skills.includes(item.entity)) {
          skills.push(item.entity);
        }
      }
    });
    
    return skills;
  } catch (error) {
    console.error('Entity extraction error:', error);
    throw new Error('Failed to extract entities from resume');
  }
}
