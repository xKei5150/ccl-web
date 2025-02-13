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
      path: "/dashboard"
    },
    {
      title: "Requests",
      icon: FileText,
      path: "/requests",
      children: [
        { title: "General Requests", path: "/dashboard/general-requests" },
        { title: "Business Permits", path: "/dashboard/business-permits" }
      ]
    },
    {
      title: "Reports",
      icon: AlertCircle,
      path: "/dashboard/reports"
    },
    {
      title: "Records",
      icon: FolderOpen,
      path: "/records",
      children: [
        { title: "Personal Information", path: "/dashboard/personal" },
        { title: "Household Information", path: "/dashboard/household" },
        { title: "Business Information", path: "/dashboard/business" }
      ]
    },
    {
        title: "Staff",
        icon: Users,
        path: "/dashboard/staff"
      },
      {
        title: "Settings",
        icon: Settings,
        path: "/settings",
        children: [
          { title: "Theme Manager", path: "/dashboard/theme" },
          { title: "Site Settings", path: "/dashboard/site-settings" }
        ]
      },
  ];