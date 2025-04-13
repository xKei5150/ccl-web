import { Suspense } from 'react';
import { getUser } from './actions';
import { redirect } from 'next/navigation';
import { Container } from '@/components/layout/container';
import { ErrorBoundary } from "next/dist/client/components/error-boundary";
import { ErrorFallback } from "@/components/ui/error";
import { RootProvider } from "@/components/providers/root-provider";
import { Toaster } from "@/components/ui/toaster";

export const metadata = {
  title: "Authentication | CCL",
  description: "Barangay Management System Authentication",
};

/**
 * Layout for auth pages with standardized structure
 */
export default async function AuthLayout({ children }) {
  // Check if user is already authenticated
  const user = await getUser();
  
  // If user is authenticated, redirect to dashboard
  if (user) {
    redirect('/dashboard');
  }

  return (
    <RootProvider>
      <div className="min-h-screen flex flex-col bg-gradient-to-b from-muted/50 to-muted">
        <header className="py-4 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <Container size="xl" className="flex justify-center">
            <div className="h-10 w-32 flex items-center justify-center">
              <h1 className="text-xl font-bold">CCL</h1>
            </div>
          </Container>
        </header>

        <main className="flex-1 flex items-center justify-center p-4">
          <ErrorBoundary FallbackComponent={ErrorFallback}>
            <Suspense fallback={
              <div className="w-full max-w-md h-96 rounded-lg bg-background/60 animate-pulse"></div>
            }>
              {children}
            </Suspense>
          </ErrorBoundary>
        </main>

        <footer className="py-4 text-center text-sm text-muted-foreground">
          <Container>
            <p>© {new Date().getFullYear()} Candelaria Civic Link. All rights reserved.</p>
          </Container>
        </footer>

        <Toaster />
      </div>
    </RootProvider>
  );
}