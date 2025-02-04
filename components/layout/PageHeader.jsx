import React from "react";

export const PageHeader = ({ title, subtitle, icon }) => {
  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between">
        <div className="flex items-center">
         {icon && <div className="flex-shrink-0 mr-4">{icon}</div>}
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
              {title}
            </h1>
            {subtitle && (
              <p className="mt-1 text-base text-gray-500 dark:text-gray-400">
                {subtitle}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

PageHeader.displayName = "PageHeader";
