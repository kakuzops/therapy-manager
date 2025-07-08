import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { CalendarProvider } from './contexts/CalendarContext';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'TherapyScheduler - Patient Management System',
  description: 'Comprehensive patient registration and scheduling system for mental health professionals',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider>
          <AuthProvider>
            <CalendarProvider>
              {children}
            </CalendarProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}