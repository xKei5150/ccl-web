import { getUser } from './actions';
import { getSiteSettings } from '../dashboard/site-settings/actions';
import { redirect } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Mail, Phone, MapPin } from 'lucide-react';

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

  // Get site settings
  const siteSettings = await getSiteSettings();

  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex-1 grid lg:grid-cols-3 min-h-0">
        {/* Left side - auth forms (1/3 width) */}
        <div className="flex flex-col justify-center items-center p-4 sm:p-6">
          <div className="w-full max-w-sm mx-auto bg-white p-5 sm:p-6 rounded-xl shadow-md">
            {/* Logo and site name header */}
            <div className="flex flex-col items-center mb-6">
              {siteSettings?.logo && (
                <Image 
                  src={siteSettings.logo.url} 
                  alt={siteSettings.siteName || "Logo"} 
                  width={70} 
                  height={70} 
                  className="rounded-full mb-3"
                />
              )}
              <h1 className="text-xl font-bold text-center">
                {siteSettings?.siteName || "CCL Web"}
              </h1>
            </div>
            
            {children}
          </div>
        </div>
        
        {/* Right side - background image (2/3 width) */}
        <div 
          className="hidden lg:block lg:col-span-2 relative"
          style={{
            backgroundImage: siteSettings?.authImage ? `url(${siteSettings.authImage.url})` : 'none',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundColor: siteSettings?.authImage ? undefined : 'hsl(var(--primary) / 0.05)'
          }}
        >
          {/* Overlay for better readability when image is present */}
          {siteSettings?.authImage && (
            <div className="absolute inset-0 bg-black/30 backdrop-blur-[1px]"></div>
          )}
        </div>
      </div>
      
      {/* Footer */}
      <footer className="bg-muted/30 py-4 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="flex flex-col md:flex-row justify-between items-center gap-2">
            <div className="flex items-center gap-2">
              {siteSettings?.logo && (
                <Image 
                  src={siteSettings.logo.url} 
                  alt={siteSettings.siteName || "Logo"} 
                  width={24} 
                  height={24} 
                  className="rounded-full"
                  priority
                  loading="eager"
                />
              )}
              <span className="text-xs font-medium">{siteSettings?.siteName || "CCL Web"}</span>
            </div>
            
            <div className="flex flex-wrap justify-center gap-4 text-xs text-muted-foreground">
              {siteSettings?.contactEmail && (
                <div className="flex items-center gap-1">
                  <Mail className="h-3 w-3" />
                  <span>{siteSettings.contactEmail}</span>
                </div>
              )}
              
              {siteSettings?.contactPhone && (
                <div className="flex items-center gap-1">
                  <Phone className="h-3 w-3" />
                  <span>{siteSettings.contactPhone}</span>
                </div>
              )}
              
              {siteSettings?.address && (
                <div className="flex items-center gap-1 hidden md:flex">
                  <MapPin className="h-3 w-3" />
                  <span className="max-w-xs truncate">{siteSettings.address}</span>
                </div>
              )}
            </div>
            
            <div className="text-xs text-muted-foreground">
              © {new Date().getFullYear()}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}