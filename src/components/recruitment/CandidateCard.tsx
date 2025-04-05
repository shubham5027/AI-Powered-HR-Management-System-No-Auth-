
import React from 'react';
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { FileText, MessageSquare, ThumbsUp } from "lucide-react";
import { Candidate } from '@/data/mockData';

export interface CandidateCardProps {
  candidate: Candidate;
  onScreenClick: () => void;
  onInterviewClick: () => void;
  onOfferClick: () => void;
  onClick: () => void; // Add this prop to fix the type error
}

export function CandidateCard({
  candidate,
  onScreenClick,
  onInterviewClick,
  onOfferClick,
  onClick
}: CandidateCardProps) {
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

  return (
    <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={onClick}>
      <CardContent className="p-4">
        <div className="flex justify-between items-start">
          <div className="flex items-center space-x-3">
            <Avatar>
              <AvatarImage src={candidate.avatar} alt={candidate.name} />
              <AvatarFallback>
                {candidate.name.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            <div>
              <h3 className="font-medium">{candidate.name}</h3>
              <p className="text-sm text-muted-foreground">{candidate.position}</p>
            </div>
          </div>
          <Badge className={getStatusColor(candidate.status)}>
            {candidate.status.charAt(0).toUpperCase() + candidate.status.slice(1)}
          </Badge>
        </div>
        
        <div className="mt-4 grid grid-cols-2 gap-2 text-sm">
          <div>
            <span className="text-muted-foreground">Email:</span>
            <p className="truncate">{candidate.email}</p>
          </div>
          <div>
            <span className="text-muted-foreground">Match:</span>
            <p>{candidate.matchScore || 'N/A'}</p>
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="px-4 py-3 bg-muted/50 flex justify-between">
        <Button 
          variant="ghost" 
          size="sm"
          onClick={(e) => {
            e.stopPropagation();
            onScreenClick();
          }}
        >
          <FileText className="h-4 w-4 mr-1" />
          Screen
        </Button>
        <Button 
          variant="ghost" 
          size="sm"
          onClick={(e) => {
            e.stopPropagation();
            onInterviewClick();
          }}
        >
          <MessageSquare className="h-4 w-4 mr-1" />
          Interview
        </Button>
        <Button 
          variant="ghost" 
          size="sm"
          onClick={(e) => {
            e.stopPropagation();
            onOfferClick();
          }}
        >
          <ThumbsUp className="h-4 w-4 mr-1" />
          Offer
        </Button>
      </CardFooter>
    </Card>
  );
}
