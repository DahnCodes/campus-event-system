import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import EventDetailsClient from '@/components/events/EventDetailsClient';

export const metadata = {
  title: 'Event Details',
  description: 'View event details and register',
};

export default async function EventDetailsPage({ params }: { params: { id: string } }) {
  // Check if user is authenticated
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;

  if (!token) {
    redirect('/login');
  }

  return <EventDetailsClient eventId={params.id} />;
}
