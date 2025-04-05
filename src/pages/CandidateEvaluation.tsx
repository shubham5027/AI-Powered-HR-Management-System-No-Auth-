// import React, { useState, useEffect } from 'react';
// import { useToast } from "@/hooks/use-toast";
// import { toast } from 'sonner';
// import { AppLayout } from '@/components/layout/AppLayout';
// import { Button } from "@/components/ui/button";
// import { Progress } from "@/components/ui/progress";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { Textarea } from "@/components/ui/textarea";
// import { Badge } from "@/components/ui/badge";
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card";
// import {
//   Tooltip,
//   TooltipContent,
//   TooltipProvider,
//   TooltipTrigger,
// } from "@/components/ui/tooltip";
// import {
//   Github,
//   Linkedin,
//   FileText,
//   Upload,
//   AlertCircle,
//   CheckCircle,
//   XCircle,
//   Globe,
//   Sparkles,
//   Award,
//   Briefcase,
//   GraduationCap,
//   FileCode,
//   Loader2,
// } from 'lucide-react';

// import { 
//   performComprehensiveEvaluation, 
//   ResumeParsingResult,
//   getResumeData,
//   getEvaluationResults
// } from '@/services/enhancedEvalService';
// import { supabase } from '@/integrations/supabase/client';

// // Helper components
// const LoadingSpinner = () => (
//   <div className="flex justify-center items-center h-[400px]">
//     <div className="flex flex-col items-center gap-2">
//       <Loader2 className="h-8 w-8 animate-spin text-primary" />
//       <p className="text-sm text-muted-foreground">Processing your request...</p>
//     </div>
//   </div>
// );

// const CandidateEvaluation = () => {
//   const { toast: toastNotification } = useToast();
//   const [isLoading, setIsLoading] = useState(false);
//   const [activeTab, setActiveTab] = useState("resume");
//   const [evaluationResult, setEvaluationResult] = useState<null | {
//     resumeData: ResumeParsingResult;
//     keySkills: string[];
//     analysis: { content: string };
//     matchScore?: number;
//   }>(null);
//   const [candidateId, setCandidateId] = useState<string | null>(null);
  
//   // Form inputs
//   const [resumeFile, setResumeFile] = useState<File | null>(null);
//   const [githubURL, setGithubURL] = useState('');
//   const [linkedinURL, setLinkedinURL] = useState('');
//   const [portfolioText, setPortfolioText] = useState('');
//   const [certifications, setCertifications] = useState('');
//   const [projects, setProjects] = useState('');
  
//   // Check if we have a candidate ID from URL parameters
//   useEffect(() => {
//     const params = new URLSearchParams(window.location.search);
//     const id = params.get('candidateId');
//     if (id) {
//       setCandidateId(id);
//       loadExistingData(id);
//     }
//   }, []);
  
//   // Load existing data if we have a candidate ID
//   const loadExistingData = async (id: string) => {
//     setIsLoading(true);
//     try {
//       // Get the candidate data
//       const { data: candidate, error: candidateError } = await supabase
//         .from('candidates')
//         .select('*')
//         .eq('id', id)
//         .single();
        
//       if (candidateError) throw candidateError;
      
//       // Get resume data
//       const resumeData = await getResumeData(id);
      
//       // Get evaluation results
//       const evaluationData = await getEvaluationResults(id);
      
//       if (resumeData && evaluationData) {
//         setEvaluationResult({
//           resumeData,
//           keySkills: evaluationData.keySkills || [],
//           analysis: { content: evaluationData.analysis || '' },
//           matchScore: evaluationData.matchScore
//         });
        
//         // Cast to any to avoid type issues with the githubUrl and linkedinUrl properties
//         const githubUrl = (candidate as any)?.githuburl || '';
//         const linkedinUrl = (candidate as any)?.linkedinurl || '';
//         const projectUrls = (candidate as any)?.projecturls || [];
        
//         // Set form inputs from candidate data
//         if (candidate) {
//           setGithubURL(githubUrl);
//           setLinkedinURL(linkedinUrl);
//         }
//       }
//     } catch (error) {
//       console.error('Error loading existing data:', error);
//       toastNotification({
//         title: "Failed to Load Data",
//         description: "Could not load existing candidate data",
//         variant: "destructive"
//       });
//     } finally {
//       setIsLoading(false);
//     }
//   };
  
//   const handleResumeUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
//     if (e.target.files && e.target.files[0]) {
//       setResumeFile(e.target.files[0]);
//       toast.success(`Selected file: ${e.target.files[0].name}`);
//     }
//   };
  
//   const handleEvaluate = async () => {
//     if (!resumeFile) {
//       toastNotification({
//         title: "Resume Required",
//         description: "Please upload a resume file to proceed with evaluation",
//         variant: "destructive"
//       });
//       return;
//     }
    
//     setIsLoading(true);
//     try {
//       // Combine all portfolio text
//       const combinedPortfolioText = `
//         GitHub: ${githubURL}
//         LinkedIn: ${linkedinURL}
//         Portfolio Description: ${portfolioText}
//         Certifications: ${certifications}
//         Projects: ${projects}
//       `;
      
//       // Perform comprehensive evaluation
//       const result = await performComprehensiveEvaluation(resumeFile, combinedPortfolioText, candidateId || undefined);
      
//       // Update state with results
//       setEvaluationResult({
//         ...result,
//         matchScore: Math.floor(Math.random() * 30) + 70 // 70-100% for demo
//       });
      
//       // Create or update candidate in database if we don't have an ID yet
//       if (!candidateId) {
//         // Extract a name from the resume data
//         const candidateName = result.resumeData.name || 'Unnamed Candidate';
//         const [firstName, ...lastNameParts] = candidateName.split(' ');
//         const lastName = lastNameParts.join(' ');
        
//         // Create a new candidate
//         const { data, error } = await supabase
//           .from('candidates')
//           .insert({
//             first_name: firstName,
//             last_name: lastName || 'Unknown',
//             email: result.resumeData.email || 'unknown@example.com',
//             phone: result.resumeData.phone,
//             skills: result.resumeData.skills,
//             githubUrl: githubURL,
//             linkedinUrl: linkedinURL,
//             projectUrls: projects.split('\n').filter(url => url.trim().length > 0)
//           })
//           .select()
//           .single();
          
//         if (error) throw error;
        
//         // Set the new candidate ID
//         if (data) {
//           setCandidateId(data.id);
          
//           // Update URL with candidate ID without page reload
//           const url = new URL(window.location.href);
//           url.searchParams.set('candidateId', data.id);
//           window.history.pushState({}, '', url.toString());
//         }
//       }
      
//       toast.success('Evaluation completed successfully');
//     } catch (error: any) {
//       console.error('Evaluation error:', error);
//       toastNotification({
//         title: "Evaluation Failed",
//         description: error.message || "An unexpected error occurred",
//         variant: "destructive"
//       });
//     } finally {
//       setIsLoading(false);
//     }
//   };
  
//   const getSkillMatch = (skillName: string): number => {
//     // This is a simplified implementation - in production, you would match against job requirements
//     const techSkills = ['javascript', 'react', 'typescript', 'node', 'python', 'java', 'sql', 'html', 'css'];
//     const softSkills = ['communication', 'teamwork', 'leadership', 'problem solving', 'critical thinking'];
    
//     skillName = skillName.toLowerCase();
    
//     if (techSkills.some(tech => skillName.includes(tech))) {
//       return Math.floor(Math.random() * 30 + 70); // 70-100% match for tech skills
//     } else if (softSkills.some(soft => skillName.includes(soft))) {
//       return Math.floor(Math.random() * 20 + 80); // 80-100% match for soft skills
//     } else {
//       return Math.floor(Math.random() * 60 + 40); // 40-100% for other skills
//     }
//   };
  
//   const handleAddCandidate = async (candidate: any) => {
//     try {
//       // Extract a name from the resume data
//       const candidateName = (evaluationResult?.resumeData.name) || 'Unnamed Candidate';
//       const [firstName, ...lastNameParts] = candidateName.split(' ');
//       const lastName = lastNameParts.join(' ');
      
//       // Create a new candidate with the correct column names
//       const { data, error } = await supabase
//         .from('candidates')
//         .insert({
//           first_name: firstName,
//           last_name: lastName || 'Unknown',
//           email: evaluationResult?.resumeData.email || 'unknown@example.com',
//           phone: evaluationResult?.resumeData.phone,
//           skills: evaluationResult?.resumeData.skills,
//           githubUrl: githubURL,  // Use proper casing based on our SQL migration
//           linkedinUrl: linkedinURL,  // Use proper casing based on our SQL migration
//           projectUrls: projects.split('\n').filter(url => url.trim().length > 0)
//         })
//         .select()
//         .single();
        
//       if (error) throw error;
      
//       // Set the new candidate ID
//       if (data) {
//         setCandidateId(data.id);
        
//         // Update URL with candidate ID without page reload
//         const url = new URL(window.location.href);
//         url.searchParams.set('candidateId', data.id);
//         window.history.pushState({}, '', url.toString());
//       }
//     } catch (error: any) {
//       console.error('Error adding candidate:', error);
//       toast.error('Failed to add candidate: ' + error.message);
//     }
//   };
  
//   return (
//     <AppLayout>
//       <div className="space-y-6">
//         <div className="flex justify-between items-center">
//           <h1 className="text-3xl font-bold tracking-tight">Candidate Evaluation</h1>
//           {candidateId && (
//             <Badge variant="outline" className="text-xs px-2 py-1">
//               Candidate ID: {candidateId}
//             </Badge>
//           )}
//         </div>
        
//         <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
//           <Card className="lg:col-span-1">
//             <CardHeader>
//               <CardTitle>Evaluation Inputs</CardTitle>
//               <CardDescription>
//                 Provide candidate information for AI-powered evaluation
//               </CardDescription>
//             </CardHeader>
//             <CardContent>
//               <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
//                 <TabsList className="grid grid-cols-4 w-full">
//                   <TabsTrigger value="resume" className="text-xs">Resume</TabsTrigger>
//                   <TabsTrigger value="github" className="text-xs">GitHub</TabsTrigger>
//                   <TabsTrigger value="linkedin" className="text-xs">LinkedIn</TabsTrigger>
//                   <TabsTrigger value="other" className="text-xs">Other</TabsTrigger>
//                 </TabsList>
                
//                 <TabsContent value="resume" className="space-y-4">
//                   <div>
//                     <Label htmlFor="resume-upload">Upload Resume (PDF/DOC)</Label>
//                     <div className="mt-1.5">
//                       <Input
//                         id="resume-upload"
//                         type="file"
//                         accept=".pdf,.doc,.docx"
//                         onChange={handleResumeUpload}
//                       />
//                       <p className="text-xs text-muted-foreground mt-1">
//                         Supported formats: PDF, DOC, DOCX
//                       </p>
//                     </div>
//                   </div>
//                 </TabsContent>
                
//                 <TabsContent value="github" className="space-y-4">
//                   <div>
//                     <Label htmlFor="github-url">GitHub Profile URL</Label>
//                     <div className="flex items-center mt-1.5">
//                       <Github className="h-4 w-4 mr-2 text-muted-foreground" />
//                       <Input
//                         id="github-url"
//                         placeholder="https://github.com/username"
//                         value={githubURL}
//                         onChange={(e) => setGithubURL(e.target.value)}
//                       />
//                     </div>
//                   </div>
//                 </TabsContent>
                
//                 <TabsContent value="linkedin" className="space-y-4">
//                   <div>
//                     <Label htmlFor="linkedin-url">LinkedIn Profile URL</Label>
//                     <div className="flex items-center mt-1.5">
//                       <Linkedin className="h-4 w-4 mr-2 text-muted-foreground" />
//                       <Input
//                         id="linkedin-url"
//                         placeholder="https://linkedin.com/in/username"
//                         value={linkedinURL}
//                         onChange={(e) => setLinkedinURL(e.target.value)}
//                       />
//                     </div>
//                   </div>
//                 </TabsContent>
                
//                 <TabsContent value="other" className="space-y-4">
//                   <div>
//                     <Label htmlFor="portfolio-description">Portfolio Description</Label>
//                     <Textarea
//                       id="portfolio-description"
//                       placeholder="Describe candidate's portfolio, achievements, and any additional information..."
//                       className="min-h-[100px] mt-1.5"
//                       value={portfolioText}
//                       onChange={(e) => setPortfolioText(e.target.value)}
//                     />
//                   </div>
//                   <div>
//                     <Label htmlFor="certifications">Certifications</Label>
//                     <Textarea
//                       id="certifications"
//                       placeholder="List relevant certifications..."
//                       className="min-h-[60px] mt-1.5"
//                       value={certifications}
//                       onChange={(e) => setCertifications(e.target.value)}
//                     />
//                   </div>
//                   <div>
//                     <Label htmlFor="projects">Notable Projects</Label>
//                     <Textarea
//                       id="projects"
//                       placeholder="Describe major projects and accomplishments..."
//                       className="min-h-[60px] mt-1.5"
//                       value={projects}
//                       onChange={(e) => setProjects(e.target.value)}
//                     />
//                   </div>
//                 </TabsContent>
//               </Tabs>
              
//               <Button 
//                 className="w-full mt-6" 
//                 onClick={handleEvaluate}
//                 disabled={isLoading || !resumeFile}
//               >
//                 {isLoading ? "Evaluating..." : "Evaluate Candidate"}
//                 {!isLoading && <Sparkles className="ml-2 h-4 w-4" />}
//               </Button>
//             </CardContent>
//           </Card>
          
//           <Card className="lg:col-span-2">
//             <CardHeader>
//               <CardTitle>Evaluation Results</CardTitle>
//               <CardDescription>
//                 AI-powered analysis of candidate qualifications and fit
//               </CardDescription>
//             </CardHeader>
//             <CardContent>
//               {isLoading ? (
//                 <LoadingSpinner />
//               ) : !evaluationResult ? (
//                 <div className="flex flex-col items-center justify-center h-[400px] text-center">
//                   <FileText className="h-16 w-16 text-muted-foreground/30 mb-4" />
//                   <h3 className="text-lg font-medium mb-2">No Evaluation Yet</h3>
//                   <p className="text-muted-foreground max-w-md">
//                     Upload a resume and provide additional information to receive an AI-powered candidate evaluation.
//                   </p>
//                 </div>
//               ) : (
//                 <div className="space-y-6">
//                   {/* Candidate Summary */}
//                   <div className="p-4 bg-muted rounded-lg">
//                     <div className="flex flex-wrap items-start gap-4">
//                       <div className="flex-1">
//                         <h3 className="text-lg font-bold">
//                           {evaluationResult.resumeData.name || "Candidate"}
//                         </h3>
//                         {evaluationResult.resumeData.email && (
//                           <p className="text-sm text-muted-foreground">
//                             {evaluationResult.resumeData.email}
//                           </p>
//                         )}
//                         {evaluationResult.resumeData.location && (
//                           <p className="text-sm text-muted-foreground flex items-center mt-1">
//                             <Globe className="h-3 w-3 mr-1" />
//                             {evaluationResult.resumeData.location}
//                           </p>
//                         )}
//                       </div>
                      
//                       <div className="flex flex-col items-center">
//                         <div className="text-3xl font-bold text-primary">
//                           {evaluationResult.matchScore || Math.floor(Math.random() * 30 + 70)}%
//                         </div>
//                         <div className="text-xs text-muted-foreground">Match Score</div>
//                       </div>
//                     </div>
//                   </div>
                  
//                   {/* Skills Assessment */}
//                   <div>
//                     <h3 className="text-md font-semibold mb-3 flex items-center">
//                       <Award className="h-4 w-4 mr-2 text-blue-500" />
//                       Skills Assessment
//                     </h3>
//                     <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
//                       {evaluationResult.resumeData.skills.slice(0, 8).map((skill, index) => {
//                         const matchScore = getSkillMatch(skill);
//                         return (
//                           <div key={index} className="space-y-1">
//                             <div className="flex justify-between text-sm">
//                               <span>{skill}</span>
//                               <span className="font-medium">{matchScore}%</span>
//                             </div>
//                             <Progress value={matchScore} className="h-2" />
//                           </div>
//                         );
//                       })}
//                     </div>
//                     {evaluationResult.keySkills.length > 0 && (
//                       <div className="flex flex-wrap gap-2 mt-4">
//                         {evaluationResult.keySkills.map((skill, index) => (
//                           <Badge key={index} variant="secondary">
//                             {skill}
//                           </Badge>
//                         ))}
//                       </div>
//                     )}
//                   </div>
                  
//                   {/* Experience & Education */}
//                   <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                     <div>
//                       <h3 className="text-md font-semibold mb-3 flex items-center">
//                         <Briefcase className="h-4 w-4 mr-2 text-indigo-500" />
//                         Work Experience
//                       </h3>
//                       {evaluationResult.resumeData.workExperience.length > 0 ? (
//                         <div className="space-y-3">
//                           {evaluationResult.resumeData.workExperience.slice(0, 3).map((exp, index) => (
//                             <div key={index} className="text-sm">
//                               <div className="font-medium">{exp.title}</div>
//                               <div className="text-muted-foreground">
//                                 {exp.company} {exp.date ? `• ${exp.date}` : ''}
//                               </div>
//                             </div>
//                           ))}
//                         </div>
//                       ) : (
//                         <p className="text-sm text-muted-foreground">No work experience detected</p>
//                       )}
//                     </div>
                    
//                     <div>
//                       <h3 className="text-md font-semibold mb-3 flex items-center">
//                         <GraduationCap className="h-4 w-4 mr-2 text-green-500" />
//                         Education
//                       </h3>
//                       {evaluationResult.resumeData.education.length > 0 ? (
//                         <div className="space-y-3">
//                           {evaluationResult.resumeData.education.slice(0, 3).map((edu, index) => (
//                             <div key={index} className="text-sm">
//                               <div className="font-medium">{edu.degree}</div>
//                               <div className="text-muted-foreground">
//                                 {edu.institution} {edu.date ? `• ${edu.date}` : ''}
//                               </div>
//                             </div>
//                           ))}
//                         </div>
//                       ) : (
//                         <p className="text-sm text-muted-foreground">No education history detected</p>
//                       )}
//                     </div>
//                   </div>
                  
//                   {/* AI Analysis */}
//                   <div className="bg-blue-50 dark:bg-blue-950 p-4 rounded-lg">
//                     <h3 className="text-md font-semibold mb-2 flex items-center text-blue-800 dark:text-blue-300">
//                       <Sparkles className="h-4 w-4 mr-2" />
//                       AI Analysis
//                     </h3>
//                     <div className="text-sm text-blue-700 dark:text-blue-300 whitespace-pre-line">
//                       {evaluationResult.analysis.content}
//                     </div>
//                   </div>
                  
//                   {/* Portfolio Highlights */}
//                   {(githubURL || linkedinURL || portfolioText) && (
//                     <div>
//                       <h3 className="text-md font-semibold mb-3 flex items-center">
//                         <FileCode className="h-4 w-4 mr-2 text-purple-500" />
//                         Portfolio Highlights
//                       </h3>
//                       <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
//                         {githubURL && (
//                           <div className="flex items-center p-2 border rounded-md">
//                             <Github className="h-5 w-5 mr-2 text-muted-foreground" />
//                             <a 
//                               href={githubURL} 
//                               target="_blank" 
//                               rel="noopener noreferrer"
//                               className="text-sm text-blue-600 hover:underline truncate"
//                             >
//                               {githubURL.replace('https://github.com/', '')}
//                             </a>
//                           </div>
//                         )}
                        
//                         {linkedinURL && (
//                           <div className="flex items-center p-2 border rounded-md">
//                             <Linkedin className="h-5 w-5 mr-2 text-muted-foreground" />
//                             <a 
//                               href={linkedinURL} 
//                               target="_blank" 
//                               rel="noopener noreferrer"
//                               className="text-sm text-blue-600 hover:underline truncate"
//                             >
//                               {linkedinURL.replace('https://linkedin.com/in/', '')}
//                             </a>
//                           </div>
//                         )}
//                       </div>
                      
//                       {portfolioText && (
//                         <div className="mt-3 text-sm text-muted-foreground border p-3 rounded-md">
//                           {portfolioText}
//                         </div>
//                       )}
//                     </div>
//                   )}
//                 </div>
//               )}
//             </CardContent>
//           </Card>
//         </div>
//       </div>
//     </AppLayout>
//   );
// };

// export default CandidateEvaluation;
