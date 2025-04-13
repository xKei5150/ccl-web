import "../globals.css";
import { Suspense, lazy } from "react";
import { SidebarContainer } from "@/components/sidebar/SidebarContainer";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { Toaster } from "@/components/ui/toaster";
import { ErrorBoundary } from "next/dist/client/components/error-boundary";
import { ErrorFallback } from "@/components/ui/error";
import { RootProvider } from "@/components/providers/root-provider";
import { getUser } from "../auth/actions";
import { redirect } from "next/navigation";

// Lazy load components
const Loading = lazy(() => import("./loading"));

export const metadata = {
  title: "Candelaria Civic Link",
  description: "Barangay Management System",
};

export default async function DashboardLayout({ children }) {
  // Check if user is authenticated
  const user = await getUser();
  
  if (!user) {
    redirect('/auth/login');
  }

  return (
    <RootProvider>
      <div className="flex min-h-screen bg-background">
        {/* Sidebar with error boundary */}
        <ErrorBoundary FallbackComponent={ErrorFallback}>
          <aside className="sticky top-0 h-screen bg-sidebar border-sidebar-border border-r overflow-hidden">
            <Suspense fallback={<div className="p-4">Loading sidebar...</div>}>
              <SidebarContainer />
            </Suspense>
          </aside>
        </ErrorBoundary>
        
        {/* Main content area */}
        <div className="flex-1 flex flex-col">
          {/* Breadcrumbs navigation */}
          <div className="sticky top-0 z-10 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="px-4 py-2">
              <ErrorBoundary FallbackComponent={ErrorFallback}>
                <Suspense fallback={<div className="h-6 w-64 bg-muted animate-pulse rounded-md"></div>}>
                  <Breadcrumbs />
                </Suspense>
              </ErrorBoundary>
            </div>
          </div>
          
          {/* Page content */}
          <main className="flex-1 overflow-y-auto">
            <div className="container mx-auto p-4 md:p-6">
              <ErrorBoundary FallbackComponent={ErrorFallback}>
                <Suspense fallback={<Loading />}>
                  {children}
                </Suspense>
              </ErrorBoundary>
            </div>
          </main>
        </div>
        
        {/* Toaster notifications */}
        <Toaster />
      </div>
    </RootProvider>
  );
}