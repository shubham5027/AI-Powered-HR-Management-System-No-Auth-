
// import React from 'react';
// import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
// import { Progress } from "@/components/ui/progress";
// import { Badge } from "@/components/ui/badge";
// import { Button } from "@/components/ui/button";
// import { ThumbsUp, ThumbsDown, AlertCircle, Download, Smile, Frown, Meh, ChevronDown, ChevronUp } from 'lucide-react';
// import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
// import { InterviewAnalysisResult } from '@/services/edenAIService';

// interface InterviewResultCardProps {
//   result: InterviewAnalysisResult;
//   onSave?: () => void;
//   onDownload?: () => void;
// }

// export function InterviewResultCard({ 
//   result, 
//   onSave,
//   onDownload 
// }: InterviewResultCardProps) {
//   const [isTranscriptOpen, setIsTranscriptOpen] = React.useState(false);
  
//   // Format sentiment score as percentage
//   const sentimentScore = Math.round(result.sentiment.score * 100);
  
//   // Get appropriate icon and color for sentiment
//   const getSentimentIcon = () => {
//     if (result.sentiment.sentiment === 'Positive') return <Smile className="h-6 w-6 text-green-500" />;
//     if (result.sentiment.sentiment === 'Negative') return <Frown className="h-6 w-6 text-red-500" />;
//     return <Meh className="h-6 w-6 text-amber-500" />;
//   };
  
//   // Get appropriate icon and color for recommendation
//   const getRecommendationData = () => {
//     if (result.recommendation === 'Hire') {
//       return {
//         icon: <ThumbsUp className="h-5 w-5" />,
//         color: 'bg-green-50 text-green-700 border-green-200'
//       };
//     }
//     if (result.recommendation === 'Reject') {
//       return {
//         icon: <ThumbsDown className="h-5 w-5" />,
//         color: 'bg-red-50 text-red-700 border-red-200'
//       };
//     }
//     return {
//       icon: <AlertCircle className="h-5 w-5" />,
//       color: 'bg-amber-50 text-amber-700 border-amber-200'
//     };
//   };
  
//   const recommendationData = getRecommendationData();
  
//   return (
//     <Card className="shadow-md">
//       <CardHeader>
//         <CardTitle className="flex justify-between items-center">
//           <span>Interview Analysis</span>
//           <Badge 
//             variant="outline"
//             className={recommendationData.color}
//           >
//             <span className="flex items-center gap-1">
//               {recommendationData.icon}
//               {result.recommendation}
//             </span>
//           </Badge>
//         </CardTitle>
//         <CardDescription>
//           AI-powered analysis of the candidate's interview
//         </CardDescription>
//       </CardHeader>
      
//       <CardContent className="space-y-6">
//         {/* Sentiment Analysis */}
//         <div className="space-y-2">
//           <div className="flex justify-between items-center">
//             <h3 className="text-sm font-medium">Sentiment Score</h3>
//             <div className="flex items-center gap-2">
//               {getSentimentIcon()}
//               <span className="text-sm font-bold">{sentimentScore}%</span>
//             </div>
//           </div>
//           <Progress 
//             value={sentimentScore} 
//             className={`h-2 ${
//               sentimentScore >= 70 ? 'bg-green-500' : 
//               sentimentScore >= 50 ? 'bg-amber-500' : 'bg-red-500'
//             }`}
//           />
//           <div className="text-xs text-right text-gray-500">
//             Detected emotion: {result.sentiment.sentiment}
//           </div>
//         </div>
        
//         {/* Keywords */}
//         <div>
//           <h3 className="text-sm font-medium mb-2">Key Topics</h3>
//           <div className="flex flex-wrap gap-2">
//             {result.keywords.keywords.map((keyword, i) => {
//               // Calculate size and color based on importance
//               const importance = result.keywords.importances[i] || 0.5;
//               const size = importance > 0.7 ? 'text-base font-medium' : 
//                           importance > 0.4 ? 'text-sm' : 'text-xs';
                          
//               return (
//                 <Badge 
//                   key={i} 
//                   variant="secondary"
//                   className={`${size} ${
//                     importance > 0.7 ? 'bg-blue-100 text-blue-800' : 
//                     importance > 0.4 ? 'bg-gray-100 text-gray-800' : 
//                     'bg-gray-50 text-gray-600'
//                   }`}
//                 >
//                   {keyword}
//                 </Badge>
//               );
//             })}
//           </div>
//         </div>
        
//         {/* Transcript */}
//         <Collapsible open={isTranscriptOpen} onOpenChange={setIsTranscriptOpen}>
//           <div className="flex justify-between items-center">
//             <h3 className="text-sm font-medium">Transcript</h3>
//             <CollapsibleTrigger asChild>
//               <Button variant="ghost" size="sm">
//                 {isTranscriptOpen ? (
//                   <ChevronUp className="h-4 w-4" />
//                 ) : (
//                   <ChevronDown className="h-4 w-4" />
//                 )}
//               </Button>
//             </CollapsibleTrigger>
//           </div>
//           <CollapsibleContent className="mt-2">
//             <div className="bg-gray-50 p-3 rounded-md text-sm max-h-[200px] overflow-y-auto">
//               {result.transcription.text}
//             </div>
//             <div className="text-xs text-gray-500 mt-1">
//               Confidence: {Math.round(result.transcription.confidence * 100)}%
//             </div>
//           </CollapsibleContent>
//         </Collapsible>
//       </CardContent>
      
//       <CardFooter className="flex justify-between">
//         <Button 
//           variant="outline" 
//           size="sm"
//           onClick={onDownload}
//           className="flex items-center gap-1"
//         >
//           <Download className="h-4 w-4" />
//           Download
//         </Button>
        
//         {onSave && (
//           <Button 
//             size="sm"
//             onClick={onSave}
//           >
//             Save Report
//           </Button>
//         )}
//       </CardFooter>
//     </Card>
//   );
// }
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ThumbsUp, ThumbsDown, AlertCircle, Download, Smile, Frown, Meh, ChevronDown, ChevronUp, Camera, Eye } from 'lucide-react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { InterviewAnalysisResult } from '@/services/edenAIService';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

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
  const [activeTab, setActiveTab] = React.useState("sentiment");
  
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
  
  // Get the primary emotion from face analysis
  const getPrimaryEmotion = () => {
    if (!result.faceAnalysis) return null;
    
    const emotions = result.faceAnalysis.emotions;
    const entries = Object.entries(emotions);
    entries.sort((a, b) => b[1] - a[1]);
    
    return entries[0];
  };
  
  const primaryEmotion = getPrimaryEmotion();
  
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
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="sentiment">Sentiment</TabsTrigger>
            <TabsTrigger value="visual">Visual Analysis</TabsTrigger>
            <TabsTrigger value="transcript">Transcript</TabsTrigger>
          </TabsList>
          
          <TabsContent value="sentiment" className="space-y-6">
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
          </TabsContent>
          
          <TabsContent value="visual" className="space-y-6">
            {/* Face Analysis */}
            {result.faceAnalysis ? (
              <div className="space-y-3">
                <h3 className="text-sm font-medium">Facial Expression Analysis</h3>
                
                {/* Primary Emotion */}
                {primaryEmotion && (
                  <div className="bg-blue-50 p-3 rounded-md">
                    <div className="text-center mb-2">
                      <span className="text-xs uppercase tracking-wider text-blue-600 font-semibold">
                        Primary Emotion
                      </span>
                      <div className="text-xl font-bold text-blue-700 capitalize">
                        {primaryEmotion[0]}
                      </div>
                      <div className="text-sm text-blue-600">
                        {Math.round(primaryEmotion[1] * 100)}% confidence
                      </div>
                    </div>
                  </div>
                )}
                
                {/* Emotion Breakdown */}
                <div className="grid grid-cols-2 gap-2">
                  {Object.entries(result.faceAnalysis.emotions).map(([emotion, value]) => (
                    <div key={emotion} className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span className="capitalize">{emotion}</span>
                        <span>{Math.round(value * 100)}%</span>
                      </div>
                      <Progress value={value * 100} className="h-1.5" />
                    </div>
                  ))}
                </div>
                
                {/* Attentiveness */}
                <div className="space-y-1 mt-3">
                  <div className="flex justify-between text-sm">
                    <span>Attentiveness</span>
                    <span>{Math.round(result.faceAnalysis.attentiveness * 100)}%</span>
                  </div>
                  <Progress 
                    value={result.faceAnalysis.attentiveness * 100} 
                    className="h-2" 
                  />
                  <div className="text-xs text-right text-gray-500">
                    How engaged the candidate appeared during the interview
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-4 text-muted-foreground">
                <Camera className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                <p>No facial analysis data available</p>
              </div>
            )}
            
            {/* Object Detection */}
            {result.objectDetection && result.objectDetection.items.length > 0 ? (
              <div className="mt-4">
                <h3 className="text-sm font-medium mb-2">Environment Analysis</h3>
                <div className="grid grid-cols-2 gap-2">
                  {result.objectDetection.items.slice(0, 6).map((item, index) => (
                    <Badge 
                      key={index} 
                      variant="outline" 
                      className="flex justify-between items-center p-2 bg-gray-50"
                    >
                      <span>{item.label}</span>
                      <span className="text-xs opacity-70">{Math.round(item.confidence * 100)}%</span>
                    </Badge>
                  ))}
                </div>
                <div className="text-xs mt-1 text-muted-foreground">
                  Objects detected in the candidate's environment
                </div>
              </div>
            ) : null}
          </TabsContent>
          
          <TabsContent value="transcript">
            {/* Transcript */}
            <div className="space-y-2">
              <h3 className="text-sm font-medium">Full Transcript</h3>
              <div className="bg-gray-50 p-3 rounded-md text-sm max-h-[300px] overflow-y-auto">
                {result.transcription.text}
              </div>
              <div className="text-xs text-gray-500 mt-1">
                Confidence: {Math.round(result.transcription.confidence * 100)}%
              </div>
            </div>
          </TabsContent>
        </Tabs>
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
