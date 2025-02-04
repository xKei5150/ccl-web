// app/layout.js
import { Geist, Geist_Mono } from "next/font/google";
import "../globals.css";
import Sidebar from "@/components/sidebar/Sidebar";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";

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
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} h-screen`}>
        <div className="flex h-full">
          {/* Sidebar remains fixed */}
          <aside className=" bg-gray-100 border-r border-gray-200">
            <Sidebar />
          </aside>
          {/* Main content scrolls independently */}
          <main className="flex-1 overflow-y-auto">
            <div className="p-4">
              <Breadcrumbs />
            </div>
            <div className="p-4">
              {children}
            </div>
          </main>
        </div>
      </body>
    </html>
  );
}
