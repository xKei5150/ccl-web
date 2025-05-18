import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getSiteSettings } from "./site-settings/actions";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Mail, Phone, MapPin } from "lucide-react";

export const metadata = {
  title: "Dashboard | CCL",
  description: "Welcome to your dashboard",
};

export default async function Dashboard() {
  const siteSettings = await getSiteSettings();
  
  return (
    <div className="min-h-screen">
      <div 
        className="w-full bg-gradient-to-b from-primary/10 to-background pt-10 pb-16 relative "
        style={{
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        {/* Background image as pseudo-element */}
        {siteSettings?.heroImage && (
          <div 
            className="absolute inset-0 z-0"
            style={{
              backgroundImage: `url(${siteSettings.heroImage.url})`,
              backgroundSize: 'contain',
              backgroundPosition: 'center',
              filter: 'brightness(0.6)',
              opacity: 0.9
            }}
          />
        )}
        
        {/* Overlay */}
        <div 
          className="absolute inset-0 bg-black/30 backdrop-blur-sm z-10" 
          style={{opacity: siteSettings?.heroImage ? 1 : 0}}
        ></div>
        
        {/* Content container with higher z-index */}
        <div className="container mx-auto relative z-20 flex flex-col items-center text-center text-white">
          {siteSettings?.logo ? (
            <div className="mb-6">
              <Avatar className="h-24 w-24 md:h-32 md:w-32 border-4 border-background shadow-xl">
                <AvatarImage src={siteSettings.logo.url} alt={siteSettings.siteName || "Logo"} />
                <AvatarFallback className="text-2xl">{siteSettings.siteName?.charAt(0) || "C"}</AvatarFallback>
              </Avatar>
            </div>
          ) : null}
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-3">
            Welcome to {siteSettings?.siteName || "Dashboard"}
          </h1>
          <p className="mx-auto">
            {siteSettings?.description || "Manage your site and content from here"}
          </p>
        </div>
      </div>

      <div className="container mx-auto py-10 -mt-8">
        <Card className="shadow-lg border-t-4 border-t-primary max-w-3xl mx-auto">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Site Information</CardTitle>
            <CardDescription>Contact details and business information</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-6 md:grid-cols-3">
            {siteSettings?.contactEmail && (
              <div className="flex flex-col items-center text-center gap-2 p-4 rounded-lg bg-muted/50">
                <Mail className="h-8 w-8 text-primary mb-2" />
                <h3 className="font-medium">Email</h3>
                <p>{siteSettings.contactEmail}</p>
              </div>
            )}
            {siteSettings?.contactPhone && (
              <div className="flex flex-col items-center text-center gap-2 p-4 rounded-lg bg-muted/50">
                <Phone className="h-8 w-8 text-primary mb-2" />
                <h3 className="font-medium">Phone</h3>
                <p>{siteSettings.contactPhone}</p>
              </div>
            )}
            {siteSettings?.address && (
              <div className="flex flex-col items-center text-center gap-2 p-4 rounded-lg bg-muted/50">
                <MapPin className="h-8 w-8 text-primary mb-2" />
                <h3 className="font-medium">Address</h3>
                <p>{siteSettings.address}</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
