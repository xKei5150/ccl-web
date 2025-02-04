"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";

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