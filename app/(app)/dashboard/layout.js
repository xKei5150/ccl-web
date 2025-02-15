import { Geist } from "next/font/google";
import "../globals.css";
import { SidebarContainer } from "@/components/sidebar/SidebarContainer";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { Toaster } from "@/components/ui/toaster";
import { Suspense } from "react";
import Loading from "./loading";
import { ErrorBoundary } from "next/dist/client/components/error-boundary";
import { ErrorFallback } from "@/components/ui/error";
import { RootProvider } from "@/components/providers/root-provider";
import { getUser } from "../auth/actions";
import { redirect } from "next/navigation";

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
      <div className="flex">
        <aside className="sticky top-0 h-screen bg-sidebar border-sidebar-border border-r overflow-hidden">
          <ErrorBoundary FallbackComponent={ErrorFallback}>
            <SidebarContainer />
          </ErrorBoundary>
        </aside>
        
        <main className="flex-1 overflow-y-auto themed-background">
          <div className="p-4">
            <ErrorBoundary FallbackComponent={ErrorFallback}>
              <Breadcrumbs />
            </ErrorBoundary>
          </div>
          <div className="p-4">
            <ErrorBoundary FallbackComponent={ErrorFallback}>
              <Suspense fallback={<Loading />}>
                {children}
              </Suspense>
            </ErrorBoundary>
          </div>
        </main>
        <Toaster />
      </div>
    </RootProvider>
  );
}