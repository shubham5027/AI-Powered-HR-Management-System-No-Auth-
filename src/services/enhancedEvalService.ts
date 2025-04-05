import { supabase } from '@/integrations/supabase/client';

// Types for resume parsing
export interface ResumeParsingResult {
  name?: string;
  email?: string;
  phone?: string;
  location?: string;
  skills: string[];
  education: Education[];
  workExperience: WorkExperience[];
  summary?: string;
  certifications: string[];
  languages: string[];
}

interface Education {
  degree?: string;
  institution?: string;
  date?: string;
}

interface WorkExperience {
  title?: string;
  company?: string;
  date?: string;
  description?: string;
}

// Types for keyword extraction
export interface KeywordExtractionResult {
  keywords: string[];
  importances: number[];
}

// Types for entity recognition
export interface EntityRecognitionResult {
  entities: Entity[];
}

interface Entity {
  entity: string;
  type: string;
  importance: number;
}

// Types for document QA
export interface DocumentQAResult {
  answers: { query: string; answer: string }[];
}

// Types for Gemini analysis
export interface GeminiAnalysisResult {
  content: string;
}

// Function to parse resume file
export async function parseResumeFile(fileUrl: string): Promise<ResumeParsingResult> {
  try {
    const { data, error } = await supabase.functions.invoke('enhance-candidate-evaluation', {
      body: {
        action: 'parse_resume',
        data: { fileUrl }
      }
    });

    if (error) throw error;

    // Extract and normalize the data from the API response
    const resumeData = data.affinda || {};
    const profile = resumeData.extracted_data || {};

    const result = {
      name: profile.personal_infos?.name || '',
      email: profile.personal_infos?.email || '',
      phone: profile.personal_infos?.phone || '',
      location: profile.personal_infos?.location?.formatted_location || '',
      skills: (profile.skills || []).map((skill: any) => skill.name || ''),
      education: (profile.education || []).map((edu: any) => ({
        degree: edu.degree || '',
        institution: edu.school || '',
        date: edu.dates?.end_date || ''
      })),
      workExperience: (profile.work_experience || []).map((exp: any) => ({
        title: exp.title || '',
        company: exp.company || '',
        date: exp.dates?.end_date || '',
        description: exp.description || ''
      })),
      summary: profile.summary || '',
      certifications: (profile.certifications || []).map((cert: any) => cert.name || ''),
      languages: (profile.languages || []).map((lang: any) => lang.name || '')
    };

    return result;
  } catch (error) {
    console.error('Error parsing resume:', error);
    throw new Error('Failed to parse resume');
  }
}

// Function to extract keywords from text
export async function extractKeywords(text: string): Promise<KeywordExtractionResult> {
  try {
    const { data, error } = await supabase.functions.invoke('enhance-candidate-evaluation', {
      body: {
        action: 'extract_keywords',
        data: { text }
      }
    });

    if (error) throw error;

    // Extract and normalize the data from the API response
    const openaiResult = data.openai || {};
    const items = openaiResult.items || [];

    return {
      keywords: items.map((item: any) => item.keyword),
      importances: items.map((item: any) => item.importance)
    };
  } catch (error) {
    console.error('Error extracting keywords:', error);
    throw new Error('Failed to extract keywords');
  }
}

// Function to recognize entities in text
export async function recognizeEntities(text: string): Promise<EntityRecognitionResult> {
  try {
    const { data, error } = await supabase.functions.invoke('enhance-candidate-evaluation', {
      body: {
        action: 'recognize_entities',
        data: { text }
      }
    });

    if (error) throw error;

    // Extract and normalize the data from the API response
    const openaiResult = data.openai || {};
    const items = openaiResult.items || [];

    return {
      entities: items.map((item: any) => ({
        entity: item.entity,
        type: item.category,
        importance: parseFloat(item.importance || 0)
      }))
    };
  } catch (error) {
    console.error('Error recognizing entities:', error);
    throw new Error('Failed to recognize entities');
  }
}

// Function to perform document QA
export async function performDocumentQA(fileUrl: string, queries: { query: string, pages: string }[]): Promise<DocumentQAResult> {
  try {
    const { data, error } = await supabase.functions.invoke('enhance-candidate-evaluation', {
      body: {
        action: 'document_qa',
        data: { fileUrl, queries }
      }
    });

    if (error) throw error;

    // For async operations, return the public_id so it can be polled
    if (data.public_id) {
      return { 
        answers: [{ 
          query: 'Processing document', 
          answer: `Document is being processed. Reference ID: ${data.public_id}` 
        }] 
      };
    }

    // Extract and normalize the data from the API response
    const extractaResult = data.extracta || {};
    const items = extractaResult.extracted_data || [];

    return {
      answers: items.map((item: any) => ({
        query: item.query,
        answer: item.answer
      }))
    };
  } catch (error) {
    console.error('Error performing document QA:', error);
    throw new Error('Failed to perform document QA');
  }
}

// Function to analyze candidate using Gemini
export async function analyzeWithGemini(prompt: string): Promise<GeminiAnalysisResult> {
  try {
    const { data, error } = await supabase.functions.invoke('analyze-with-gemini', {
      body: {
        prompt,
        model: 'gemini-1.5-flash' // You can also use 'gemini-1.5-pro' for more advanced analysis
      }
    });

    if (error) throw error;

    // Extract the text from the response
    let content = 'No analysis available';
    
    try {
      if (data.candidates && data.candidates.length > 0 &&
          data.candidates[0].content && data.candidates[0].content.parts &&
          data.candidates[0].content.parts.length > 0) {
        content = data.candidates[0].content.parts[0].text;
      } else if (data.candidates && data.candidates[0] && data.candidates[0].parts) {
        // Alternative structure sometimes returned
        content = data.candidates[0].parts[0].text;
      }
    } catch (parseError) {
      console.error('Error parsing Gemini response:', parseError);
      console.log('Raw response:', data);
    }

    return {
      content
    };
  } catch (error) {
    console.error('Error analyzing with Gemini:', error);
    throw new Error('Failed to analyze with Gemini');
  }
}

// Function to upload a resume file to Supabase
export async function uploadResumeFile(file: File): Promise<string> {
  try {
    // Generate a unique file name
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}_${Math.random().toString(36).substring(2)}.${fileExt}`;
    
    // Upload file to storage
    const { data, error } = await supabase.storage
      .from('resumes')
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: false
      });
      
    if (error) throw error;
      
    // Get the public URL
    const { data: urlData } = supabase.storage
      .from('resumes')
      .getPublicUrl(fileName);
      
    return urlData.publicUrl;
  } catch (error) {
    console.error('Error uploading resume:', error);
    throw new Error('Failed to upload resume');
  }
}

// Save resume data to database - Using direct SQL queries to avoid type issues
export async function saveResumeData(candidateId: string, resumeData: ResumeParsingResult, resumeUrl: string): Promise<void> {
  try {
    // Direct insert into candidates table as a fallback
    const { error } = await supabase
      .from('candidates')
      .update({
        first_name: resumeData.name?.split(' ')[0] || '',
        last_name: resumeData.name?.split(' ').slice(1).join(' ') || '',
        email: resumeData.email || '',
        phone: resumeData.phone || '',
        skills: resumeData.skills,
        notes: `Summary: ${resumeData.summary || ''}`,
        resume_url: resumeUrl
      })
      .eq('id', candidateId);
      
    if (error) {
      console.error('Update error:', error);
      throw error;
    }
  } catch (error) {
    console.error('Error saving resume data:', error);
    throw new Error('Failed to save resume data');
  }
}

// Save evaluation results to database - Using direct updates instead of RPC calls
export async function saveEvaluationResults(
  candidateId: string, 
  keySkills: string[], 
  entities: EntityRecognitionResult, 
  analysis: GeminiAnalysisResult,
  matchScore: number = 0
): Promise<void> {
  try {
    // Update the candidates table with the evaluation scores
    const { error: updateError } = await supabase
      .from('candidates')
      .update({
        skills: keySkills,
        notes: analysis.content.substring(0, 300) + '...',
        portfolio_score: matchScore,
        github_score: Math.floor(matchScore * 0.25),
        linkedin_score: Math.floor(matchScore * 0.25),
        cert_score: Math.floor(matchScore * 0.25),
        project_score: Math.floor(matchScore * 0.25)
      })
      .eq('id', candidateId);
    
    if (updateError) {
      console.error('Error updating candidate:', updateError);
      throw updateError;
    }
  } catch (error) {
    console.error('Error saving evaluation results:', error);
    throw new Error('Failed to save evaluation results');
  }
}

// Update candidate portfolio data
export async function updateCandidatePortfolio(
  candidateId: string,
  githubUrl: string,
  linkedinUrl: string,
  projectUrls: string[]
): Promise<void> {
  try {
    const { error } = await supabase
      .from('candidates')
      .update({
        githuburl: githubUrl,
        linkedinurl: linkedinUrl,
        projecturls: projectUrls
      })
      .eq('id', candidateId);
      
    if (error) {
      console.error('Error updating candidate portfolio:', error);
      throw error;
    }
  } catch (error) {
    console.error('Error updating portfolio:', error);
    throw new Error('Failed to update portfolio');
  }
}

// Get resume data for a candidate
export async function getResumeData(candidateId: string): Promise<ResumeParsingResult | null> {
  try {
    // Since we're storing partial data in the candidates table as a fallback
    const { data, error } = await supabase
      .from('candidates')
      .select('first_name, last_name, email, phone, skills, notes, resume_url')
      .eq('id', candidateId)
      .single();
      
    if (error) throw error;
    
    if (!data) return null;
    
    return {
      name: `${data.first_name} ${data.last_name}`.trim(),
      email: data.email,
      phone: data.phone || '',
      location: '',
      skills: data.skills || [],
      education: [],
      workExperience: [],
      summary: data.notes?.replace('Summary: ', '') || '',
      certifications: [],
      languages: []
    };
  } catch (error) {
    console.error('Error getting resume data:', error);
    return null;
  }
}

// Get evaluation results from database
export async function getEvaluationResults(candidateId: string): Promise<any | null> {
  try {
    const { data, error } = await supabase
      .from('candidates')
      .select('skills, notes, portfolio_score, github_score, linkedin_score, cert_score, project_score')
      .eq('id', candidateId)
      .single();
      
    if (error) {
      console.error('Error getting evaluation results:', error);
      return null;
    }
    
    // If no data or no portfolio score, return null
    if (!data || data.portfolio_score === null) return null;
    
    return {
      keySkills: data.skills || [],
      analysis: data.notes || '',
      matchScore: data.portfolio_score || 0,
      githubScore: data.github_score || 0,
      linkedinScore: data.linkedin_score || 0,
      certificationScore: data.cert_score || 0,
      projectScore: data.project_score || 0
    };
  } catch (error) {
    console.error('Error getting evaluation results:', error);
    return null;
  }
}

// Combined function for comprehensive candidate evaluation
export async function performComprehensiveEvaluation(resumeFile: File, portfolioText: string, candidateId?: string): Promise<{
  resumeData: ResumeParsingResult;
  keySkills: string[];
  entities: EntityRecognitionResult;
  analysis: GeminiAnalysisResult;
}> {
  try {
    // Upload resume first
    const resumeUrl = await uploadResumeFile(resumeFile);
    
    // Parse resume
    const resumeData = await parseResumeFile(resumeUrl);
    
    // Extract keywords from combined resume and portfolio text
    const combinedText = `${resumeData.summary || ''} ${portfolioText}`;
    const keywordResults = await extractKeywords(combinedText);
    
    // Recognize entities
    const entityResults = await recognizeEntities(combinedText);
    
    // Perform deep analysis with Gemini
    const analysisPrompt = `
      Please provide a comprehensive evaluation of this candidate based on the following information:
      
      Resume Summary: ${resumeData.summary || 'Not provided'}
      
      Skills: ${resumeData.skills.join(', ')}
      
      Education: ${resumeData.education.map(edu => `${edu.degree} from ${edu.institution} (${edu.date})`).join(', ')}
      
      Work Experience: ${resumeData.workExperience.map(exp => `${exp.title} at ${exp.company} (${exp.date})`).join(', ')}
      
      Portfolio/Additional Information: ${portfolioText}
      
      Provide strengths, weaknesses, and overall recommendation. Focus on evaluating:
      1. Technical skills match
      2. Experience relevance
      3. Education background
      4. Overall fit for a technical role
      5. Areas for improvement
    `;
    
    const analysisResults = await analyzeWithGemini(analysisPrompt);
    
    // Calculate a simple match score (can be enhanced with more sophisticated logic)
    const matchScore = Math.floor(Math.random() * 30) + 70; // 70-100% for demo purposes
    
    // If candidateId is provided, save the data to database
    if (candidateId) {
      await saveResumeData(candidateId, resumeData, resumeUrl);
      await saveEvaluationResults(candidateId, keywordResults.keywords, entityResults, analysisResults, matchScore);
    }
    
    return {
      resumeData,
      keySkills: keywordResults.keywords,
      entities: entityResults,
      analysis: analysisResults
    };
  } catch (error) {
    console.error('Error in comprehensive evaluation:', error);
    throw error;
  }
}
