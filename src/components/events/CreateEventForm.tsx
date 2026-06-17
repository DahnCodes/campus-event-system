'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import { AlertCircle } from 'lucide-react';

interface FormData {
  title: string;
  description: string;
  category: string;
  venue: string;
  eventDate: string;
  capacity: string;
  coverImage: string;
}

interface FieldErrors {
  [key: string]: string;
}

export default function CreateEventForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState<FormData>({
    title: '',
    description: '',
    category: '',
    venue: '',
    eventDate: '',
    capacity: '',
    coverImage: '',
  });
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});

  const validateForm = (): boolean => {
    const errors: FieldErrors = {};

    if (!formData.title.trim()) {
      errors.title = 'Title is required';
    }

    if (!formData.description.trim()) {
      errors.description = 'Description is required';
    }

    if (!formData.category.trim()) {
      errors.category = 'Category is required';
    }

    if (!formData.venue.trim()) {
      errors.venue = 'Venue is required';
    }

    if (!formData.eventDate) {
      errors.eventDate = 'Date and time are required';
    } else {
      const selectedDate = new Date(formData.eventDate);
      const now = new Date();
      if (selectedDate <= now) {
        errors.eventDate = 'Event date must be in the future';
      }
    }

    if (!formData.capacity) {
      errors.capacity = 'Capacity is required';
    } else {
      const capacityNum = parseInt(formData.capacity, 10);
      if (isNaN(capacityNum) || capacityNum <= 0) {
        errors.capacity = 'Capacity must be a positive number';
      }
    }

    if (!formData.coverImage.trim()) {
      errors.coverImage = 'Cover image URL is required';
    } else {
      try {
        new URL(formData.coverImage);
      } catch {
        errors.coverImage = 'Please enter a valid URL';
      }
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear field error when user starts typing
    if (fieldErrors[name]) {
      setFieldErrors((prev) => ({ ...prev, [name]: '' }));
    }
    // Clear general error
    if (error) setError('');
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      const response = await api.post('/events/create', {
        title: formData.title,
        description: formData.description,
        category: formData.category,
        venue: formData.venue,
        eventDate: new Date(formData.eventDate).toISOString(),
        capacity: parseInt(formData.capacity, 10),
        coverImage: formData.coverImage,
      });

      if (response.data.success) {
        router.push('/dashboard');
      } else {
        setError(response.data.message || 'Failed to create event');
      }
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message || 'An error occurred while creating the event';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="flex gap-3 rounded-lg border border-red-200 bg-red-50 p-4">
          <AlertCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-red-600" />
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      {/* Title */}
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-neutral-900">
          Event Title
        </label>
        <input
          type="text"
          id="title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          disabled={isLoading}
          className="mt-2 block w-full rounded-lg border border-neutral-200 px-4 py-2.5 text-neutral-900 placeholder-neutral-500 focus:border-neutral-900 focus:outline-none focus:ring-1 focus:ring-neutral-900 disabled:bg-neutral-50"
          placeholder="Enter event title"
        />
        {fieldErrors.title && (
          <p className="mt-1 text-xs text-red-600">{fieldErrors.title}</p>
        )}
      </div>

      {/* Description */}
      <div>
        <label htmlFor="description" className="block text-sm font-medium text-neutral-900">
          Description
        </label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          disabled={isLoading}
          rows={4}
          className="mt-2 block w-full rounded-lg border border-neutral-200 px-4 py-2.5 text-neutral-900 placeholder-neutral-500 focus:border-neutral-900 focus:outline-none focus:ring-1 focus:ring-neutral-900 disabled:bg-neutral-50"
          placeholder="Describe your event"
        />
        {fieldErrors.description && (
          <p className="mt-1 text-xs text-red-600">{fieldErrors.description}</p>
        )}
      </div>

      {/* Category */}
      <div>
        <label htmlFor="category" className="block text-sm font-medium text-neutral-900">
          Category
        </label>
        <input
          type="text"
          id="category"
          name="category"
          value={formData.category}
          onChange={handleChange}
          disabled={isLoading}
          className="mt-2 block w-full rounded-lg border border-neutral-200 px-4 py-2.5 text-neutral-900 placeholder-neutral-500 focus:border-neutral-900 focus:outline-none focus:ring-1 focus:ring-neutral-900 disabled:bg-neutral-50"
          placeholder="e.g., Workshop, Concert, Sports"
        />
        {fieldErrors.category && (
          <p className="mt-1 text-xs text-red-600">{fieldErrors.category}</p>
        )}
      </div>

      {/* Venue */}
      <div>
        <label htmlFor="venue" className="block text-sm font-medium text-neutral-900">
          Venue
        </label>
        <input
          type="text"
          id="venue"
          name="venue"
          value={formData.venue}
          onChange={handleChange}
          disabled={isLoading}
          className="mt-2 block w-full rounded-lg border border-neutral-200 px-4 py-2.5 text-neutral-900 placeholder-neutral-500 focus:border-neutral-900 focus:outline-none focus:ring-1 focus:ring-neutral-900 disabled:bg-neutral-50"
          placeholder="Enter event location"
        />
        {fieldErrors.venue && (
          <p className="mt-1 text-xs text-red-600">{fieldErrors.venue}</p>
        )}
      </div>

      {/* Event Date */}
      <div>
        <label htmlFor="eventDate" className="block text-sm font-medium text-neutral-900">
          Date & Time
        </label>
        <input
          type="datetime-local"
          id="eventDate"
          name="eventDate"
          value={formData.eventDate}
          onChange={handleChange}
          disabled={isLoading}
          className="mt-2 block w-full rounded-lg border border-neutral-200 px-4 py-2.5 text-neutral-900 placeholder-neutral-500 focus:border-neutral-900 focus:outline-none focus:ring-1 focus:ring-neutral-900 disabled:bg-neutral-50"
        />
        {fieldErrors.eventDate && (
          <p className="mt-1 text-xs text-red-600">{fieldErrors.eventDate}</p>
        )}
      </div>

      {/* Capacity */}
      <div>
        <label htmlFor="capacity" className="block text-sm font-medium text-neutral-900">
          Capacity
        </label>
        <input
          type="number"
          id="capacity"
          name="capacity"
          value={formData.capacity}
          onChange={handleChange}
          disabled={isLoading}
          min="1"
          className="mt-2 block w-full rounded-lg border border-neutral-200 px-4 py-2.5 text-neutral-900 placeholder-neutral-500 focus:border-neutral-900 focus:outline-none focus:ring-1 focus:ring-neutral-900 disabled:bg-neutral-50"
          placeholder="Maximum number of attendees"
        />
        {fieldErrors.capacity && (
          <p className="mt-1 text-xs text-red-600">{fieldErrors.capacity}</p>
        )}
      </div>

      {/* Cover Image URL */}
      <div>
        <label htmlFor="coverImage" className="block text-sm font-medium text-neutral-900">
          Cover Image URL
        </label>
        <input
          type="text"
          id="coverImage"
          name="coverImage"
          value={formData.coverImage}
          onChange={handleChange}
          disabled={isLoading}
          className="mt-2 block w-full rounded-lg border border-neutral-200 px-4 py-2.5 text-neutral-900 placeholder-neutral-500 focus:border-neutral-900 focus:outline-none focus:ring-1 focus:ring-neutral-900 disabled:bg-neutral-50"
          placeholder="https://example.com/image.jpg"
        />
        {fieldErrors.coverImage && (
          <p className="mt-1 text-xs text-red-600">{fieldErrors.coverImage}</p>
        )}
      </div>

      {/* Submit and Cancel */}
      <div className="flex gap-3 pt-4">
        <button
          type="submit"
          disabled={isLoading}
          className="flex-1 rounded-lg bg-neutral-900 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-neutral-800 disabled:bg-neutral-400"
        >
          {isLoading ? 'Creating...' : 'Create Event'}
        </button>
        <button
          type="button"
          disabled={isLoading}
          onClick={() => router.back()}
          className="rounded-lg border border-neutral-200 px-4 py-2.5 text-sm font-medium text-neutral-900 transition-colors hover:bg-neutral-50 disabled:bg-neutral-50"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
