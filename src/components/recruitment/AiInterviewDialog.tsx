
import React, { useState, useRef, useEffect } from 'react';
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
import { Badge } from "@/components/ui/badge";
import { Candidate } from '@/data/mockData';
import { 
  Mic, 
  MicOff, 
  Video, 
  VideoOff, 
  Sparkles, 
  MessageSquare,
  ChevronRight,
  Star,
  AlertTriangle,
  Loader2
} from 'lucide-react';
import { toast } from 'sonner';
import { InterviewRecorder } from './InterviewRecorder';
import { InterviewResultCard } from './InterviewResultCard';
import { InterviewAnalysisResult, processInterview } from '@/services/edenAIService';
import { supabase } from '@/integrations/supabase/client';

interface AiInterviewDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  candidate?: Candidate;
}

export function AiInterviewDialog({ 
  open, 
  onOpenChange,
  candidate
}: AiInterviewDialogProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState<'setup' | 'recording' | 'processing' | 'results'>('setup');
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [analysisResult, setAnalysisResult] = useState<InterviewAnalysisResult | null>(null);
  const [edenKeyAvailable, setEdenKeyAvailable] = useState<boolean | null>(null);
  
  // Check if Eden AI key exists
  useEffect(() => {
    if (open) {
      checkEdenAiKey();
    }
  }, [open]);
  
  const checkEdenAiKey = async () => {
    try {
      const { data, error } = await supabase.functions.invoke('get-eden-ai-key', {
        method: 'GET',
      });
      
      if (error) {
        setEdenKeyAvailable(false);
        return;
      }
      
      setEdenKeyAvailable(!!data.apiKey);
    } catch (error) {
      console.error('Error checking Eden AI key:', error);
      setEdenKeyAvailable(false);
    }
  };
  
  const handleReset = () => {
    setStep('setup');
    setAudioBlob(null);
    setAnalysisResult(null);
  };
  
  const handleRecordingComplete = (blob: Blob) => {
    setAudioBlob(blob);
    setStep('processing');
    processInterviewRecording(blob);
  };
  
  const processInterviewRecording = async (blob: Blob) => {
    setIsLoading(true);
    try {
      // Default candidate ID if no candidate is selected
      const candidateId = candidate?.id || 'demo-candidate';
      
      // Process the interview recording
      const result = await processInterview(blob, candidateId);
      
      setAnalysisResult(result);
      setStep('results');
      
      toast.success("Interview analysis completed");
    } catch (error: any) {
      console.error('Error processing interview:', error);
      toast.error(error.message || "Failed to analyze interview");
      setStep('recording'); // Go back to recording
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleStartInterview = () => {
    setStep('recording');
    toast.success("Interview session started");
  };
  
  const handleDownloadReport = () => {
    if (!analysisResult) return;
    
    // Create a JSON string from the analysis result
    const jsonReport = JSON.stringify(analysisResult, null, 2);
    
    // Create a blob from the JSON
    const blob = new Blob([jsonReport], { type: 'application/json' });
    
    // Create a URL for the blob
    const url = URL.createObjectURL(blob);
    
    // Create a temporary anchor element and trigger download
    const a = document.createElement('a');
    a.href = url;
    a.download = `interview_report_${candidate?.name || 'candidate'}_${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(a);
    a.click();
    
    // Clean up
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast.success("Interview report downloaded");
  };
  
  const renderContent = () => {
    if (!edenKeyAvailable) {
      return (
        <div className="py-8 text-center">
          <AlertTriangle className="h-12 w-12 text-amber-500 mx-auto mb-4" />
          <h3 className="text-lg font-medium mb-2">Eden AI Key Required</h3>
          <p className="text-muted-foreground mb-4">
            To use the AI interview feature, you need to set up your Eden AI API key in the Supabase Edge Functions.
          </p>
          <div className="flex justify-center">
            <Button onClick={() => onOpenChange(false)}>Close</Button>
          </div>
        </div>
      );
    }
    
    switch (step) {
      case 'setup':
        return (
          <div className="space-y-6">
            <div className="bg-slate-100 rounded-md p-4">
              <h3 className="font-medium mb-2">Candidate Information</h3>
              <p className="text-sm">
                <span className="font-semibold">Name:</span> {candidate?.name || "New Candidate"}
              </p>
              <p className="text-sm">
                <span className="font-semibold">Position:</span> {candidate?.position || "Software Developer"}
              </p>
            </div>
            
            <div className="bg-blue-50 border border-blue-100 rounded-md p-4">
              <h3 className="font-medium flex items-center gap-2 text-blue-800 mb-2">
                <Sparkles className="h-4 w-4 text-blue-500" />
                AI Interview Assistant
              </h3>
              <p className="text-sm text-blue-700 mb-4">
                This feature uses AI to analyze candidate interviews. The process includes:
              </p>
              <ol className="text-sm space-y-2 text-blue-700 list-decimal pl-4">
                <li>Recording the interview (audio only)</li>
                <li>Transcribing the recording using Eden AI</li>
                <li>Analyzing the transcript for sentiment and key topics</li>
                <li>Generating an AI recommendation</li>
              </ol>
            </div>
            
            <div className="text-center">
              <Button 
                onClick={handleStartInterview}
                className="px-6"
              >
                Start Interview Session
              </Button>
            </div>
          </div>
        );
        
      case 'recording':
        return (
          <div className="space-y-4">
            <InterviewRecorder onRecordingComplete={handleRecordingComplete} />
          </div>
        );
        
      case 'processing':
        return (
          <div className="py-12 text-center space-y-4">
            <Loader2 className="h-12 w-12 text-primary mx-auto animate-spin" />
            <div>
              <h3 className="text-lg font-medium mb-1">Processing Interview</h3>
              <p className="text-muted-foreground">
                Please wait while we analyze the interview recording...
              </p>
            </div>
            
            <div className="max-w-md mx-auto pt-4">
              <div className="space-y-4">
                <div className="flex justify-between text-sm">
                  <span>Transcribing audio</span>
                  <span className="text-blue-500 animate-pulse">In progress...</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Analyzing sentiment</span>
                  <span className="text-gray-400">Waiting...</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Extracting keywords</span>
                  <span className="text-gray-400">Waiting...</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Generating recommendation</span>
                  <span className="text-gray-400">Waiting...</span>
                </div>
              </div>
            </div>
          </div>
        );
        
      case 'results':
        return analysisResult ? (
          <div className="space-y-4">
            <InterviewResultCard 
              result={analysisResult} 
              onDownload={handleDownloadReport}
            />
          </div>
        ) : (
          <div className="py-8 text-center">
            <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">Analysis Failed</h3>
            <p className="text-muted-foreground mb-4">
              There was a problem processing the interview. Please try again.
            </p>
            <Button onClick={() => setStep('recording')}>
              Try Again
            </Button>
          </div>
        );
    }
  };
  
  return (
    <Dialog open={open} onOpenChange={(isOpen) => {
      if (!isOpen) {
        handleReset();
      }
      onOpenChange(isOpen);
    }}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-purple-500" />
            AI-Driven Interview
          </DialogTitle>
          <DialogDescription>
            Conduct an AI-powered interview with automated analysis of candidate responses.
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-4">
          {renderContent()}
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
          
          {step === 'results' && analysisResult && (
            <Button onClick={() => onOpenChange(false)}>
              Save & Close
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
