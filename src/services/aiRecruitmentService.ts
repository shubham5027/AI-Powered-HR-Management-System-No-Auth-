import { supabase } from '@/integrations/supabase/client';

export interface CandidateScreeningResult {
  matchPercentage: number;
  keySkills: string[];
  missingSkills: string[];
  recommendation: string;
  rank: 'A' | 'B' | 'C';
}

// Mock function for now - will be replaced with actual API calls to Eden AI
export const analyzeResume = async (resumeText: string, jobDescription: string): Promise<CandidateScreeningResult> => {
  // For now, we'll simulate the analysis with a delay
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  // Extract skills from resume text (mocked for now)
  const candidateSkills = extractSkills(resumeText);
  
  // Extract required skills from job description (mocked for now)
  const requiredSkills = extractSkills(jobDescription);
  
  // Calculate matching skills
  const matchingSkills = candidateSkills.filter(skill => 
    requiredSkills.some(reqSkill => 
      reqSkill.toLowerCase().includes(skill.toLowerCase()) || 
      skill.toLowerCase().includes(reqSkill.toLowerCase())
    )
  );
  
  // Calculate missing skills
  const missingSkills = requiredSkills.filter(reqSkill => 
    !candidateSkills.some(skill => 
      reqSkill.toLowerCase().includes(skill.toLowerCase()) || 
      skill.toLowerCase().includes(reqSkill.toLowerCase())
    )
  );
  
  // Calculate match percentage
  const matchPercentage = Math.min(
    Math.round((matchingSkills.length / Math.max(requiredSkills.length, 1)) * 100),
    100
  );
  
  // Determine rank based on match percentage
  let rank: 'A' | 'B' | 'C';
  if (matchPercentage >= 80) {
    rank = 'A';
  } else if (matchPercentage >= 60) {
    rank = 'B';
  } else {
    rank = 'C';
  }
  
  // Generate recommendation
  let recommendation = '';
  if (matchPercentage >= 80) {
    recommendation = "Strong match. Candidate has most of the required skills for this position.";
  } else if (matchPercentage >= 60) {
    recommendation = "Potential match. Candidate has some key skills but lacks experience in " + missingSkills.slice(0, 2).join(', ') + '.';
  } else {
    recommendation = "Not recommended for this position. Candidate lacks several key requirements including " + missingSkills.slice(0, 3).join(', ') + '.';
  }
  
  return {
    matchPercentage,
    keySkills: matchingSkills,
    missingSkills: missingSkills.slice(0, 5), // Limit to top 5 missing skills
    recommendation,
    rank
  };
};

// Helper function to extract skills from text
function extractSkills(text: string): string[] {
  // This is a simplified mock implementation
  // In production, this would use Eden AI's NER to extract skills
  const commonSkills = [
    'React', 'JavaScript', 'TypeScript', 'HTML', 'CSS', 'Node.js', 'Python',
    'Java', 'UI/UX', 'Design', 'Project Management', 'Agile', 'Scrum',
    'Communication', 'Leadership', 'Problem Solving', 'Customer Service',
    'Sales', 'Marketing', 'SEO', 'SEM', 'Content Writing', 'Data Analysis',
    'SQL', 'NoSQL', 'MongoDB', 'PostgreSQL', 'AWS', 'Azure', 'GCP',
    'DevOps', 'CI/CD', 'Docker', 'Kubernetes', 'Git', 'GitHub', 'GitLab',
    'Responsive Design', 'Mobile Development', 'iOS', 'Android', 'Flutter',
    'React Native', 'Vue.js', 'Angular', 'Svelte', 'Redux', 'GraphQL', 'REST API'
  ];
  
  // Extract skills that appear in the text
  return commonSkills.filter(skill => 
    text.toLowerCase().includes(skill.toLowerCase())
  );
}

// Save screening result to database
export const saveScreeningResult = async (
  candidateId: string,
  result: CandidateScreeningResult
): Promise<void> => {
  try {
    const { error } = await supabase
      .from('candidates')
      .update({
        match_score: result.matchPercentage,
        skills: result.keySkills,
        notes: `AI Analysis: ${result.recommendation}`,
        status: result.rank === 'A' ? 'screening' : 'applied'
      })
      .eq('id', candidateId);
      
    if (error) throw error;
  } catch (error) {
    console.error('Error saving screening results:', error);
    throw new Error('Failed to save screening results');
  }
};

// Upload resume file
export const uploadResume = async (file: File): Promise<string> => {
  try {
    // Generate a unique filename
    const filename = `resume_${Date.now()}.${file.name.split('.').pop()}`;
    
    // Upload to Supabase Storage
    const { data, error } = await supabase.storage
      .from('resumes')
      .upload(filename, file, {
        contentType: file.type,
        cacheControl: '3600',
      });
    
    if (error) throw error;
    
    // Get the public URL
    const { data: urlData } = supabase.storage
      .from('resumes')
      .getPublicUrl(filename);
      
    return urlData.publicUrl;
  } catch (error) {
    console.error('Error uploading resume file:', error);
    throw new Error('Failed to upload resume file');
  }
};

// Generate an AI-powered offer letter (mock implementation)
export const generateOfferLetter = async (
  candidateName: string,
  jobTitle: string,
  salary: number
): Promise<string> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  // Format the salary with commas
  const formattedSalary = salary.toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0
  });
  
  // Generate a mock offer letter
  const currentDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  
  return `
Mindsprint
ITP White Field
Banglore, India

${currentDate}

Dear ${candidateName},

We are pleased to offer you the position of ${jobTitle} at Minsprint Inc. After careful consideration of your qualifications and experience, we believe you would be a valuable addition to our team.

This letter confirms our offer with the following details:

Position: ${jobTitle}
Start Date: Two weeks from acceptance
Salary: ${formattedSalary} per annum
Employment Type: Full-time
Benefits: 
- Comprehensive health, dental, and vision insurance
- 401(k) retirement plan with company matching
- 20 days of paid time off annually
- Flexible work arrangements
- Professional development allowance

This offer is contingent upon successful completion of a background check and signing of our standard employment agreement.

To accept this offer, please sign and return this letter by [Acceptance Deadline]. If you have any questions or need clarification, please don't hesitate to contact our HR department.

We are excited about the possibility of you joining our team and look forward to your positive response.

Sincerely,


HR Director
Mindsprint Inc.

ACCEPTANCE:
I, ${candidateName}, accept the offer as outlined above.

____________________                  ____________________
Signature                            Date
`;
};
