
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { generateOfferLetter } from '@/services/aiRecruitmentService';
import { Candidate } from '@/data/mockData';
import { 
  FileText,
  Download,
  RefreshCw,
  Sparkles
} from 'lucide-react';

interface OfferLetterDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  candidate?: Candidate;
}

export function OfferLetterDialog({ 
  open, 
  onOpenChange,
  candidate
}: OfferLetterDialogProps) {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [candidateName, setCandidateName] = useState(candidate?.name || '');
  const [jobTitle, setJobTitle] = useState(candidate?.position || '');
  const [salary, setSalary] = useState('85000');
  const [offerLetter, setOfferLetter] = useState<string | null>(null);
  
  const handleGenerateOffer = async () => {
    if (!candidateName || !jobTitle || !salary) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }
    
    setIsLoading(true);
    try {
      const letter = await generateOfferLetter(
        candidateName, 
        jobTitle, 
        parseInt(salary.replace(/,/g, ''), 10)
      );
      setOfferLetter(letter);
      toast({
        title: "Offer generated",
        description: "Offer letter has been created successfully",
      });
    } catch (error) {
      toast({
        title: "Generation failed",
        description: "Could not generate offer letter",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleDownload = () => {
    if (!offerLetter) return;
    
    const element = document.createElement('a');
    const file = new Blob([offerLetter], {type: 'text/plain'});
    element.href = URL.createObjectURL(file);
    element.download = `Offer_Letter_${candidateName.replace(/\s+/g, '_')}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    
    toast({
      title: "Downloaded",
      description: "Offer letter downloaded successfully",
    });
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-green-500" />
            AI Offer Letter Generator
          </DialogTitle>
          <DialogDescription>
            Generate personalized offer letters based on candidate information and job details.
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-4">
          {!offerLetter ? (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="candidate-name">Candidate Name</Label>
                  <Input 
                    id="candidate-name"
                    value={candidateName}
                    onChange={(e) => setCandidateName(e.target.value)}
                    placeholder="Enter candidate name"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="job-title">Job Title</Label>
                  <Input 
                    id="job-title"
                    value={jobTitle}
                    onChange={(e) => setJobTitle(e.target.value)}
                    placeholder="Enter job title"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="salary">Annual Salary ($)</Label>
                <Input 
                  id="salary"
                  value={salary}
                  onChange={(e) => {
                    // Allow only numbers
                    const value = e.target.value.replace(/[^\d]/g, '');
                    setSalary(value);
                  }}
                  placeholder="Enter salary amount"
                  className="font-mono"
                />
              </div>
              
              <div className="pt-2">
                <Label>Recommended Benefits</Label>
                <div className="flex flex-wrap gap-2 mt-2">
                  <Badge variant="outline" className="bg-blue-50">Health Insurance</Badge>
                  <Badge variant="outline" className="bg-blue-50">401(k)</Badge>
                  <Badge variant="outline" className="bg-blue-50">Paid Time Off</Badge>
                  <Badge variant="outline" className="bg-blue-50">Remote Work Option</Badge>
                  <Badge variant="outline" className="bg-blue-50">Professional Development</Badge>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="p-4 border rounded-md bg-white">
                <Textarea 
                  className="min-h-[300px] font-mono whitespace-pre-wrap"
                  value={offerLetter}
                  readOnly
                />
              </div>
            </div>
          )}
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          
          {!offerLetter ? (
            <Button onClick={handleGenerateOffer} disabled={isLoading}>
              {isLoading ? "Generating..." : "Generate Offer Letter"}
              {!isLoading && <Sparkles className="ml-2 h-4 w-4" />}
            </Button>
          ) : (
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setOfferLetter(null)}>
                <RefreshCw className="mr-2 h-4 w-4" />
                Edit Details
              </Button>
              <Button onClick={handleDownload}>
                <Download className="mr-2 h-4 w-4" />
                Download
              </Button>
            </div>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
