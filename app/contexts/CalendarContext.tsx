'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAuth } from './AuthContext';

interface Appointment {
  id: string;
  patientId?: string;
  therapistId?: string;
  patientName?: string;
  therapistName?: string;
  date: Date;
  startTime: string;
  endTime: string;
  duration: string;
  type: 'in-person' | 'virtual' | 'phone';
  status: 'scheduled' | 'completed' | 'cancelled';
  location?: string;
  notes?: string;
  avatar?: string;
  googleEventId?: string;
  createdAt: Date;
  updatedAt: Date;
}

interface CalendarContextType {
  appointments: Appointment[];
  loading: boolean;
  error: string | null;
  isGoogleConnected: boolean;
  lastSyncTime: Date | null;
  syncStatus: 'idle' | 'syncing' | 'success' | 'error';
  
  // Appointment management
  createAppointment: (appointmentData: Partial<Appointment>) => Promise<Appointment>;
  updateAppointment: (id: string, appointmentData: Partial<Appointment>) => Promise<Appointment>;
  deleteAppointment: (id: string) => Promise<void>;
  getAppointment: (id: string) => Appointment | undefined;
  
  // Google Calendar integration
  connectGoogle: () => Promise<void>;
  disconnectGoogle: () => Promise<void>;
  syncWithGoogle: () => Promise<void>;
  
  // Filtering and search
  getAppointmentsByDate: (date: Date) => Appointment[];
  getAppointmentsByDateRange: (startDate: Date, endDate: Date) => Appointment[];
}

const CalendarContext = createContext<CalendarContextType | undefined>(undefined);

export const useCalendar = () => {
  const context = useContext(CalendarContext);
  if (context === undefined) {
    throw new Error('useCalendar must be used within a CalendarProvider');
  }
  return context;
};

interface CalendarProviderProps {
  children: ReactNode;
}

export const CalendarProvider: React.FC<CalendarProviderProps> = ({ children }) => {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isGoogleConnected, setIsGoogleConnected] = useState(false);
  const [lastSyncTime, setLastSyncTime] = useState<Date | null>(null);
  const [syncStatus, setSyncStatus] = useState<'idle' | 'syncing' | 'success' | 'error'>('idle');

  // Load initial data
  useEffect(() => {
    if (user) {
      loadAppointments();
      checkGoogleConnection();
    }
  }, [user]);

  const loadAppointments = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Simulate API call - replace with actual API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock data based on user role
      const mockAppointments: Appointment[] = generateMockAppointments(user?.role || 'patient');
      setAppointments(mockAppointments);
    } catch (err) {
      setError('Failed to load appointments');
    } finally {
      setLoading(false);
    }
  };

  const generateMockAppointments = (userRole: string): Appointment[] => {
    const now = new Date();
    const appointments: Appointment[] = [];

    // Generate appointments for the next 30 days
    for (let i = 0; i < 30; i++) {
      const date = new Date(now);
      date.setDate(date.getDate() + i);
      
      // Skip weekends for some appointments
      if (date.getDay() === 0 || date.getDay() === 6) continue;
      
      // Random chance of having appointments
      if (Math.random() > 0.3) continue;

      const startHour = 9 + Math.floor(Math.random() * 8); // 9 AM to 5 PM
      const startTime = `${startHour.toString().padStart(2, '0')}:00`;
      const endTime = `${startHour.toString().padStart(2, '0')}:50`;

      const types: ('in-person' | 'virtual' | 'phone')[] = ['in-person', 'virtual', 'phone'];
      const statuses: ('scheduled' | 'completed' | 'cancelled')[] = ['scheduled', 'completed', 'cancelled'];
      
      const appointment: Appointment = {
        id: `apt-${i}-${Date.now()}`,
        date,
        startTime,
        endTime,
        duration: '50',
        type: types[Math.floor(Math.random() * types.length)],
        status: i < 5 ? 'scheduled' : statuses[Math.floor(Math.random() * statuses.length)],
        location: 'Room 203',
        notes: 'Regular therapy session',
        createdAt: new Date(),
        updatedAt: new Date()
      };

      if (userRole === 'patient') {
        appointment.therapistName = 'Dr. Sarah Johnson';
        appointment.therapistId = 'therapist-1';
        appointment.avatar = 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=40&h=40&fit=crop&crop=face';
      } else {
        const patients = [
          { name: 'John Smith', id: 'patient-1', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=40&h=40&fit=crop&crop=face' },
          { name: 'Sarah Johnson', id: 'patient-2', avatar: 'https://images.unsplash.com/photo-1494790108755-2616b056b88?w=40&h=40&fit=crop&crop=face' },
          { name: 'Michael Davis', id: 'patient-3', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face' },
        ];
        const patient = patients[Math.floor(Math.random() * patients.length)];
        appointment.patientName = patient.name;
        appointment.patientId = patient.id;
        appointment.avatar = patient.avatar;
      }

      appointments.push(appointment);
    }

    return appointments.sort((a, b) => a.date.getTime() - b.date.getTime());
  };

  const checkGoogleConnection = async () => {
    // Simulate checking Google Calendar connection
    const connected = localStorage.getItem('googleCalendarConnected') === 'true';
    setIsGoogleConnected(connected);
    
    if (connected) {
      const lastSync = localStorage.getItem('lastGoogleSync');
      if (lastSync) {
        setLastSyncTime(new Date(lastSync));
      }
    }
  };

  const createAppointment = async (appointmentData: Partial<Appointment>): Promise<Appointment> => {
    setLoading(true);
    setError(null);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const newAppointment: Appointment = {
        id: `apt-${Date.now()}`,
        patientId: appointmentData.patientId || 'patient-1',
        therapistId: appointmentData.therapistId || 'therapist-1',
        patientName: appointmentData.patientName || 'New Patient',
        therapistName: appointmentData.therapistName || 'Dr. Sarah Johnson',
        date: appointmentData.date || new Date(),
        startTime: appointmentData.startTime || '10:00',
        endTime: appointmentData.endTime || '10:50',
        duration: appointmentData.duration || '50',
        type: appointmentData.type || 'in-person',
        status: appointmentData.status || 'scheduled',
        location: appointmentData.location || '',
        notes: appointmentData.notes || '',
        avatar: appointmentData.avatar || '',
        createdAt: new Date(),
        updatedAt: new Date(),
        ...appointmentData
      };
      
      setAppointments(prev => [...prev, newAppointment].sort((a, b) => a.date.getTime() - b.date.getTime()));
      
      // Sync with Google Calendar if connected
      if (isGoogleConnected) {
        await syncAppointmentWithGoogle(newAppointment);
      }
      
      return newAppointment;
    } catch (err) {
      setError('Failed to create appointment');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateAppointment = async (id: string, appointmentData: Partial<Appointment>): Promise<Appointment> => {
    setLoading(true);
    setError(null);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setAppointments(prev => prev.map(apt => 
        apt.id === id 
          ? { ...apt, ...appointmentData, updatedAt: new Date() }
          : apt
      ));
      
      const updatedAppointment = appointments.find(apt => apt.id === id);
      if (!updatedAppointment) throw new Error('Appointment not found');
      
      // Sync with Google Calendar if connected
      if (isGoogleConnected) {
        await syncAppointmentWithGoogle({ ...updatedAppointment, ...appointmentData });
      }
      
      return { ...updatedAppointment, ...appointmentData };
    } catch (err) {
      setError('Failed to update appointment');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteAppointment = async (id: string): Promise<void> => {
    setLoading(true);
    setError(null);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const appointment = appointments.find(apt => apt.id === id);
      if (appointment && isGoogleConnected && appointment.googleEventId) {
        // Delete from Google Calendar
        await deleteGoogleCalendarEvent(appointment.googleEventId);
      }
      
      setAppointments(prev => prev.filter(apt => apt.id !== id));
    } catch (err) {
      setError('Failed to delete appointment');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const getAppointment = (id: string): Appointment | undefined => {
    return appointments.find(apt => apt.id === id);
  };

  const connectGoogle = async (): Promise<void> => {
    setLoading(true);
    setError(null);
    
    try {
      // Simulate Google OAuth flow
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // In a real implementation, this would:
      // 1. Open Google OAuth popup
      // 2. Get authorization code
      // 3. Exchange for access token
      // 4. Store tokens securely
      
      localStorage.setItem('googleCalendarConnected', 'true');
      setIsGoogleConnected(true);
      
      // Initial sync
      await syncWithGoogle();
    } catch (err) {
      setError('Failed to connect to Google Calendar');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const disconnectGoogle = async (): Promise<void> => {
    setLoading(true);
    setError(null);
    
    try {
      // Simulate disconnection
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      localStorage.removeItem('googleCalendarConnected');
      localStorage.removeItem('lastGoogleSync');
      setIsGoogleConnected(false);
      setLastSyncTime(null);
      
      // Remove Google event IDs from appointments
      setAppointments(prev => prev.map(apt => ({ ...apt, googleEventId: undefined })));
    } catch (err) {
      setError('Failed to disconnect from Google Calendar');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const syncWithGoogle = async (): Promise<void> => {
    if (!isGoogleConnected) return;
    
    setSyncStatus('syncing');
    setError(null);
    
    try {
      // Simulate sync process
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // In a real implementation, this would:
      // 1. Fetch events from Google Calendar
      // 2. Compare with local appointments
      // 3. Create/update/delete as needed
      // 4. Handle conflicts
      
      const now = new Date();
      setLastSyncTime(now);
      localStorage.setItem('lastGoogleSync', now.toISOString());
      setSyncStatus('success');
      
      // Reset status after 3 seconds
      setTimeout(() => setSyncStatus('idle'), 3000);
    } catch (err) {
      setError('Failed to sync with Google Calendar');
      setSyncStatus('error');
      throw err;
    }
  };

  const syncAppointmentWithGoogle = async (appointment: Appointment): Promise<void> => {
    if (!isGoogleConnected) return;
    
    try {
      // Simulate creating/updating Google Calendar event
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // In a real implementation, this would use Google Calendar API
      const googleEventId = `google-event-${appointment.id}`;
      
      // Update appointment with Google event ID
      setAppointments(prev => prev.map(apt => 
        apt.id === appointment.id 
          ? { ...apt, googleEventId }
          : apt
      ));
    } catch (err) {
      console.error('Failed to sync appointment with Google Calendar:', err);
    }
  };

  const deleteGoogleCalendarEvent = async (googleEventId: string): Promise<void> => {
    if (!isGoogleConnected) return;
    
    try {
      // Simulate deleting Google Calendar event
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // In a real implementation, this would use Google Calendar API
      console.log('Deleted Google Calendar event:', googleEventId);
    } catch (err) {
      console.error('Failed to delete Google Calendar event:', err);
    }
  };

  const getAppointmentsByDate = (date: Date): Appointment[] => {
    return appointments.filter(apt => 
      apt.date.toDateString() === date.toDateString()
    );
  };

  const getAppointmentsByDateRange = (startDate: Date, endDate: Date): Appointment[] => {
    return appointments.filter(apt => 
      apt.date >= startDate && apt.date <= endDate
    );
  };

  return (
    <CalendarContext.Provider value={{
      appointments,
      loading,
      error,
      isGoogleConnected,
      lastSyncTime,
      syncStatus,
      createAppointment,
      updateAppointment,
      deleteAppointment,
      getAppointment,
      connectGoogle,
      disconnectGoogle,
      syncWithGoogle,
      getAppointmentsByDate,
      getAppointmentsByDateRange
    }}>
      {children}
    </CalendarContext.Provider>
  );
};