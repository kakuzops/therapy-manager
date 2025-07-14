'use client';

import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  ChevronLeft,
  ChevronRight,
  Video,
  MapPin,
  Phone,
  Clock,
  User
} from 'lucide-react';
import {
  format,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  addDays,
  addWeeks,
  addMonths,
  subDays,
  subWeeks,
  subMonths,
  isSameMonth,
  isSameDay,
  isToday,
  startOfDay,
  addHours,
  getHours
} from 'date-fns';

interface Appointment {
  id: string;
  patientName?: string;
  therapistName?: string;
  date: Date;
  startTime: string;
  endTime: string;
  type: 'in-person' | 'virtual' | 'phone';
  status: 'scheduled' | 'completed' | 'cancelled';
  avatar?: string;
  location?: string;
}

interface CalendarViewProps {
  view: 'month' | 'week' | 'day';
  selectedDate: Date;
  onDateChange: (date: Date) => void;
  appointments: Appointment[];
  onAppointmentClick: (appointment: Appointment) => void;
  userRole: string;
}

export const CalendarView: React.FC<CalendarViewProps> = ({
  view,
  selectedDate,
  onDateChange,
  appointments,
  onAppointmentClick,
  userRole
}) => {
  const navigatePrevious = () => {
    switch (view) {
      case 'month':
        onDateChange(subMonths(selectedDate, 1));
        break;
      case 'week':
        onDateChange(subWeeks(selectedDate, 1));
        break;
      case 'day':
        onDateChange(subDays(selectedDate, 1));
        break;
    }
  };

  const navigateNext = () => {
    switch (view) {
      case 'month':
        onDateChange(addMonths(selectedDate, 1));
        break;
      case 'week':
        onDateChange(addWeeks(selectedDate, 1));
        break;
      case 'day':
        onDateChange(addDays(selectedDate, 1));
        break;
    }
  };

  const getTitle = () => {
    switch (view) {
      case 'month':
        return format(selectedDate, 'MMMM yyyy');
      case 'week':
        const weekStart = startOfWeek(selectedDate);
        const weekEnd = endOfWeek(selectedDate);
        return `${format(weekStart, 'MMM d')} - ${format(weekEnd, 'MMM d, yyyy')}`;
      case 'day':
        return format(selectedDate, 'EEEE, MMMM d, yyyy');
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'virtual':
        return <Video className="h-3 w-3 text-blue-500" />;
      case 'phone':
        return <Phone className="h-3 w-3 text-green-500" />;
      case 'in-person':
      default:
        return <MapPin className="h-3 w-3 text-purple-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 border-blue-200';
      case 'completed':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 border-green-200';
      case 'cancelled':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200 border-gray-200';
    }
  };

  const getAppointmentsForDate = (date: Date) => {
    return appointments.filter(apt => isSameDay(apt.date, date));
  };

  const renderMonthView = () => {
    const monthStart = startOfMonth(selectedDate);
    const monthEnd = endOfMonth(selectedDate);
    const startDate = startOfWeek(monthStart);
    const endDate = endOfWeek(monthEnd);

    const rows = [];
    let days = [];
    let day = startDate;

    while (day <= endDate) {
      for (let i = 0; i < 7; i++) {
        const cloneDay = day;
        const dayAppointments = getAppointmentsForDate(day);
        
        days.push(
          <div
            key={day.toString()}
            className={`min-h-[120px] p-2 border border-border cursor-pointer hover:bg-muted/50 transition-colors ${
              !isSameMonth(day, monthStart) ? 'text-muted-foreground bg-muted/20' : ''
            } ${isToday(day) ? 'bg-primary/5 border-primary/20' : ''}`}
            onClick={() => onDateChange(cloneDay)}
          >
            <div className={`text-sm font-medium mb-1 ${isToday(day) ? 'text-primary' : ''}`}>
              {format(day, 'd')}
            </div>
            <div className="space-y-1">
              {dayAppointments.slice(0, 3).map((appointment) => (
                <div
                  key={appointment.id}
                  className={`text-xs p-1 rounded border cursor-pointer hover:opacity-80 ${getStatusColor(appointment.status)}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    onAppointmentClick(appointment);
                  }}
                >
                  <div className="flex items-center space-x-1">
                    {getTypeIcon(appointment.type)}
                    <span className="truncate">
                      {appointment.startTime} - {userRole === 'patient' ? appointment.therapistName : appointment.patientName}
                    </span>
                  </div>
                </div>
              ))}
              {dayAppointments.length > 3 && (
                <div className="text-xs text-muted-foreground">
                  +{dayAppointments.length - 3} more
                </div>
              )}
            </div>
          </div>
        );
        day = addDays(day, 1);
      }
      rows.push(
        <div key={day.toString()} className="grid grid-cols-7">
          {days}
        </div>
      );
      days = [];
    }

    return (
      <div className="space-y-0">
        {/* Week headers */}
        <div className="grid grid-cols-7 border-b">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
            <div key={day} className="p-3 text-sm font-medium text-center text-muted-foreground">
              {day}
            </div>
          ))}
        </div>
        {rows}
      </div>
    );
  };

  const renderWeekView = () => {
    const weekStart = startOfWeek(selectedDate);
    const days = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));
    const hours = Array.from({ length: 12 }, (_, i) => i + 8); // 8 AM to 7 PM

    return (
      <div className="space-y-0">
        {/* Day headers */}
        <div className="grid grid-cols-8 border-b">
          <div className="p-3"></div>
          {days.map((day) => (
            <div key={day.toString()} className="p-3 text-center">
              <div className={`text-sm font-medium ${isToday(day) ? 'text-primary' : ''}`}>
                {format(day, 'EEE')}
              </div>
              <div className={`text-lg font-bold ${isToday(day) ? 'text-primary' : ''}`}>
                {format(day, 'd')}
              </div>
            </div>
          ))}
        </div>

        {/* Time slots */}
        <div className="grid grid-cols-8 min-h-[600px]">
          {/* Time column */}
          <div className="border-r">
            {hours.map((hour) => (
              <div key={hour} className="h-16 p-2 border-b text-xs text-muted-foreground">
                {format(new Date().setHours(hour, 0, 0, 0), 'h:mm a')}
              </div>
            ))}
          </div>

          {/* Day columns */}
          {days.map((day) => (
            <div key={day.toString()} className="border-r relative">
              {hours.map((hour) => (
                <div key={hour} className="h-16 border-b hover:bg-muted/50 cursor-pointer"></div>
              ))}
              
              {/* Appointments for this day */}
              {getAppointmentsForDate(day).map((appointment) => {
                const startHour = parseInt(appointment.startTime.split(':')[0]);
                const startMinute = parseInt(appointment.startTime.split(':')[1]);
                const endHour = parseInt(appointment.endTime.split(':')[0]);
                const endMinute = parseInt(appointment.endTime.split(':')[1]);
                
                const top = ((startHour - 8) * 64) + (startMinute / 60 * 64);
                const height = ((endHour - startHour) * 64) + ((endMinute - startMinute) / 60 * 64);
                
                return (
                  <div
                    key={appointment.id}
                    className={`absolute left-1 right-1 rounded p-1 cursor-pointer hover:opacity-80 ${getStatusColor(appointment.status)}`}
                    style={{ top: `${top}px`, height: `${height}px` }}
                    onClick={() => onAppointmentClick(appointment)}
                  >
                    <div className="text-xs font-medium truncate">
                      {userRole === 'patient' ? appointment.therapistName : appointment.patientName}
                    </div>
                    <div className="text-xs opacity-75 flex items-center space-x-1">
                      {getTypeIcon(appointment.type)}
                      <span>{appointment.startTime}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderDayView = () => {
    const hours = Array.from({ length: 12 }, (_, i) => i + 8); // 8 AM to 7 PM
    const dayAppointments = getAppointmentsForDate(selectedDate);

    return (
      <div className="space-y-0">
        <div className="grid grid-cols-2 min-h-[600px]">
          {/* Time column */}
          <div className="border-r">
            {hours.map((hour) => (
              <div key={hour} className="h-16 p-3 border-b flex items-center">
                <span className="text-sm text-muted-foreground">
                  {format(new Date().setHours(hour, 0, 0, 0), 'h:mm a')}
                </span>
              </div>
            ))}
          </div>

          {/* Appointments column */}
          <div className="relative">
            {hours.map((hour) => (
              <div key={hour} className="h-16 border-b hover:bg-muted/50 cursor-pointer"></div>
            ))}
            
            {dayAppointments.map((appointment) => {
              const startHour = parseInt(appointment.startTime.split(':')[0]);
              const startMinute = parseInt(appointment.startTime.split(':')[1]);
              const endHour = parseInt(appointment.endTime.split(':')[0]);
              const endMinute = parseInt(appointment.endTime.split(':')[1]);
              
              const top = ((startHour - 8) * 64) + (startMinute / 60 * 64);
              const height = ((endHour - startHour) * 64) + ((endMinute - startMinute) / 60 * 64);
              
              return (
                <div
                  key={appointment.id}
                  className={`absolute left-2 right-2 rounded p-3 cursor-pointer hover:opacity-80 ${getStatusColor(appointment.status)}`}
                  style={{ top: `${top}px`, height: `${height}px` }}
                  onClick={() => onAppointmentClick(appointment)}
                >
                  <div className="flex items-center space-x-2 mb-1">
                    <Avatar className="h-6 w-6">
                      <AvatarImage src={appointment.avatar} />
                      <AvatarFallback className="text-xs">
                        {(userRole === 'patient' ? appointment.therapistName : appointment.patientName)?.split(' ').map(n => n[0]).join('') || '??'}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-sm font-medium">
                      {userRole === 'patient' ? appointment.therapistName : appointment.patientName}
                    </span>
                  </div>
                  <div className="text-xs opacity-75 flex items-center space-x-2">
                    <div className="flex items-center space-x-1">
                      <Clock className="h-3 w-3" />
                      <span>{appointment.startTime} - {appointment.endTime}</span>
                    </div>
                    {getTypeIcon(appointment.type)}
                  </div>
                  {appointment.location && (
                    <div className="text-xs opacity-75 mt-1">
                      📍 {appointment.location}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-4">
      {/* Navigation */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">{getTitle()}</h2>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm" onClick={navigatePrevious}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="sm" onClick={() => onDateChange(new Date())}>
            Today
          </Button>
          <Button variant="outline" size="sm" onClick={navigateNext}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="border rounded-lg overflow-hidden">
        {view === 'month' && renderMonthView()}
        {view === 'week' && renderWeekView()}
        {view === 'day' && renderDayView()}
      </div>
    </div>
  );
};