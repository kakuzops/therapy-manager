'use client';

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import {
  Users,
  Calendar,
  Clock,
  Plus,
  FileText,
  TrendingUp,
  CheckCircle,
  XCircle,
  AlertCircle,
  Phone
} from 'lucide-react';

export const TherapistDashboard: React.FC = () => {
  // Mock data - replace with real data
  const stats = {
    totalPatients: 22,
    todayAppointments: 5,
    weeklyHours: 32,
    completionRate: 94
  };

  const todaySchedule = [
    {
      id: '1',
      patient: 'Sarah Johnson',
      time: '9:00 AM',
      duration: '50 min',
      status: 'scheduled',
      type: 'In-person',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b056b88?w=40&h=40&fit=crop&crop=face'
    },
    {
      id: '2',
      patient: 'Michael Davis',
      time: '10:00 AM',
      duration: '50 min',
      status: 'completed',
      type: 'Virtual',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face'
    },
    {
      id: '3',
      patient: 'Lisa Wilson',
      time: '11:00 AM',
      duration: '50 min',
      status: 'scheduled',
      type: 'In-person',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=40&h=40&fit=crop&crop=face'
    },
    {
      id: '4',
      patient: 'David Brown',
      time: '2:00 PM',
      duration: '50 min',
      status: 'scheduled',
      type: 'Virtual',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face'
    },
    {
      id: '5',
      patient: 'Emma Taylor',
      time: '3:00 PM',
      duration: '50 min',
      status: 'scheduled',
      type: 'In-person',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=40&h=40&fit=crop&crop=face'
    }
  ];

  const recentPatients = [
    {
      id: '1',
      name: 'Sarah Johnson',
      lastVisit: '2024-01-12',
      nextAppointment: '2024-01-15',
      status: 'Active',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b056b88?w=40&h=40&fit=crop&crop=face'
    },
    {
      id: '2',
      name: 'Michael Davis',
      lastVisit: '2024-01-10',
      nextAppointment: '2024-01-17',
      status: 'Active',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face'
    },
    {
      id: '3',
      name: 'Lisa Wilson',
      lastVisit: '2024-01-08',
      nextAppointment: '2024-01-15',
      status: 'Active',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=40&h=40&fit=crop&crop=face'
    }
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'scheduled': return <Clock className="h-4 w-4 text-blue-500" />;
      case 'completed': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'cancelled': return <XCircle className="h-4 w-4 text-red-500" />;
      default: return <AlertCircle className="h-4 w-4 text-gray-500" />;
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
          <h1 className="text-3xl font-bold">Therapist Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back, Dr. Sarah Johnson
          </p>
        </div>
        <div className="flex space-x-2">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add Patient
          </Button>
          <Button variant="outline">
            <FileText className="mr-2 h-4 w-4" />
            View Notes
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Patients</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalPatients}</div>
            <p className="text-xs text-muted-foreground">
              +3 from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Today's Appointments</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.todayAppointments}</div>
            <p className="text-xs text-muted-foreground">
              Next at 9:00 AM
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Weekly Hours</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.weeklyHours}</div>
            <p className="text-xs text-muted-foreground">
              Out of 40 hours
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completion Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.completionRate}%</div>
            <p className="text-xs text-muted-foreground">
              +2% from last week
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {/* Today's Schedule */}
        <Card>
          <CardHeader>
            <CardTitle>Today's Schedule</CardTitle>
            <CardDescription>
              Your appointments for today
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {todaySchedule.map((appointment) => (
                <div key={appointment.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={appointment.avatar} alt={appointment.patient} />
                      <AvatarFallback>{appointment.patient.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-medium">{appointment.patient}</p>
                      <p className="text-xs text-muted-foreground">
                        {appointment.duration} • {appointment.type}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(appointment.status)}
                      <span className="text-sm font-medium">{appointment.time}</span>
                    </div>
                    <Badge variant="secondary" className={getStatusColor(appointment.status)}>
                      {appointment.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Patients */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Patients</CardTitle>
            <CardDescription>
              Patients you've seen recently
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentPatients.map((patient) => (
                <div key={patient.id} className="flex items-center space-x-4">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={patient.avatar} alt={patient.name} />
                    <AvatarFallback>{patient.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium truncate">{patient.name}</p>
                      <Badge variant="outline">{patient.status}</Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Last visit: {patient.lastVisit}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Next: {patient.nextAppointment}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};