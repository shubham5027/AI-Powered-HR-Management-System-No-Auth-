
import React from 'react';
import { cn } from '@/lib/utils';
import { 
  ArrowUpIcon, 
  ArrowDownIcon, 
  ArrowRightIcon,
  Users,
  Briefcase,
  Clock,
  Smile,
  BarChart,
  DollarSign,
  AlertCircle,
  Calendar,
  CheckCircle,
  FileText,
  MessageSquare,
  Award
} from 'lucide-react';
import { DashboardStat } from '@/data/mockData';

interface StatCardProps {
  stat: DashboardStat;
  className?: string;
}

export function StatCard({ stat, className }: StatCardProps) {
  const IconComponent = getIconByName(stat.icon);
  
  const trendIcon = stat.trend === 'up' ? (
    <ArrowUpIcon className="h-4 w-4 text-green-500" />
  ) : stat.trend === 'down' ? (
    <ArrowDownIcon className="h-4 w-4 text-red-500" />
  ) : (
    <ArrowRightIcon className="h-4 w-4 text-gray-500" />
  );
  
  const trendText = stat.change ? (
    <span className={cn(
      'text-sm',
      stat.trend === 'up' ? 'text-green-500' : 
      stat.trend === 'down' ? 'text-red-500' : 'text-gray-500'
    )}>
      {stat.change > 0 ? '+' : ''}{stat.change}%
    </span>
  ) : null;

  return (
    <div className={cn("stat-card", className)}>
      <div className="flex justify-between items-start mb-4">
        <div className={cn(
          "p-3 rounded-lg", 
          stat.color === 'blue' ? 'bg-blue-100 text-blue-600' : 
          stat.color === 'indigo' ? 'bg-indigo-100 text-indigo-600' : 
          stat.color === 'green' ? 'bg-green-100 text-green-600' : 
          stat.color === 'red' ? 'bg-red-100 text-red-600' : 
          stat.color === 'yellow' ? 'bg-yellow-100 text-yellow-600' : 
          stat.color === 'purple' ? 'bg-purple-100 text-purple-600' : 
          'bg-gray-100 text-gray-600'
        )}>
          <IconComponent className="h-6 w-6" />
        </div>
      </div>
      <div className="space-y-1">
        <div className="text-sm font-medium text-muted-foreground">{stat.title}</div>
        <div className="text-2xl font-bold">{stat.value}</div>
        {stat.change !== undefined && (
          <div className="flex items-center space-x-1 text-sm">
            {trendIcon}
            {trendText}
            <span className="text-muted-foreground ml-1">from last month</span>
          </div>
        )}
      </div>
    </div>
  );
}

// Helper function to get the corresponding icon from the name
function getIconByName(iconName: string) {
  const iconMap: Record<string, React.ComponentType<any>> = {
    users: Users,
    briefcase: Briefcase,
    clock: Clock,
    smile: Smile,
    chart: BarChart,
    dollar: DollarSign,
    alert: AlertCircle,
    calendar: Calendar,
    check: CheckCircle,
    file: FileText,
    message: MessageSquare,
    award: Award,
  };

  return iconMap[iconName] || Users;
}
