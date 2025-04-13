import { cn } from "@/lib/style-utils";
import { FormGrid } from "@/components/layout/grid";

/**
 * Form layout container
 * 
 * @param {object} props - Component properties
 * @param {React.ReactNode} props.children - Form content
 * @param {string} props.className - Additional CSS classes
 * @returns {JSX.Element} Form layout component
 */
export function FormLayout({ children, className }) {
  return (
    <div className={cn("space-y-6", className)}>
      {children}
    </div>
  );
}

/**
 * Form section with title and description
 * 
 * @param {object} props - Component properties
 * @param {React.ReactNode} props.children - Section content
 * @param {string} props.title - Section title
 * @param {string} props.description - Section description
 * @param {string} props.className - Additional CSS classes
 * @returns {JSX.Element} Form section component
 */
export function FormSection({ children, title, description, className }) {
  return (
    <div className={cn("space-y-4", className)}>
      {(title || description) && (
        <div className="space-y-1">
          {title && (
            <h3 className="text-lg font-medium">{title}</h3>
          )}
          {description && (
            <p className="text-sm text-muted-foreground">
              {description}
            </p>
          )}
        </div>
      )}
      <div className="space-y-4">
        {children}
      </div>
    </div>
  );
}

/**
 * Form group for field layouts
 * 
 * @param {object} props - Component properties
 * @param {React.ReactNode} props.children - Form fields
 * @param {number} props.columns - Number of columns
 * @param {string} props.className - Additional CSS classes
 * @returns {JSX.Element} Form group component
 */
export function FormGroup({ children, columns = 1, className }) {
  if (columns === 1) {
    return (
      <div className={cn("space-y-4", className)}>
        {children}
      </div>
    );
  }

  return (
    <FormGrid 
      mobile={1} 
      tablet={columns > 2 ? 2 : columns} 
      desktop={columns}
      className={className}
    >
      {children}
    </FormGrid>
  );
}

/**
 * Form field with label
 * 
 * @param {object} props - Component properties
 * @param {React.ReactNode} props.children - Field input
 * @param {string} props.label - Field label
 * @param {string} props.description - Field description
 * @param {boolean} props.error - Error state
 * @param {string} props.errorMessage - Error message
 * @param {string} props.className - Additional CSS classes
 * @returns {JSX.Element} Form field component
 */
export function FormField({ 
  children, 
  label, 
  description, 
  error, 
  errorMessage,
  className 
}) {
  return (
    <div className={cn("space-y-2", className)}>
      {label && (
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
            {label}
          </label>
        </div>
      )}
      {children}
      {description && !error && (
        <p className="text-xs text-muted-foreground">
          {description}
        </p>
      )}
      {error && errorMessage && (
        <p className="text-xs text-destructive">
          {errorMessage}
        </p>
      )}
    </div>
  );
}

/**
 * Form actions container
 * 
 * @param {object} props - Component properties
 * @param {React.ReactNode} props.children - Action buttons
 * @param {string} props.className - Additional CSS classes
 * @returns {JSX.Element} Form actions component
 */
export function FormActions({ children, className }) {
  return (
    <div className={cn("flex items-center justify-end gap-2 pt-4", className)}>
      {children}
    </div>
  );
} 