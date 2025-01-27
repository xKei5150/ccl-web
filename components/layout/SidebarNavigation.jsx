"use client";

import {
    LayoutDashboard,
    FileText,
    FolderOpen,
    Settings,
    AlertCircle,
    Users
  } from "lucide-react";
  export const navigation = [
    {
      title: "Dashboard",
      icon: LayoutDashboard,
      path: "/"
    },
    {
      title: "Requests",
      icon: FileText,
      path: "/requests",
      children: [
        { title: "General Requests", path: "/general-requests" },
        { title: "Business Permits", path: "/business-permits" }
      ]
    },
    {
      title: "Reports",
      icon: AlertCircle,
      path: "/reports"
    },
    {
      title: "Records",
      icon: FolderOpen,
      path: "/records",
      children: [
        { title: "Personal Information", path: "/personal" },
        { title: "Household Information", path: "/household" },
        { title: "Business Information", path: "/business" }
      ]
    },
    {
        title: "Staff",
        icon: Users,
        path: "/staff"
      },
    {
      title: "Settings",
      icon: Settings,
      path: "/settings",
      children: [
        { title: "Theme Manager", path: "/theme" }
      ]
    }
  ];