'use client';

import React from 'react';
import { useAuth } from '@/app/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import {
  Users,
  Calendar,
  FileText,
  BarChart3,
  Settings,
  UserPlus,
  Clock,
  Heart,
  Shield,
  CalendarDays,
  User,
  Stethoscope
} from 'lucide-react';

interface SidebarProps {
  className?: string;
}

export const Sidebar: React.FC<SidebarProps> = ({ className }) => {
  const { user } = useAuth();

  const getNavigationItems = () => {
    switch (user?.role) {
      case 'super_admin':
        return [
          { icon: BarChart3, label: 'Dashboard', path: '/dashboard' },
          { icon: Users, label: 'All Therapists', path: '/therapists' },
          { icon: User, label: 'All Patients', path: '/patients' },
          { icon: Calendar, label: 'All Appointments', path: '/appointments' },
          { icon: FileText, label: 'Reports', path: '/reports' },
          { icon: Settings, label: 'System Settings', path: '/settings' },
        ];
      case 'therapist':
        return [
          { icon: BarChart3, label: 'Dashboard', path: '/dashboard' },
          { icon: Users, label: 'My Patients', path: '/patients' },
          { icon: UserPlus, label: 'Add Patient', path: '/patients/new' },
          { icon: Calendar, label: 'My Schedule', path: '/schedule' },
          { icon: CalendarDays, label: 'Appointments', path: '/appointments' },
          { icon: FileText, label: 'Patient Notes', path: '/notes' },
          { icon: Settings, label: 'My Settings', path: '/settings' },
        ];
      case 'patient':
        return [
          { icon: Heart, label: 'My Health', path: '/dashboard' },
          { icon: Stethoscope, label: 'My Therapist', path: '/therapist' },
          { icon: Calendar, label: 'My Appointments', path: '/appointments' },
          { icon: Clock, label: 'Book Appointment', path: '/book' },
          { icon: User, label: 'My Profile', path: '/profile' },
        ];
      default:
        return [];
    }
  };

  const navigationItems = getNavigationItems();

  return (
    <div className={cn('pb-12 w-64 bg-card border-r', className)}>
      <div className="space-y-4 py-4">
        <div className="px-3 py-2">
          <div className="flex items-center mb-2">
            <Shield className="mr-2 h-5 w-5 text-primary" />
            <h2 className="text-lg font-semibold">
              {user?.role === 'super_admin' && 'Admin Panel'}
              {user?.role === 'therapist' && 'Therapist Portal'}
              {user?.role === 'patient' && 'Patient Portal'}
            </h2>
          </div>
          <div className="space-y-1">
            {navigationItems.map((item) => (
              <Button
                key={item.path}
                variant="ghost"
                className="w-full justify-start"
                asChild
              >
                <a href={item.path}>
                  <item.icon className="mr-2 h-4 w-4" />
                  {item.label}
                </a>
              </Button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};