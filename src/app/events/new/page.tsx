import { redirect } from 'next/navigation';
import { getUserFromRequest } from '@/lib/auth';
import CreateEventForm from '@/components/events/CreateEventForm';

export const metadata = {
  title: 'Create Event',
  description: 'Create a new campus event',
};

export default async function CreateEventPage() {
  // Check if user is authenticated and is an organizer
  const user = await getUserFromRequest();

  if (!user) {
    redirect('/login');
  }

  if (user.role !== 'organizer' && user.role !== 'admin') {
    redirect('/dashboard');
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b border-neutral-200 px-6 py-12 sm:px-8">
        <div className="mx-auto max-w-2xl">
          <h1 className="text-4xl font-bold text-neutral-900 sm:text-5xl">Create Event</h1>
          <p className="mt-3 text-base text-neutral-600">
            Fill in the details below to create a new event on campus.
          </p>
        </div>
      </header>

      {/* Form */}
      <main className="mx-auto max-w-2xl px-6 py-12 sm:px-8">
        <CreateEventForm />
      </main>
    </div>
  );
}
