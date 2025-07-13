'use client';

import React from 'react';
import { useAuth } from '@/app/contexts/AuthContext';
import { Header } from '@/app/(panel)/dashboard/components/layout/Header';
import { Sidebar } from '@/app/(panel)/dashboard/components/layout/Sidebar';
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
        return (
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-muted-foreground mb-2">
                Access Denied
              </h2>
              <p className="text-muted-foreground">
                Unknown user role or insufficient permissions
              </p>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20">
      <Header />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-6 overflow-auto">
          {renderDashboard()}
        </main>
      </div>
    </div>
  );
};