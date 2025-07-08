export interface User {
  id: string;
  email: string;
  name: string;
  role: 'super_admin' | 'therapist' | 'patient';
  avatar?: string;
  phone?: string;
  bio?: string;
  createdAt: Date;
  isEmailVerified: boolean;
  therapistId?: string; // For patients - which therapist they're assigned to
}

export interface Therapist extends User {
  role: 'therapist';
  specialization: string;
  bio: string;
  schedule: {
    monday: { start: string; end: string; available: boolean };
    tuesday: { start: string; end: string; available: boolean };
    wednesday: { start: string; end: string; available: boolean };
    thursday: { start: string; end: string; available: boolean };
    friday: { start: string; end: string; available: boolean };
    saturday: { start: string; end: string; available: boolean };
    sunday: { start: string; end: string; available: boolean };
  };
  patientCount: number;
  googleCalendarId?: string;
}

export interface Patient extends User {
  role: 'patient';
  therapistId: string;
  dateOfBirth: Date;
  phoneNumber: string;
  emergencyContact: {
    name: string;
    phone: string;
    relationship: string;
  };
  medicalHistory: string[];
  notes: PatientNote[];
}

export interface PatientNote {
  id: string;
  patientId: string;
  therapistId: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Appointment {
  id: string;
  patientId: string;
  therapistId: string;
  date: Date;
  startTime: string;
  endTime: string;
  status: 'scheduled' | 'completed' | 'cancelled' | 'no_show';
  notes?: string;
  googleEventId?: string;
  createdAt: Date;
  updatedAt: Date;
}