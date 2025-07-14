'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { CalendarView } from '@/app/(panel)/dashboard/components/calendar/CalendarView';
import { AppointmentModal } from '@/app/(panel)/dashboard/components/calendar/AppointmentModal';
import { GoogleCalendarSync } from '@/app/(panel)/dashboard/components/calendar/GoogleCalendarSync';
import { useAuth } from '@/app/contexts/AuthContext';
import { useCalendar } from '@/app/contexts/CalendarContext';
import { Calendar, Plus, Filter, Download, Upload, Settings, Clock, Users, CheckCircle, AlertCircle, FolderSync as Sync, ExternalLink } from 'lucide-react';
import { format, startOfWeek, endOfWeek, startOfMonth, endOfMonth } from 'date-fns';

export const CalendarContent: React.FC = () => {
  const { user } = useAuth();
  const { 
    appointments, 
    loading, 
    syncWithGoogle, 
    isGoogleConnected,
    createAppointment,
    updateAppointment,
    deleteAppointment
  } = useCalendar();

  const [selectedDate, setSelectedDate] = useState(new Date());
  const [view, setView] = useState<'month' | 'week' | 'day'>('month');
  const [showAppointmentModal, setShowAppointmentModal] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [filterStatus, setFilterStatus] = useState<'all' | 'scheduled' | 'completed' | 'cancelled'>('all');

  // Get filtered appointments based on current view and filters
  const getFilteredAppointments = () => {
    let filtered = appointments;

    // Filter by status
    if (filterStatus !== 'all') {
      filtered = filtered.filter(apt => apt.status === filterStatus);
    }

    // Filter by date range based on view
    const now = new Date();
    switch (view) {
      case 'day':
        filtered = filtered.filter(apt => 
          format(apt.date, 'yyyy-MM-dd') === format(selectedDate, 'yyyy-MM-dd')
        );
        break;
      case 'week':
        const weekStart = startOfWeek(selectedDate);
        const weekEnd = endOfWeek(selectedDate);
        filtered = filtered.filter(apt => 
          apt.date >= weekStart && apt.date <= weekEnd
        );
        break;
      case 'month':
        const monthStart = startOfMonth(selectedDate);
        const monthEnd = endOfMonth(selectedDate);
        filtered = filtered.filter(apt => 
          apt.date >= monthStart && apt.date <= monthEnd
        );
        break;
    }

    return filtered;
  };

  const filteredAppointments = getFilteredAppointments();

  // Statistics for the current view
  const stats = {
    total: filteredAppointments.length,
    scheduled: filteredAppointments.filter(apt => apt.status === 'scheduled').length,
    completed: filteredAppointments.filter(apt => apt.status === 'completed').length,
    cancelled: filteredAppointments.filter(apt => apt.status === 'cancelled').length,
  };

  const handleAppointmentClick = (appointment: any) => {
    setSelectedAppointment(appointment);
    setShowAppointmentModal(true);
  };

  const handleNewAppointment = () => {
    setSelectedAppointment(null);
    setShowAppointmentModal(true);
  };

  const handleAppointmentSave = async (appointmentData: any) => {
    try {
      if (selectedAppointment) {
        await updateAppointment(selectedAppointment, appointmentData);
      } else {
        await createAppointment(appointmentData);
      }
      setShowAppointmentModal(false);
      setSelectedAppointment(null);
    } catch (error) {
      console.error('Failed to save appointment:', error);
    }
  };

  const handleAppointmentDelete = async (appointmentId: string) => {
    try {
      await deleteAppointment(appointmentId);
      setShowAppointmentModal(false);
      setSelectedAppointment(null);
    } catch (error) {
      console.error('Failed to delete appointment:', error);
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
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Calendar</h1>
          <p className="text-muted-foreground">
            {user?.role === 'patient' ? 'Your appointments and sessions' : 'Manage appointments and schedule'}
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <GoogleCalendarSync />
          <Button onClick={handleNewAppointment}>
            <Plus className="mr-2 h-4 w-4" />
            {user?.role === 'patient' ? 'Book Appointment' : 'New Appointment'}
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Appointments</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-xs text-muted-foreground">
              This {view}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Scheduled</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{stats.scheduled}</div>
            <p className="text-xs text-muted-foreground">
              Upcoming sessions
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.completed}</div>
            <p className="text-xs text-muted-foreground">
              Finished sessions
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Cancelled</CardTitle>
            <AlertCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{stats.cancelled}</div>
            <p className="text-xs text-muted-foreground">
              Cancelled sessions
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Calendar Controls */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Button
                  variant={view === 'month' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setView('month')}
                >
                  Month
                </Button>
                <Button
                  variant={view === 'week' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setView('week')}
                >
                  Week
                </Button>
                <Button
                  variant={view === 'day' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setView('day')}
                >
                  Day
                </Button>
              </div>

              <div className="flex items-center space-x-2">
                <Filter className="h-4 w-4 text-muted-foreground" />
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value as any)}
                  className="text-sm border rounded px-2 py-1 bg-background"
                >
                  <option value="all">All Status</option>
                  <option value="scheduled">Scheduled</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              {isGoogleConnected && (
                <Badge variant="outline" className="text-green-600 border-green-600">
                  <Sync className="h-3 w-3 mr-1" />
                  Google Synced
                </Badge>
              )}
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <CalendarView
            view={view}
            selectedDate={selectedDate}
            onDateChange={setSelectedDate}
            appointments={filteredAppointments}
            onAppointmentClick={handleAppointmentClick}
            userRole={user?.role || 'patient'}
          />
        </CardContent>
      </Card>

      {/* Appointment Modal */}
      {showAppointmentModal && (
        <AppointmentModal
          appointment={selectedAppointment}
          isOpen={showAppointmentModal}
          onClose={() => {
            setShowAppointmentModal(false);
            setSelectedAppointment(null);
          }}
          onSave={handleAppointmentSave}
          onDelete={selectedAppointment ? () => handleAppointmentDelete(selectedAppointment) : undefined}
          userRole={user?.role || 'patient'}
        />
      )}
    </div>
  );
};