
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { 
  ChevronDown, 
  ChevronUp, 
  Download, 
  ThumbsUp, 
  ThumbsDown, 
  AlertCircle,
  Smile,
  Frown,
  Meh,
  FileText,
  Clock
} from 'lucide-react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Separator } from "@/components/ui/separator";
import { Candidate } from '@/data/mockData';
import { supabase } from '@/integrations/supabase/client';

interface InterviewData {
  id: string;
  candidateId: string;
  feedback: {
    transcription: {
      text: string;
      confidence: number;
    };
    sentiment: {
      sentiment: 'Positive' | 'Neutral' | 'Negative';
      score: number;
    };
    keywords: {
      keywords: string[];
      importances: number[];
    };
    recommendation: 'Hire' | 'Review' | 'Reject';
  };
  interviewDate: string;
}

interface CandidateInterviewReportProps {
  candidate: Candidate;
}

export function CandidateInterviewReport({
  candidate
}: CandidateInterviewReportProps) {
  const [interviews, setInterviews] = useState<InterviewData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [openReport, setOpenReport] = useState<string | null>(null);
  
  useEffect(() => {
    fetchInterviews();
  }, [candidate.id]);
  
  const fetchInterviews = async () => {
    setIsLoading(true);
    try {
      // Get interviews for this candidate
      const { data, error } = await supabase
        .from('interviews')
        .select('id, candidate_id, feedback, created_at')
        .eq('candidate_id', candidate.id)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      // Process the interviews
      const processedInterviews = data.map(item => {
        try {
          const feedback = typeof item.feedback === 'string' 
            ? JSON.parse(item.feedback) 
            : item.feedback;
            
          return {
            id: item.id,
            candidateId: item.candidate_id,
            feedback,
            interviewDate: new Date(item.created_at).toLocaleDateString(),
          };
        } catch (e) {
          console.error('Error parsing interview feedback:', e);
          return null;
        }
      }).filter(Boolean) as InterviewData[];
      
      setInterviews(processedInterviews);
    } catch (error) {
      console.error('Error fetching interviews:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleToggleReport = (id: string) => {
    if (openReport === id) {
      setOpenReport(null);
    } else {
      setOpenReport(id);
    }
  };
  
  const getRecommendationBadge = (recommendation: string) => {
    if (recommendation === 'Hire') {
      return (
        <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
          <ThumbsUp className="h-3 w-3 mr-1" />
          {recommendation}
        </Badge>
      );
    } else if (recommendation === 'Reject') {
      return (
        <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
          <ThumbsDown className="h-3 w-3 mr-1" />
          {recommendation}
        </Badge>
      );
    } else {
      return (
        <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
          <AlertCircle className="h-3 w-3 mr-1" />
          {recommendation}
        </Badge>
      );
    }
  };
  
  // Generate CSV for download
  const downloadCsv = () => {
    if (interviews.length === 0) return;
    
    const headers = ['Date', 'Sentiment', 'Sentiment Score', 'Keywords', 'Recommendation'];
    const csvRows = [headers.join(',')];
    
    interviews.forEach(interview => {
      const { feedback, interviewDate } = interview;
      const row = [
        interviewDate,
        feedback.sentiment.sentiment,
        Math.round(feedback.sentiment.score * 100) + '%',
        '"' + feedback.keywords.keywords.join('; ') + '"',
        feedback.recommendation
      ];
      csvRows.push(row.join(','));
    });
    
    const csvString = csvRows.join('\n');
    const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    
    link.setAttribute('href', url);
    link.setAttribute('download', `${candidate.name.replace(/\s+/g, '_')}_interviews.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Interview Reports</CardTitle>
        </CardHeader>
        <CardContent className="flex justify-center py-8">
          <div className="text-center">
            <Clock className="h-8 w-8 mx-auto text-gray-400 animate-spin mb-2" />
            <p className="text-muted-foreground">Loading interview reports...</p>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  if (interviews.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Interview Reports</CardTitle>
        </CardHeader>
        <CardContent className="flex justify-center py-8">
          <div className="text-center">
            <FileText className="h-8 w-8 mx-auto text-gray-400 mb-2" />
            <p className="text-muted-foreground">No interview reports available for this candidate.</p>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle>Interview Reports</CardTitle>
        <Button
          variant="outline"
          size="sm"
          onClick={downloadCsv}
          className="h-9"
        >
          <Download className="h-4 w-4 mr-1" />
          Export
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        {interviews.map((interview) => (
          <div key={interview.id} className="border rounded-md">
            <div 
              className="flex items-center justify-between p-4 cursor-pointer"
              onClick={() => handleToggleReport(interview.id)}
            >
              <div className="flex items-center gap-3">
                <div className="flex flex-col">
                  <span className="font-medium">{interview.interviewDate}</span>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <span>Sentiment: </span>
                    {interview.feedback.sentiment.sentiment === 'Positive' ? (
                      <Smile className="h-4 w-4 text-green-500" />
                    ) : interview.feedback.sentiment.sentiment === 'Negative' ? (
                      <Frown className="h-4 w-4 text-red-500" />
                    ) : (
                      <Meh className="h-4 w-4 text-amber-500" />
                    )}
                    <span>{Math.round(interview.feedback.sentiment.score * 100)}%</span>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                {getRecommendationBadge(interview.feedback.recommendation)}
                {openReport === interview.id ? (
                  <ChevronUp className="h-5 w-5 text-muted-foreground" />
                ) : (
                  <ChevronDown className="h-5 w-5 text-muted-foreground" />
                )}
              </div>
            </div>
            
            <Collapsible open={openReport === interview.id}>
              <Separator />
              <CollapsibleContent className="p-4 pt-2">
                <div className="space-y-4">
                  {/* Sentiment */}
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium">Sentiment Analysis</h4>
                    <Progress 
                      value={interview.feedback.sentiment.score * 100} 
                      className="h-2"
                    />
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>Negative</span>
                      <span>Neutral</span>
                      <span>Positive</span>
                    </div>
                  </div>
                  
                  {/* Keywords */}
                  <div>
                    <h4 className="text-sm font-medium mb-2">Key Topics</h4>
                    <div className="flex flex-wrap gap-2">
                      {interview.feedback.keywords.keywords.map((keyword, i) => (
                        <Badge 
                          key={i} 
                          variant="secondary"
                          className="bg-blue-50 text-blue-700"
                        >
                          {keyword}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  
                  {/* Transcript */}
                  <div>
                    <h4 className="text-sm font-medium mb-2">Transcript Preview</h4>
                    <div className="bg-gray-50 rounded-md p-3 text-sm max-h-[120px] overflow-y-auto">
                      {interview.feedback.transcription.text.substring(0, 300)}
                      {interview.feedback.transcription.text.length > 300 && '...'}
                    </div>
                  </div>
                </div>
              </CollapsibleContent>
            </Collapsible>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
