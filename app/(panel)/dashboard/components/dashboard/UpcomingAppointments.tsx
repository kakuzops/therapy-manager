'use client';

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Calendar, 
  Clock, 
  Video, 
  MapPin, 
  Phone,
  MoreHorizontal,
  Plus,
  AlertCircle
} from 'lucide-react';
import { format, isToday, isTomorrow, isThisWeek } from 'date-fns';

interface Appointment {
  id: string;
  patientName?: string;
  therapistName?: string;
  date: Date;
  startTime: string;
  endTime: string;
  duration: string;
  type: 'in-person' | 'virtual' | 'phone';
  status: 'scheduled' | 'confirmed' | 'pending';
  location?: string;
  avatar?: string;
  notes?: string;
}

interface UpcomingAppointmentsProps {
  appointments: Appointment[];
  userRole: 'super_admin' | 'therapist' | 'patient';
  maxItems?: number;
  showAddButton?: boolean;
}

export const UpcomingAppointments: React.FC<UpcomingAppointmentsProps> = ({
  appointments,
  userRole,
  maxItems = 5,
  showAddButton = true
}) => {
  const displayedAppointments = appointments.slice(0, maxItems);

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'virtual':
        return <Video className="h-4 w-4 text-blue-500" />;
      case 'phone':
        return <Phone className="h-4 w-4 text-green-500" />;
      case 'in-person':
      default:
        return <MapPin className="h-4 w-4 text-purple-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'scheduled':
      default:
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
    }
  };

  const getDateLabel = (date: Date) => {
    if (isToday(date)) return 'Today';
    if (isTomorrow(date)) return 'Tomorrow';
    if (isThisWeek(date)) return format(date, 'EEEE');
    return format(date, 'MMM d');
  };

  const getDisplayName = (appointment: Appointment) => {
    if (userRole === 'patient') return appointment.therapistName;
    return appointment.patientName;
  };

  const getDisplayRole = (appointment: Appointment) => {
    if (userRole === 'patient') return 'Therapist';
    return 'Patient';
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Upcoming Appointments</CardTitle>
            <CardDescription>
              {userRole === 'patient' ? 'Your scheduled sessions' : 'Scheduled appointments'}
            </CardDescription>
          </div>
          <div className="flex space-x-2">
            {showAddButton && (
              <Button size="sm">
                <Plus className="h-4 w-4 mr-2" />
                {userRole === 'patient' ? 'Book' : 'Schedule'}
              </Button>
            )}
            <Button variant="ghost" size="sm">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {displayedAppointments.length === 0 ? (
            <div className="text-center py-8">
              <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground mb-2">No upcoming appointments</p>
              {showAddButton && (
                <Button variant="outline" size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  {userRole === 'patient' ? 'Book your first session' : 'Schedule appointment'}
                </Button>
              )}
            </div>
          ) : (
            displayedAppointments.map((appointment) => (
              <div key={appointment.id} className="flex items-center space-x-4 p-4 rounded-lg border bg-card/50 hover:bg-card transition-colors">
                <Avatar className="h-12 w-12">
                  <AvatarImage src={appointment.avatar} alt={getDisplayName(appointment)} />
                  <AvatarFallback>
                    {getDisplayName(appointment)?.split(' ').map(n => n[0]).join('') || '??'}
                  </AvatarFallback>
                </Avatar>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="text-sm font-semibold text-foreground">
                      {getDisplayName(appointment)}
                    </h4>
                    <Badge variant="secondary" className={getStatusColor(appointment.status)}>
                      {appointment.status}
                    </Badge>
                  </div>
                  
                  <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                    <div className="flex items-center space-x-1">
                      <Calendar className="h-3 w-3" />
                      <span>{getDateLabel(appointment.date)}</span>
                    </div>
                    
                    <div className="flex items-center space-x-1">
                      <Clock className="h-3 w-3" />
                      <span>{appointment.startTime} - {appointment.endTime}</span>
                    </div>
                    
                    <div className="flex items-center space-x-1">
                      {getTypeIcon(appointment.type)}
                      <span className="capitalize">{appointment.type}</span>
                    </div>
                  </div>
                  
                  {appointment.location && (
                    <p className="text-xs text-muted-foreground mt-1">
                      📍 {appointment.location}
                    </p>
                  )}
                </div>
                
                <div className="flex flex-col space-y-1">
                  <Button variant="outline" size="sm">
                    {appointment.type === 'virtual' ? 'Join' : 'View'}
                  </Button>
                  {userRole !== 'patient' && (
                    <Button variant="ghost" size="sm">
                      Edit
                    </Button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
        
        {appointments.length > maxItems && (
          <div className="mt-4 text-center">
            <Button variant="ghost" size="sm">
              View all appointments
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};