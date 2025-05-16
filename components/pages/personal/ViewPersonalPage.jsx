"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PageHeader } from "@/components/layout/PageHeader";
import { 
  SquareUser, 
  PenSquare, 
  ArrowLeft, 
  User, 
  Calendar, 
  Mail, 
  MapPin, 
  HeartPulse, 
  Home,
  Image
} from "lucide-react";
import { InfoItem } from "@/components/ui/info-item";
import { cn } from "@/lib/utils";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";

const ViewPersonalPage = ({ data }) => {
  const router = useRouter();

  const getResidencyStyle = (status) => {
    switch (status) {
      case "own-outright":
        return "bg-green-100 text-green-800";
      case "own-mortgage":
        return "bg-blue-100 text-blue-800";
      case "renting":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getLifeStatusStyle = (status) => {
    switch (status) {
      case "alive":
        return "bg-green-100 text-green-800";
      case "deceased":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6 animate-fade-in">
      <PageHeader
        title={data.name.fullName}
        subtitle="Personal Record Details"
        icon={<SquareUser className="h-8 w-8" />}
      >
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            className="flex items-center gap-2"
            onClick={() => router.push('/dashboard/personal')}
          >
            <ArrowLeft className="h-4 w-4" />
            Back to List
          </Button>
          
          <Button
            onClick={() => router.push(`/dashboard/personal/${data.id}/edit`)}
            className="flex items-center gap-2"
          >
            <PenSquare className="h-4 w-4" />
            Edit Record
          </Button>
        </div>
      </PageHeader>

      <main className="max-w-6xl mx-auto space-y-6">
        {/* Profile Photo */}
        <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <Image className="h-5 w-5 text-primary" />
              <CardTitle>Profile Photo</CardTitle>
            </div>
            <Separator />
          </CardHeader>
          <CardContent className="flex justify-center">
            <Avatar className="w-48 h-48">
              {data.photo?.url ? (
                <AvatarImage
                  src={data.photo.url}
                  alt={data.name.fullName}
                  className="object-cover"
                />
              ) : (
                <AvatarFallback className="text-4xl bg-primary/10 text-primary">
                  {data.name.firstName?.[0]?.toUpperCase() || "?"}
                </AvatarFallback>
              )}
            </Avatar>
          </CardContent>
        </Card>

        {/* Personal Information */}
        <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <User className="h-5 w-5 text-primary" />
              <CardTitle>Basic Information</CardTitle>
            </div>
            <Separator />
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <InfoItem
                label={
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <span>Full Name</span>
                  </div>
                }
                value={data.name.fullName}
              />
              <InfoItem
                label={
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span>Birth Date</span>
                  </div>
                }
                value={data.demographics?.birthDate ? 
                  new Date(data.demographics.birthDate).toLocaleDateString() : 'N/A'}
              />
              <InfoItem
                label={
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <span>Sex</span>
                  </div>
                }
                value={<span className="capitalize">{data.demographics?.sex || 'N/A'}</span>}
              />
            </div>
          </CardContent>
        </Card>

        {/* Contact Information */}
        <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <Mail className="h-5 w-5 text-primary" />
              <CardTitle>Contact Information</CardTitle>
            </div>
            <Separator />
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InfoItem
                label={
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span>Email Address</span>
                  </div>
                }
                value={data.contact?.emailAddress || 'N/A'}
              />
              <InfoItem
                label={
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span>Local Address</span>
                  </div>
                }
                value={data.contact?.localAddress || 'N/A'}
              />
            </div>
          </CardContent>
        </Card>

        {/* Status Information */}
        <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <HeartPulse className="h-5 w-5 text-primary" />
              <CardTitle>Status Information</CardTitle>
            </div>
            <Separator />
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <InfoItem
                label={
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <span>Marital Status</span>
                  </div>
                }
                value={<span className="capitalize">{data.demographics?.maritalStatus || 'N/A'}</span>}
              />
              <InfoItem
                label={
                  <div className="flex items-center gap-2">
                    <Home className="h-4 w-4 text-muted-foreground" />
                    <span>Residency Status</span>
                  </div>
                }
                value={
                  <span
                    className={cn(
                      "inline-flex items-center px-3 py-1 rounded-full text-sm capitalize",
                      getResidencyStyle(data.status?.residencyStatus)
                    )}
                  >
                    {data.status?.residencyStatus?.replace("-", " ") || 'N/A'}
                  </span>
                }
              />
              <InfoItem
                label={
                  <div className="flex items-center gap-2">
                    <HeartPulse className="h-4 w-4 text-muted-foreground" />
                    <span>Life Status</span>
                  </div>
                }
                value={
                  <span
                    className={cn(
                      "inline-flex items-center px-3 py-1 rounded-full text-sm capitalize",
                      getLifeStatusStyle(data.status?.lifeStatus)
                    )}
                  >
                    {data.status?.lifeStatus || 'N/A'}
                  </span>
                }
              />
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default ViewPersonalPage;