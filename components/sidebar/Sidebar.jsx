"use client";

import { useState } from 'react';
import Link from 'next/link';
import { cn } from "@/lib/utils";
import { ChevronLeft, Home, LogOut, User } from "lucide-react";
import { navigation } from './SidebarNavigation';
import { SidebarItem } from './SidebarItem';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);

  const user = {
    name: "John Doe",
    email: "john@example.com",
    avatar: ""
  };

  return (
    <div className={cn(
      "relative h-screen bg-white border-r border-gray-200 transition-all duration-300 ease-in-out flex flex-col",
      collapsed ? "w-20" : "w-64"
    )}>
      {/* Header */}
      <div className="flex-none p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          {!collapsed && (
            <Link href="/" className="flex items-center space-x-2">
              <Home className="w-6 h-6 text-gray-700" />
              <span className="font-semibold text-gray-900">Barangay MS</span>
            </Link>
          )}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <ChevronLeft className={cn(
              "w-5 h-5 text-gray-500 transition-transform",
              collapsed && "rotate-180"
            )} />
          </button>
        </div>
      </div>

      {/* Navigation - Scrollable Area */}
      <nav className="flex-1 overflow-y-auto p-2 space-y-1">
        {navigation.map((item) => (
          <SidebarItem
            key={item.path}
            item={item}
            collapsed={collapsed}
          />
        ))}
      </nav>

      {/* User Profile - Fixed at Bottom */}
      <div className="flex-none p-4 border-t border-gray-200">
        <DropdownMenu>
          <DropdownMenuTrigger className="w-full">
            <div className={cn(
              "flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-100 transition-colors",
              collapsed && "justify-center"
            )}>
              <Avatar className="h-8 w-8">
                <AvatarImage src={user.avatar} />
                <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
              </Avatar>
              {!collapsed && (
                <div className="flex-1 text-left">
                  <p className="text-sm font-medium text-gray-900">{user.name}</p>
                  <p className="text-xs text-gray-500">{user.email}</p>
                </div>
              )}
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <Link href="/dashboard/profile" passHref legacyBehavior>
              <DropdownMenuItem>
                <User className="mr-2 h-4 w-4" />
                View Profile
              </DropdownMenuItem>
            </Link>
            <Link href="/auth/login" passHref legacyBehavior>
              <DropdownMenuItem>
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </DropdownMenuItem>
            </Link>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}