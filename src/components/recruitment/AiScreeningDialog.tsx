
// "use client";
// import React, { useState } from "react";
// import { useToast } from "@/hooks/use-toast";
// import {
//   Dialog,
//   DialogContent,
//   DialogDescription,
//   DialogFooter,
//   DialogHeader,
//   DialogTitle,
// } from "@/components/ui/dialog";
// import { Button } from "@/components/ui/button";
// import { Textarea } from "@/components/ui/textarea";
// import { Progress } from "@/components/ui/progress";
// import { Badge } from "@/components/ui/badge";
// import { Label } from "@/components/ui/label";
// import { Input } from "@/components/ui/input";
// import {
//   CandidateScreeningResult,
//   analyzeResume,
//   saveScreeningResult,
// } from "@/services/aiRecruitmentService";
// import { Candidate } from "@/data/mockData";
// import {
//   Sparkles,
//   ChevronRight,
//   FileText,
//   Upload,
//   DownloadCloud,
// } from "lucide-react";

// // ✅ Import EdenAI integration
// import { parseResumeWithEdenAI } from "@/services/edenResumeParser";

// interface AiScreeningDialogProps {
//   open: boolean;
//   onOpenChange: (open: boolean) => void;
//   candidate?: Candidate;
//   jobDescription?: string;
// }

// export function AiScreeningDialog({
//   open,
//   onOpenChange,
//   candidate,
//   jobDescription = "We are seeking a skilled professional with experience in modern web development technologies including React, TypeScript, and responsive design principles. The ideal candidate will have 3+ years of experience in front-end development and be comfortable working in an agile environment.",
// }: AiScreeningDialogProps) {
//   const { toast } = useToast();
//   const [isLoading, setIsLoading] = useState(false);
//   const [resumeText, setResumeText] = useState(
//     candidate
//       ? `${candidate.name} - Resume\n\nSkills: React, JavaScript, HTML, CSS, UI/UX Design\nExperience: 3 years at TechCorp, 2 years at WebSolutions\nEducation: BS in Computer Science`
//       : ""
//   );
//   const [customJobDescription, setCustomJobDescription] =
//     useState(jobDescription);
//   const [result, setResult] = useState<CandidateScreeningResult | null>(null);
//   const [resumeFile, setResumeFile] = useState<File | null>(null);
//   const [isUploading, setIsUploading] = useState(false);
//   const [resumeDetails, setResumeDetails] = useState<any>(null); // Add this line


//   const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     if (e.target.files && e.target.files[0]) {
//       setResumeFile(e.target.files[0]);
//       toast({
//         title: "Resume Selected",
//         description: `File: ${e.target.files[0].name}`,
//       });
//     }
//   };

//   // // ✅ Integrated with EdenAI OCR
//   // const handleUploadResume = async () => {
//   //   if (!resumeFile) {
//   //     toast({
//   //       title: "Error",
//   //       description: "Please select a file to upload",
//   //       variant: "destructive",
//   //     });
//   //     return;
//   //   }
  
//   //   setIsUploading(true);
//   //   try {
//   //     const parsedResult = await parseResumeWithEdenAI(resumeFile);
//   //     console.log("✅ Parsed Result from EdenAI:", parsedResult);
  
//   //     // Extract text based on EdenAI's response structure
//   //     let fullText = "";
      
//   //     // Check the standard Affinda response structure
//   //     if (parsedResult?.affinda?.extracted_data?.resume_text) {
//   //       fullText = parsedResult.affinda.extracted_data.resume_text;
//   //     } 
//   //     // Fallback to other possible structures
//   //     else if (parsedResult?.affinda?.extracted_data?.raw_text) {
//   //       fullText = parsedResult.affinda.extracted_data.raw_text;
//   //     }
//   //     else if (parsedResult?.text) {
//   //       fullText = parsedResult.text;
//   //     }
//   //     else {
//   //       fullText = "No text could be extracted from the resume.";
//   //       console.warn("Unexpected response structure:", parsedResult);
//   //     }
  
//   //     setResumeText(fullText);
//   //     setResumeDetails(parsedResult);
  
//   //     toast({
//   //       title: "Resume Parsed",
//   //       description: "Resume text has been extracted using Eden AI.",
//   //     });
//   //   } catch (error) {
//   //     console.error("❌ Error parsing resume:", error);
//   //     toast({
//   //       title: "Error",
//   //       description: "Failed to parse resume with Eden AI.",
//   //       variant: "destructive",
//   //     });
//   //   } finally {
//   //     setIsUploading(false);
//   //   }
//   // };


//   // gemini powred
//   // const handleUploadResume = async () => {
//   //   if (!resumeFile) {
//   //     toast({
//   //       title: "Error",
//   //       description: "Please select a file to upload",
//   //       variant: "destructive",
//   //     });
//   //     return;
//   //   }
  
//   //   setIsUploading(true);
  
//   //   try {
//   //     // Convert file to base64 or plain text
//   //     const fileText = await resumeFile.text(); // works for txt/pdf if parsed
//   //     console.log("📄 File text extracted for Gemini:", fileText.slice(0, 300));
  
//   //     // Craft your LLM prompt
//   //     const prompt = `
//   //       You are an AI resume parser. Extract structured information from the resume below.
//   //       Return key details like name, email, phone, skills, work experience, education, and a summary.
  
//   //       Resume:
//   //       ${fileText}
//   //     `;
  
//   //     // Call Gemini API
//   //     const geminiResponse = await fetch("https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=AIzaSyBCstuceBv_TMCB3Xhf9M7GL-brZCyDaNE", {
//   //       method: "POST",
//   //       headers: {
//   //         "Content-Type": "application/json"
//   //       },
//   //       body: JSON.stringify({
//   //         contents: [{ parts: [{ text: prompt }] }]
//   //       })
//   //     });
  
//   //     if (!geminiResponse.ok) {
//   //       throw new Error("Gemini LLM failed to respond.");
//   //     }
  
//   //     const responseData = await geminiResponse.json();
//   //     const fullText = responseData.candidates?.[0]?.content?.parts?.[0]?.text || "No content extracted.";
  
//   //     setResumeText(fullText);
//   //     setResumeDetails(responseData); // Optionally store full Gemini response
  
//   //     toast({
//   //       title: "Resume Parsed",
//   //       description: "Resume text has been extracted using Gemini LLM.",
//   //     });
  
//   //   } catch (error) {
//   //     console.error("❌ Error parsing resume with Gemini:", error);
//   //     toast({
//   //       title: "Error",
//   //       description: "Failed to parse resume with Gemini LLM.",
//   //       variant: "destructive",
//   //     });
//   //   } finally {
//   //     setIsUploading(false);
//   //   }
//   // };


//   const handleUploadResume = async () => {
//     if (!resumeFile) {
//       toast({
//         title: "Error",
//         description: "Please select a file to upload",
//         variant: "destructive",
//       });
//       return;
//     }
  
//     setIsUploading(true);
  
//     try {
//       // Parse with Eden AI
//       const form = new FormData();
//       form.append("providers", "extracta");
//       form.append("file", resumeFile);
//       form.append(
//         "queries",
//         JSON.stringify([
//           { query: "Extract the full name", pages: "1-*" },
//           { query: "What is the email address?", pages: "1-*" },
//           { query: "What is the phone number?", pages: "1-*" },
//           { query: "List all technical skills mentioned", pages: "1-*" },
//           { 
//             query: "Extract work experience in JSON format: [{company, role, duration, description}]", 
//             pages: "1-*" 
//           },
//           { 
//             query: "Extract education in JSON format: [{degree, institution, year}]", 
//             pages: "1-*" 
//           },
//           { query: "Extract a professional summary", pages: "1-*" }
//         ])
//       );
  
//       const response = await fetch("https://api.edenai.run/v2/ocr/custom_document_parsing_async", {
//         method: "POST",
//         headers: {
//           Authorization: "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiOGE1YmQwOTYtZTQ2OC00ZjEwLTk2Y2MtOWU2ZjUwMjIxZjY3IiwidHlwZSI6ImFwaV90b2tlbiJ9.QL-Qjs13w0VxiLng4b_9AS8uD16n1u7fM3vT31pX7F0",
//         },
//         body: form,
//       });
  
//       if (!response.ok) {
//         throw new Error(await response.text());
//       }
  
//       const data = await response.json();
      
//       // Process Eden AI response
//       const parsedResume = {
//         "Full Name": data.extracta?.answers[0]?.answer || "Not found",
//         "Email": data.extracta?.answers[1]?.answer || "Not found",
//         "Phone": data.extracta?.answers[2]?.answer || "Not found",
//         "Skills": data.extracta?.answers[3]?.answer 
//           ? data.extracta.answers[3].answer.split(',').map(skill => skill.trim()) 
//           : [],
//         "Experience": tryParseJson(data.extracta?.answers[4]?.answer) || [],
//         "Education": tryParseJson(data.extracta?.answers[5]?.answer) || [],
//         "Summary": data.extracta?.answers[6]?.answer || ""
//       };
  
//       setResumeDetails(parsedResume);
//       toast({
//         title: "Resume Parsed",
//         description: "Resume successfully analyzed with Eden AI",
//       });
  
//     } catch (error) {
//       console.error("Error parsing resume:", error);
//       toast({
//         title: "Error",
//         description: (error as Error).message,
//         variant: "destructive",
//       });
//     } finally {
//       setIsUploading(false);
//     }
//   };
//   function tryParseJson(jsonString: string) {
//     try {
//       return jsonString ? JSON.parse(jsonString) : null;
//     } catch (e) {
//       console.warn("Failed to parse JSON:", jsonString);
//       return null;
//     }
//   }
  


 

//   const getRankColor = (rank: string) => {
//     switch (rank) {
//       case "A":
//         return "bg-green-100 text-green-800";
//       case "B":
//         return "bg-blue-100 text-blue-800";
//       case "C":
//         return "bg-orange-100 text-orange-800";
//       default:
//         return "bg-gray-100 text-gray-800";
//     }
//   };

//   return (
//     <Dialog open={open} onOpenChange={onOpenChange}>
//       <DialogContent className="sm:max-w-[625px]">
//         <DialogHeader>
//           <DialogTitle className="flex items-center gap-2">
//             <Sparkles className="h-5 w-5 text-blue-500" />
//             AI Resume Screening
//           </DialogTitle>
//           <DialogDescription>
//             Use AI to analyze resumes, match skills to job requirements, and
//             rank candidates.
//           </DialogDescription>
//         </DialogHeader>

//         <div className="grid gap-4 py-4">
//           {!result ? (
//             <>
//               <div className="space-y-4">
//                 <div>
//                   <Label className="block text-sm font-medium mb-2">
//                     Upload Resume (PDF/DOC)
//                   </Label>
//                   <div className="flex gap-2">
//                     <Input
//                       type="file"
//                       accept=".pdf,.doc,.docx"
//                       onChange={handleFileChange}
//                       className="flex-1"
//                     />
//                     <Button
//                       variant="outline"
//                       onClick={handleUploadResume}
//                       disabled={!resumeFile || isUploading}
//                     >
//                       {isUploading ? "Processing..." : "Process"}
//                       {!isUploading && <Upload className="ml-2 h-4 w-4" />}
//                     </Button>
//                   </div>
//                   <p className="text-xs text-muted-foreground mt-1">
//                     Supported formats: PDF, DOC, DOCX
//                   </p>
//                 </div>

//                 <div>
//                   <Label className="block text-sm font-medium mb-2">
//                     Resume Text
//                   </Label>
//                   <Textarea
//                     placeholder="Paste resume content here or upload a file above..."
//                     className="h-64 font-mono text-sm"
//                     value={resumeText}
//                     onChange={(e) => setResumeText(e.target.value)}
//                   />
//                 </div>

//                 <div>
//                   <Label className="block text-sm font-medium mb-2">
//                     Job Description
//                   </Label>
//                   <Textarea
//                     placeholder="Enter job requirements..."
//                     className="h-32"
//                     value={customJobDescription}
//                     onChange={(e) => setCustomJobDescription(e.target.value)}
//                   />
//                 </div>
//               </div>
//             </>
//           ) : (
//             <div className="space-y-6">
//               <div className="flex items-center gap-4 mb-4">
//                 <div className="flex-1">
//                   <div className="flex justify-between mb-1">
//                     <span className="text-sm font-medium">Match Score</span>
//                     <span className="text-sm font-bold">
//                       {result.matchPercentage}%
//                     </span>
//                   </div>
//                   <Progress
//                     value={result.matchPercentage}
//                     className="h-2"
//                   />
//                 </div>

//                 <Badge className={`text-lg px-3 py-1 ${getRankColor(result.rank)}`}>
//                   Rank: {result.rank}
//                 </Badge>
//               </div>

//               <div>
//                 <h4 className="font-medium mb-2">Key Matching Skills</h4>
//                 <div className="flex flex-wrap gap-2">
//                   {result.keySkills.map((skill, i) => (
//                     <Badge
//                       key={i}
//                       variant="secondary"
//                       className="bg-green-100 text-green-800 hover:bg-green-200"
//                     >
//                       {skill}
//                     </Badge>
//                   ))}
//                 </div>
//               </div>

//               {result.missingSkills.length > 0 && (
//                 <div>
//                   <h4 className="font-medium mb-2">Skills Gap</h4>
//                   <div className="flex flex-wrap gap-2">
//                     {result.missingSkills.map((skill, i) => (
//                       <Badge
//                         key={i}
//                         variant="outline"
//                         className="bg-red-50 text-red-700 border-red-200 hover:bg-red-100"
//                       >
//                         {skill}
//                       </Badge>
//                     ))}
//                   </div>
//                 </div>
//               )}

//               <div className="rounded-md bg-blue-50 p-4">
//                 <h4 className="font-medium text-blue-800 mb-1">
//                   AI Recommendation
//                 </h4>
//                 <p className="text-blue-700 text-sm">{result.recommendation}</p>
//               </div>

//               <div className="bg-gray-50 rounded-md p-4">
//                 <h4 className="font-medium mb-2">Resume Preview</h4>
//                 <div className="max-h-40 overflow-y-auto bg-white p-3 rounded border text-xs font-mono">
//                   {resumeText.split("\n").map((line, i) => (
//                     <div key={i} className={i === 0 ? "font-bold" : ""}>
//                       {line}
//                     </div>
//                   ))}
//                 </div>
//                 <Button variant="outline" size="sm" className="mt-2">
//                   <DownloadCloud className="h-4 w-4 mr-1" />
//                   Download Resume
//                 </Button>
//               </div>
//             </div>
//           )}
//         </div>

//         <DialogFooter>
//           <Button variant="outline" onClick={() => onOpenChange(false)}>
//             Cancel
//           </Button>

//           {!result ? (
//             <Button
//               disabled={isLoading || !resumeText.trim()}
//               // onClick={handleScreenCandidate}
//             >
//               {isLoading ? "Analyzing..." : "Screen Candidate"}
//               {!isLoading && <Sparkles className="ml-2 h-4 w-4" />}
//             </Button>
//           ) : (
//             <div className="flex gap-2">
//               <Button variant="outline" onClick={() => setResult(null)}>
//                 <FileText className="mr-2 h-4 w-4" />
//                 Edit Resume
//               </Button>
//               <Button onClick={() => onOpenChange(false)}>
//                 Done
//                 <ChevronRight className="ml-2 h-4 w-4" />
//               </Button>
//             </div>
//           )}
//         </DialogFooter>
//       </DialogContent>
//     </Dialog>
//   );
// }
import React, { useState } from 'react';
import { useToast } from "@/hooks/use-toast";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { CandidateScreeningResult, analyzeResume, saveScreeningResult, uploadResume } from '@/services/aiRecruitmentService';
import { Candidate } from '@/data/mockData';
import { Sparkles, ChevronRight, FileText, Upload, DownloadCloud, Loader2 } from 'lucide-react';
import axios from 'axios';

interface AiScreeningDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  candidate?: Candidate;
  jobDescription?: string;
}

export function AiScreeningDialog({ 
  open, 
  onOpenChange,
  candidate,
  jobDescription = "We are seeking a skilled professional with experience in modern web development technologies including React, TypeScript, and responsive design principles. The ideal candidate will have 3+ years of experience in front-end development and be comfortable working in an agile environment."
}: AiScreeningDialogProps) {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [resumeText, setResumeText] = useState(
    candidate ? `${candidate.name} - Resume\n\nSkills: React, JavaScript, HTML, CSS, UI/UX Design\nExperience: 3 years at TechCorp, 2 years at WebSolutions\nEducation: BS in Computer Science` : ''
  );
  const [customJobDescription, setCustomJobDescription] = useState(jobDescription);
  const [result, setResult] = useState<CandidateScreeningResult | null>(null);
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [parseProgress, setParseProgress] = useState(0);
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setResumeFile(e.target.files[0]);
      
      // Preview the file name
      toast({
        title: "Resume Selected",
        description: `File: ${e.target.files[0].name}`,
      });
    }
  };
  
  const handleUploadResume = async () => {
    if (!resumeFile) {
      toast({
        title: "Error",
        description: "Please select a file to upload",
        variant: "destructive"
      });
      return;
    }
    
    setIsUploading(true);
    setParseProgress(10);
    
    try {
      // Create form data for the API request
      const formData = new FormData();
      formData.append("providers", "affinda");
      formData.append("file", resumeFile);
      
      setParseProgress(30);
      
      // Make the API request to EdenAI
      const response = await axios({
        method: "POST",
        url: "https://api.edenai.run/v2/ocr/resume_parser",
        headers: {
          Authorization: "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiOGE1YmQwOTYtZTQ2OC00ZjEwLTk2Y2MtOWU2ZjUwMjIxZjY3IiwidHlwZSI6ImFwaV90b2tlbiJ9.QL-Qjs13w0VxiLng4b_9AS8uD16n1u7fM3vT31pX7F0",
          "Content-Type": "multipart/form-data",
        },
        data: formData,
      });
      
      setParseProgress(70);
      
      // Process the response data
      const resumeData = response.data.affinda;
      
      if (resumeData && resumeData.extracted_data) {
        const data = resumeData.extracted_data;
        
        // Format the extracted data into a readable resume text
        let extractedText = `${data.personal_infos?.name?.raw || candidate?.name || 'Candidate'} - Resume\n\n`;
        
        // Add skills
        if (data.skills && data.skills.length > 0) {
          extractedText += "Skills: " + data.skills.map((skill: any) => skill.name).join(", ") + "\n";
        }
        
        // Add work experience
        if (data.work_experience && data.work_experience.length > 0) {
          extractedText += "Experience: " + data.work_experience.map((exp: any) => {
            return `${exp.duration || ''} at ${exp.company || ''} as ${exp.title || ''}`;
          }).join(", ") + "\n";
        }
        
        // Add education
        if (data.education && data.education.length > 0) {
          extractedText += "Education: " + data.education.map((edu: any) => {
            return `${edu.degree || ''} in ${edu.field_of_study || ''}, ${edu.school || ''}`;
          }).join(", ") + "\n";
        }
        
        // Add contact information if available
        if (data.personal_infos?.email) {
          extractedText += `Email: ${data.personal_infos.email.raw}\n`;
        }
        if (data.personal_infos?.phone) {
          extractedText += `Phone: ${data.personal_infos.phone.raw}\n`;
        }
        
        setResumeText(extractedText);
        
        toast({
          title: "Resume Processed",
          description: "Resume text has been extracted successfully",
        });
      } else {
        throw new Error("Failed to extract resume data");
      }
      
      setParseProgress(100);
      
    } catch (error) {
      console.error("Resume parsing error:", error);
      toast({
        title: "Error",
        description: "Failed to process resume. Please try again or enter text manually.",
        variant: "destructive"
      });
    } finally {
      setIsUploading(false);
    }
  };
  
  const handleScreenCandidate = async () => {
    if (!resumeText.trim()) {
      toast({
        title: "Error",
        description: "Please enter resume text or upload a resume file",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    try {
      const screeningResult = await analyzeResume(resumeText, customJobDescription);
      setResult(screeningResult);
      
      // If a candidate is selected, save the results
      if (candidate && candidate.id) {
        await saveScreeningResult(candidate.id, screeningResult);
      }
      
      toast({
        title: "Analysis Complete",
        description: "AI has successfully analyzed the resume",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to analyze resume",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getRankColor = (rank: string) => {
    switch (rank) {
      case 'A': return 'bg-green-100 text-green-800';
      case 'B': return 'bg-blue-100 text-blue-800';
      case 'C': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[625px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-blue-500" />
            AI Resume Screening
          </DialogTitle>
          <DialogDescription>
            Use AI to analyze resumes, match skills to job requirements, and rank candidates.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          {!result ? (
            <>
              <div className="space-y-4">
                <div>
                  <Label className="block text-sm font-medium mb-2">Upload Resume (PDF/DOC)</Label>
                  <div className="flex gap-2">
                    <Input 
                      type="file" 
                      accept=".pdf,.doc,.docx" 
                      onChange={handleFileChange}
                      className="flex-1"
                    />
                    <Button 
                      variant="outline" 
                      onClick={handleUploadResume}
                      disabled={!resumeFile || isUploading}
                    >
                      {isUploading ? (
                        <div className="flex items-center">
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Processing...
                        </div>
                      ) : (
                        <div className="flex items-center">
                          <Upload className="mr-2 h-4 w-4" />
                          Process
                        </div>
                      )}
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">Supported formats: PDF, DOC, DOCX</p>
                  
                  {isUploading && (
                    <div className="mt-2">
                      <div className="flex justify-between text-xs text-muted-foreground mb-1">
                        <span>Parsing document...</span>
                        <span>{parseProgress}%</span>
                      </div>
                      <Progress value={parseProgress} className="h-1" />
                    </div>
                  )}
                </div>

                <div>
                  <Label className="block text-sm font-medium mb-2">Resume Text</Label>
                  <Textarea 
                    placeholder="Paste resume content here or upload a file above..." 
                    className="h-64 font-mono text-sm"
                    value={resumeText}
                    onChange={(e) => setResumeText(e.target.value)}
                  />
                </div>
                
                <div>
                  <Label className="block text-sm font-medium mb-2">Job Description</Label>
                  <Textarea
                    placeholder="Enter job requirements..."
                    className="h-32"
                    value={customJobDescription}
                    onChange={(e) => setCustomJobDescription(e.target.value)}
                  />
                </div>
              </div>
            </>
          ) : (
            <div className="space-y-6">
              <div className="flex items-center gap-4 mb-4">
                <div className="flex-1">
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium">Match Score</span>
                    <span className="text-sm font-bold">{result.matchPercentage}%</span>
                  </div>
                  <Progress 
                    value={result.matchPercentage} 
                    className={`h-2 ${
                      result.matchPercentage >= 85 ? 'bg-green-500' : 
                      result.matchPercentage >= 70 ? 'bg-blue-500' : 
                      result.matchPercentage >= 50 ? 'bg-yellow-500' : 'bg-orange-500'
                    }`}
                  />
                </div>
                
                <Badge className={`text-lg px-3 py-1 ${getRankColor(result.rank)}`}>
                  Rank: {result.rank}
                </Badge>
              </div>
              
              <div>
                <h4 className="font-medium mb-2">Key Matching Skills</h4>
                <div className="flex flex-wrap gap-2">
                  {result.keySkills.map((skill, i) => (
                    <Badge key={i} variant="secondary" className="bg-green-100 text-green-800 hover:bg-green-200">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>
              
              {result.missingSkills.length > 0 && (
                <div>
                  <h4 className="font-medium mb-2">Skills Gap</h4>
                  <div className="flex flex-wrap gap-2">
                    {result.missingSkills.map((skill, i) => (
                      <Badge key={i} variant="outline" className="bg-red-50 text-red-700 border-red-200 hover:bg-red-100">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
              
              <div className="rounded-md bg-blue-50 p-4">
                <h4 className="font-medium text-blue-800 mb-1">AI Recommendation</h4>
                <p className="text-blue-700 text-sm">{result.recommendation}</p>
              </div>
              
              <div className="bg-gray-50 rounded-md p-4">
                <h4 className="font-medium mb-2">Resume Preview</h4>
                <div className="max-h-40 overflow-y-auto bg-white p-3 rounded border text-xs font-mono">
                  {resumeText.split('\n').map((line, i) => (
                    <div key={i} className={i === 0 ? "font-bold" : ""}>{line}</div>
                  ))}
                </div>
                <Button variant="outline" size="sm" className="mt-2">
                  <DownloadCloud className="h-4 w-4 mr-1" />
                  Download Resume
                </Button>
              </div>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          
          {!result ? (
            <Button 
              disabled={isLoading || !resumeText.trim()} 
              onClick={handleScreenCandidate}
            >
              {isLoading ? (
                <div className="flex items-center">
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Analyzing...
                </div>
              ) : (
                <div className="flex items-center">
                  <Sparkles className="mr-2 h-4 w-4" />
                  Screen Candidate
                </div>
              )}
            </Button>
          ) : (
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setResult(null)}>
                <FileText className="mr-2 h-4 w-4" />
                Edit Resume
              </Button>
              <Button onClick={() => onOpenChange(false)}>
                Done
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}