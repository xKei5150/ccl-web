"use client";

import {
  LayoutDashboard,
  FileText,
  FolderOpen,
  Settings,
  AlertCircle,
  Users,
  Megaphone,
  CreditCard,
  BarChart
} from "lucide-react";
const navigationWithPermissions = [
  {
    title: "Dashboard",
    icon: LayoutDashboard,
    path: "/dashboard",
    requiredPermissions: ["globals.site-settings.update"]
  },
  {
    title: "Announcements",
    icon: Megaphone,
    path: "/dashboard/posts",
    requiredPermissions: ["collections.posts.read"]
  },
  {
    title: "Analytics & Records",
    icon: BarChart,
    path: "/dashboard/analytics",
    requiredPermissions: ["collections.requests.read"],
    children: [
      {
        title: "Services",
        path: "/dashboard/services",
        requiredPermissions: ["collections.requests.read"]
      }
    ]
  },
  {
    title: "Financing",
    icon: CreditCard,
    path: "/dashboard/financing",
    requiredPermissions: ["collections.financing.read"],
  },
  {
    title: "Requests",
    icon: FileText,
    path: "/requests",
    requiredPermissions: ["collections.requests.read || collections.business-permits.read || collections.requests.read.permission"],
    children: [
      {
        title: "General Requests",
        path: "/dashboard/general-requests",
        requiredPermissions: ["collections.requests.read || collections.requests.read.permission"]
      },
      {
        title: "Business Permits",
        path: "/dashboard/business-permits",
        requiredPermissions: ["collections.business-permits.read"]
      }
    ]
  },
  {
    title: "Reports",
    icon: AlertCircle,
    path: "/dashboard/reports",
    requiredPermissions: ["collections.reports.read || collections.reports.read.permission"]
  },
  {
    title: "Records",
    icon: FolderOpen,
    path: "/records",
    requiredPermissions: [
      "collections.personal-information.read || collections.households.read || collections.business.read"
  ],
    children: [
      {
        title: "Personal Information",
        path: "/dashboard/personal",
        requiredPermissions: ["collections.personal-information.create"]
      },
      {
        title: "Household Information",
        path: "/dashboard/household",
        requiredPermissions: ["collections.households.read"]
      },
      {
        title: "Business Information",
        path: "/dashboard/business",
        requiredPermissions: ["collections.business.read"]
      }
    ]
  },
  {
    title: "Staff",
    icon: Users,
    path: "/dashboard/staff",
    requiredPermissions: ["globals.site-settings.update"]
  },
  {
    title: "Settings",
    icon: Settings,
    path: "/settings",
    requiredPermissions: ["globals.site-settings.update"],
    children: [
      {
        title: "Theme Manager",
        path: "/dashboard/theme",
        requiredPermissions: ["globals.site-settings.update"]
      },
      {
        title: "Site Settings",
        path: "/dashboard/site-settings",
        requiredPermissions: ["globals.site-settings.update"]
      }
    ]
  },
];

function evaluatePermission(permissions, permissionPath) {
  if (permissionPath.includes('||')) {
    return permissionPath.split('||').some(path => 
      evaluatePermission(permissions, path.trim())
    );
  }

  const parts = permissionPath.split('.');
  let current = permissions;
  
  for (const part of parts) {
    if (!current || current[part] === undefined) return false;
    current = current[part];
  }
  
  return current === true || (typeof current === 'object' && current.read === true);
}

function hasPermission(permissions, requiredPermissions) {
  if (!Array.isArray(requiredPermissions)) return false;
  return requiredPermissions.some(permissionPath => {
    return evaluatePermission(permissions, permissionPath);
  });
}

function filterNavigationByPermissions(items, permissions) {
  return items.filter(item => {
    const hasRequiredPermission = hasPermission(permissions, item.requiredPermissions);

    if (!hasRequiredPermission) {
      return false;
    }

    if (item.children) {
      const filteredChildren = item.children.filter(child => 
        hasPermission(permissions, child.requiredPermissions)
      );

      if (filteredChildren.length > 0) {
        item.children = filteredChildren;
        return true;
      }
      return false;
    }

    return true;
  });
}

export function getNavigation(permissions) {
  return filterNavigationByPermissions(navigationWithPermissions, permissions);
}

export const navigation = navigationWithPermissions;