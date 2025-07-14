'use client';

import React from 'react';
import { useAuth } from '@/app/contexts/AuthContext';
import { Header } from '@/app/(panel)/dashboard/components/layout/Header';
import { Sidebar } from '@/app/(panel)/dashboard/components/layout/Sidebar';
import { CalendarContent } from '@/app/(panel)/dashboard/components/calendar/CalendarContent';
import { LoadingSpinner } from '@/app/(panel)/dashboard/components/ui/loading-spinner';
import { redirect } from 'next/navigation';

export default function CalendarPage() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
        <div className="text-center">
          <LoadingSpinner size="lg" />
          <p className="mt-4 text-muted-foreground">Loading calendar...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    redirect('/');
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20">
      <Header />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-6 overflow-auto">
          <CalendarContent />
        </main>
      </div>
    </div>
  );
}