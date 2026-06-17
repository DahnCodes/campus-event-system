import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import DashboardClient from '@/components/dashboard/DashboardClient';

export const metadata = {
  title: 'Dashboard',
  description: 'Discover and manage campus events',
};

export default async function DashboardPage() {
  // Check if user is authenticated via JWT cookie
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;

  if (!token) {
    redirect('/login');
  }

  return <DashboardClient />;
}
