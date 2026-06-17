'use client';

import { useState } from 'react';

interface OrganizerPromotionCardProps {
  onBecomeOrganizer: () => Promise<void>;
}

export default function OrganizerPromotionCard({ onBecomeOrganizer }: OrganizerPromotionCardProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleClick = async () => {
    setIsLoading(true);
    try {
      await onBecomeOrganizer();
      setIsSuccess(true);
    } catch (err) {
      console.error('[v0] Error becoming organizer:', err);
    } finally {
      setIsLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="rounded-lg border border-green-200 bg-green-50 px-5 py-4 sm:px-6 sm:py-5">
        <p className="text-base font-medium text-green-900">
          Congratulations! You are now an organizer 🎉
        </p>
        <p className="mt-1 text-sm text-green-800">
          You can now create and manage your own events.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-neutral-200 bg-neutral-50 px-5 py-4 sm:px-6 sm:py-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex-1">
          <h3 className="text-base font-semibold text-neutral-900">Become an organizer</h3>
          <p className="mt-1 text-sm text-neutral-600">
            Create and manage your own campus events to share with the community.
          </p>
        </div>
        <button
          onClick={handleClick}
          disabled={isLoading}
          className="mt-3 inline-flex items-center gap-2 rounded border border-neutral-900 bg-neutral-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-neutral-800 disabled:opacity-50 sm:mt-0"
        >
          {isLoading ? 'Upgrading...' : 'Upgrade'}
        </button>
      </div>
    </div>
  );
}
