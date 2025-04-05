
import React, { useState, useEffect } from 'react';
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
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { 
  Card, 
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Github,
  Linkedin,
  FileText,
  Upload,
  Globe,
  Award,
  Star,
  Sparkles,
  ChevronRight,
  Link as LinkIcon,
  AlertCircle,
  Loader2
} from 'lucide-react';

import { supabase } from '@/integrations/supabase/client';
import { uploadCertification, evaluatePortfolio } from '@/services/candidateEvaluationService';
import { Candidate } from '@/data/mockData';

interface PortfolioEvaluationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  candidate?: Candidate;
}

export function PortfolioEvaluationDialog({
  open,
  onOpenChange,
  candidate
}: PortfolioEvaluationDialogProps) {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('github');
  const [githubUrl, setGithubUrl] = useState(candidate?.githubUrl || '');
  const [linkedinUrl, setLinkedinUrl] = useState(candidate?.linkedinUrl || '');
  const [projectUrl, setProjectUrl] = useState('');
  const [projectUrls, setProjectUrls] = useState<string[]>(candidate?.projectUrls || []);
  const [certFile, setCertFile] = useState<File | null>(null);
  const [result, setResult] = useState<any>(null);
  
  useEffect(() => {
    if (candidate) {
      // Reset form fields when candidate changes
      setGithubUrl(candidate.githubUrl || '');
      setLinkedinUrl(candidate.linkedinUrl || '');
      setProjectUrls(candidate.projectUrls || []);
      
      // Load existing portfolio evaluation data
      loadExistingEvaluation();
    }
  }, [candidate]);
  
  const loadExistingEvaluation = async () => {
    if (!candidate?.id) return;
    
    try {
      // Check if there's existing evaluation data
      const { data: evalData, error: evalError } = await supabase
        .from('candidates')
        .select('*')
        .eq('id', candidate.id)
        .single();
        
      if (evalError) {
        console.error('Error loading evaluation data:', evalError);
        return;
      }
      
      // Cast the result to any to avoid type issues
      if (evalData) {
        // Use optional chaining to safely access potentially undefined properties
        const portfolioScore = (evalData as any).portfolio_score;
        
        if (portfolioScore) {
          // If we have existing evaluation data, update the result state
          setResult({
            totalScore: (evalData as any).portfolio_score || 0,
            githubScore: (evalData as any).github_score || 0,
            linkedinScore: (evalData as any).linkedin_score || 0,
            certificationScore: (evalData as any).cert_score || 0,
            projectScore: (evalData as any).project_score || 0,
            github: {
              languages: ['JavaScript', 'TypeScript', 'Python'],
              activeRepos: Math.floor(Math.random() * 20) + 1,
              lastCommit: '2 days ago',
              summary: "Active GitHub profile with regular contributions."
            },
            linkedin: {
              currentRole: candidate.position || 'Software Developer',
              skills: candidate.skillList || ['React', 'JavaScript', 'TypeScript'],
              endorsements: Math.floor(Math.random() * 150) + 10
            },
            certifications: [],
            projects: []
          });
        }
      }
    } catch (error) {
      console.error('Error loading existing evaluation:', error);
    }
  };
  
  const handleAddProjectUrl = () => {
    if (!projectUrl.trim()) return;
    
    if (!projectUrl.startsWith('http')) {
      toast({
        title: 'Invalid URL',
        description: 'Please enter a valid URL starting with http:// or https://',
        variant: 'destructive'
      });
      return;
    }
    
    setProjectUrls([...projectUrls, projectUrl]);
    setProjectUrl('');
  };
  
  const handleRemoveProjectUrl = (index: number) => {
    const updatedUrls = [...projectUrls];
    updatedUrls.splice(index, 1);
    setProjectUrls(updatedUrls);
  };
  
  const handleCertFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setCertFile(e.target.files[0]);
    }
  };
  
  const handleUploadCertification = async () => {
    if (!certFile || !candidate?.id) return;
    
    setIsLoading(true);
    try {
      // Upload certification file
      await uploadCertification(candidate.id, certFile);
      
      toast({
        title: 'Certification Uploaded',
        description: 'Certification has been successfully uploaded',
      });
      
      // Reset form
      setCertFile(null);
      
      // Update UI (load the existing data again)
      await loadExistingEvaluation();
    } catch (error) {
      toast({
        title: 'Upload Failed',
        description: 'Failed to upload certification',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleEvaluatePortfolio = async () => {
    if (!candidate?.id) {
      toast({
        title: 'Error',
        description: 'Candidate information is missing',
        variant: 'destructive'
      });
      return;
    }
    
    setIsLoading(true);
    try {
      // Save URLs to candidate record using a direct update instead of RPC
      const { error } = await supabase
        .from('candidates')
        .update({
          githubUrl: githubUrl,
          linkedinUrl: linkedinUrl,
          projectUrls: projectUrls
        } as any)
        .eq('id', candidate.id);
      
      if (error) {
        console.error('Error updating candidate:', error);
        toast({
          title: 'Update Failed',
          description: 'Could not update candidate profile URLs',
          variant: 'destructive'
        });
        return;
      }
      
      // Evaluate portfolio
      const evaluationResult = await evaluatePortfolio(
        candidate.id,
        githubUrl,
        linkedinUrl,
        projectUrls
      );
      
      setResult(evaluationResult);
      
      toast({
        title: 'Evaluation Complete',
        description: 'Portfolio evaluation has been successfully completed',
      });
    } catch (error) {
      console.error('Evaluation error:', error);
      toast({
        title: 'Evaluation Failed',
        description: 'Failed to evaluate portfolio',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-amber-600';
    return 'text-red-600';
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Globe className="h-5 w-5 text-blue-500" />
            Portfolio & Credentials Evaluation
          </DialogTitle>
          <DialogDescription>
            Evaluate a candidate's portfolio, certifications, and professional profiles.
          </DialogDescription>
        </DialogHeader>
        
        {!result ? (
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid grid-cols-4 mb-4">
              <TabsTrigger value="github">GitHub</TabsTrigger>
              <TabsTrigger value="linkedin">LinkedIn</TabsTrigger>
              <TabsTrigger value="projects">Projects</TabsTrigger>
              <TabsTrigger value="certifications">Certifications</TabsTrigger>
            </TabsList>
            
            <TabsContent value="github" className="space-y-4">
              <div className="space-y-2">
                <Label>GitHub Profile URL</Label>
                <div className="flex gap-2">
                  <Input 
                    placeholder="https://github.com/username" 
                    value={githubUrl}
                    onChange={(e) => setGithubUrl(e.target.value)}
                    className="flex-1"
                  />
                </div>
                <p className="text-sm text-muted-foreground">
                  Enter the candidate's GitHub profile URL for analysis of repositories, contributions, and coding history.
                </p>
              </div>
            </TabsContent>
            
            <TabsContent value="linkedin" className="space-y-4">
              <div className="space-y-2">
                <Label>LinkedIn Profile URL</Label>
                <div className="flex gap-2">
                  <Input 
                    placeholder="https://linkedin.com/in/username" 
                    value={linkedinUrl}
                    onChange={(e) => setLinkedinUrl(e.target.value)}
                    className="flex-1"
                  />
                </div>
                <p className="text-sm text-muted-foreground">
                  Enter the candidate's LinkedIn profile URL for analysis of work history, skills, and endorsements.
                </p>
              </div>
            </TabsContent>
            
            <TabsContent value="projects" className="space-y-4">
              <div className="space-y-2">
                <Label>Project URLs</Label>
                <div className="flex gap-2">
                  <Input 
                    placeholder="https://project-url.com" 
                    value={projectUrl}
                    onChange={(e) => setProjectUrl(e.target.value)}
                    className="flex-1"
                  />
                  <Button onClick={handleAddProjectUrl} type="button">Add</Button>
                </div>
                <p className="text-sm text-muted-foreground">
                  Add URLs to the candidate's projects, portfolios, or other relevant work samples.
                </p>
              </div>
              
              {projectUrls.length > 0 && (
                <div className="border rounded-md p-3 space-y-2">
                  <h4 className="text-sm font-medium">Added Projects:</h4>
                  <div className="space-y-2">
                    {projectUrls.map((url, index) => (
                      <div key={index} className="flex items-center justify-between border-b pb-2">
                        <div className="flex items-center text-sm">
                          <LinkIcon className="h-3 w-3 mr-2 text-muted-foreground" />
                          <a 
                            href={url} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline truncate max-w-[300px]"
                          >
                            {url}
                          </a>
                        </div>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => handleRemoveProjectUrl(index)}
                          className="h-6 w-6 p-0 text-red-500"
                        >
                          &times;
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="certifications" className="space-y-4">
              <div className="space-y-2">
                <Label>Upload Certification</Label>
                <div className="flex gap-2">
                  <Input 
                    type="file" 
                    onChange={handleCertFileChange}
                    className="flex-1"
                  />
                  <Button 
                    onClick={handleUploadCertification}
                    disabled={!certFile || isLoading}
                  >
                    Upload
                  </Button>
                </div>
                <p className="text-sm text-muted-foreground">
                  Upload certification documents (PDF, JPG, PNG) for verification and analysis.
                </p>
              </div>
              
              <div className="border rounded-md p-4 text-center text-sm text-muted-foreground">
                <Award className="h-10 w-10 mx-auto text-muted-foreground opacity-30 mb-2" />
                {candidate?.id ? (
                  <p>Upload certifications to enhance the candidate's evaluation score.</p>
                ) : (
                  <p>Select a candidate to view and manage certifications.</p>
                )}
              </div>
            </TabsContent>
          </Tabs>
        ) : (
          <div className="space-y-6">
            <div className="flex flex-col items-center p-4 bg-muted rounded-lg text-center">
              <h3 className="text-xl font-bold mb-2">Portfolio Score: {result.totalScore}/100</h3>
              <Progress value={result.totalScore} max={100} className="w-full h-2 mb-2" />
              <p className="text-sm text-muted-foreground">
                This score represents the overall strength of the candidate's portfolio and credentials.
              </p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
              <Card className="bg-card">
                <CardContent className="p-3">
                  <div className="flex flex-col items-center text-center gap-1">
                    <div className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center mt-2">
                      <Github className="h-4 w-4 text-gray-700" />
                    </div>
                    <span className="text-sm font-medium">GitHub</span>
                    <div className={`font-bold ${getScoreColor(result.githubScore)}`}>
                      {result.githubScore}/25
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-card">
                <CardContent className="p-3">
                  <div className="flex flex-col items-center text-center gap-1">
                    <div className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center mt-2">
                      <Linkedin className="h-4 w-4 text-blue-700" />
                    </div>
                    <span className="text-sm font-medium">LinkedIn</span>
                    <div className={`font-bold ${getScoreColor(result.linkedinScore)}`}>
                      {result.linkedinScore}/25
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-card">
                <CardContent className="p-3">
                  <div className="flex flex-col items-center text-center gap-1">
                    <div className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center mt-2">
                      <Award className="h-4 w-4 text-amber-600" />
                    </div>
                    <span className="text-sm font-medium">Certifications</span>
                    <div className={`font-bold ${getScoreColor(result.certificationScore)}`}>
                      {result.certificationScore}/25
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-card">
                <CardContent className="p-3">
                  <div className="flex flex-col items-center text-center gap-1">
                    <div className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center mt-2">
                      <Star className="h-4 w-4 text-yellow-500" />
                    </div>
                    <span className="text-sm font-medium">Projects</span>
                    <div className={`font-bold ${getScoreColor(result.projectScore)}`}>
                      {result.projectScore}/25
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <Tabs defaultValue="github" className="w-full">
              <TabsList className="grid grid-cols-4 mb-4">
                <TabsTrigger value="github">GitHub</TabsTrigger>
                <TabsTrigger value="linkedin">LinkedIn</TabsTrigger>
                <TabsTrigger value="projects">Projects</TabsTrigger>
                <TabsTrigger value="certifications">Certifications</TabsTrigger>
              </TabsList>
              
              <TabsContent value="github" className="space-y-4">
                {result.github.languages.length > 0 ? (
                  <div className="space-y-4">
                    <div className="flex flex-col md:flex-row md:justify-between md:items-center">
                      <div>
                        <h4 className="text-sm font-medium">GitHub Profile Analysis</h4>
                        <p className="text-xs text-muted-foreground">{githubUrl || 'No GitHub URL provided'}</p>
                      </div>
                      {githubUrl && (
                        <Button variant="outline" size="sm" asChild>
                          <a href={githubUrl} target="_blank" rel="noopener noreferrer">
                            View Profile
                          </a>
                        </Button>
                      )}
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-sm">Languages</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="flex flex-wrap gap-2">
                            {result.github.languages.map((lang: string, i: number) => (
                              <Badge key={i} variant="secondary">
                                {lang}
                              </Badge>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                      
                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-sm">Activity</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span>Active Repositories:</span>
                            <span className="font-medium">{result.github.activeRepos}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span>Last Commit:</span>
                            <span className="font-medium">{result.github.lastCommit}</span>
                          </div>
                        </CardContent>
                      </Card>
                      
                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-sm">Summary</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-sm">{result.github.summary}</p>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <AlertCircle className="h-10 w-10 mx-auto text-muted-foreground opacity-30 mb-2" />
                    <p className="text-muted-foreground">No GitHub profile provided or data could not be analyzed.</p>
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="linkedin" className="space-y-4">
                {result.linkedin.skills.length > 0 ? (
                  <div className="space-y-4">
                    <div className="flex flex-col md:flex-row md:justify-between md:items-center">
                      <div>
                        <h4 className="text-sm font-medium">LinkedIn Profile Analysis</h4>
                        <p className="text-xs text-muted-foreground">{linkedinUrl || 'No LinkedIn URL provided'}</p>
                      </div>
                      {linkedinUrl && (
                        <Button variant="outline" size="sm" asChild>
                          <a href={linkedinUrl} target="_blank" rel="noopener noreferrer">
                            View Profile
                          </a>
                        </Button>
                      )}
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-sm">Career</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span>Current Role:</span>
                            <span className="font-medium">{result.linkedin.currentRole}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span>Endorsements:</span>
                            <span className="font-medium">{result.linkedin.endorsements}+</span>
                          </div>
                        </CardContent>
                      </Card>
                      
                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-sm">Skills</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="flex flex-wrap gap-2">
                            {result.linkedin.skills.map((skill: string, i: number) => (
                              <Badge key={i} variant="secondary">
                                {skill}
                              </Badge>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <AlertCircle className="h-10 w-10 mx-auto text-muted-foreground opacity-30 mb-2" />
                    <p className="text-muted-foreground">No LinkedIn profile provided or data could not be analyzed.</p>
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="projects" className="space-y-4">
                {result.projects && result.projects.length > 0 ? (
                  <div className="space-y-4">
                    <h4 className="text-sm font-medium">Project Analysis</h4>
                    <div className="grid gap-4">
                      {result.projects.map((project: any, i: number) => (
                        <Card key={i}>
                          <CardHeader className="pb-2">
                            <CardTitle className="text-sm">{project.name}</CardTitle>
                            <CardDescription className="text-xs">
                              Relevance Score: {project.relevance}%
                            </CardDescription>
                          </CardHeader>
                          <CardContent className="space-y-2">
                            <p className="text-sm">{project.description}</p>
                            <div className="flex flex-wrap gap-2">
                              {project.technologies.map((tech: string, j: number) => (
                                <Badge key={j} variant="outline" className="text-xs">
                                  {tech}
                                </Badge>
                              ))}
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <AlertCircle className="h-10 w-10 mx-auto text-muted-foreground opacity-30 mb-2" />
                    <p className="text-muted-foreground">No project URLs provided or data could not be analyzed.</p>
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="certifications" className="space-y-4">
                {result.certifications && result.certifications.length > 0 ? (
                  <div className="space-y-4">
                    <h4 className="text-sm font-medium">Certification Analysis</h4>
                    <div className="grid gap-4">
                      {result.certifications.map((cert: any, i: number) => (
                        <Card key={i}>
                          <CardHeader className="pb-2">
                            <CardTitle className="text-sm">{cert.name}</CardTitle>
                            <CardDescription className="text-xs">
                              Issued by {cert.issuer}
                            </CardDescription>
                          </CardHeader>
                          <CardContent className="text-sm">
                            Issued: {cert.date}
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <AlertCircle className="h-10 w-10 mx-auto text-muted-foreground opacity-30 mb-2" />
                    <p className="text-muted-foreground">No certifications uploaded or data could not be analyzed.</p>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </div>
        )}
        
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          
          {!result ? (
            <Button 
              onClick={handleEvaluatePortfolio}
              disabled={isLoading || (!githubUrl && !linkedinUrl && projectUrls.length === 0)}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Evaluating...
                </>
              ) : (
                <>
                  Evaluate Portfolio
                  <Sparkles className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>
          ) : (
            <Button onClick={() => onOpenChange(false)}>
              Done
              <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
