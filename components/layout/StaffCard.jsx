"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Edit, Trash2, Mail, User, Home } from "lucide-react";
import Link from "next/link";

const UserProfile = ({
  name,
  role,
  description,
  avatarUrl,
}) => {
  const [imageLoaded, setImageLoaded] = useState(false);

  return (
    <Card className="w-full max-w-2xl mx-auto mt-20 p-8 bg-white/80 backdrop-blur-sm border border-gray-100 rounded-xl shadow-sm animate-fadeIn">
      <div className="flex items-start space-x-6">
        <div className="relative w-24 h-24 transition-transform duration-300 ease-in-out hover:scale-105">
          <Avatar className="w-full h-full border-2 border-gray-50 shadow-sm">
            <AvatarImage
              src={avatarUrl}
              onLoad={() => setImageLoaded(true)}
              className={`transition-opacity duration-300 ${
                imageLoaded ? "opacity-100" : "opacity-0"
              }`}
            />
            <AvatarFallback className="text-2xl">
                {name.charAt(0)}
            </AvatarFallback>
          </Avatar>
        </div>

        <div className="flex-1 space-y-2">
          <h1 className="text-2xl font-semibold tracking-tight text-gray-900">
            {name}
          </h1>
          
          <Badge
            variant="secondary"
            className="bg-gray-100/80 text-gray-600 hover:bg-gray-100"
          >
            {role}
          </Badge>
          
          <p className="text-gray-600 leading-relaxed">
            {description}
          </p>
        </div>
      </div>
    </Card>
  );
};

export default UserProfile;

export function StaffCard({ staff, onEdit, onDelete }) {
  return (
    <Card className="overflow-hidden transition-all hover:shadow-md">
      <Link href={`/dashboard/staff/${staff.id}`}>
        <CardContent className="p-6">
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <Avatar className="h-10 w-10">
                {staff.personalInfo?.photo ? (
                  <AvatarImage src={staff.personalInfo.photo.url} />
                ) : (
                  <AvatarFallback>
                    {staff.personalInfo?.name?.firstName?.[0] || staff.email[0].toUpperCase()}
                  </AvatarFallback>
                )}
              </Avatar>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold">
                    {staff.personalInfo?.name?.fullName || staff.email}
                  </h3>
                </div>
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <Mail className="h-4 w-4" />
                  <span>{staff.email}</span>
                </div>
              </div>
            </div>
            
            {staff.personalInfo && (
              <div className="text-sm text-muted-foreground space-y-1">
                {staff.personalInfo.contact?.localAddress && (
                  <div className="flex items-center gap-1">
                    <Home className="h-4 w-4" />
                    <span className="truncate">{staff.personalInfo.contact.localAddress}</span>
                  </div>
                )}
              </div>
            )}
          </div>
        </CardContent>
      </Link>
      
      <CardFooter className="flex justify-end gap-2 p-4 bg-muted/5">
        <Button variant="ghost" size="sm" onClick={(e) => {
          e.preventDefault();
          onEdit();
        }}>
          <Edit className="h-4 w-4 mr-2" />
          Edit
        </Button>
        <Button variant="ghost" size="sm" onClick={(e) => {
          e.preventDefault();
          onDelete();
        }}>
          <Trash2 className="h-4 w-4 mr-2" />
          Delete
        </Button>
      </CardFooter>
    </Card>
  );
}