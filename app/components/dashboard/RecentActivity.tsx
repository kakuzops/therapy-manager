'use client';

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { 
  Calendar, 
  Clock, 
  CheckCircle, 
  XCircle, 
  AlertCircle,
  User,
  FileText,
  Phone,
  Video,
  MapPin,
  MoreHorizontal
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface ActivityItem {
  id: string;
  type: 'appointment' | 'note' | 'registration' | 'cancellation';
  title: string;
  description: string;
  timestamp: Date;
  user?: {
    name: string;
    avatar?: string;
    role: string;
  };
  status?: 'scheduled' | 'completed' | 'cancelled' | 'pending';
  metadata?: {
    appointmentType?: 'in-person' | 'virtual';
    location?: string;
  };
}

interface RecentActivityProps {
  activities: ActivityItem[];
  showAll?: boolean;
  maxItems?: number;
}

export const RecentActivity: React.FC<RecentActivityProps> = ({
  activities,
  showAll = false,
  maxItems = 5
}) => {
  const displayedActivities = showAll ? activities : activities.slice(0, maxItems);

  const getActivityIcon = (type: string, metadata?: any) => {
    switch (type) {
      case 'appointment':
        if (metadata?.appointmentType === 'virtual') {
          return <Video className="h-4 w-4 text-blue-500" />;
        }
        return <MapPin className="h-4 w-4 text-green-500" />;
      case 'note':
        return <FileText className="h-4 w-4 text-purple-500" />;
      case 'registration':
        return <User className="h-4 w-4 text-indigo-500" />;
      case 'cancellation':
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return <AlertCircle className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusBadge = (status?: string) => {
    if (!status) return null;

    const statusConfig = {
      scheduled: { color: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200', label: 'Scheduled' },
      completed: { color: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200', label: 'Completed' },
      cancelled: { color: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200', label: 'Cancelled' },
      pending: { color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200', label: 'Pending' },
    };

    const config = statusConfig[status as keyof typeof statusConfig];
    if (!config) return null;

    return (
      <Badge variant="secondary" className={config.color}>
        {config.label}
      </Badge>
    );
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>
              Latest updates and actions in the system
            </CardDescription>
          </div>
          <Button variant="ghost" size="sm">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {displayedActivities.length === 0 ? (
            <div className="text-center py-8">
              <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No recent activity</p>
            </div>
          ) : (
            displayedActivities.map((activity) => (
              <div key={activity.id} className="flex items-start space-x-4 p-3 rounded-lg border bg-card/50 hover:bg-card transition-colors">
                <div className="flex-shrink-0 mt-1">
                  {getActivityIcon(activity.type, activity.metadata)}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="text-sm font-medium text-foreground">
                      {activity.title}
                    </h4>
                    {getStatusBadge(activity.status)}
                  </div>
                  
                  <p className="text-sm text-muted-foreground mb-2">
                    {activity.description}
                  </p>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      {activity.user && (
                        <>
                          <Avatar className="h-6 w-6">
                            <AvatarImage src={activity.user.avatar} alt={activity.user.name} />
                            <AvatarFallback className="text-xs">
                              {activity.user.name.split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
                          </Avatar>
                          <span className="text-xs text-muted-foreground">
                            {activity.user.name}
                          </span>
                        </>
                      )}
                    </div>
                    
                    <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      <span>{formatDistanceToNow(activity.timestamp, { addSuffix: true })}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
        
        {!showAll && activities.length > maxItems && (
          <div className="mt-4 text-center">
            <Button variant="ghost" size="sm">
              View all activity
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};