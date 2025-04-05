
import React from 'react';
import { cn } from '@/lib/utils';
import { 
  Avatar, 
  AvatarFallback, 
  AvatarImage 
} from "@/components/ui/avatar";
import { formatDistanceToNow } from 'date-fns';
import { Activity } from '@/data/mockData';
import { 
  FileText, 
  UserPlus, 
  Star, 
  ClipboardCheck, 
  Calendar 
} from 'lucide-react';

interface RecentActivityProps {
  activities: Activity[];
  className?: string;
}

export function RecentActivity({ activities, className }: RecentActivityProps) {
  return (
    <div className={cn("space-y-6", className)}>
      <h3 className="text-lg font-semibold">Recent Activity</h3>
      <div className="space-y-4">
        {activities.map((activity) => (
          <ActivityItem key={activity.id} activity={activity} />
        ))}
      </div>
    </div>
  );
}

function ActivityItem({ activity }: { activity: Activity }) {
  const getActivityIcon = (type: Activity['type']) => {
    switch (type) {
      case 'application':
        return <FileText className="h-4 w-4" />;
      case 'hire':
        return <UserPlus className="h-4 w-4" />;
      case 'review':
        return <Star className="h-4 w-4" />;
      case 'onboarding':
        return <ClipboardCheck className="h-4 w-4" />;
      case 'interview':
        return <Calendar className="h-4 w-4" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };

  const getActivityColor = (type: Activity['type']) => {
    switch (type) {
      case 'application':
        return 'bg-blue-100 text-blue-600';
      case 'hire':
        return 'bg-green-100 text-green-600';
      case 'review':
        return 'bg-yellow-100 text-yellow-600';
      case 'onboarding':
        return 'bg-purple-100 text-purple-600';
      case 'interview':
        return 'bg-indigo-100 text-indigo-600';
      default:
        return 'bg-gray-100 text-gray-600';
    }
  };

  const userInitials = activity.user.split(' ').map(n => n[0]).join('');
  const timeAgo = formatDistanceToNow(new Date(activity.timestamp), { addSuffix: true });
  
  return (
    <div className="flex items-start space-x-4">
      <Avatar className="h-9 w-9">
        <AvatarImage src={activity.avatar} alt={activity.user} />
        <AvatarFallback>{userInitials}</AvatarFallback>
      </Avatar>
      
      <div className="space-y-1 flex-1">
        <div className="flex items-center justify-between">
          <div className="font-medium text-sm">
            <span className="font-bold">{activity.user}</span> {activity.description}
          </div>
          <div className="text-xs text-muted-foreground">
            {timeAgo}
          </div>
        </div>
        <div className="flex items-center space-x-1 text-xs">
          <div className={cn("p-1 rounded-md", getActivityColor(activity.type))}>
            {getActivityIcon(activity.type)}
          </div>
          <span className="capitalize">{activity.type}</span>
        </div>
      </div>
    </div>
  );
}
