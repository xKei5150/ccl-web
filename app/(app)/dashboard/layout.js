import { Geist, Geist_Mono } from "next/font/google";
import "../globals.css";
import { SidebarContainer } from "@/components/sidebar/SidebarContainer";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { Toaster } from "@/components/ui/toaster";
import { Suspense } from "react";
import Loading from "./loading";
import { ErrorBoundary } from "next/dist/client/components/error-boundary";
import { ErrorFallback } from "@/components/ui/error";

export const metadata = {
  title: "Candelaria Civic Link",
  description: "Barangay Management System",
};

export default function DashboardLayout({ children }) {
  return (
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
            {children}
          </ErrorBoundary>
        </div>
      </main>
      <Toaster />
    </div>
  );
}