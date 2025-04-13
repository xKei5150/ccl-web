/**
 * Grid layout components for consistent responsive layouts
 */
import { responsiveGrid, cn } from "@/lib/style-utils";

/**
 * Grid component for responsive layouts
 * 
 * @param {object} props - Component properties
 * @param {React.ReactNode} props.children - Grid content
 * @param {number} props.mobile - Mobile columns (default: 1)
 * @param {number} props.tablet - Tablet columns (default: 2)
 * @param {number} props.desktop - Desktop columns (default: 4)
 * @param {string} props.gap - Grid gap (default: 'gap-4')
 * @param {string} props.className - Additional CSS classes
 * @returns {JSX.Element} Grid component
 */
export function Grid({ 
  children, 
  mobile = 1, 
  tablet = 2, 
  desktop = 4, 
  gap = "gap-4",
  className = "" 
}) {
  return (
    <div className={cn(responsiveGrid({ mobile, tablet, desktop, gap }), className)}>
      {children}
    </div>
  );
}

/**
 * Card grid with appropriate spacing for card items
 */
export function CardGrid({ 
  children, 
  mobile = 1, 
  tablet = 2, 
  desktop = 3,
  className = "",
  ...props
}) {
  return (
    <Grid 
      mobile={mobile} 
      tablet={tablet} 
      desktop={desktop} 
      gap="gap-4 md:gap-6"
      className={className}
      {...props}
    >
      {children}
    </Grid>
  );
}

/**
 * Feature grid optimized for feature sections
 */
export function FeatureGrid({ 
  children, 
  mobile = 1, 
  tablet = 2, 
  desktop = 3,
  className = "",
  ...props
}) {
  return (
    <Grid 
      mobile={mobile} 
      tablet={tablet} 
      desktop={desktop} 
      gap="gap-6 md:gap-8 lg:gap-10"
      className={cn("my-8", className)}
      {...props}
    >
      {children}
    </Grid>
  );
}

/**
 * Form grid optimized for form layouts
 */
export function FormGrid({ 
  children, 
  mobile = 1, 
  tablet = 1, 
  desktop = 2,
  className = "",
  ...props
}) {
  return (
    <Grid 
      mobile={mobile} 
      tablet={tablet} 
      desktop={desktop} 
      gap="gap-4 md:gap-6"
      className={cn("my-4", className)}
      {...props}
    >
      {children}
    </Grid>
  );
} 