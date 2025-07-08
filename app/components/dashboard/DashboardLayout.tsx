'use client';

import React from 'react';
import { useAuth } from '@/app/contexts/AuthContext';
import { Header } from '@/app/components/layout/Header';
import { Sidebar } from '@/app/components/layout/Sidebar';
import { SuperAdminDashboard } from './SuperAdminDashboard';
import { TherapistDashboard } from './TherapistDashboard';
import { PatientDashboard } from './PatientDashboard';

export const DashboardLayout: React.FC = () => {
  const { user } = useAuth();

  const renderDashboard = () => {
    switch (user?.role) {
      case 'super_admin':
        return <SuperAdminDashboard />;
      case 'therapist':
        return <TherapistDashboard />;
      case 'patient':
        return <PatientDashboard />;
      default:
        return <div>Unknown user role</div>;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-6">
          {renderDashboard()}
        </main>
      </div>
    </div>
  );
};