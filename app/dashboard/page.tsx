'use client';

import React from 'react';
import { useAuth } from '@/app/contexts/AuthContext';
import { DashboardLayout } from '@/app/components/dashboard/DashboardLayout';
import { LoadingSpinner } from '@/app/(panel)/dashboard/components/ui/loading-spinner';
import { redirect } from 'next/navigation';

export default function DashboardPage() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
        <div className="text-center">
          <LoadingSpinner size="lg" />
          <p className="mt-4 text-muted-foreground">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    redirect('/');
  }

  return <DashboardLayout />;
}