import React from 'react';
import { Label } from "@/components/ui/label";

function FormField({ 
  label, 
  description, 
  children, 
  className = "",
  ...props 
}) {
  return (
    <div className={`space-y-2 mb-4 ${className}`} {...props}>
      {label && <Label className="font-medium">{label}</Label>}
      {description && <p className="text-sm text-muted-foreground">{description}</p>}
      <div className="mt-1">
        {children}
      </div>
    </div>
  );
}

export { FormField }; 