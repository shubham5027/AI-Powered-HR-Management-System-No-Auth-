import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { AppLayout } from "@/components/layout/AppLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Select, 
  SelectContent, 
  SelectGroup, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { ChartContainer } from "@/components/ui/chart";
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Info, Users, TrendingUp, Clock, ChevronDown, ChevronRight, Sparkles, AlertCircle, MessageSquare, Heart, Frown, Smile } from 'lucide-react';
import { Textarea } from "@/components/ui/textarea";

// API Configuration
const EDENAI_API_KEY = "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiOGE1YmQwOTYtZTQ2OC00ZjEwLTk2Y2MtOWU2ZjUwMjIxZjY3IiwidHlwZSI6ImFwaV90b2tlbiJ9.QL-Qjs13w0VxiLng4b_9AS8uD16n1u7fM3vT31pX7F0";
const GEMINI_API_KEY = "AIzaSyBCstuceBv_TMCB3Xhf9M7GL-brZCyDaNE";

// Mock data for employee relations analytics
const teamSatisfactionData = [
  { team: 'Engineering', satisfaction: 8.2, engagement: 7.8, conflicts: 2 },
  { team: 'Marketing', satisfaction: 7.5, engagement: 7.2, conflicts: 3 },
  { team: 'Sales', satisfaction: 7.1, engagement: 6.9, conflicts: 5 },
  { team: 'Support', satisfaction: 6.8, engagement: 6.5, conflicts: 4 },
  { team: 'HR', satisfaction: 8.4, engagement: 8.1, conflicts: 1 },
];

const conflictResolutionData = [
  { month: 'Aug', resolved: 8, escalated: 2 },
  { month: 'Sep', resolved: 10, escalated: 1 },
  { month: 'Oct', resolved: 12, escalated: 3 },
  { month: 'Nov', resolved: 9, escalated: 2 },
  { month: 'Dec', resolved: 11, escalated: 1 },
  { month: 'Jan', resolved: 14, escalated: 0 },
];

const sentimentDistributionData = [
  { name: 'Positive', value: 65, color: '#10b981' },
  { name: 'Neutral', value: 25, color: '#f59e0b' },
  { name: 'Negative', value: 10, color: '#ef4444' },
];

// Mock recent employee relations events
const recentEvents = [
  { id: 1, type: 'conflict', description: 'Resolved inter-team communication issue', timestamp: '2 days ago', status: 'resolved' },
  { id: 2, description: 'Conducted team building workshop', timestamp: '1 week ago', status: 'completed' },
  { id: 3, type: 'feedback', description: 'Addressed employee concerns about workload', timestamp: '2 weeks ago', status: 'in-progress' }
];

const chartConfig = {
  satisfaction: {
    label: "Team Satisfaction",
    theme: {
      light: "#3b82f6",
      dark: "#93c5fd"
    }
  },
  engagement: {
    label: "Engagement Score",
    theme: {
      light: "#8b5cf6",
      dark: "#c4b5fd"
    }
  },
  conflicts: {
    label: "Conflict Count",
    theme: {
      light: "#ef4444",
      dark: "#f87171"
    }
  }
};

const EmployeeRelationsDashboard = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const tabFromUrl = searchParams.get('tab') || 'analytics';
  const [activeTab, setActiveTab] = useState(tabFromUrl);
  const [timeframe, setTimeframe] = useState("6m");
  const [selectedTeam, setSelectedTeam] = useState("all");
  const [loading, setLoading] = useState(false);
  const [feedbackText, setFeedbackText] = useState("");
  const [sentimentResult, setSentimentResult] = useState(null);
  const [geminiRecommendations, setGeminiRecommendations] = useState("");
  const [analysisRunning, setAnalysisRunning] = useState(false);
  const [activeFeedbackTab, setActiveFeedbackTab] = useState('all');

  useEffect(() => {
    if (activeTab !== tabFromUrl) {
      setSearchParams({ tab: activeTab });
    }
  }, [activeTab, tabFromUrl, setSearchParams]);

  const handleTabChange = (value: string) => {
    setActiveTab(value);
  };

  const handleTimeframeChange = (value: string) => {
    setTimeframe(value);
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 800);
  };

  const handleTeamChange = (value: string) => {
    setSelectedTeam(value);
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 800);
  };

  const analyzeSentiment = async () => {
    if (!feedbackText) return;
    
    setLoading(true);
    try {
      const response = await fetch("https://api.edenai.run/v2/text/sentiment_analysis", {
        method: 'POST',
        headers: {
          'Authorization': EDENAI_API_KEY,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          providers: 'google,amazon',
          text: feedbackText,
          language: 'en'
        })
      });

      const data = await response.json();
      setSentimentResult(data.google || data.amazon);
      
      // Get recommendations based on sentiment
      await getGeminiRecommendations(feedbackText, data.google || data.amazon);
    } catch (error) {
      console.error("Sentiment analysis failed:", error);
    } finally {
      setLoading(false);
    }
  };

  const getGeminiRecommendations = async (text, sentiment) => {
    setAnalysisRunning(true);
    try {
      const prompt = `As an employee relations specialist, analyze this feedback: "${text}" 
      with sentiment results: ${JSON.stringify(sentiment)}. 
      Provide 3 specific recommendations to improve employee relations.
      Format as bullet points with actionable steps.`;
      
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${GEMINI_API_KEY}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: prompt
            }]
          }]
        })
      });

      const data = await response.json();
      setGeminiRecommendations(data.candidates[0].content.parts[0].text);
    } catch (error) {
      console.error("Failed to get recommendations:", error);
    } finally {
      setAnalysisRunning(false);
    }
  };

  const runTeamAnalysis = async () => {
    setLoading(true);
    try {
      // Simulate analysis of team dynamics
      await new Promise(resolve => setTimeout(resolve, 1500));
    } catch (error) {
      console.error("Analysis failed:", error);
    } finally {
      setLoading(false);
    }
  };

  const renderEventIcon = (type) => {
    switch (type) {
      case 'conflict':
        return <AlertCircle className="w-5 h-5 text-orange-500" />;
      case 'feedback':
        return <MessageSquare className="w-5 h-5 text-blue-500" />;
      default:
        return <Heart className="w-5 h-5 text-green-500" />;
    }
  };

  const renderStatusBadge = (status) => {
    switch (status) {
      case 'resolved':
        return <Badge variant="default">Resolved</Badge>;
      case 'in-progress':
        return <Badge variant="secondary">In Progress</Badge>;
      default:
        return <Badge variant="outline">Completed</Badge>;
    }
  };

  return (
    <AppLayout>
      <div className="container py-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Employee Relations Dashboard</h1>
          <div className="flex gap-4">
            <Select value={timeframe} onValueChange={handleTimeframeChange}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select timeframe" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="3m">3 Months</SelectItem>
                  <SelectItem value="6m">6 Months</SelectItem>
                  <SelectItem value="1y">1 Year</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
            <Button 
              className="bg-primary flex items-center gap-2" 
              onClick={runTeamAnalysis}
              disabled={loading}
            >
              <Sparkles className="w-4 h-4" />
              {loading ? "Analyzing..." : "Analyze Team Dynamics"}
            </Button>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-4">
            <TabsTrigger value="analytics">Team Analytics</TabsTrigger>
            <TabsTrigger value="feedback">Feedback Analysis</TabsTrigger>
            <TabsTrigger value="interventions">Relations Interventions</TabsTrigger>
          </TabsList>
          
          <TabsContent value="analytics" className="space-y-6">
            <Card>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Team Health Metrics</CardTitle>
                    <CardDescription>
                      Employee satisfaction, engagement, and conflict metrics by team
                    </CardDescription>
                  </div>
                  <Select value={selectedTeam} onValueChange={handleTeamChange}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="All Teams" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectItem value="all">All Teams</SelectItem>
                        <SelectItem value="eng">Engineering</SelectItem>
                        <SelectItem value="sales">Sales</SelectItem>
                        <SelectItem value="marketing">Marketing</SelectItem>
                        <SelectItem value="support">Support</SelectItem>
                        <SelectItem value="hr">HR</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="space-y-4">
                    <Skeleton className="h-80 w-full" />
                    <div className="grid gap-4 grid-cols-3">
                      <Skeleton className="h-24 w-full" />
                      <Skeleton className="h-24 w-full" />
                      <Skeleton className="h-24 w-full" />
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="h-80 mb-6">
                      <ChartContainer config={chartConfig}>
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={teamSatisfactionData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="team" />
                            <YAxis domain={[0, 10]} />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="satisfaction" name="Satisfaction (1-10)" fill="var(--color-satisfaction)" />
                            <Bar dataKey="engagement" name="Engagement (1-10)" fill="var(--color-engagement)" />
                            <Bar dataKey="conflicts" name="Conflicts (count)" fill="var(--color-conflicts)" />
                          </BarChart>
                        </ResponsiveContainer>
                      </ChartContainer>
                    </div>

                    <Separator className="my-6" />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h3 className="text-lg font-medium mb-4">Conflict Resolution</h3>
                        <div className="h-64">
                          <ChartContainer config={chartConfig}>
                            <ResponsiveContainer width="100%" height="100%">
                              <LineChart data={conflictResolutionData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="month" />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Line 
                                  type="monotone" 
                                  dataKey="resolved" 
                                  name="Resolved Conflicts" 
                                  stroke="#10b981" 
                                  strokeWidth={2}
                                />
                                <Line 
                                  type="monotone" 
                                  dataKey="escalated" 
                                  name="Escalated Conflicts" 
                                  stroke="#ef4444" 
                                  strokeWidth={2}
                                />
                              </LineChart>
                            </ResponsiveContainer>
                          </ChartContainer>
                        </div>
                      </div>

                      <div>
                        <h3 className="text-lg font-medium mb-4">Sentiment Distribution</h3>
                        <div className="h-64">
                          <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                              <Pie
                                data={sentimentDistributionData}
                                cx="50%"
                                cy="50%"
                                labelLine={false}
                                outerRadius={80}
                                fill="#8884d8"
                                dataKey="value"
                                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                              >
                                {sentimentDistributionData.map((entry, index) => (
                                  <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                              </Pie>
                              <Tooltip />
                              <Legend />
                            </PieChart>
                          </ResponsiveContainer>
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="feedback" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="w-5 h-5" />
                  Employee Feedback Analysis
                </CardTitle>
                <CardDescription>
                  Analyze employee feedback sentiment and get AI-powered recommendations
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card>
                    <CardContent className="p-4 flex items-center">
                      <div className="p-2 rounded-full bg-green-100 mr-4">
                        <Smile className="w-5 h-5 text-green-500" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Positive Feedback</p>
                        <p className="text-2xl font-bold">42</p>
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4 flex items-center">
                      <div className="p-2 rounded-full bg-yellow-100 mr-4">
                        <MessageSquare className="w-5 h-5 text-yellow-500" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Neutral Feedback</p>
                        <p className="text-2xl font-bold">28</p>
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4 flex items-center">
                      <div className="p-2 rounded-full bg-red-100 mr-4">
                        <Frown className="w-5 h-5 text-red-500" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Negative Feedback</p>
                        <p className="text-2xl font-bold">15</p>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <Tabs value={activeFeedbackTab} onValueChange={setActiveFeedbackTab} className="w-full">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="all">All Feedback</TabsTrigger>
                    <TabsTrigger value="positive">Positive</TabsTrigger>
                    <TabsTrigger value="negative">Negative</TabsTrigger>
                  </TabsList>
                  <TabsContent value="all" className="pt-4">
                    <div className="space-y-4">
                      <Textarea
                        placeholder="Paste new employee feedback here..."
                        value={feedbackText}
                        onChange={(e) => setFeedbackText(e.target.value)}
                        className="min-h-[120px]"
                      />
                      <div className="flex justify-end gap-2">
                        <Button 
                          variant="outline" 
                          onClick={() => setFeedbackText("")}
                          disabled={!feedbackText}
                        >
                          Clear
                        </Button>
                        <Button 
                          onClick={analyzeSentiment}
                          disabled={!feedbackText || loading}
                        >
                          {loading ? "Analyzing..." : "Analyze Sentiment"}
                        </Button>
                      </div>
                    </div>
                  </TabsContent>
                  <TabsContent value="positive" className="pt-4">
                    <div className="space-y-3">
                      {[1, 2, 3].map(i => (
                        <Card key={i}>
                          <CardContent className="p-4 flex items-start">
                            <div className="mr-4 mt-1">
                              <div className="p-1.5 rounded-full bg-green-100">
                                <Smile className="w-4 h-4 text-green-500" />
                              </div>
                            </div>
                            <div>
                              <p className="font-medium">Great team collaboration this week</p>
                              <p className="text-sm text-muted-foreground">Engineering team, 3 days ago</p>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </TabsContent>
                  <TabsContent value="negative" className="pt-4">
                    <div className="space-y-3">
                      {[1, 2].map(i => (
                        <Card key={i}>
                          <CardContent className="p-4 flex items-start">
                            <div className="mr-4 mt-1">
                              <div className="p-1.5 rounded-full bg-red-100">
                                <Frown className="w-4 h-4 text-red-500" />
                              </div>
                            </div>
                            <div>
                              <p className="font-medium">Need clearer communication from leadership</p>
                              <p className="text-sm text-muted-foreground">Marketing team, 1 week ago</p>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </TabsContent>
                </Tabs>

                {sentimentResult && (
                  <div className="mt-4 space-y-4">
                    <div className="flex items-start gap-4 p-4 border rounded-lg">
                      <div className="p-2 rounded-full bg-blue-100 mt-1">
                        <Info className="w-5 h-5 text-blue-500" />
                      </div>
                      <div>
                        <h4 className="font-medium mb-2">Sentiment Analysis Results</h4>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div>
                            <p className="text-sm text-muted-foreground">General Sentiment</p>
                            <p className="text-xl font-bold capitalize">
                              {sentimentResult.general_sentiment}
                              <Badge 
                                variant={
                                  sentimentResult.general_sentiment === 'positive' ? 'default' :
                                  sentimentResult.general_sentiment === 'negative' ? 'destructive' : 'secondary'
                                }
                                className="ml-2"
                              >
                                {Math.round(sentimentResult.general_sentiment_rate * 100)}%
                              </Badge>
                            </p>
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">Positive Aspects</p>
                            <p className="text-xl font-bold">
                              {sentimentResult.positive?.length || 0}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">Negative Aspects</p>
                            <p className="text-xl font-bold">
                              {sentimentResult.negative?.length || 0}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {analysisRunning ? (
                      <Skeleton className="h-[120px] w-full" />
                    ) : geminiRecommendations ? (
                      <div className="p-4 border rounded-lg bg-muted/30">
                        <h4 className="font-medium mb-2 flex items-center gap-2">
                          <Sparkles className="w-5 h-5 text-yellow-500" />
                          AI Recommendations for Employee Relations
                        </h4>
                        <div className="prose prose-sm dark:prose-invert">
                          {geminiRecommendations.split('\n').map((line, i) => (
                            <p key={i}>{line}</p>
                          ))}
                        </div>
                      </div>
                    ) : null}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="interventions" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Heart className="w-5 h-5 text-red-500" />
                  Employee Relations Interventions
                </CardTitle>
                <CardDescription>
                  Recent actions taken to improve employee relations and team dynamics
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card>
                    <CardContent className="p-4 flex items-center">
                      <div className="p-2 rounded-full bg-green-100 mr-4">
                        <TrendingUp className="w-5 h-5 text-green-500" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Relations Improved</p>
                        <p className="text-2xl font-bold">+22%</p>
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4 flex items-center">
                      <div className="p-2 rounded-full bg-blue-100 mr-4">
                        <MessageSquare className="w-5 h-5 text-blue-500" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Mediations Conducted</p>
                        <p className="text-2xl font-bold">14</p>
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4 flex items-center">
                      <div className="p-2 rounded-full bg-purple-100 mr-4">
                        <Users className="w-5 h-5 text-purple-500" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Team Workshops</p>
                        <p className="text-2xl font-bold">8</p>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <div>
                  <h3 className="text-lg font-medium mb-4 flex items-center">
                    <Clock className="w-4 h-4 mr-2" />
                    Recent Employee Relations Events
                  </h3>
                  
                  <div className="space-y-3">
                    {recentEvents.map(event => (
                      <Card key={event.id}>
                        <CardContent className="p-4 flex items-start justify-between">
                          <div className="flex items-start">
                            <div className="mr-4 mt-1">
                              {renderEventIcon(event.type)}
                            </div>
                            <div>
                              <p className="font-medium">{event.description}</p>
                              <p className="text-sm text-muted-foreground">{event.timestamp}</p>
                            </div>
                          </div>
                          {renderStatusBadge(event.status)}
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>

                <div className="border rounded-lg p-6 bg-muted/30">
                  <h3 className="text-lg font-medium mb-4">Schedule New Intervention</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium mb-1">Intervention Type</label>
                          <Select>
                            <SelectTrigger>
                              <SelectValue placeholder="Select type" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="mediation">Conflict Mediation</SelectItem>
                              <SelectItem value="workshop">Team Building Workshop</SelectItem>
                              <SelectItem value="training">Communication Training</SelectItem>
                              <SelectItem value="one-on-one">Manager One-on-One</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-1">Team/Individual</label>
                          <Select>
                            <SelectTrigger>
                              <SelectValue placeholder="Select target" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="all">All Teams</SelectItem>
                              <SelectItem value="eng">Engineering</SelectItem>
                              <SelectItem value="sales">Sales</SelectItem>
                              <SelectItem value="marketing">Marketing</SelectItem>
                              <SelectItem value="support">Support</SelectItem>
                              <SelectItem value="individual">Individual</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </div>
                    <div>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium mb-1">Date</label>
                          <input type="date" className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50" />
                        </div>
                        <div className="flex justify-end pt-2">
                          <Button>Schedule Intervention</Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
};

export default EmployeeRelationsDashboard;