
import React from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { StatCard } from '@/components/dashboard/StatCard';
import { DepartmentChart } from '@/components/dashboard/DepartmentChart';
import { HiringChart } from '@/components/dashboard/HiringChart';
import { RecentActivity } from '@/components/dashboard/RecentActivity';
import { CandidateCard } from '@/components/recruitment/CandidateCard';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Sparkles } from 'lucide-react';

import { 
  dashboardStats, 
  departmentDistribution, 
  monthlyHiring, 
  recentActivities,
  candidates
} from '@/data/mockData';
import { useNavigate } from 'react-router-dom';

const Index = () => {
  const topCandidates = candidates
    .sort((a, b) => (b.matchScore || 0) - (a.matchScore || 0))
    .slice(0, 3);
    
  const navigate = useNavigate();
  
  // Dummy handler functions for CandidateCard props
  const handleCandidateClick = (candidateId: string) => {
    navigate(`/recruitment?tab=candidates&id=${candidateId}`);
  };
  
  const handleScreenClick = (candidateId: string) => {
    navigate(`/recruitment?tab=candidates&feature=screen&id=${candidateId}`);
  };
  
  const handleInterviewClick = (candidateId: string) => {
    navigate(`/recruitment?tab=candidates&feature=interview&id=${candidateId}`);
  };
  
  const handleOfferClick = (candidateId: string) => {
    navigate(`/recruitment?tab=candidates&feature=offer&id=${candidateId}`);
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="h2">Dashboard</h1>
          <div className="flex gap-2">
            <Button variant="outline">Export</Button>
            <Button>
              <Sparkles className="w-4 h-4 mr-2" />
              AI Insights
            </Button>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {dashboardStats.map((stat) => (
            <StatCard key={stat.id} stat={stat} />
          ))}
        </div>
        
        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Department Distribution</CardTitle>
                  <CardDescription>Employee count by department</CardDescription>
                </div>
                <Badge variant="secondary">Total: 162</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <DepartmentChart data={departmentDistribution} />
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Monthly Hiring Overview</CardTitle>
                  <CardDescription>New hires vs attrition</CardDescription>
                </div>
                <Badge variant="outline" className="border-green-200 bg-green-100 text-green-700">
                  +38% Growth
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <HiringChart data={monthlyHiring} />
            </CardContent>
          </Card>
        </div>
        
        <div className="grid gap-6 md:grid-cols-3">
          <div className="md:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>AI Talent Recommendations</CardTitle>
                <CardDescription>
                  Top candidates based on AI matching algorithm
                </CardDescription>
              </CardHeader>
              <CardContent className="grid gap-4 sm:grid-cols-3">
                {topCandidates.map((candidate) => (
                  <CandidateCard 
                    key={candidate.id} 
                    candidate={candidate}
                    onScreenClick={() => handleScreenClick(candidate.id)}
                    onInterviewClick={() => handleInterviewClick(candidate.id)}
                    onOfferClick={() => handleOfferClick(candidate.id)}
                    onClick={() => handleCandidateClick(candidate.id)}
                  />
                ))}
              </CardContent>
            </Card>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <RecentActivity activities={recentActivities} />
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
};

export default Index;
