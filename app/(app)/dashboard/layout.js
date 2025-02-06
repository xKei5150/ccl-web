import { Geist, Geist_Mono } from "next/font/google";
import "../globals.css";
import Sidebar from "@/components/sidebar/Sidebar";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { Toaster } from "@/components/ui/toaster";
import { Suspense } from "react";
import LoadingSkeleton from "@/components/layout/LoadingSkeleton";
import Loading from "./loading"
import { ErrorBoundary } from "next/dist/client/components/error-boundary";
import { ErrorFallback } from "@/components/ui/error";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Candelaria Civic Link",
  description: "Barangay Management System",
};

export default function DashboardLayout({ children }) {
  return (
    <div className="flex h-screen overflow-hidden">
      <aside className="sticky top-0 h-screen w-64 bg-gray-100 border-r border-gray-200 overflow-hidden">
        <ErrorBoundary FallbackComponent={ErrorFallback}>
          <Suspense fallback={<Loading />}>
            <Sidebar />
          </Suspense>
        </ErrorBoundary>
      </aside>
      
      <main className="flex-1 overflow-y-auto">
        <div className="p-4">
          <ErrorBoundary FallbackComponent={ErrorFallback}>
            <Suspense fallback={<Loading/>}>
              <Breadcrumbs />
            </Suspense>
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
  );
}