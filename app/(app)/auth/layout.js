import { getUser } from './actions';
import { redirect } from 'next/navigation';

export const metadata = {
  title: "Authentication | CCL",
  description: "Barangay Management System Authentication",
};

export default async function AuthLayout({ children }) {
  // Check if user is already authenticated
  const user = await getUser();
  
  // If user is authenticated, redirect to dashboard
  if (user) {
    redirect('/dashboard');
  }

  return (
    <main className="min-h-screen bg-background">
      {children}
    </main>
  );
}