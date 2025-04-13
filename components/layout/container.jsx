/**
 * Container component for standardized page layouts
 */
import { containerSize } from "@/lib/style-utils";

/**
 * Container component that provides consistent width constraints
 * 
 * @param {object} props - Component properties
 * @param {React.ReactNode} props.children - Container content
 * @param {string} props.size - Container size (xs, sm, md, lg, xl, 2xl, etc.)
 * @param {string} props.className - Additional CSS classes
 * @param {boolean} props.as - Component to render as (defaults to div)
 * @returns {JSX.Element} Container component
 */
export function Container({ 
  children, 
  size = "5xl", 
  className = "", 
  as: Component = "div" 
}) {
  return (
    <Component className={containerSize(size) + " " + className}>
      {children}
    </Component>
  );
}

/**
 * Page container with standard padding
 */
export function PageContainer({ children, className = "", ...props }) {
  return (
    <Container className={`py-6 md:py-8 lg:py-12 ${className}`} {...props}>
      {children}
    </Container>
  );
}

/**
 * Section container with standard padding
 */
export function SectionContainer({ children, className = "", ...props }) {
  return (
    <Container className={`py-4 md:py-6 lg:py-8 ${className}`} {...props}>
      {children}
    </Container>
  );
} 