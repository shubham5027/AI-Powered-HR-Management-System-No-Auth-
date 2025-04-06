
// // import { supabase } from '@/integrations/supabase/client';

// // const API_BASE_URL = 'https://api.edenai.run/v2';

// // export interface TranscriptionResult {
// //   text: string;
// //   confidence: number;
// // }

// // export interface SentimentResult {
// //   sentiment: 'Positive' | 'Neutral' | 'Negative';
// //   score: number;
// //   segments?: Array<{
// //     text: string;
// //     sentiment: string;
// //     score: number;
// //   }>;
// // }

// // export interface KeywordExtractionResult {
// //   keywords: string[];
// //   importances: number[];
// // }

// // export interface InterviewAnalysisResult {
// //   transcription: TranscriptionResult;
// //   sentiment: SentimentResult;
// //   keywords: KeywordExtractionResult;
// //   recommendation: 'Hire' | 'Review' | 'Reject';
// // }

// // // async function getApiKey(): Promise<string> {
// // //   // Try to get API key from Supabase Edge Functions
// // //   try {
// // //     const { data, error } = await supabase.functions.invoke('get-eden-ai-key', {
// // //       method: 'GET',
// // //     });
    
// // //     if (error) throw new Error(error.message);
// // //     return data.apiKey;
// // //   } catch (error) {
// // //     console.error('Error getting Eden AI API key:', error);
// // //     throw new Error('Failed to get Eden AI API key');
// // //   }
// // // }

// // export async function uploadAudioForTranscription(audioBlob: Blob): Promise<string> {
// //   try {
// //     // Generate a unique filename
// //     const filename = `interview_${Date.now()}.webm`;
    
// //     // Upload to Supabase Storage
// //     const { data, error } = await supabase.storage
// //       .from('interview-recordings')
// //       .upload(filename, audioBlob, {
// //         contentType: 'audio/webm',
// //         cacheControl: '3600',
// //       });
    
// //     if (error) throw error;
    
// //     // Get the public URL
// //     const { data: urlData } = supabase.storage
// //       .from('interview-recordings')
// //       .getPublicUrl(filename);
      
// //     return urlData.publicUrl;
// //   } catch (error) {
// //     console.error('Error uploading audio file:', error);
// //     throw new Error('Failed to upload audio recording');
// //   }
// // }

// // export async function transcribeAudio(audioUrl: string, language = 'en-US'): Promise<TranscriptionResult> {
// //   try {
// //     // const apiKey = await getApiKey();
    
// //     const response = await fetch(`${API_BASE_URL}/audio/speech_to_text`, {
// //       method: 'POST',
// //       headers: {
// //         'Authorization': "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiOGE1YmQwOTYtZTQ2OC00ZjEwLTk2Y2MtOWU2ZjUwMjIxZjY3IiwidHlwZSI6ImFwaV90b2tlbiJ9.QL-Qjs13w0VxiLng4b_9AS8uD16n1u7fM3vT31pX7F0",
// //         'Content-Type': 'application/json'
// //       },
// //       body: JSON.stringify({
// //         providers: 'openai',
// //         file_url: audioUrl,
// //         language
// //       })
// //     });
    
// //     if (!response.ok) {
// //       const errorData = await response.json();
// //       throw new Error(errorData.message || 'Transcription failed');
// //     }
    
// //     const data = await response.json();
    
// //     // Extract OpenAI results
// //     const result = data.openai;
    
// //     return {
// //       text: result.text,
// //       confidence: result.confidence || 0.8 // Default if not provided
// //     };
// //   } catch (error) {
// //     console.error('Transcription error:', error);
// //     throw new Error('Failed to transcribe audio');
// //   }
// // }

// // export async function analyzeSentiment(text: string, language = 'en'): Promise<SentimentResult> {
// //   try {
// //     // const apiKey = await getApiKey();
    
// //     const response = await fetch(`${API_BASE_URL}/text/sentiment_analysis`, {
// //       method: 'POST',
// //       headers: {
// //         'Authorization': "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiOGE1YmQwOTYtZTQ2OC00ZjEwLTk2Y2MtOWU2ZjUwMjIxZjY3IiwidHlwZSI6ImFwaV90b2tlbiJ9.QL-Qjs13w0VxiLng4b_9AS8uD16n1u7fM3vT31pX7F0",
// //         'Content-Type': 'application/json'
// //       },
// //       body: JSON.stringify({
// //         providers: 'openai',
// //         text,
// //         language
// //       })
// //     });
    
// //     if (!response.ok) {
// //       const errorData = await response.json();
// //       throw new Error(errorData.message || 'Sentiment analysis failed');
// //     }
    
// //     const data = await response.json();
    
// //     // Extract OpenAI results
// //     const result = data.openai;
    
// //     return {
// //       sentiment: result.sentiment as 'Positive' | 'Neutral' | 'Negative',
// //       score: result.sentiment_rate,
// //       segments: result.segments?.map((segment: any) => ({
// //         text: segment.text,
// //         sentiment: segment.sentiment,
// //         score: segment.sentiment_rate
// //       }))
// //     };
// //   } catch (error) {
// //     console.error('Sentiment analysis error:', error);
// //     throw new Error('Failed to analyze sentiment');
// //   }
// // }

// // export async function extractKeywords(text: string, language = 'en'): Promise<KeywordExtractionResult> {
// //   try {
// //     // const apiKey = await getApiKey();
    
// //     const response = await fetch(`${API_BASE_URL}/text/keyword_extraction`, {
// //       method: 'POST',
// //       headers: {
// //         'Authorization': "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiOGE1YmQwOTYtZTQ2OC00ZjEwLTk2Y2MtOWU2ZjUwMjIxZjY3IiwidHlwZSI6ImFwaV90b2tlbiJ9.QL-Qjs13w0VxiLng4b_9AS8uD16n1u7fM3vT31pX7F0",
// //         'Content-Type': 'application/json'
// //       },
// //       body: JSON.stringify({
// //         providers: 'openai',
// //         text,
// //         language
// //       })
// //     });
    
// //     if (!response.ok) {
// //       const errorData = await response.json();
// //       throw new Error(errorData.message || 'Keyword extraction failed');
// //     }
    
// //     const data = await response.json();
    
// //     // Extract OpenAI results
// //     const result = data.openai;
    
// //     // Sort by importance and take top 5
// //     const items = result.items || [];
// //     items.sort((a: any, b: any) => b.importance - a.importance);
// //     const top5 = items.slice(0, 5);
    
// //     return {
// //       keywords: top5.map((item: any) => item.keyword),
// //       importances: top5.map((item: any) => item.importance)
// //     };
// //   } catch (error) {
// //     console.error('Keyword extraction error:', error);
// //     throw new Error('Failed to extract keywords');
// //   }
// // }

// // export async function determineRecommendation(sentimentScore: number, transcriptLength: number): Promise<'Hire' | 'Review' | 'Reject'> {
// //   // This is a simple logic that could be enhanced with more sophisticated analysis
// //   if (sentimentScore >= 0.7 && transcriptLength > 100) {
// //     return 'Hire';
// //   } else if (sentimentScore >= 0.4) {
// //     return 'Review';
// //   } else {
// //     return 'Reject';
// //   }
// // }

// // export async function saveInterviewResults(
// //   candidateId: string,
// //   interviewData: InterviewAnalysisResult
// // ): Promise<void> {
// //   try {
// //     const { error } = await supabase
// //       .from('interviews')
// //       .insert({
// //         candidate_id: candidateId,
// //         feedback: JSON.stringify({
// //           transcription: interviewData.transcription,
// //           sentiment: interviewData.sentiment,
// //           keywords: interviewData.keywords,
// //           recommendation: interviewData.recommendation
// //         }),
// //         status: 'completed',
// //         rating: Math.ceil(interviewData.sentiment.score * 5), // Convert 0-1 to 1-5 scale
// //         scheduled_at: new Date().toISOString()
// //       });
      
// //     if (error) throw error;
// //   } catch (error) {
// //     console.error('Error saving interview results:', error);
// //     throw new Error('Failed to save interview results');
// //   }
// // }

// // export async function processInterview(audioBlob: Blob, candidateId: string): Promise<InterviewAnalysisResult> {
// //   try {
// //     // Upload audio file
// //     const audioUrl = await uploadAudioForTranscription(audioBlob);
    
// //     // Transcribe audio
// //     const transcription = await transcribeAudio(audioUrl);
    
// //     // Analyze sentiment
// //     const sentiment = await analyzeSentiment(transcription.text);
    
// //     // Extract keywords
// //     const keywords = await extractKeywords(transcription.text);
    
// //     // Determine recommendation
// //     const recommendation = await determineRecommendation(
// //       sentiment.score, 
// //       transcription.text.length
// //     );
    
// //     const result = {
// //       transcription,
// //       sentiment,
// //       keywords,
// //       recommendation
// //     };
    
// //     // Save results to database
// //     await saveInterviewResults(candidateId, result);
    
// //     return result;
// //   } catch (error) {
// //     console.error('Error processing interview:', error);
// //     throw error;
// //   }
// // }

// // // Added new functions for resume analysis
// // export async function extractTextFromResume(fileUrl: string): Promise<string> {
// //   try {
// //     // const apiKey = await getApiKey();
    
// //     const response = await fetch(`${API_BASE_URL}/ocr/ocr`, {
// //       method: 'POST',
// //       headers: {
// //         'Authorization': "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiOGE1YmQwOTYtZTQ2OC00ZjEwLTk2Y2MtOWU2ZjUwMjIxZjY3IiwidHlwZSI6ImFwaV90b2tlbiJ9.QL-Qjs13w0VxiLng4b_9AS8uD16n1u7fM3vT31pX7F0",
// //         'Content-Type': 'application/json'
// //       },
// //       body: JSON.stringify({
// //         providers: 'google',
// //         file_url: fileUrl,
// //         language: 'en'
// //       })
// //     });
    
// //     if (!response.ok) {
// //       const errorData = await response.json();
// //       throw new Error(errorData.message || 'OCR extraction failed');
// //     }
    
// //     const data = await response.json();
    
// //     // Extract Google OCR results
// //     const result = data.google;
    
// //     return result.text;
// //   } catch (error) {
// //     console.error('OCR extraction error:', error);
// //     throw new Error('Failed to extract text from resume');
// //   }
// // }

// // export async function extractEntitiesFromText(text: string): Promise<string[]> {
// //   try {
// //     // const apiKey = await getApiKey();
    
// //     const response = await fetch(`${API_BASE_URL}/text/named_entity_recognition`, {
// //       method: 'POST',
// //       headers: {
// //         'Authorization': "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiOGE1YmQwOTYtZTQ2OC00ZjEwLTk2Y2MtOWU2ZjUwMjIxZjY3IiwidHlwZSI6ImFwaV90b2tlbiJ9.QL-Qjs13w0VxiLng4b_9AS8uD16n1u7fM3vT31pX7F0",
// //         'Content-Type': 'application/json'
// //       },
// //       body: JSON.stringify({
// //         providers: 'openai',
// //         text,
// //         language: 'en'
// //       })
// //     });
    
// //     if (!response.ok) {
// //       const errorData = await response.json();
// //       throw new Error(errorData.message || 'Entity extraction failed');
// //     }
    
// //     const data = await response.json();
    
// //     // Extract OpenAI results
// //     const result = data.openai;
    
// //     // Extract skills and experiences
// //     const skills: string[] = [];
// //     result.items.forEach((item: any) => {
// //       if (item.entity === 'SKILL' || item.entity === 'PRODUCT' || item.entity === 'ORG') {
// //         if (!skills.includes(item.entity)) {
// //           skills.push(item.entity);
// //         }
// //       }
// //     });
    
// //     return skills;
// //   } catch (error) {
// //     console.error('Entity extraction error:', error);
// //     throw new Error('Failed to extract entities from resume');
// //   }
// // }
// import { supabase } from '@/integrations/supabase/client';

// const API_BASE_URL = 'https://api.edenai.run/v2';

// export interface TranscriptionResult {
//   text: string;
//   confidence: number;
// }

// export interface SentimentResult {
//   sentiment: 'Positive' | 'Neutral' | 'Negative';
//   score: number;
//   segments?: Array<{
//     text: string;
//     sentiment: string;
//     score: number;
//   }>;
// }

// export interface KeywordExtractionResult {
//   keywords: string[];
//   importances: number[];
// }

// export interface FaceDetectionResult {
//   facePresent: boolean;
//   confidence: number;
//   emotions?: {
//     dominant: string;
//     scores: {
//       [key: string]: number;
//     }
//   }
// }

// export interface ObjectDetectionResult {
//   objects: Array<{
//     label: string;
//     confidence: number;
//     xMin: number;
//     yMin: number;
//     xMax: number;
//     yMax: number;
//   }>;
//   flaggedItems?: string[];
// }

// export interface InterviewAnalysisResult {
//   transcription: TranscriptionResult;
//   sentiment: SentimentResult;
//   keywords: KeywordExtractionResult;
//   faceAnalysis?: FaceDetectionResult[];
//   objectDetection?: ObjectDetectionResult[];
//   recommendation: 'Hire' | 'Review' | 'Reject';
// }

// // Get API key from secure storage
// async function getApiKey(): Promise<string> {
//   try {
//     const { data, error } = await supabase.functions.invoke('get-eden-ai-key', {
//       method: 'GET',
//     });
    
//     if (error) throw new Error(error.message);
//     return data.apiKey;
//   } catch (error) {
//     console.error('Error getting Eden AI API key:', error);
//     throw new Error('Failed to get Eden AI API key');
//   }
// }

// // Helper function to get the authorization header
// async function getAuthHeader(): Promise<Headers> {
//   try {
//     // For production, use the API key from secure storage
//     // const apiKey = await getApiKey();
    
//     // For development and demonstration, using a hardcoded key
//     const headers = new Headers();
//     headers.append('Authorization', "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiOGE1YmQwOTYtZTQ2OC00ZjEwLTk2Y2MtOWU2ZjUwMjIxZjY3IiwidHlwZSI6ImFwaV90b2tlbiJ9.QL-Qjs13w0VxiLng4b_9AS8uD16n1u7fM3vT31pX7F0");
//     headers.append('Content-Type', 'application/json');
//     return headers;
//   } catch (error) {
//     console.error('Error creating auth header:', error);
//     throw new Error('Failed to create authorization header');
//   }
// }

// export async function uploadAudioForTranscription(audioBlob: Blob): Promise<string> {
//   try {
//     // Generate a unique filename
//     const filename = `interview_${Date.now()}.webm`;
    
//     // Upload to Supabase Storage
//     const { data, error } = await supabase.storage
//       .from('interview-recordings')
//       .upload(filename, audioBlob, {
//         contentType: 'audio/webm',
//         cacheControl: '3600',
//       });
    
//     if (error) throw error;
    
//     // Get the public URL
//     const { data: urlData } = supabase.storage
//       .from('interview-recordings')
//       .getPublicUrl(filename);
      
//     return urlData.publicUrl;
//   } catch (error) {
//     console.error('Error uploading audio file:', error);
//     throw new Error('Failed to upload audio recording');
//   }
// }

// export async function uploadVideoFrame(imageBlob: Blob): Promise<string> {
//   try {
//     // Generate a unique filename
//     const filename = `interview_frame_${Date.now()}.jpg`;
    
//     // Upload to Supabase Storage
//     const { data, error } = await supabase.storage
//       .from('interview-recordings')
//       .upload(filename, imageBlob, {
//         contentType: 'image/jpeg',
//         cacheControl: '3600',
//       });
    
//     if (error) throw error;
    
//     // Get the public URL
//     const { data: urlData } = supabase.storage
//       .from('interview-recordings')
//       .getPublicUrl(filename);
      
//     return urlData.publicUrl;
//   } catch (error) {
//     console.error('Error uploading video frame:', error);
//     throw new Error('Failed to upload video frame');
//   }
// }

// export async function transcribeAudio(audioUrl: string, language = 'en-US'): Promise<TranscriptionResult> {
//   try {
//     const headers = await getAuthHeader();
    
//     const response = await fetch(`${API_BASE_URL}/audio/speech_to_text`, {
//       method: 'POST',
//       headers,
//       body: JSON.stringify({
//         providers: 'openai',
//         file_url: audioUrl,
//         language
//       })
//     });
    
//     if (!response.ok) {
//       const errorData = await response.json();
//       throw new Error(errorData.message || 'Transcription failed');
//     }
    
//     const data = await response.json();
    
//     // Extract OpenAI results
//     const result = data.openai;
    
//     return {
//       text: result.text,
//       confidence: result.confidence || 0.8 // Default if not provided
//     };
//   } catch (error) {
//     console.error('Transcription error:', error);
//     throw new Error('Failed to transcribe audio');
//   }
// }

// export async function detectFace(imageUrl: string): Promise<FaceDetectionResult> {
//   try {
//     const headers = await getAuthHeader();
    
//     const response = await fetch(`${API_BASE_URL}/vision/face_detection`, {
//       method: 'POST',
//       headers,
//       body: JSON.stringify({
//         providers: 'amazon',
//         file_url: imageUrl
//       })
//     });
    
//     if (!response.ok) {
//       const errorData = await response.json();
//       throw new Error(errorData.message || 'Face detection failed');
//     }
    
//     const data = await response.json();
    
//     // Extract Amazon results
//     const result = data.amazon;
    
//     if (!result.items || result.items.length === 0) {
//       return {
//         facePresent: false,
//         confidence: 0
//       };
//     }
    
//     // Get the face with highest confidence
//     const highestConfidenceFace = result.items.reduce(
//       (prev: any, current: any) => 
//         (prev.confidence > current.confidence) ? prev : current
//     );
    
//     // Extract emotion data if available
//     let emotions = undefined;
//     if (highestConfidenceFace.emotions && highestConfidenceFace.emotions.length > 0) {
//       const emotionScores: {[key: string]: number} = {};
//       let dominantEmotion = '';
//       let highestScore = 0;
      
//       highestConfidenceFace.emotions.forEach((emotion: any) => {
//         emotionScores[emotion.emotion] = emotion.confidence;
//         if (emotion.confidence > highestScore) {
//           highestScore = emotion.confidence;
//           dominantEmotion = emotion.emotion;
//         }
//       });
      
//       emotions = {
//         dominant: dominantEmotion,
//         scores: emotionScores
//       };
//     }
    
//     return {
//       facePresent: true,
//       confidence: highestConfidenceFace.confidence,
//       emotions
//     };
//   } catch (error) {
//     console.error('Face detection error:', error);
//     throw new Error('Failed to detect face');
//   }
// }

// export async function detectObjects(imageUrl: string): Promise<ObjectDetectionResult> {
//   try {
//     const headers = await getAuthHeader();
    
//     const response = await fetch(`${API_BASE_URL}/vision/object_detection`, {
//       method: 'POST',
//       headers,
//       body: JSON.stringify({
//         providers: 'google',
//         file_url: imageUrl
//       })
//     });
    
//     if (!response.ok) {
//       const errorData = await response.json();
//       throw new Error(errorData.message || 'Object detection failed');
//     }
    
//     const data = await response.json();
    
//     // Extract Google results
//     const result = data.google;
    
//     if (!result.items || result.items.length === 0) {
//       return {
//         objects: []
//       };
//     }
    
//     // Process objects
//     const objects = result.items.map((item: any) => ({
//       label: item.label,
//       confidence: item.confidence,
//       xMin: item.x_min,
//       yMin: item.y_min,
//       xMax: item.x_max,
//       yMax: item.y_max
//     }));
    
//     // Flag potentially inappropriate items
//     // This list can be customized based on specific requirements
//     const inappropriateItems = [
//       'alcohol', 'wine', 'beer', 'cigarette', 'drug', 'weapon', 'gun',
//       'knife', 'inappropriate content', 'nudity'
//     ];
    
//     const flaggedItems = objects
//       .filter(obj => inappropriateItems.some(item => 
//         obj.label.toLowerCase().includes(item.toLowerCase())
//       ))
//       .map(obj => obj.label);
    
//     return {
//       objects,
//       flaggedItems: flaggedItems.length > 0 ? flaggedItems : undefined
//     };
//   } catch (error) {
//     console.error('Object detection error:', error);
//     throw new Error('Failed to detect objects');
//   }
// }

// export async function analyzeSentiment(text: string, language = 'en'): Promise<SentimentResult> {
//   try {
//     const headers = await getAuthHeader();
    
//     const response = await fetch(`${API_BASE_URL}/text/sentiment_analysis`, {
//       method: 'POST',
//       headers,
//       body: JSON.stringify({
//         providers: 'openai',
//         text,
//         language
//       })
//     });
    
//     if (!response.ok) {
//       const errorData = await response.json();
//       throw new Error(errorData.message || 'Sentiment analysis failed');
//     }
    
//     const data = await response.json();
    
//     // Extract OpenAI results
//     const result = data.openai;
    
//     return {
//       sentiment: result.sentiment as 'Positive' | 'Neutral' | 'Negative',
//       score: result.sentiment_rate,
//       segments: result.segments?.map((segment: any) => ({
//         text: segment.text,
//         sentiment: segment.sentiment,
//         score: segment.sentiment_rate
//       }))
//     };
//   } catch (error) {
//     console.error('Sentiment analysis error:', error);
//     throw new Error('Failed to analyze sentiment');
//   }
// }

// export async function extractKeywords(text: string, language = 'en'): Promise<KeywordExtractionResult> {
//   try {
//     const headers = await getAuthHeader();
    
//     const response = await fetch(`${API_BASE_URL}/text/keyword_extraction`, {
//       method: 'POST',
//       headers,
//       body: JSON.stringify({
//         providers: 'openai',
//         text,
//         language
//       })
//     });
    
//     if (!response.ok) {
//       const errorData = await response.json();
//       throw new Error(errorData.message || 'Keyword extraction failed');
//     }
    
//     const data = await response.json();
    
//     // Extract OpenAI results
//     const result = data.openai;
    
//     // Sort by importance and take top 5
//     const items = result.items || [];
//     items.sort((a: any, b: any) => b.importance - a.importance);
//     const top5 = items.slice(0, 5);
    
//     return {
//       keywords: top5.map((item: any) => item.keyword),
//       importances: top5.map((item: any) => item.importance)
//     };
//   } catch (error) {
//     console.error('Keyword extraction error:', error);
//     throw new Error('Failed to extract keywords');
//   }
// }

// export async function determineRecommendation(
//   sentimentScore: number, 
//   transcriptLength: number,
//   faceAnalysis?: FaceDetectionResult[],
//   objectDetection?: ObjectDetectionResult[]
// ): Promise<'Hire' | 'Review' | 'Reject'> {
//   // Enhanced logic that considers video analysis results
//   let baseScore = 0;
  
//   // Sentiment analysis (0-50 points)
//   baseScore += sentimentScore * 50;
  
//   // Transcript length - longer, more detailed answers (0-20 points)
//   const lengthScore = Math.min(transcriptLength / 500, 1) * 20;
//   baseScore += lengthScore;
  
//   // Face presence and emotions (0-20 points)
//   if (faceAnalysis && faceAnalysis.length > 0) {
//     // Calculate percentage of frames where face was detected
//     const faceDetectionRate = faceAnalysis.filter(f => f.facePresent).length / faceAnalysis.length;
//     baseScore += faceDetectionRate * 20;
    
//     // Penalize if flagged objects were detected
//     if (objectDetection && objectDetection.some(od => od.flaggedItems && od.flaggedItems.length > 0)) {
//       baseScore -= 20; // Significant penalty for inappropriate items
//     }
//   }
  
//   // Determine recommendation based on total score
//   if (baseScore >= 70) {
//     return 'Hire';
//   } else if (baseScore >= 40) {
//     return 'Review';
//   } else {
//     return 'Reject';
//   }
// }

// export async function saveInterviewResults(
//   candidateId: string,
//   interviewData: InterviewAnalysisResult
// ): Promise<void> {
//   try {
//     const { error } = await supabase
//       .from('interviews')
//       .insert({
//         candidate_id: candidateId,
//         feedback: JSON.stringify({
//           transcription: interviewData.transcription,
//           sentiment: interviewData.sentiment,
//           keywords: interviewData.keywords,
//           faceAnalysis: interviewData.faceAnalysis,
//           objectDetection: interviewData.objectDetection,
//           recommendation: interviewData.recommendation
//         }),
//         status: 'completed',
//         rating: Math.ceil(interviewData.sentiment.score * 5), // Convert 0-1 to 1-5 scale
//         scheduled_at: new Date().toISOString()
//       });
      
//     if (error) throw error;
//   } catch (error) {
//     console.error('Error saving interview results:', error);
//     throw new Error('Failed to save interview results');
//   }
// }

// export async function processInterview(
//   audioBlob: Blob, 
//   candidateId: string,
//   videoFrames?: Blob[]
// ): Promise<InterviewAnalysisResult> {
//   try {
//     // Upload audio file for transcription
//     const audioUrl = await uploadAudioForTranscription(audioBlob);
    
//     // Transcribe audio
//     const transcription = await transcribeAudio(audioUrl);
    
//     // Process video frames if provided
//     let faceAnalysis: FaceDetectionResult[] | undefined;
//     let objectDetection: ObjectDetectionResult[] | undefined;
    
//     if (videoFrames && videoFrames.length > 0) {
//       // Process video frames in parallel (limited to 5 frames to avoid rate limits)
//       const framesToProcess = videoFrames.slice(0, Math.min(videoFrames.length, 5));
      
//       const frameUrls = await Promise.all(
//         framesToProcess.map(frame => uploadVideoFrame(frame))
//       );
      
//       const [faceResults, objectResults] = await Promise.all([
//         // Analyze faces in frames
//         Promise.all(frameUrls.map(url => detectFace(url).catch(() => ({ 
//           facePresent: false, 
//           confidence: 0 
//         })))),
        
//         // Detect objects in frames
//         Promise.all(frameUrls.map(url => detectObjects(url).catch(() => ({ 
//           objects: [] 
//         }))))
//       ]);
      
//       faceAnalysis = faceResults;
//       objectDetection = objectResults;
//     }
    
//     // Analyze sentiment
//     const sentiment = await analyzeSentiment(transcription.text);
    
//     // Extract keywords
//     const keywords = await extractKeywords(transcription.text);
    
//     // Determine recommendation with enhanced logic
//     const recommendation = await determineRecommendation(
//       sentiment.score, 
//       transcription.text.length,
//       faceAnalysis,
//       objectDetection
//     );
    
//     const result = {
//       transcription,
//       sentiment,
//       keywords,
//       faceAnalysis,
//       objectDetection,
//       recommendation
//     };
    
//     // Save results to database
//     await saveInterviewResults(candidateId, result);
    
//     return result;
//   } catch (error) {
//     console.error('Error processing interview:', error);
//     throw error;
//   }
// }

// export async function extractTextFromResume(fileUrl: string): Promise<string> {
//   try {
//     const headers = await getAuthHeader();
    
//     const response = await fetch(`${API_BASE_URL}/ocr/ocr`, {
//       method: 'POST',
//       headers,
//       body: JSON.stringify({
//         providers: 'google',
//         file_url: fileUrl,
//         language: 'en'
//       })
//     });
    
//     if (!response.ok) {
//       const errorData = await response.json();
//       throw new Error(errorData.message || 'OCR extraction failed');
//     }
    
//     const data = await response.json();
    
//     // Extract Google OCR results
//     const result = data.google;
    
//     return result.text;
//   } catch (error) {
//     console.error('OCR extraction error:', error);
//     throw new Error('Failed to extract text from resume');
//   }
// }

// export async function extractEntitiesFromText(text: string): Promise<string[]> {
//   try {
//     const headers = await getAuthHeader();
    
//     const response = await fetch(`${API_BASE_URL}/text/named_entity_recognition`, {
//       method: 'POST',
//       headers,
//       body: JSON.stringify({
//         providers: 'openai',
//         text,
//         language: 'en'
//       })
//     });
    
//     if (!response.ok) {
//       const errorData = await response.json();
//       throw new Error(errorData.message || 'Entity extraction failed');
//     }
    
//     const data = await response.json();
    
//     // Extract OpenAI results
//     const result = data.openai;
    
//     // Extract skills and experiences
//     const skills: string[] = [];
//     result.items.forEach((item: any) => {
//       if (item.entity === 'SKILL' || item.entity === 'PRODUCT' || item.entity === 'ORG') {
//         if (!skills.includes(item.entity)) {
//           skills.push(item.entity);
//         }
//       }
//     });
    
//     return skills;
//   } catch (error) {
//     console.error('Entity extraction error:', error);
//     throw new Error('Failed to extract entities from resume');
//   }
// }
import { supabase } from '@/integrations/supabase/client';

const API_BASE_URL = 'https://api.edenai.run/v2';
const EDEN_API_KEY = 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiOGE1YmQwOTYtZTQ2OC00ZjEwLTk2Y2MtOWU2ZjUwMjIxZjY3IiwidHlwZSI6ImFwaV90b2tlbiJ9.QL-Qjs13w0VxiLng4b_9AS8uD16n1u7fM3vT31pX7F0';

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
  faceAnalysis?: FaceAnalysisResult;
  objectDetection?: ObjectDetectionResult;
}

export interface FaceAnalysisResult {
  emotions: {
    joy: number;
    sorrow: number;
    anger: number;
    surprise: number;
  };
  attentiveness: number;
}

export interface ObjectDetectionResult {
  items: Array<{
    label: string;
    confidence: number;
  }>;
}

async function callEdenAI(apiEndpoint: string, data: any): Promise<any> {
  try {
    // Call the Gemini function with EdenAI data
    const response = await supabase.functions.invoke('analyze-with-gemini', {
      body: {
        type: 'edenai',
        prompt: {
          service: apiEndpoint.split('/').pop(),
          apiEndpoint,
          data
        }
      }
    });
    
    if (response.error) throw new Error(response.error.message);
    return response.data;
  } catch (error) {
    console.error(`Error calling Eden AI (${apiEndpoint}):`, error);
    throw new Error(`Failed to call Eden AI service: ${apiEndpoint}`);
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

export async function uploadImageForAnalysis(imageBlob: Blob): Promise<string> {
  try {
    // Generate a unique filename
    const filename = `interview_face_${Date.now()}.jpg`;
    
    // Upload to Supabase Storage
    const { data, error } = await supabase.storage
      .from('interview-recordings')
      .upload(filename, imageBlob, {
        contentType: 'image/jpeg',
        cacheControl: '3600',
      });
    
    if (error) throw error;
    
    // Get the public URL
    const { data: urlData } = supabase.storage
      .from('interview-recordings')
      .getPublicUrl(filename);
      
    return urlData.publicUrl;
  } catch (error) {
    console.error('Error uploading image file:', error);
    throw new Error('Failed to upload image for analysis');
  }
}

export async function transcribeAudio(audioUrl: string, language = 'en-US'): Promise<TranscriptionResult> {
  try {
    const data = await callEdenAI('audio/speech_to_text', {
      providers: 'openai',
      file_url: audioUrl,
      language
    });
    
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

export async function analyzeFace(imageUrl: string): Promise<FaceAnalysisResult> {
  try {
    const data = await callEdenAI('image/face_detection', {
      providers: 'amazon',
      file_url: imageUrl
    });
    
    // Extract Amazon results
    const result = data.amazon;
    
    // Default values in case face detection fails
    const defaultResult: FaceAnalysisResult = {
      emotions: {
        joy: 0.5,
        sorrow: 0.1,
        anger: 0.1,
        surprise: 0.3
      },
      attentiveness: 0.7
    };
    
    // If no faces detected, return default result
    if (!result.items || result.items.length === 0) {
      return defaultResult;
    }
    
    // Get the first face detected
    const face = result.items[0];
    
    // Process emotions if available
    let emotions = defaultResult.emotions;
    if (face.emotions) {
      // Map Amazon's emotions to our format
      emotions = {
        joy: face.emotions.find((e: any) => e.emotion === 'HAPPY')?.confidence || 0,
        sorrow: face.emotions.find((e: any) => e.emotion === 'SAD')?.confidence || 0,
        anger: face.emotions.find((e: any) => e.emotion === 'ANGRY')?.confidence || 0,
        surprise: face.emotions.find((e: any) => e.emotion === 'SURPRISED')?.confidence || 0
      };
    }
    
    // Calculate attentiveness based on face pose if available
    let attentiveness = defaultResult.attentiveness;
    if (face.pose) {
      // Higher attentiveness if the person is looking directly at the camera
      // (lower pitch, yaw, and roll values indicate direct gaze)
      const pitch = Math.abs(face.pose.pitch || 0);
      const yaw = Math.abs(face.pose.yaw || 0);
      const roll = Math.abs(face.pose.roll || 0);
      
      // Normalize to 0-1 range where 1 is perfect attentiveness
      attentiveness = 1 - ((pitch + yaw + roll) / 180);
      // Ensure value is between 0 and 1
      attentiveness = Math.max(0, Math.min(1, attentiveness));
    }
    
    return {
      emotions,
      attentiveness
    };
  } catch (error) {
    console.error('Face analysis error:', error);
    // Return default values instead of failing
    return {
      emotions: {
        joy: 0.5,
        sorrow: 0.1,
        anger: 0.1,
        surprise: 0.3
      },
      attentiveness: 0.7
    };
  }
}

export async function detectObjects(imageUrl: string): Promise<ObjectDetectionResult> {
  try {
    const data = await callEdenAI('image/object_detection', {
      providers: 'google',
      file_url: imageUrl
    });
    
    // Extract Google results
    const result = data.google;
    
    return {
      items: result.items.map((item: any) => ({
        label: item.label,
        confidence: item.confidence
      }))
    };
  } catch (error) {
    console.error('Object detection error:', error);
    // Return empty result instead of failing
    return { items: [] };
  }
}

export async function analyzeSentiment(text: string, language = 'en'): Promise<SentimentResult> {
  try {
    const data = await callEdenAI('text/sentiment_analysis', {
      providers: 'openai',
      text,
      language
    });
    
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
    const data = await callEdenAI('text/keyword_extraction', {
      providers: 'openai',
      text,
      language
    });
    
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

export async function determineRecommendation(
  sentimentScore: number, 
  transcriptLength: number,
  faceAnalysis?: FaceAnalysisResult
): Promise<'Hire' | 'Review' | 'Reject'> {
  // Enhanced logic that includes face analysis if available
  let confidenceScore = sentimentScore * 0.6; // Base 60% on sentiment
  
  // Add 20% based on transcript length/completeness
  confidenceScore += (Math.min(transcriptLength, 300) / 300) * 0.2;
  
  // Add 20% based on face analysis if available
  if (faceAnalysis) {
    const emotionScore = 
      (faceAnalysis.emotions.joy * 0.5) + 
      (faceAnalysis.emotions.surprise * 0.3) - 
      (faceAnalysis.emotions.anger * 0.6) -
      (faceAnalysis.emotions.sorrow * 0.4);
    
    const normalizedEmotionScore = (emotionScore + 1) / 2; // Convert to 0-1 range
    const attentivenessScore = faceAnalysis.attentiveness;
    
    // Combine emotion and attentiveness
    const faceScore = (normalizedEmotionScore * 0.5) + (attentivenessScore * 0.5);
    
    // Add face score weight (20%)
    confidenceScore += faceScore * 0.2;
  }
  
  // Ensure confidenceScore is between 0 and 1
  confidenceScore = Math.max(0, Math.min(1, confidenceScore));
  
  // Determine recommendation based on confidence score
  if (confidenceScore >= 0.7) {
    return 'Hire';
  } else if (confidenceScore >= 0.4) {
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
          recommendation: interviewData.recommendation,
          faceAnalysis: interviewData.faceAnalysis,
          objectDetection: interviewData.objectDetection
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

export async function processInterview(
  audioBlob: Blob, 
  imageBlob: Blob | null,
  candidateId: string
): Promise<InterviewAnalysisResult> {
  try {
    // Upload audio file
    const audioUrl = await uploadAudioForTranscription(audioBlob);
    
    // Transcribe audio
    const transcription = await transcribeAudio(audioUrl);
    
    // Analyze sentiment
    const sentiment = await analyzeSentiment(transcription.text);
    
    // Extract keywords
    const keywords = await extractKeywords(transcription.text);
    
    // Face analysis if image blob is provided
    let faceAnalysis: FaceAnalysisResult | undefined;
    let objectDetection: ObjectDetectionResult | undefined;
    
    if (imageBlob) {
      // Upload image for analysis
      const imageUrl = await uploadImageForAnalysis(imageBlob);
      
      // Analyze face in parallel
      faceAnalysis = await analyzeFace(imageUrl);
      
      // Detect objects in parallel
      objectDetection = await detectObjects(imageUrl);
    }
    
    // Determine recommendation with enhanced logic
    const recommendation = await determineRecommendation(
      sentiment.score, 
      transcription.text.length,
      faceAnalysis
    );
    
    const result = {
      transcription,
      sentiment,
      keywords,
      recommendation,
      faceAnalysis,
      objectDetection
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
    const data = await callEdenAI('ocr/ocr', {
      providers: 'google',
      file_url: fileUrl,
      language: 'en'
    });
    
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
    const data = await callEdenAI('text/named_entity_recognition', {
      providers: 'openai',
      text,
      language: 'en'
    });
    
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
