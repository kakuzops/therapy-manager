'use client';

import React from 'react';
import { useAuth } from './contexts/AuthContext';
import { LoginForm } from '@/app/(panel)/dashboard/components/auth/LoginForm';
import { DashboardLayout } from '@/app/components/dashboard/DashboardLayout';
import { LoadingSpinner } from '@/app/(panel)/dashboard/components/ui/loading-spinner';

export default function Home() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return user ? <DashboardLayout /> : <LoginForm />;
}