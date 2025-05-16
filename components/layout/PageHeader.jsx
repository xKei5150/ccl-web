import React from "react";

export const PageHeader = ({ title, subtitle, icon, action, children }) => {
  return (
    <header className="mb-2 max-w-6xl">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-white rounded-lg shadow-sm">
            {React.cloneElement(icon, { className: "h-6 w-6 text-gray-600" })}
          </div>
          <div>
            <h1 className="text-2xl font-medium text-gray-900">
              {title}
            </h1>
            {subtitle && (
              <p className="text-sm text-gray-600">
                {subtitle}
              </p>
            )}
          </div>
        </div>
        
        {/* Render either children or action prop */}
        {children ? (
          <div className="flex-shrink-0">
            {children}
          </div>
        ) : action ? (
          <div className="flex-shrink-0">
            {action}
          </div>
        ) : null}
      </div>
    </header>
  );
};

PageHeader.displayName = "PageHeader";
