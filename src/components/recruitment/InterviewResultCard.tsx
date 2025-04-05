
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ThumbsUp, ThumbsDown, AlertCircle, Download, Smile, Frown, Meh, ChevronDown, ChevronUp } from 'lucide-react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { InterviewAnalysisResult } from '@/services/edenAIService';

interface InterviewResultCardProps {
  result: InterviewAnalysisResult;
  onSave?: () => void;
  onDownload?: () => void;
}

export function InterviewResultCard({ 
  result, 
  onSave,
  onDownload 
}: InterviewResultCardProps) {
  const [isTranscriptOpen, setIsTranscriptOpen] = React.useState(false);
  
  // Format sentiment score as percentage
  const sentimentScore = Math.round(result.sentiment.score * 100);
  
  // Get appropriate icon and color for sentiment
  const getSentimentIcon = () => {
    if (result.sentiment.sentiment === 'Positive') return <Smile className="h-6 w-6 text-green-500" />;
    if (result.sentiment.sentiment === 'Negative') return <Frown className="h-6 w-6 text-red-500" />;
    return <Meh className="h-6 w-6 text-amber-500" />;
  };
  
  // Get appropriate icon and color for recommendation
  const getRecommendationData = () => {
    if (result.recommendation === 'Hire') {
      return {
        icon: <ThumbsUp className="h-5 w-5" />,
        color: 'bg-green-50 text-green-700 border-green-200'
      };
    }
    if (result.recommendation === 'Reject') {
      return {
        icon: <ThumbsDown className="h-5 w-5" />,
        color: 'bg-red-50 text-red-700 border-red-200'
      };
    }
    return {
      icon: <AlertCircle className="h-5 w-5" />,
      color: 'bg-amber-50 text-amber-700 border-amber-200'
    };
  };
  
  const recommendationData = getRecommendationData();
  
  return (
    <Card className="shadow-md">
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          <span>Interview Analysis</span>
          <Badge 
            variant="outline"
            className={recommendationData.color}
          >
            <span className="flex items-center gap-1">
              {recommendationData.icon}
              {result.recommendation}
            </span>
          </Badge>
        </CardTitle>
        <CardDescription>
          AI-powered analysis of the candidate's interview
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Sentiment Analysis */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <h3 className="text-sm font-medium">Sentiment Score</h3>
            <div className="flex items-center gap-2">
              {getSentimentIcon()}
              <span className="text-sm font-bold">{sentimentScore}%</span>
            </div>
          </div>
          <Progress 
            value={sentimentScore} 
            className={`h-2 ${
              sentimentScore >= 70 ? 'bg-green-500' : 
              sentimentScore >= 50 ? 'bg-amber-500' : 'bg-red-500'
            }`}
          />
          <div className="text-xs text-right text-gray-500">
            Detected emotion: {result.sentiment.sentiment}
          </div>
        </div>
        
        {/* Keywords */}
        <div>
          <h3 className="text-sm font-medium mb-2">Key Topics</h3>
          <div className="flex flex-wrap gap-2">
            {result.keywords.keywords.map((keyword, i) => {
              // Calculate size and color based on importance
              const importance = result.keywords.importances[i] || 0.5;
              const size = importance > 0.7 ? 'text-base font-medium' : 
                          importance > 0.4 ? 'text-sm' : 'text-xs';
                          
              return (
                <Badge 
                  key={i} 
                  variant="secondary"
                  className={`${size} ${
                    importance > 0.7 ? 'bg-blue-100 text-blue-800' : 
                    importance > 0.4 ? 'bg-gray-100 text-gray-800' : 
                    'bg-gray-50 text-gray-600'
                  }`}
                >
                  {keyword}
                </Badge>
              );
            })}
          </div>
        </div>
        
        {/* Transcript */}
        <Collapsible open={isTranscriptOpen} onOpenChange={setIsTranscriptOpen}>
          <div className="flex justify-between items-center">
            <h3 className="text-sm font-medium">Transcript</h3>
            <CollapsibleTrigger asChild>
              <Button variant="ghost" size="sm">
                {isTranscriptOpen ? (
                  <ChevronUp className="h-4 w-4" />
                ) : (
                  <ChevronDown className="h-4 w-4" />
                )}
              </Button>
            </CollapsibleTrigger>
          </div>
          <CollapsibleContent className="mt-2">
            <div className="bg-gray-50 p-3 rounded-md text-sm max-h-[200px] overflow-y-auto">
              {result.transcription.text}
            </div>
            <div className="text-xs text-gray-500 mt-1">
              Confidence: {Math.round(result.transcription.confidence * 100)}%
            </div>
          </CollapsibleContent>
        </Collapsible>
      </CardContent>
      
      <CardFooter className="flex justify-between">
        <Button 
          variant="outline" 
          size="sm"
          onClick={onDownload}
          className="flex items-center gap-1"
        >
          <Download className="h-4 w-4" />
          Download
        </Button>
        
        {onSave && (
          <Button 
            size="sm"
            onClick={onSave}
          >
            Save Report
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
