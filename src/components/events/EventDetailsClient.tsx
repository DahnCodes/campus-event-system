'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { AlertCircle } from 'lucide-react';
import api from '@/lib/api';
import type { Event } from '@/types/event';

interface EventMeta {
  isRegistered: boolean;
  slotsLeft: number;
}

interface EventDetailsResponse {
  success: boolean;
  event: Event;
  meta: EventMeta;
}

export default function EventDetailsClient({ eventId }: { eventId: string }) {
  const router = useRouter();
  const [event, setEvent] = useState<Event | null>(null);
  const [meta, setMeta] = useState<EventMeta | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isRegistering, setIsRegistering] = useState(false);
  const [registrationError, setRegistrationError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEventDetails = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const response = await api.get<EventDetailsResponse>(`/events/${eventId}`);

        if (response.data.success) {
          setEvent(response.data.event);
          setMeta(response.data.meta);
        } else {
          setError('Failed to load event details');
        }
      } catch (err: any) {
        if (err.response?.status === 404) {
          setError('Event not found');
        } else {
          setError(err.response?.data?.message || 'Failed to load event details');
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchEventDetails();
  }, [eventId]);

  const handleRegister = async () => {
    if (!event) return;

    try {
      setIsRegistering(true);
      setRegistrationError(null);

      const response = await api.post(`/events/register`, { eventId: event._id });

      if (response.data.success) {
        setMeta(prev => prev ? { ...prev, isRegistered: true, slotsLeft: prev.slotsLeft - 1 } : null);
        // Show success message or redirect
        alert('Successfully registered for the event!');
      }
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Failed to register for event';
      setRegistrationError(errorMessage);
    } finally {
      setIsRegistering(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl">
          <div className="space-y-6">
            {/* Header skeleton */}
            <div className="h-12 w-3/4 rounded bg-neutral-100"></div>
            {/* Content skeleton */}
            <div className="space-y-3">
              <div className="h-4 w-full rounded bg-neutral-100"></div>
              <div className="h-4 w-5/6 rounded bg-neutral-100"></div>
              <div className="h-4 w-4/6 rounded bg-neutral-100"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl">
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-50">
              <AlertCircle className="h-6 w-6 text-red-600" />
            </div>
            <h1 className="text-xl font-semibold text-neutral-900">{error}</h1>
            <Link
              href="/dashboard"
              className="mt-6 text-sm font-medium text-neutral-600 hover:text-neutral-900"
            >
              Back to Dashboard
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (!event || !meta) {
    return null;
  }

  return (
    <div className="min-h-screen bg-white px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-2xl">
        {/* Back button */}
        <Link
          href="/dashboard"
          className="mb-8 inline-flex text-sm font-medium text-neutral-600 transition-colors hover:text-neutral-900"
        >
          ← Back to Dashboard
        </Link>

        {/* Event Header */}
        <div className="mb-8">
          <h1 className="mb-2 text-4xl font-bold text-neutral-900">{event.title}</h1>
          <p className="text-lg text-neutral-600">{event.category}</p>
        </div>

        {/* Error banner */}
        {registrationError && (
          <div className="mb-6 flex gap-3 rounded-lg bg-red-50 px-4 py-3">
            <AlertCircle className="h-5 w-5 flex-shrink-0 text-red-600" />
            <p className="text-sm text-red-700">{registrationError}</p>
          </div>
        )}

        {/* Main content */}
        <div className="space-y-8">
          {/* Event description */}
          <div className="space-y-3 border-b border-neutral-200 pb-8">
            <h2 className="text-sm font-semibold text-neutral-900">About this event</h2>
            <p className="text-base leading-relaxed text-neutral-700">{event.description}</p>
          </div>

          {/* Event details grid */}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            {/* Date & Time */}
            <div className="border-b border-neutral-200 pb-6 sm:border-b-0">
              <p className="text-xs font-semibold uppercase tracking-wide text-neutral-500">Date & Time</p>
              <p className="mt-2 text-base text-neutral-900">
                {new Date(event.eventDate).toLocaleDateString('en-US', {
                  weekday: 'long',
                  month: 'long',
                  day: 'numeric',
                  year: 'numeric',
                })}
              </p>
              <p className="text-sm text-neutral-600">
                {new Date(event.eventDate).toLocaleTimeString('en-US', {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </p>
            </div>

            {/* Venue */}
            <div className="border-b border-neutral-200 pb-6 sm:border-b-0">
              <p className="text-xs font-semibold uppercase tracking-wide text-neutral-500">Venue</p>
              <p className="mt-2 text-base text-neutral-900">{event.venue}</p>
            </div>

            {/* Capacity */}
            <div className="border-b border-neutral-200 pb-6 sm:border-b-0">
              <p className="text-xs font-semibold uppercase tracking-wide text-neutral-500">Capacity</p>
              <p className="mt-2 text-base text-neutral-900">
                {event.registeredCount} / {event.capacity} attendees
              </p>
              <div className="mt-2 h-2 overflow-hidden rounded-full bg-neutral-200">
                <div
                  className="h-full bg-neutral-900 transition-all duration-300"
                  style={{ width: `${(event.registeredCount / event.capacity) * 100}%` }}
                ></div>
              </div>
            </div>

            {/* Slots left */}
            <div className="border-b border-neutral-200 pb-6 sm:border-b-0">
              <p className="text-xs font-semibold uppercase tracking-wide text-neutral-500">Slots Available</p>
              <p className="mt-2 text-base text-neutral-900">{meta.slotsLeft} remaining</p>
            </div>
          </div>

          {/* Organizer info */}
          <div className="border-t border-neutral-200 pt-8">
            <h2 className="mb-4 text-sm font-semibold text-neutral-900">Organizer</h2>
            <div className="flex flex-col space-y-2">
              <p className="text-base text-neutral-900">{event.organizerId.fullName}</p>
              <p className="text-sm text-neutral-600">{event.organizerId.email}</p>
            </div>
          </div>

          {/* Registration button */}
          <div className="border-t border-neutral-200 pt-8">
            {meta.isRegistered ? (
              <div className="rounded-lg border border-green-200 bg-green-50 px-4 py-3">
                <p className="text-sm font-medium text-green-900">You are registered for this event</p>
              </div>
            ) : meta.slotsLeft > 0 ? (
              <button
                onClick={handleRegister}
                disabled={isRegistering}
                className="w-full rounded-lg bg-neutral-900 px-6 py-3 font-medium text-white transition-colors hover:bg-neutral-800 disabled:bg-neutral-400 disabled:cursor-not-allowed"
              >
                {isRegistering ? 'Registering...' : 'Register for Event'}
              </button>
            ) : (
              <div className="rounded-lg border border-neutral-200 bg-neutral-50 px-4 py-3">
                <p className="text-sm font-medium text-neutral-600">This event is full</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
