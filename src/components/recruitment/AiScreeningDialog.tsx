
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
import { Sparkles, ChevronRight, FileText, Upload, DownloadCloud } from 'lucide-react';

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
    try {
      // In a real implementation, this would use Eden AI's OCR to extract text
      // For now, we'll just simulate the upload
      
      // const resumeUrl = await uploadResume(resumeFile);
      
      // Simulate processing delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Mock extracted text based on file type
      let extractedText = "";
      if (resumeFile.name.endsWith('.pdf')) {
        extractedText = `${candidate?.name || 'Candidate'} - Resume (extracted from PDF)\n\nSkills: React, JavaScript, TypeScript, Node.js, Express\nExperience: 4 years at TechCorp as Senior Developer, 2 years at WebSolutions as Junior Developer\nEducation: MS in Computer Science, Stanford University`;
      } else {
        extractedText = `${candidate?.name || 'Candidate'} - Resume (extracted from DOC)\n\nSkills: React, JavaScript, HTML, CSS, UI/UX Design, Figma, User Testing\nExperience: 3 years at DesignFirm as UI/UX Designer, 2 years at WebAgency as Frontend Developer\nEducation: BS in Computer Science, MIT`;
      }
      
      setResumeText(extractedText);
      
      toast({
        title: "Resume Processed",
        description: "Resume text has been extracted successfully",
      });
      
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to process resume",
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
                      {isUploading ? 'Processing...' : 'Process'}
                      {!isUploading && <Upload className="ml-2 h-4 w-4" />}
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">Supported formats: PDF, DOC, DOCX</p>
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
              {isLoading ? 'Analyzing...' : 'Screen Candidate'}
              {!isLoading && <Sparkles className="ml-2 h-4 w-4" />}
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
