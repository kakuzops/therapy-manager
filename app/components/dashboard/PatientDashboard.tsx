'use client';

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import {
  Calendar,
  Clock,
  Heart,
  TrendingUp,
  Plus,
  Phone,
  Video,
  MapPin,
  CheckCircle,
  AlertCircle
} from 'lucide-react';

export const PatientDashboard: React.FC = () => {
  // Mock data - replace with real data
  const stats = {
    totalSessions: 18,
    nextAppointment: '2024-01-15',
    weeklyProgress: 78,
    therapistRating: 4.9
  };

  const therapist = {
    id: '1',
    name: 'Dr. Sarah Johnson',
    specialization: 'Cognitive Behavioral Therapy',
    email: 'sarah.johnson@clinic.com',
    phone: '+1 (555) 123-4567',
    rating: 4.9,
    avatar: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=80&h=80&fit=crop&crop=face'
  };

  const upcomingAppointments = [
    {
      id: '1',
      date: '2024-01-15',
      time: '10:00 AM',
      duration: '50 min',
      type: 'In-person',
      status: 'scheduled',
      location: 'Room 203'
    },
    {
      id: '2',
      date: '2024-01-22',
      time: '10:00 AM',
      duration: '50 min',
      type: 'Virtual',
      status: 'scheduled',
      location: 'Video Call'
    },
    {
      id: '3',
      date: '2024-01-29',
      time: '10:00 AM',
      duration: '50 min',
      type: 'In-person',
      status: 'scheduled',
      location: 'Room 203'
    }
  ];

  const recentSessions = [
    {
      id: '1',
      date: '2024-01-08',
      time: '10:00 AM',
      duration: '50 min',
      type: 'In-person',
      status: 'completed',
      notes: 'Made good progress on anxiety management techniques'
    },
    {
      id: '2',
      date: '2024-01-01',
      time: '10:00 AM',
      duration: '50 min',
      type: 'Virtual',
      status: 'completed',
      notes: 'Discussed coping strategies and homework assignments'
    },
    {
      id: '3',
      date: '2023-12-25',
      time: '10:00 AM',
      duration: '50 min',
      type: 'In-person',
      status: 'completed',
      notes: 'Holiday session - focused on stress management'
    }
  ];

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'Virtual': return <Video className="h-4 w-4 text-blue-500" />;
      case 'In-person': return <MapPin className="h-4 w-4 text-green-500" />;
      default: return <Calendar className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'completed': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'cancelled': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">My Health Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back, John! Here's your wellness overview.
          </p>
        </div>
        <div className="flex space-x-2">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Book Appointment
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Sessions</CardTitle>
            <Heart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalSessions}</div>
            <p className="text-xs text-muted-foreground">
              +2 this month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Next Appointment</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Jan 15</div>
            <p className="text-xs text-muted-foreground">
              10:00 AM with Dr. Johnson
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Weekly Progress</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.weeklyProgress}%</div>
            <Progress value={stats.weeklyProgress} className="h-2 mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Therapist Rating</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.therapistRating}</div>
            <p className="text-xs text-muted-foreground">
              ⭐ Excellent care
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {/* My Therapist */}
        <Card>
          <CardHeader>
            <CardTitle>My Therapist</CardTitle>
            <CardDescription>
              Your assigned mental health professional
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-4">
              <Avatar className="h-16 w-16">
                <AvatarImage src={therapist.avatar} alt={therapist.name} />
                <AvatarFallback>{therapist.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <h3 className="text-lg font-semibold">{therapist.name}</h3>
                <p className="text-sm text-muted-foreground">{therapist.specialization}</p>
                <div className="flex items-center space-x-1 mt-1">
                  <span className="text-sm">⭐ {therapist.rating}</span>
                  <span className="text-xs text-muted-foreground">rating</span>
                </div>
              </div>
            </div>
            <div className="mt-4 space-y-2">
              <div className="flex items-center space-x-2">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">{therapist.phone}</span>
              </div>
              <div className="flex space-x-2 mt-3">
                <Button size="sm" variant="outline">
                  <Phone className="mr-2 h-4 w-4" />
                  Call
                </Button>
                <Button size="sm" variant="outline">
                  <Video className="mr-2 h-4 w-4" />
                  Video Call
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Upcoming Appointments */}
        <Card>
          <CardHeader>
            <CardTitle>Upcoming Appointments</CardTitle>
            <CardDescription>
              Your scheduled sessions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {upcomingAppointments.map((appointment) => (
                <div key={appointment.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    {getTypeIcon(appointment.type)}
                    <div>
                      <p className="text-sm font-medium">{appointment.date}</p>
                      <p className="text-xs text-muted-foreground">
                        {appointment.time} • {appointment.duration}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {appointment.location}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge variant="secondary" className={getStatusColor(appointment.status)}>
                      {appointment.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Sessions */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Sessions</CardTitle>
          <CardDescription>
            Your completed therapy sessions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentSessions.map((session) => (
              <div key={session.id} className="flex items-start space-x-4 p-4 border rounded-lg">
                <div className="flex items-center space-x-2">
                  {getTypeIcon(session.type)}
                  <CheckCircle className="h-5 w-5 text-green-500" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium">{session.date}</p>
                    <Badge variant="secondary" className={getStatusColor(session.status)}>
                      {session.status}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {session.time} • {session.duration}
                  </p>
                  <p className="text-sm mt-2 text-muted-foreground">
                    {session.notes}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};