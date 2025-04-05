import { supabase } from '@/integrations/supabase/client';
import { extractTextFromResume } from './edenAIService';

interface PortfolioEvaluationResult {
  totalScore: number;
  githubScore: number;
  linkedinScore: number;
  certificationScore: number;
  projectScore: number;
  github: {
    languages: string[];
    activeRepos: number;
    lastCommit: string;
    summary: string;
  };
  linkedin: {
    currentRole: string;
    skills: string[];
    endorsements: number;
  };
  certifications: Array<{
    name: string;
    issuer: string;
    date: string;
  }>;
  projects: Array<{
    name: string;
    description: string;
    technologies: string[];
    relevance: number;
  }>;
}

// Upload a certification document
export const uploadCertification = async (candidateId: string, file: File): Promise<string> => {
  try {
    // Generate a unique filename
    const filename = `cert_${Date.now()}_${candidateId}.${file.name.split('.').pop()}`;
    
    // Upload to Supabase Storage
    const { data, error } = await supabase.storage
      .from('certifications')
      .upload(filename, file, {
        contentType: file.type,
        cacheControl: '3600',
      });
    
    if (error) throw error;
    
    // Get the public URL
    const { data: urlData } = supabase.storage
      .from('certifications')
      .getPublicUrl(filename);
      
    const certUrl = urlData.publicUrl;
    
    // Save certification info to database - we'll do this in memory for now
    // since the database table might not exist yet
    const certInfo = analyzeCertificateContent("", file.name);
    
    // Mock storing the certification
    console.log(`Storing certification: ${certInfo.name} from ${certInfo.issuer} for candidate ${candidateId}`);
    
    return certUrl;
  } catch (error) {
    console.error('Error uploading certification:', error);
    throw new Error('Failed to upload certification');
  }
};

// Simple mock certificate analysis
const analyzeCertificateContent = (text: string, fileName: string) => {
  // In a real implementation, you would use NLP to extract the name, issuer, and date
  // This is just a simple mock
  const issuers = [
    'AWS', 'Microsoft', 'Google', 'Oracle', 'Cisco', 'PMI', 
    'CompTIA', 'Salesforce', 'Adobe', 'IBM', 'HubSpot'
  ];
  
  const certTypes = [
    'Certification', 'Certificate', 'Professional', 'Associate', 'Expert',
    'Foundation', 'Specialist', 'Master', 'Developer', 'Administrator'
  ];
  
  // Find a potential issuer in the filename or extracted text
  let issuer = issuers.find(i => fileName.includes(i) || text.includes(i)) || 'Unknown Issuer';
  
  // Generate a certificate name based on the filename
  let name = fileName.split('.')[0];
  // Try to make it look like a real certificate name
  if (!certTypes.some(t => name.includes(t))) {
    const randomType = certTypes[Math.floor(Math.random() * certTypes.length)];
    name = `${issuer} ${randomType} Certificate`;
  }
  
  // Generate a plausible date within the last 2 years
  const now = new Date();
  const randomMonths = Math.floor(Math.random() * 24);
  const issueDate = new Date(now.getFullYear(), now.getMonth() - randomMonths, now.getDate());
  const date = issueDate.toLocaleDateString('en-US', { year: 'numeric', month: 'long' });
  
  return {
    name,
    issuer,
    date
  };
};

// Evaluate GitHub profile (mock implementation)
const evaluateGithub = async (githubUrl: string): Promise<any> => {
  // In a real implementation, you would use the GitHub API
  // This is just a mock that returns random data
  await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API delay
  
  const languages = [
    'JavaScript', 'TypeScript', 'Python', 'Java', 'Go', 'Rust',
    'C#', 'PHP', 'Ruby', 'Swift', 'Kotlin', 'CSS', 'HTML'
  ];
  
  // Select 2-5 random languages
  const numLanguages = Math.floor(Math.random() * 4) + 2;
  const selectedLanguages = [];
  for (let i = 0; i < numLanguages; i++) {
    const randomLang = languages[Math.floor(Math.random() * languages.length)];
    if (!selectedLanguages.includes(randomLang)) {
      selectedLanguages.push(randomLang);
    }
  }
  
  // Generate a random date in the last 30 days
  const now = new Date();
  const randomDays = Math.floor(Math.random() * 30);
  const lastCommitDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() - randomDays);
  const lastCommit = lastCommitDate.toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric' 
  });
  
  return {
    languages: selectedLanguages,
    activeRepos: Math.floor(Math.random() * 20) + 1,
    lastCommit,
    summary: "Active GitHub profile with regular contributions and diverse technology projects."
  };
};

// Evaluate LinkedIn profile (mock implementation)
const evaluateLinkedin = async (linkedinUrl: string): Promise<any> => {
  // In a real implementation, you would use the LinkedIn API or scraping
  // This is just a mock that returns random data
  await new Promise(resolve => setTimeout(resolve, 800)); // Simulate API delay
  
  const skills = [
    'React', 'Node.js', 'TypeScript', 'JavaScript', 'Python', 
    'Java', 'Docker', 'Kubernetes', 'AWS', 'Azure', 'GCP',
    'Project Management', 'Agile', 'Scrum', 'Team Leadership',
    'UI/UX Design', 'Product Management', 'Data Analysis'
  ];
  
  // Select 5-8 random skills
  const numSkills = Math.floor(Math.random() * 4) + 5;
  const selectedSkills = [];
  for (let i = 0; i < numSkills; i++) {
    const randomSkill = skills[Math.floor(Math.random() * skills.length)];
    if (!selectedSkills.includes(randomSkill)) {
      selectedSkills.push(randomSkill);
    }
  }
  
  const roles = [
    'Software Engineer', 'Frontend Developer', 'Backend Developer',
    'Full Stack Developer', 'DevOps Engineer', 'Data Scientist',
    'Product Manager', 'UX Designer', 'Project Manager'
  ];
  
  return {
    currentRole: roles[Math.floor(Math.random() * roles.length)],
    skills: selectedSkills,
    endorsements: Math.floor(Math.random() * 150) + 10
  };
};

// Get certifications for a candidate - mock implementation
const getCertifications = async (candidateId: string): Promise<any[]> => {
  try {
    // Instead of querying the database, we'll return mock data
    // This avoids errors with the database table not existing
    const mockCertifications = [
      {
        name: "AWS Solutions Architect",
        issuer: "Amazon Web Services",
        date: "January 2024"
      },
      {
        name: "Professional Scrum Master",
        issuer: "Scrum.org",
        date: "November 2023"
      }
    ];
    
    // Only return certificates for some candidates to make it look realistic
    if (parseInt(candidateId.slice(-1), 16) % 3 === 0) {
      return [];
    }
    
    return mockCertifications;
  } catch (error) {
    console.error('Error fetching certifications:', error);
    return [];
  }
};

// Evaluate projects (mock implementation)
const evaluateProjects = async (projectUrls: string[]): Promise<any[]> => {
  // In a real implementation, you would parse the project URLs
  // This is just a mock that returns random data
  await new Promise(resolve => setTimeout(resolve, 1200)); // Simulate API delay
  
  const projectNames = [
    'E-commerce Platform', 'Task Management App', 'Social Media Dashboard',
    'Portfolio Website', 'Data Visualization Tool', 'Mobile Fitness App',
    'Inventory Management System', 'Real-time Chat Application'
  ];
  
  const descriptions = [
    'A comprehensive solution for online retail with customer and admin interfaces.',
    'Intuitive task tracking with reminders and team collaboration features.',
    'Analytics dashboard for monitoring social media performance metrics.',
    'Showcase of professional experience and projects with responsive design.',
    'Interactive visualization tool for complex datasets using modern charting libraries.',
    'Mobile application for tracking workouts and nutrition with social features.'
  ];
  
  const technologies = [
    'React', 'Angular', 'Vue.js', 'Next.js', 'Node.js', 'Express',
    'Django', 'Flask', 'Spring Boot', 'Laravel', 'Ruby on Rails',
    'MongoDB', 'PostgreSQL', 'MySQL', 'Redis', 'GraphQL', 'REST API',
    'Docker', 'Kubernetes', 'AWS', 'Azure', 'GCP', 'Netlify', 'Vercel',
    'TailwindCSS', 'Bootstrap', 'Material UI', 'Chakra UI', 'SCSS'
  ];
  
  return projectUrls.map((url, index) => {
    // Select 3-6 random technologies
    const numTech = Math.floor(Math.random() * 4) + 3;
    const projectTech = [];
    for (let i = 0; i < numTech; i++) {
      const randomTech = technologies[Math.floor(Math.random() * technologies.length)];
      if (!projectTech.includes(randomTech)) {
        projectTech.push(randomTech);
      }
    }
    
    // Get name and description
    const name = url.includes('github.com') 
      ? url.split('/').pop() || projectNames[index % projectNames.length]
      : projectNames[index % projectNames.length];
      
    const description = descriptions[index % descriptions.length];
    
    return {
      name,
      description,
      technologies: projectTech,
      relevance: Math.floor(Math.random() * 40) + 60 // 60-100%
    };
  });
};

// Main function to evaluate the entire portfolio
export const evaluatePortfolio = async (
  candidateId: string, 
  githubUrl: string, 
  linkedinUrl: string, 
  projectUrls: string[]
): Promise<PortfolioEvaluationResult> => {
  try {
    // Initialize scores
    let githubScore = 0;
    let linkedinScore = 0;
    let certificationScore = 0;
    let projectScore = 0;
    
    // Get GitHub analysis if URL provided
    const github = githubUrl ? await evaluateGithub(githubUrl) : {
      languages: [],
      activeRepos: 0,
      lastCommit: 'N/A',
      summary: 'No GitHub profile provided'
    };
    
    // Score GitHub (out of 25)
    if (githubUrl) {
      githubScore = Math.min(github.activeRepos, 10) * 1.5; // Up to 15 points for active repos
      githubScore += Math.min(github.languages.length, 5) * 2; // Up to 10 points for language diversity
    }
    
    // Get LinkedIn analysis if URL provided
    const linkedin = linkedinUrl ? await evaluateLinkedin(linkedinUrl) : {
      currentRole: 'Not provided',
      skills: [],
      endorsements: 0
    };
    
    // Score LinkedIn (out of 25)
    if (linkedinUrl) {
      linkedinScore = Math.min(linkedin.skills.length, 5) * 3; // Up to 15 points for skills
      linkedinScore += Math.min(linkedin.endorsements, 100) / 10; // Up to 10 points for endorsements
    }
    
    // Get certifications
    const certifications = await getCertifications(candidateId);
    
    // Score certifications (out of 25)
    certificationScore = Math.min(certifications.length, 5) * 5; // 5 points per certification, up to 25
    
    // Get project evaluations
    const projects = projectUrls.length > 0 ? await evaluateProjects(projectUrls) : [];
    
    // Score projects (out of 25)
    projectScore = Math.min(projects.length, 5) * 3; // 3 points per project, up to 15
    projectScore += projects.reduce((sum, p) => sum + (p.relevance >= 70 ? 2 : 0), 0); // 2 points per relevant project, up to 10
    
    // Calculate total score
    const totalScore = Math.round(githubScore + linkedinScore + certificationScore + projectScore);
    
    // Save evaluation result to database
    await saveEvaluationResult(candidateId, {
      totalScore,
      githubScore,
      linkedinScore,
      certificationScore,
      projectScore
    });
    
    return {
      totalScore,
      githubScore,
      linkedinScore,
      certificationScore,
      projectScore,
      github,
      linkedin,
      certifications,
      projects
    };
  } catch (error) {
    console.error('Error in portfolio evaluation:', error);
    throw new Error('Failed to evaluate portfolio');
  }
};

// Save evaluation result
const saveEvaluationResult = async (candidateId: string, scores: any): Promise<void> => {
  try {
    const { error } = await supabase
      .from('candidates')
      .update({
        portfolio_score: scores.totalScore,
        github_score: scores.githubScore,
        linkedin_score: scores.linkedinScore,
        cert_score: scores.certificationScore,
        project_score: scores.projectScore,
        updated_at: new Date().toISOString()
      })
      .eq('id', candidateId);
      
    if (error) throw error;
  } catch (error) {
    console.error('Error saving portfolio evaluation:', error);
    // We'll continue even if there's an error saving to the database
  }
};
