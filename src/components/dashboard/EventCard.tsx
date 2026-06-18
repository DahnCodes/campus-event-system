'use client';

import Link from 'next/link';
import { format } from 'date-fns';
import type { Event } from '@/types/event';

interface EventCardProps {
  event: Event;
}

export default function EventCard({ event }: EventCardProps) {
  const eventDate = new Date(event.eventDate);
  const formattedDate = format(eventDate, 'MMM dd');
  const formattedTime = format(eventDate, 'h:mm a');
  const capacityPercentage = (event.registeredCount / event.capacity) * 100;
  const spotsRemaining = event.capacity - event.registeredCount;

  return (
    <Link href={`/events/${event._id}`}>
      <div className="group relative flex flex-col overflow-hidden rounded-lg border border-neutral-200 bg-white transition-all hover:border-neutral-300 hover:shadow-sm">
      {/* Cover Image */}
      {event.coverImage && (
        <div className="relative aspect-video overflow-hidden bg-neutral-100">
          <img
            src={event.coverImage}
            alt={event.title}
            className="h-full w-full object-cover transition-transform group-hover:scale-105"
          />
        </div>
      )}

      {/* Content */}
      <div className="flex flex-1 flex-col gap-3 px-4 py-4 sm:px-5 sm:py-5">
        {/* Category Badge */}
        {event.category && (
          <div className="inline-flex w-fit rounded bg-neutral-100 px-2.5 py-1">
            <span className="text-xs font-medium text-neutral-600">{event.category}</span>
          </div>
        )}

        {/* Title */}
        <h3 className="text-base font-semibold text-neutral-900 line-clamp-2 leading-tight">
          {event.title}
        </h3>

        {/* Description */}
        {event.description && (
          <p className="text-sm text-neutral-600 line-clamp-2 leading-relaxed">
            {event.description}
          </p>
        )}

        {/* Event Details */}
        <div className="mt-auto space-y-2 pt-2">
          {/* Date & Time */}
          <div className="flex items-center gap-2 text-sm text-neutral-700">
            <span className="font-medium">{formattedDate}</span>
            <span className="text-neutral-500">•</span>
            <span>{formattedTime}</span>
          </div>

          {/* Venue */}
          {event.venue && (
            <div className="flex items-start gap-2 text-sm text-neutral-600">
              <span className="mt-0.5 text-neutral-500">📍</span>
              <span className="line-clamp-1">{event.venue}</span>
            </div>
          )}

          {/* Capacity */}
          <div className="pt-2">
            <div className="mb-1.5 flex items-center justify-between">
              <span className="text-xs font-medium text-neutral-700">
                {spotsRemaining > 0 ? `${spotsRemaining} spots left` : 'Full'}
              </span>
              <span className="text-xs text-neutral-500">{event.registeredCount}/{event.capacity}</span>
            </div>
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-neutral-200">
              <div
                className="h-full bg-neutral-900 transition-all"
                style={{ width: `${Math.min(capacityPercentage, 100)}%` }}
              />
            </div>
          </div>
        </div>

        {/* Status Badge */}
        {event.status && (
          <div className="mt-3 pt-3 border-t border-neutral-100">
            <span className={`inline-flex text-xs font-medium ${
              event.status === 'published'
                ? 'text-green-700'
                : 'text-neutral-600'
            }`}>
              {event.status.charAt(0).toUpperCase() + event.status.slice(1)}
            </span>
          </div>
        )}
      </div>
      </div>
    </Link>
  );
}
