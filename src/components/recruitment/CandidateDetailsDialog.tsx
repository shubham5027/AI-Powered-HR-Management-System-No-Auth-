import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent } from "@/components/ui/card";
import { 
  User, 
  Mail, 
  Phone, 
  Calendar, 
  Briefcase, 
  FileText, 
  Award, 
  ThumbsUp, 
  MessageSquare,
  Github,
  Linkedin,
  Globe,
  Star 
} from "lucide-react";
import { Candidate } from '@/data/mockData';
import { CandidateInterviewReport } from './CandidateInterviewReport';
import { PortfolioEvaluationDialog } from './PortfolioEvaluationDialog';

interface CandidateDetailsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  candidate: Candidate;
  onScreenClick: () => void;
  onInterviewClick: () => void;
  onOfferClick: () => void;
}

export function CandidateDetailsDialog({
  open,
  onOpenChange,
  candidate,
  onScreenClick,
  onInterviewClick,
  onOfferClick
}: CandidateDetailsDialogProps) {
  const [activeTab, setActiveTab] = useState('profile');
  const [portfolioDialogOpen, setPortfolioDialogOpen] = useState(false);
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new': return 'bg-blue-100 text-blue-800';
      case 'screening': return 'bg-purple-100 text-purple-800';
      case 'interview': return 'bg-amber-100 text-amber-800';
      case 'offered': return 'bg-green-100 text-green-800';
      case 'hired': return 'bg-teal-100 text-teal-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };
  
  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-amber-600';
    return 'text-red-600';
  };
  
  const handlePortfolioEvaluation = () => {
    setPortfolioDialogOpen(true);
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Candidate Details</DialogTitle>
          <DialogDescription>
            View and manage candidate information
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex items-center space-x-4 py-2">
          <Avatar className="h-16 w-16">
            <AvatarImage 
              src={candidate.avatar || "https://github.com/shadcn.png"} 
              alt={candidate.name} 
            />
            <AvatarFallback>
              {candidate.name.split(' ').map(n => n[0]).join('')}
            </AvatarFallback>
          </Avatar>
          <div>
            <h3 className="text-lg font-medium">{candidate.name}</h3>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Briefcase className="h-4 w-4" />
              <span>{candidate.position}</span>
            </div>
            <Badge className={`mt-1 ${getStatusColor(candidate.status)}`}>
              {candidate.status.charAt(0).toUpperCase() + candidate.status.slice(1)}
            </Badge>
          </div>
        </div>
        
        <Tabs 
          defaultValue="profile" 
          value={activeTab} 
          onValueChange={setActiveTab}
          className="w-full"
        >
          <TabsList className="grid grid-cols-4 mb-4">
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="portfolio">Portfolio</TabsTrigger>
            <TabsTrigger value="interviews">AI Interviews</TabsTrigger>
            <TabsTrigger value="notes">Notes</TabsTrigger>
          </TabsList>
          
          <TabsContent value="profile" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="flex items-center text-sm">
                  <Mail className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span>{candidate.email}</span>
                </div>
                
                <div className="flex items-center text-sm">
                  <Phone className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span>{candidate.phoneNumber || 'Not provided'}</span>
                </div>
                
                <div className="flex items-center text-sm">
                  <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span>Applied: {formatDate(candidate.appliedDate || new Date().toISOString())}</span>
                </div>
                
                <div className="flex items-center text-sm">
                  <Award className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span>Matching Score: {candidate.matchScore || 'Not calculated'}</span>
                </div>
              </div>
              
              <div>
                <h4 className="text-sm font-medium mb-2">Skills</h4>
                <div className="flex flex-wrap gap-2">
                  {candidate.skillList && candidate.skillList.map((skill, index) => (
                    <Badge key={index} variant="secondary" className="bg-gray-100">
                      {skill}
                    </Badge>
                  ))}
                  {(!candidate.skillList || candidate.skillList.length === 0) && (
                    <span className="text-sm text-muted-foreground">No skills listed</span>
                  )}
                </div>
              </div>
            </div>
            
            <div>
              <h4 className="text-sm font-medium mb-2">Actions</h4>
              <div className="flex flex-wrap gap-2">
                <Button size="sm" variant="outline" onClick={onScreenClick}>
                  <FileText className="h-4 w-4 mr-1" />
                  Screen
                </Button>
                <Button size="sm" variant="outline" onClick={onInterviewClick}>
                  <MessageSquare className="h-4 w-4 mr-1" />
                  Interview
                </Button>
                <Button size="sm" variant="outline" onClick={onOfferClick}>
                  <ThumbsUp className="h-4 w-4 mr-1" />
                  Offer
                </Button>
              </div>
            </div>
            
            {candidate.notes && (
              <div>
                <h4 className="text-sm font-medium mb-2">Notes</h4>
                <div className="text-sm p-3 bg-gray-50 rounded-md">
                  {candidate.notes}
                </div>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="portfolio" className="space-y-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {/* Resume Score */}
              <Card>
                <CardContent className="p-4">
                  <div className="flex justify-between items-center mb-2">
                    <div className="flex items-center">
                      <FileText className="h-4 w-4 mr-2 text-indigo-500" />
                      <span className="font-medium">Resume Score</span>
                    </div>
                    <Badge variant={candidate.matchScore && candidate.matchScore >= 80 ? "default" : "secondary"}>
                      {candidate.matchScore || 0}%
                    </Badge>
                  </div>
                  <Progress value={candidate.matchScore || 0} className="h-2" />
                </CardContent>
              </Card>
              
              {/* Portfolio Score */}
              <Card>
                <CardContent className="p-4">
                  <div className="flex justify-between items-center mb-2">
                    <div className="flex items-center">
                      <Globe className="h-4 w-4 mr-2 text-blue-500" />
                      <span className="font-medium">Portfolio Score</span>
                    </div>
                    <Badge variant={candidate.portfolioScore && candidate.portfolioScore >= 80 ? "default" : "secondary"}>
                      {candidate.portfolioScore || 0}/100
                    </Badge>
                  </div>
                  <Progress value={candidate.portfolioScore || 0} max={100} className="h-2" />
                </CardContent>
              </Card>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {/* GitHub */}
              <Card>
                <CardContent className="p-3">
                  <div className="flex flex-col items-center text-center gap-1">
                    <div className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center">
                      <Github className="h-5 w-5 text-gray-700" />
                    </div>
                    <span className="text-sm font-medium">GitHub</span>
                    <div className={`font-bold ${getScoreColor(candidate.githubScore || 0)}`}>
                      {candidate.githubScore || 0}/25
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              {/* LinkedIn */}
              <Card>
                <CardContent className="p-3">
                  <div className="flex flex-col items-center text-center gap-1">
                    <div className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center">
                      <Linkedin className="h-5 w-5 text-blue-700" />
                    </div>
                    <span className="text-sm font-medium">LinkedIn</span>
                    <div className={`font-bold ${getScoreColor(candidate.linkedinScore || 0)}`}>
                      {candidate.linkedinScore || 0}/25
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              {/* Certifications */}
              <Card>
                <CardContent className="p-3">
                  <div className="flex flex-col items-center text-center gap-1">
                    <div className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center">
                      <Award className="h-5 w-5 text-amber-600" />
                    </div>
                    <span className="text-sm font-medium">Certifications</span>
                    <div className={`font-bold ${getScoreColor(candidate.certScore || 0)}`}>
                      {candidate.certScore || 0}/25
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              {/* Projects */}
              <Card>
                <CardContent className="p-3">
                  <div className="flex flex-col items-center text-center gap-1">
                    <div className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center">
                      <Star className="h-5 w-5 text-yellow-500" />
                    </div>
                    <span className="text-sm font-medium">Projects</span>
                    <div className={`font-bold ${getScoreColor(candidate.projectScore || 0)}`}>
                      {candidate.projectScore || 0}/25
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <div className="flex justify-center mt-4">
              <Button onClick={handlePortfolioEvaluation}>
                Evaluate Portfolio
              </Button>
            </div>
          </TabsContent>
          
          <TabsContent value="interviews">
            <CandidateInterviewReport candidate={candidate} />
          </TabsContent>
          
          <TabsContent value="notes">
            <div className="text-center py-8">
              <FileText className="h-12 w-12 mx-auto text-gray-300 mb-2" />
              <h3 className="text-lg font-medium mb-1">No Notes Yet</h3>
              <p className="text-muted-foreground mb-4">
                Add notes about this candidate to keep track of important information.
              </p>
              <Button>Add Note</Button>
            </div>
          </TabsContent>
        </Tabs>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
      
      <PortfolioEvaluationDialog
        open={portfolioDialogOpen}
        onOpenChange={setPortfolioDialogOpen}
        candidate={candidate}
      />
    </Dialog>
  );
}
