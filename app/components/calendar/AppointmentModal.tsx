'use client';

import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { LoadingSpinner } from '@/app/components/ui/loading-spinner';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Calendar,
  Clock,
  User,
  MapPin,
  Video,
  Phone,
  Save,
  Trash2,
  AlertCircle,
  CheckCircle
} from 'lucide-react';
import { format } from 'date-fns';

interface AppointmentModalProps {
  appointment?: any;
  isOpen: boolean;
  onClose: () => void;
  onSave: (appointmentData: any) => Promise<void>;
  onDelete?: () => Promise<void>;
  userRole: string;
}

export const AppointmentModal: React.FC<AppointmentModalProps> = ({
  appointment,
  isOpen,
  onClose,
  onSave,
  onDelete,
  userRole
}) => {
  const [formData, setFormData] = useState({
    patientName: '',
    therapistName: '',
    date: '',
    startTime: '',
    endTime: '',
    type: 'in-person' as 'in-person' | 'virtual' | 'phone',
    status: 'scheduled' as 'scheduled' | 'completed' | 'cancelled',
    location: '',
    notes: '',
    duration: '50'
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (appointment) {
      setFormData({
        patientName: appointment.patientName || '',
        therapistName: appointment.therapistName || '',
        date: format(appointment.date, 'yyyy-MM-dd'),
        startTime: appointment.startTime || '',
        endTime: appointment.endTime || '',
        type: appointment.type || 'in-person',
        status: appointment.status || 'scheduled',
        location: appointment.location || '',
        notes: appointment.notes || '',
        duration: appointment.duration || '50'
      });
    } else {
      // Reset form for new appointment
      setFormData({
        patientName: '',
        therapistName: '',
        date: format(new Date(), 'yyyy-MM-dd'),
        startTime: '10:00',
        endTime: '10:50',
        type: 'in-person',
        status: 'scheduled',
        location: '',
        notes: '',
        duration: '50'
      });
    }
    setError(null);
  }, [appointment, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Validate form
      if (!formData.date || !formData.startTime || !formData.endTime) {
        throw new Error('Please fill in all required fields');
      }

      if (userRole !== 'patient' && !formData.patientName) {
        throw new Error('Patient name is required');
      }

      if (userRole === 'patient' && !formData.therapistName) {
        throw new Error('Therapist name is required');
      }

      // Calculate end time based on duration if not manually set
      if (formData.duration && formData.startTime) {
        const [hours, minutes] = formData.startTime.split(':').map(Number);
        const startMinutes = hours * 60 + minutes;
        const endMinutes = startMinutes + parseInt(formData.duration);
        const endHours = Math.floor(endMinutes / 60);
        const endMins = endMinutes % 60;
        formData.endTime = `${endHours.toString().padStart(2, '0')}:${endMins.toString().padStart(2, '0')}`;
      }

      await onSave({
        ...formData,
        date: new Date(formData.date),
        id: appointment?.id
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!onDelete || !appointment) return;
    
    setLoading(true);
    try {
      await onDelete();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete appointment');
    } finally {
      setLoading(false);
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'virtual':
        return <Video className="h-4 w-4 text-blue-500" />;
      case 'phone':
        return <Phone className="h-4 w-4 text-green-500" />;
      case 'in-person':
      default:
        return <MapPin className="h-4 w-4 text-purple-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'completed':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'cancelled':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Calendar className="h-5 w-5" />
            <span>{appointment ? 'Edit Appointment' : 'New Appointment'}</span>
          </DialogTitle>
          <DialogDescription>
            {appointment ? 'Update appointment details' : 'Schedule a new appointment'}
          </DialogDescription>
        </DialogHeader>

        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Participants */}
          <div className="grid gap-4 md:grid-cols-2">
            {userRole !== 'patient' && (
              <div className="space-y-2">
                <Label htmlFor="patient">Patient *</Label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="patient"
                    value={formData.patientName}
                    onChange={(e) => setFormData(prev => ({ ...prev, patientName: e.target.value }))}
                    className="pl-10"
                    placeholder="Select or enter patient name"
                    required
                  />
                </div>
              </div>
            )}

            {userRole === 'patient' && (
              <div className="space-y-2">
                <Label htmlFor="therapist">Therapist *</Label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="therapist"
                    value={formData.therapistName}
                    onChange={(e) => setFormData(prev => ({ ...prev, therapistName: e.target.value }))}
                    className="pl-10"
                    placeholder="Select therapist"
                    required
                  />
                </div>
              </div>
            )}
          </div>

          {/* Date and Time */}
          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="date">Date *</Label>
              <Input
                id="date"
                type="date"
                value={formData.date}
                onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="startTime">Start Time *</Label>
              <Input
                id="startTime"
                type="time"
                value={formData.startTime}
                onChange={(e) => setFormData(prev => ({ ...prev, startTime: e.target.value }))}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="duration">Duration (minutes)</Label>
              <Select
                value={formData.duration}
                onValueChange={(value) => setFormData(prev => ({ ...prev, duration: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="30">30 minutes</SelectItem>
                  <SelectItem value="45">45 minutes</SelectItem>
                  <SelectItem value="50">50 minutes</SelectItem>
                  <SelectItem value="60">60 minutes</SelectItem>
                  <SelectItem value="90">90 minutes</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Type and Status */}
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="type">Appointment Type</Label>
              <Select
                value={formData.type}
                onValueChange={(value: any) => setFormData(prev => ({ ...prev, type: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="in-person">
                    <div className="flex items-center space-x-2">
                      <MapPin className="h-4 w-4 text-purple-500" />
                      <span>In-Person</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="virtual">
                    <div className="flex items-center space-x-2">
                      <Video className="h-4 w-4 text-blue-500" />
                      <span>Virtual</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="phone">
                    <div className="flex items-center space-x-2">
                      <Phone className="h-4 w-4 text-green-500" />
                      <span>Phone</span>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select
                value={formData.status}
                onValueChange={(value: any) => setFormData(prev => ({ ...prev, status: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="scheduled">Scheduled</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Location */}
          {formData.type === 'in-person' && (
            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <div className="relative">
                <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="location"
                  value={formData.location}
                  onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                  className="pl-10"
                  placeholder="Enter location or room number"
                />
              </div>
            </div>
          )}

          {/* Notes */}
          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
              placeholder="Add any additional notes..."
              rows={3}
            />
          </div>

          {/* Current Status Display */}
          {appointment && (
            <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
              <div className="flex items-center space-x-3">
                {getTypeIcon(formData.type)}
                <div>
                  <p className="text-sm font-medium">
                    {formData.date} at {formData.startTime}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {formData.duration} minutes • {formData.type}
                  </p>
                </div>
              </div>
              <Badge variant="secondary" className={getStatusColor(formData.status)}>
                {formData.status}
              </Badge>
            </div>
          )}
        </form>

        <DialogFooter className="flex justify-between">
          <div>
            {appointment && onDelete && (
              <Button
                type="button"
                variant="destructive"
                onClick={handleDelete}
                disabled={loading}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </Button>
            )}
          </div>
          <div className="flex space-x-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={handleSubmit} disabled={loading}>
              {loading ? (
                <>
                  <LoadingSpinner size="sm" className="mr-2" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  {appointment ? 'Update' : 'Create'}
                </>
              )}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};