
import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { AppLayout } from '@/components/layout/AppLayout';
import { CandidateCard } from '@/components/recruitment/CandidateCard';
import { AiScreeningDialog } from '@/components/recruitment/AiScreeningDialog';
import { AiInterviewDialog } from '@/components/recruitment/AiInterviewDialog';
import { OfferLetterDialog } from '@/components/recruitment/OfferLetterDialog';
import { AddCandidateDialog } from '@/components/recruitment/AddCandidateDialog';
import { CandidateDetailsDialog } from '@/components/recruitment/CandidateDetailsDialog';
import { PortfolioEvaluationDialog } from '@/components/recruitment/PortfolioEvaluationDialog';
import { 
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  Plus, 
  Download,
  Upload,
  Search,
  Sparkles,
  FileText,
  MessageSquare,
  Globe
} from "lucide-react";

import { candidates, jobPostings } from '@/data/mockData';
import { toast } from 'sonner';

const Recruitment = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [filter, setFilter] = useState('all');
  const [screeningDialogOpen, setScreeningDialogOpen] = useState(false);
  const [interviewDialogOpen, setInterviewDialogOpen] = useState(false);
  const [offerDialogOpen, setOfferDialogOpen] = useState(false);
  const [portfolioDialogOpen, setPortfolioDialogOpen] = useState(false);
  const [addCandidateDialogOpen, setAddCandidateDialogOpen] = useState(false);
  const [candidateDetailsOpen, setCandidateDetailsOpen] = useState(false);
  const [selectedCandidate, setSelectedCandidate] = useState<typeof candidates[0] | undefined>(undefined);
  const [activeTab, setActiveTab] = useState('candidates');
  const [searchQuery, setSearchQuery] = useState('');
  const [allCandidates, setAllCandidates] = useState([...candidates]);
  
  useEffect(() => {
    const tab = searchParams.get('tab');
    const feature = searchParams.get('feature');
    
    if (tab && ['candidates', 'jobs', 'analytics'].includes(tab)) {
      setActiveTab(tab);
    }
    
    if (feature) {
      switch (feature) {
        case 'screen':
          setScreeningDialogOpen(true);
          break;
        case 'interview':
          setInterviewDialogOpen(true);
          break;
        case 'offer':
          setOfferDialogOpen(true);
          break;
        case 'portfolio':
          setPortfolioDialogOpen(true);
          break;
        default:
          break;
      }
      
      searchParams.delete('feature');
      setSearchParams(searchParams);
    }
  }, [searchParams]);
  
  const filteredCandidates = allCandidates
    .filter(candidate => filter === 'all' ? true : candidate.status === filter)
    .filter(candidate => 
      searchQuery === '' ? true : 
      candidate.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      candidate.position.toLowerCase().includes(searchQuery.toLowerCase()) ||
      candidate.email.toLowerCase().includes(searchQuery.toLowerCase())
    );

  const handleOpenAiScreening = (candidate?: typeof candidates[0]) => {
    setSelectedCandidate(candidate);
    setScreeningDialogOpen(true);
  };

  const handleOpenAiInterview = (candidate?: typeof candidates[0]) => {
    setSelectedCandidate(candidate);
    setInterviewDialogOpen(true);
  };

  const handleOpenOfferLetter = (candidate?: typeof candidates[0]) => {
    setSelectedCandidate(candidate);
    setOfferDialogOpen(true);
  };
  
  const handleOpenPortfolioEvaluation = (candidate?: typeof candidates[0]) => {
    setSelectedCandidate(candidate);
    setPortfolioDialogOpen(true);
  };
  
  const handleTabChange = (value: string) => {
    setActiveTab(value);
    searchParams.set('tab', value);
    setSearchParams(searchParams);
  };

  const handleAddCandidate = (candidate: typeof candidates[0]) => {
    setAllCandidates([candidate, ...allCandidates]);
    toast.success(`Candidate ${candidate.name} added successfully`);
    setAddCandidateDialogOpen(false);
  };

  const handleOpenCandidateDetails = (candidate: typeof candidates[0]) => {
    setSelectedCandidate(candidate);
    setCandidateDetailsOpen(true);
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="h2">Recruitment</h1>
          <div className="flex gap-2">
            <Button variant="outline">
              <Upload className="w-4 h-4 mr-2" />
              Import
            </Button>
            <Button onClick={() => setAddCandidateDialogOpen(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Add Candidate
            </Button>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={handleTabChange} className="space-y-6">
          <TabsList>
            <TabsTrigger value="candidates">Candidates</TabsTrigger>
            <TabsTrigger value="jobs">Job Postings</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>
          
          <TabsContent value="candidates" className="space-y-6">
            <Card>
              <CardHeader className="pb-3">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div className="flex items-center gap-2">
                    <Search className="h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search candidates..."
                      className="max-w-sm"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                  
                  {/* <div className="flex flex-wrap items-center gap-2">
                    <div className="flex items-center gap-2 mr-4 bg-blue-50 rounded-md px-3 py-1">
                      <Sparkles className="h-4 w-4 text-blue-500" />
                      <span className="text-sm text-blue-700 font-medium">AI Tools:</span>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="text-blue-600 hover:text-blue-800 hover:bg-blue-100"
                        onClick={() => handleOpenAiScreening()}
                      >
                        <FileText className="w-3 h-3 mr-1" />
                        Screen
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        className="text-blue-600 hover:text-blue-800 hover:bg-blue-100"
                        onClick={() => handleOpenAiInterview()}
                      >
                        <MessageSquare className="w-3 h-3 mr-1" />
                        Interview
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        className="text-blue-600 hover:text-blue-800 hover:bg-blue-100"
                        onClick={() => handleOpenPortfolioEvaluation()}
                      >
                        <Globe className="w-3 h-3 mr-1" />
                        Portfolio
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        className="text-blue-600 hover:text-blue-800 hover:bg-blue-100"
                        onClick={() => handleOpenOfferLetter()}
                      >
                        <Sparkles className="w-3 h-3 mr-1" />
                        Offer
                      </Button>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-muted-foreground">Status:</span>
                      <Select
                        defaultValue="all"
                        onValueChange={setFilter}
                      >
                        <SelectTrigger className="w-[180px]">
                          <SelectValue placeholder="All Candidates" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Candidates</SelectItem>
                          <SelectItem value="new">New</SelectItem>
                          <SelectItem value="screening">Screening</SelectItem>
                          <SelectItem value="interview">Interview</SelectItem>
                          <SelectItem value="offered">Offered</SelectItem>
                          <SelectItem value="hired">Hired</SelectItem>
                          <SelectItem value="rejected">Rejected</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div> */}
                </div>
              </CardHeader>
              <CardContent className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {filteredCandidates.map((candidate) => (
                  <CandidateCard 
                    key={candidate.id} 
                    candidate={candidate}
                    onScreenClick={() => handleOpenAiScreening(candidate)}
                    onInterviewClick={() => handleOpenAiInterview(candidate)}
                    onOfferClick={() => handleOpenOfferLetter(candidate)}
                    onClick={() => handleOpenCandidateDetails(candidate)}
                  />
                ))}
                
                {filteredCandidates.length === 0 && (
                  <div className="col-span-full py-8 text-center">
                    <p className="text-muted-foreground">No candidates found matching your criteria.</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="jobs">
            <Card>
              <CardHeader className="pb-3">
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>Job Postings</CardTitle>
                    <CardDescription>Manage your open positions</CardDescription>
                  </div>
                  <Button>
                    <Plus className="w-4 h-4 mr-2" />
                    Create Job
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-3 px-4 font-medium">Position</th>
                        <th className="text-left py-3 px-4 font-medium">Department</th>
                        <th className="text-left py-3 px-4 font-medium">Location</th>
                        <th className="text-left py-3 px-4 font-medium">Applicants</th>
                        <th className="text-left py-3 px-4 font-medium">Status</th>
                        <th className="text-left py-3 px-4 font-medium">Posted Date</th>
                        <th className="text-right py-3 px-4 font-medium">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {jobPostings.map((job) => (
                        <tr key={job.id} className="border-b">
                          <td className="py-3 px-4">{job.title}</td>
                          <td className="py-3 px-4">{job.department}</td>
                          <td className="py-3 px-4">{job.location}</td>
                          <td className="py-3 px-4">{job.applicants}</td>
                          <td className="py-3 px-4">
                            <Badge 
                              className={job.status === 'open' ? 'bg-green-100 text-green-700' : 
                                         job.status === 'draft' ? 'bg-gray-100 text-gray-700' : 
                                         'bg-red-100 text-red-700'}
                            >
                              {job.status.toUpperCase()}
                            </Badge>
                          </td>
                          <td className="py-3 px-4">{job.postedDate}</td>
                          <td className="py-3 px-4 text-right">
                            <Button variant="ghost" size="sm">
                              View
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="analytics" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Recruitment Analytics</CardTitle>
                <CardDescription>
                  AI-powered insights and metrics about your recruitment process
                </CardDescription>
              </CardHeader>
              <CardContent className="flex items-center justify-center p-8 min-h-[300px]">
                <div className="text-center space-y-4">
                  <Sparkles className="h-12 w-12 mx-auto text-primary" />
                  <div>
                    <h3 className="text-lg font-medium">AI Analytics Dashboard</h3>
                    <p className="text-muted-foreground">
                      Coming soon! Get powerful insights into your recruitment process.
                    </p>
                  </div>
                  <Button onClick={() => toast.success("Request submitted! We'll notify you when this feature is available.")}>
                    Request Early Access
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      <AiScreeningDialog 
        open={screeningDialogOpen} 
        onOpenChange={setScreeningDialogOpen} 
        candidate={selectedCandidate}
      />
      
      <AiInterviewDialog 
        open={interviewDialogOpen}
        onOpenChange={setInterviewDialogOpen}
        candidate={selectedCandidate}
      />
      
      <OfferLetterDialog 
        open={offerDialogOpen}
        onOpenChange={setOfferDialogOpen}
        candidate={selectedCandidate}
      />
      
      <PortfolioEvaluationDialog
        open={portfolioDialogOpen}
        onOpenChange={setPortfolioDialogOpen}
        candidate={selectedCandidate}
      />
      
      <AddCandidateDialog
        open={addCandidateDialogOpen}
        onOpenChange={setAddCandidateDialogOpen}
        onAddCandidate={handleAddCandidate}
      />

      {selectedCandidate && (
        <CandidateDetailsDialog
          open={candidateDetailsOpen}
          onOpenChange={setCandidateDetailsOpen}
          candidate={selectedCandidate}
          onScreenClick={() => {
            setCandidateDetailsOpen(false);
            handleOpenAiScreening(selectedCandidate);
          }}
          onInterviewClick={() => {
            setCandidateDetailsOpen(false);
            handleOpenAiInterview(selectedCandidate);
          }}
          onOfferClick={() => {
            setCandidateDetailsOpen(false);
            handleOpenOfferLetter(selectedCandidate);
          }}
        />
      )}
    </AppLayout>
  );
};

export default Recruitment;
