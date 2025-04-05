
import React, { useState } from 'react';
import { AppLayout } from "@/components/layout/AppLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Badge } from "@/components/ui/badge";
import { ArrowUp, ArrowDown, TrendingUp, AlertTriangle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const sentimentData = [
  { month: 'Jan', score: 7.2 },
  { month: 'Feb', score: 7.5 },
  { month: 'Mar', score: 6.8 },
  { month: 'Apr', score: 7.1 },
  { month: 'May', score: 7.4 },
  { month: 'Jun', score: 8.2 },
  { month: 'Jul', score: 8.0 },
];

const departmentSentiment = [
  { name: 'Engineering', score: 8.4, status: 'up', change: '+0.3' },
  { name: 'Marketing', score: 7.9, status: 'up', change: '+0.5' },
  { name: 'Sales', score: 7.2, status: 'down', change: '-0.2' },
  { name: 'Customer Support', score: 6.5, status: 'down', change: '-0.8' },
  { name: 'HR', score: 8.1, status: 'up', change: '+0.4' }
];

const conflictCases = [
  { 
    id: 'CF001',
    title: 'Communication Issue Between Teams',
    departments: ['Engineering', 'Product'],
    severity: 'Medium',
    status: 'Open',
    aiRecommendation: 'Schedule a facilitated workshop to align team expectations and create formal communication channels.'
  },
  { 
    id: 'CF002',
    title: 'Disagreement on Project Timeline',
    departments: ['Marketing', 'Sales'],
    severity: 'High',
    status: 'In Progress',
    aiRecommendation: 'Review project timeline with both teams present, establish flexible milestones and accountability measures.'
  },
  { 
    id: 'CF003',
    title: 'Resource Allocation Dispute',
    departments: ['HR', 'Finance'],
    severity: 'Low',
    status: 'Resolved',
    aiRecommendation: 'Implement transparent resource allocation process with quarterly reviews.'
  },
];

const EmployeeRelations = () => {
  const [activeTab, setActiveTab] = useState("sentiment");
  const { toast } = useToast();

  const handleAnalysisRun = () => {
    toast({
      title: "Sentiment Analysis Running",
      description: "Analyzing employee communications and survey data...",
      duration: 3000,
    });
  };

  const handleConflictAIRecommendation = () => {
    toast({
      title: "AI Recommendations Generated",
      description: "New conflict resolution recommendations have been generated.",
      duration: 3000,
    });
  };

  const chartConfig = {
    sentiment: {
      label: "Employee Sentiment",
      theme: {
        light: "#4f46e5",
        dark: "#818cf8"
      }
    }
  };

  return (
    <AppLayout>
      <div className="container py-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Employee Relations & Culture</h1>
          <Button onClick={handleAnalysisRun} className="bg-primary">
            Run Analysis
          </Button>
        </div>

        <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-4">
            <TabsTrigger value="sentiment">AI Sentiment Analysis</TabsTrigger>
            <TabsTrigger value="conflicts">Conflict Resolution</TabsTrigger>
          </TabsList>
          
          <TabsContent value="sentiment" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Employee Sentiment Trends</CardTitle>
                <CardDescription>
                  AI-driven analysis of employee morale based on feedback surveys and communication.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ChartContainer config={chartConfig}>
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={sentimentData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis domain={[5, 10]} />
                        <ChartTooltip 
                          content={({ payload, label }) => 
                            payload && payload.length ? (
                              <ChartTooltipContent>
                                <div className="px-2 py-1">
                                  <p className="font-medium">{label}</p>
                                  <p>Sentiment: {payload[0].value}</p>
                                </div>
                              </ChartTooltipContent>
                            ) : null
                          }
                        />
                        <Legend />
                        <Line 
                          type="monotone" 
                          dataKey="score" 
                          name="Sentiment Score" 
                          strokeWidth={2} 
                          dot={{ r: 4 }}
                          activeDot={{ r: 6 }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </div>

                <Separator className="my-6" />

                <div>
                  <h3 className="text-lg font-medium mb-4">Department Sentiment</h3>
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {departmentSentiment.map((dept) => (
                      <Card key={dept.name}>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-base font-medium">{dept.name}</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="flex justify-between items-center">
                            <span className="text-2xl font-bold">{dept.score}</span>
                            <Badge 
                              variant={dept.status === 'up' ? "default" : "destructive"}
                              className="flex items-center"
                            >
                              {dept.status === 'up' ? <ArrowUp className="w-3 h-3 mr-1" /> : <ArrowDown className="w-3 h-3 mr-1" />}
                              {dept.change}
                            </Badge>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="conflicts" className="space-y-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Automated Conflict Resolution</CardTitle>
                  <CardDescription>
                    AI-powered analysis and recommendations for dispute handling.
                  </CardDescription>
                </div>
                <Button onClick={handleConflictAIRecommendation}>Generate AI Recommendations</Button>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {conflictCases.map((conflict) => (
                    <Card key={conflict.id} className="overflow-hidden">
                      <CardHeader className="bg-muted/50 pb-3">
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-lg">{conflict.title}</CardTitle>
                          <Badge 
                            variant={
                              conflict.status === 'Open' ? "outline" : 
                              conflict.status === 'In Progress' ? "secondary" : "default"
                            }
                          >
                            {conflict.status}
                          </Badge>
                        </div>
                        <div className="flex gap-2 mt-2">
                          {conflict.departments.map((dept) => (
                            <Badge key={dept} variant="outline">{dept}</Badge>
                          ))}
                        </div>
                      </CardHeader>
                      <CardContent className="pt-4">
                        <div className="flex items-start mb-3">
                          <div className={`p-1.5 rounded-full mr-3 ${
                            conflict.severity === 'High' ? 'bg-red-100' : 
                            conflict.severity === 'Medium' ? 'bg-yellow-100' : 'bg-green-100'
                          }`}>
                            <AlertTriangle className={`w-4 h-4 ${
                              conflict.severity === 'High' ? 'text-red-500' : 
                              conflict.severity === 'Medium' ? 'text-yellow-500' : 'text-green-500'
                            }`} />
                          </div>
                          <div>
                            <p className="text-sm font-medium">Severity: {conflict.severity}</p>
                            <p className="text-sm text-muted-foreground">Case ID: {conflict.id}</p>
                          </div>
                        </div>
                        <Separator className="my-3" />
                        <div>
                          <h4 className="text-sm font-medium flex items-center mb-2">
                            <TrendingUp className="w-4 h-4 mr-2" />
                            AI Recommendation
                          </h4>
                          <p className="text-sm text-muted-foreground">
                            {conflict.aiRecommendation}
                          </p>
                        </div>
                        {conflict.status !== 'Resolved' && (
                          <div className="flex justify-end mt-4">
                            <Button variant="outline" size="sm" className="mr-2">Reject</Button>
                            <Button size="sm">Apply Recommendation</Button>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
};

export default EmployeeRelations;
