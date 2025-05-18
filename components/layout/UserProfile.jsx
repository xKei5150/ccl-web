import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { PenSquare } from "lucide-react";
import { useRouter } from "next/navigation";

const UserProfile = ({
  personalInfo,
  role
}) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const router = useRouter();

  if (!personalInfo) return null;

  const {
    photo,
    name,
    contact,
    demographics,
    status
  } = personalInfo;

  const photoUrl = photo?.url || '';
  const fullName = name?.fullName || '';
  const initials = name ? `${name.firstName?.[0] || ''}${name.lastName?.[0] || ''}` : '';

  return (
    <Card className="w-full max-w-screen mx-auto p-8 bg-white/80 backdrop-blur-sm border border-gray-100 rounded-xl shadow-sm animate-fadeIn">
      <div className="flex flex-col md:flex-row md:items-start gap-6">
        <div className="relative w-24 h-24 transition-transform duration-300 ease-in-out hover:scale-105">
          <Avatar className="w-full h-full border-2 border-gray-50 shadow-sm">
            <AvatarImage
              src={photoUrl}
              onLoad={() => setImageLoaded(true)}
              className={`transition-opacity duration-300 ${
                imageLoaded ? "opacity-100" : "opacity-0"
              }`}
            />
            <AvatarFallback className="text-2xl">{initials}</AvatarFallback>
          </Avatar>
        </div>

        <div className="flex-1 space-y-4">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-gray-900 mb-2">
              {fullName}
            </h1>
            <div className="flex flex-wrap gap-2">
              <Badge variant="secondary" className="bg-gray-100/80 text-gray-600 hover:bg-gray-100">
                {role}
              </Badge>
              {demographics?.maritalStatus && (
                <Badge variant="outline">
                  {demographics.maritalStatus.charAt(0).toUpperCase() + demographics.maritalStatus.slice(1)}
                </Badge>
              )}
              {status?.residencyStatus && (
                <Badge variant="outline" className="bg-blue-50">
                  {status.residencyStatus.split('-').map(word => 
                    word.charAt(0).toUpperCase() + word.slice(1)
                  ).join(' ')}
                </Badge>
              )}
            </div>
            </div>
            <Button
              onClick={() => router.push('/dashboard/profile/edit')}
              variant="outline"
              size="sm"
              className="flex items-center gap-2 self-start"
            >
              <PenSquare className="h-4 w-4" />
              Edit Profile
            </Button>
          </div>
          
          <div className="space-y-2 text-sm text-gray-600">
            {contact?.emailAddress && (
              <p>📧 {contact.emailAddress}</p>
            )}
            {contact?.localAddress && (
              <p>📍 {contact.localAddress}</p>
            )}
            {demographics?.birthDate && (
              <p>🎂 {format(new Date(demographics.birthDate), 'MMMM d, yyyy')}</p>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
};

export default UserProfile;