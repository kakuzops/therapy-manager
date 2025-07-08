'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { LoadingSpinner } from '@/app/components/ui/loading-spinner';
import { useCalendar } from '@/app/contexts/CalendarContext';
import {
  Sync,
  ExternalLink,
  CheckCircle,
  AlertCircle,
  Settings,
  Unlink,
  Calendar
} from 'lucide-react';

export const GoogleCalendarSync: React.FC = () => {
  const { 
    isGoogleConnected, 
    syncWithGoogle, 
    connectGoogle, 
    disconnectGoogle,
    lastSyncTime,
    syncStatus 
  } = useCalendar();

  const [showDialog, setShowDialog] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleConnect = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // In a real implementation, this would open Google OAuth flow
      await connectGoogle();
      setShowDialog(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to connect to Google Calendar');
    } finally {
      setLoading(false);
    }
  };

  const handleDisconnect = async () => {
    setLoading(true);
    setError(null);
    
    try {
      await disconnectGoogle();
      setShowDialog(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to disconnect from Google Calendar');
    } finally {
      setLoading(false);
    }
  };

  const handleSync = async () => {
    setLoading(true);
    setError(null);
    
    try {
      await syncWithGoogle();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to sync with Google Calendar');
    } finally {
      setLoading(false);
    }
  };

  if (isGoogleConnected) {
    return (
      <div className="flex items-center space-x-2">
        <Button
          variant="outline"
          size="sm"
          onClick={handleSync}
          disabled={loading}
        >
          {loading ? (
            <LoadingSpinner size="sm" className="mr-2" />
          ) : (
            <Sync className="h-4 w-4 mr-2" />
          )}
          Sync
        </Button>

        <Dialog open={showDialog} onOpenChange={setShowDialog}>
          <DialogTrigger asChild>
            <Button variant="ghost" size="sm">
              <Settings className="h-4 w-4" />
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="flex items-center space-x-2">
                <Calendar className="h-5 w-5 text-green-600" />
                <span>Google Calendar Integration</span>
              </DialogTitle>
              <DialogDescription>
                Manage your Google Calendar connection and sync settings
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <div>
                    <p className="text-sm font-medium">Connected to Google Calendar</p>
                    <p className="text-xs text-muted-foreground">
                      {lastSyncTime ? `Last synced: ${lastSyncTime.toLocaleString()}` : 'Never synced'}
                    </p>
                  </div>
                </div>
                <Badge variant="outline" className="text-green-600 border-green-600">
                  Active
                </Badge>
              </div>

              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div className="space-y-3">
                <h4 className="text-sm font-medium">Sync Features</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center justify-between">
                    <span>Two-way sync</span>
                    <CheckCircle className="h-4 w-4 text-green-600" />
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Automatic updates</span>
                    <CheckCircle className="h-4 w-4 text-green-600" />
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Event notifications</span>
                    <CheckCircle className="h-4 w-4 text-green-600" />
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t">
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={handleDisconnect}
                  disabled={loading}
                  className="w-full"
                >
                  {loading ? (
                    <LoadingSpinner size="sm" className="mr-2" />
                  ) : (
                    <Unlink className="h-4 w-4 mr-2" />
                  )}
                  Disconnect Google Calendar
                </Button>
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setShowDialog(false)}>
                Close
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    );
  }

  return (
    <Dialog open={showDialog} onOpenChange={setShowDialog}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Calendar className="h-4 w-4 mr-2" />
          Connect Google
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Calendar className="h-5 w-5" />
            <span>Connect Google Calendar</span>
          </DialogTitle>
          <DialogDescription>
            Sync your appointments with Google Calendar for seamless scheduling
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <h4 className="text-sm font-medium mb-2">Benefits of connecting:</h4>
            <ul className="text-sm space-y-1 text-muted-foreground">
              <li>• Automatic two-way sync with your Google Calendar</li>
              <li>• Get notifications on all your devices</li>
              <li>• Never miss an appointment</li>
              <li>• Access your schedule anywhere</li>
            </ul>
          </div>

          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="text-xs text-muted-foreground">
            By connecting, you agree to allow TherapyScheduler to access your Google Calendar.
            You can disconnect at any time.
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setShowDialog(false)}>
            Cancel
          </Button>
          <Button onClick={handleConnect} disabled={loading}>
            {loading ? (
              <>
                <LoadingSpinner size="sm" className="mr-2" />
                Connecting...
              </>
            ) : (
              <>
                <ExternalLink className="h-4 w-4 mr-2" />
                Connect Google Calendar
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};