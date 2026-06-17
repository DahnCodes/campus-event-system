'use client';

import { useState, useEffect } from 'react';
import api from '@/lib/api';
import TabNavigation from './TabNavigation';
import EventGrid from './EventGrid';
import OrganizerPromotionCard from './OrganizerPromotionCard';
import LoadingState from './LoadingState';
import type { Event } from '@/types/event';

type TabType = 'discover' | 'my-events' | 'created-events';

interface User {
  id: string;
  fullName: string;
  email: string;
  role: 'student' | 'organizer';
}

export default function DashboardClient() {
  const [activeTab, setActiveTab] = useState<TabType>('discover');
  const [events, setEvents] = useState<Event[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch user data on mount
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await api.get('/user/me');
        setUser(response.data.user);
      } catch (err) {
        console.error('[v0] Failed to fetch user:', err);
        // User data fetch failure is not critical
      }
    };

    fetchUser();
  }, []);

  // Fetch events based on active tab
  useEffect(() => {
    const fetchEvents = async () => {
      setLoading(true);
      setError(null);
      try {
        let endpoint = '/events';

        if (activeTab === 'my-events') {
          endpoint = '/user/me/events';
        } else if (activeTab === 'created-events') {
          endpoint = '/user/me/created-events';
        }

        const response = await api.get(endpoint);
        setEvents(response.data.events || []);
      } catch (err) {
        console.error('[v0] Failed to fetch events:', err);
        setError('Failed to load events. Please try again.');
        setEvents([]);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, [activeTab]);

  const handleBecomeOrganizer = async () => {
    try {
      const response = await api.post('/user/become-organizer');
      setUser(response.data.user);
    } catch (err) {
      console.error('Failed to become organizer:', err);
      setError('Failed to upgrade to organizer. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b border-neutral-200 px-6 py-12 sm:px-8">
        <div className="mx-auto max-w-6xl">
          <h1 className="text-4xl font-bold text-neutral-900 sm:text-5xl">Events</h1>
          {user && (
            <p className="mt-3 text-base text-neutral-600">
              Welcome back, <span className="font-medium text-neutral-900">{user.fullName}</span>
            </p>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-6xl px-6 py-8 sm:px-8">
        {/* Organizer Promotion Card */}
        {user && user.role === 'student' && (
        <div className="mb-8">
    <OrganizerPromotionCard onBecomeOrganizer={handleBecomeOrganizer} />
  </div>
        )}

        {/* Tab Navigation */}
        <div className="mb-8">
          <TabNavigation activeTab={activeTab} onTabChange={setActiveTab} />
        </div>

      


{/* Error State */}
        {error && (
          <div className="mb-6 rounded border border-red-200 bg-red-50 px-4 py-3">
            <p className="text-sm text-red-800">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-2 text-sm font-medium text-red-600 hover:text-red-700"
            >
              Try again
            </button>
          </div>
        )}

        {/* Loading State */}
        {loading ? (
          <LoadingState />
        ) : events.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16">
            <p className="text-lg text-neutral-600">No events found</p>
            <p className="mt-2 text-sm text-neutral-500">
              {activeTab === 'discover' && 'Check back soon for upcoming events'}
              {activeTab === 'my-events' && 'You haven&apos;t registered for any events yet'}
              {activeTab === 'created-events' && 'You haven&apos;t created any events yet'}
            </p>
          </div>
        ) : (
          <EventGrid events={events} />
        )}
      </main>
    </div>
  );
}
