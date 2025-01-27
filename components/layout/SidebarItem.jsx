"use client";

import { useState } from 'react';
import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';
import { cn } from "@/lib/utils";

export const SidebarItem = ({ item, collapsed }) => {
  const [isOpen, setIsOpen] = useState(false);

  if (!item.children) {
    return (
      <Link 
        href={item.path}
        className={cn(
          "flex items-center px-3 py-2 text-sm rounded-lg transition-colors",
          "hover:bg-gray-100 group"
        )}
      >
        {item.icon && (
          <item.icon className={cn(
            "w-5 h-5 text-gray-500 group-hover:text-gray-900",
            !collapsed && "mr-3"
          )} />
        )}
        {!collapsed && <span>{item.title}</span>}
      </Link>
    );
  }

  return (
    <div>
      <div
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "w-full flex items-center px-3 py-2 text-sm rounded-lg transition-colors cursor-pointer",
          "hover:bg-gray-100 group"
        )}
      >
        {item.icon && (
          <item.icon className={cn(
            "w-5 h-5 text-gray-500 group-hover:text-gray-900",
            !collapsed && "mr-3"
          )} />
        )}
        {!collapsed && (
          <>
            <span>{item.title}</span>
            <ChevronLeft className={cn(
              "ml-auto w-4 h-4 text-gray-500 transition-transform",
              isOpen && "rotate-90"
            )} />
          </>
        )}
      </div>
      
      {!collapsed && isOpen && item.children && (
        <div className="ml-6 mt-1 space-y-1">
          {item.children.map((child) => (
            <Link
              key={child.path}
              href={child.path}
              className={cn(
                "block px-3 py-2 text-sm text-gray-600 rounded-lg",
                "hover:bg-gray-100 hover:text-gray-900 transition-colors"
              )}
            >
              {child.title}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};