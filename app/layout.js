// app/layout.js
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Sidebar from "@/components/layout/Sidebar";
import { headers } from 'next/headers';

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

export default async function RootLayout({ children }) {
  const headersList = await headers();
  const excludeSidebar = headersList.get('x-exclude-sidebar') === 'true';

  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {!excludeSidebar ? (
          <div className="flex">
            <Sidebar />
            <div className="flex h-max w-screen">
              <main className="flex-1 overflow-y-auto p-8">{children}</main>
            </div>
          </div>
        ) : (
          <main className="h-screen w-screen">{children}</main>
        )}
      </body>
    </html>
  );
}