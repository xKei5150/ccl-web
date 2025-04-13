# CCL Web Design System

## Color System

### Base Colors
- **Background:** `#FFFFFF` (light) / `#0A0A0A` (dark)
- **Foreground:** `#0A0A0A` (light) / `#FAFAFA` (dark)
- **Primary:** `#2563EB` (light) / `#FAFAFA` (dark)
- **Secondary:** `#F5F5F5` (light) / `#262626` (dark)
- **Muted:** `#F5F5F5` (light) / `#262626` (dark)
- **Accent:** `#F5F5F5` (light) / `#262626` (dark)
- **Destructive:** `#EF4444` (light) / `#7F1D1D` (dark)
- **Success:** `#10B981` (light) / `#059669` (dark)

### Semantic Colors
- **Card:** For container backgrounds
- **Popover:** For floating UI elements
- **Border:** For dividers and outlines
- **Input:** For form controls
- **Ring:** For focus states

## Typography

### Font Family
- **Primary:** Poppins
- **Weights:** 400 (Regular), 500 (Medium), 600 (SemiBold), 700 (Bold)

### Text Sizes
- **xs:** 0.75rem (12px)
- **sm:** 0.875rem (14px)
- **base:** 1rem (16px)
- **lg:** 1.125rem (18px)
- **xl:** 1.25rem (20px)
- **2xl:** 1.5rem (24px)
- **3xl:** 1.875rem (30px)
- **4xl:** 2.25rem (36px)

## Spacing

Consistent spacing using Tailwind's scale:
- **0:** 0px
- **1:** 0.25rem (4px)
- **2:** 0.5rem (8px)
- **3:** 0.75rem (12px)
- **4:** 1rem (16px)
- **5:** 1.25rem (20px)
- **6:** 1.5rem (24px)
- **8:** 2rem (32px)
- **10:** 2.5rem (40px)
- **12:** 3rem (48px)
- **16:** 4rem (64px)

## Border Radius
- **sm:** calc(var(--radius) - 4px)
- **md:** calc(var(--radius) - 2px)
- **lg:** var(--radius)
- **rounded-full:** 9999px

## Components

### Component Hierarchy

#### Primitive Components
- Button
- Input
- Checkbox
- Radio
- Select
- Textarea
- Toggle
- Switch

#### Composite Components
- Form
- Card
- Dialog
- Dropdown
- Toast
- Table
- Tabs
- Navigation

### Button Variants
- **Default:** Primary background with contrasting text
- **Secondary:** Subtle background with contrasting text
- **Outline:** Transparent with border
- **Ghost:** Text-only with hover effect
- **Destructive:** Error/warning colors
- **Link:** Appears as hyperlink

### Button Sizes
- **sm:** Compact buttons
- **default:** Standard size
- **lg:** Large buttons
- **icon:** Square buttons for icons only

## Layout Guidelines

### Container Widths
- **xs:** 20rem (320px)
- **sm:** 24rem (384px)
- **md:** 28rem (448px)
- **lg:** 32rem (512px)
- **xl:** 36rem (576px)
- **2xl:** 42rem (672px)
- **3xl:** 48rem (768px)
- **4xl:** 56rem (896px)
- **5xl:** 64rem (1024px)
- **6xl:** 72rem (1152px)
- **7xl:** 80rem (1280px)

### Grid System
Use Tailwind's grid system with consistent column patterns:
- Mobile: 1-2 columns
- Tablet: 2-4 columns
- Desktop: 4-12 columns

## Responsive Design

### Breakpoints
- **sm:** 640px
- **md:** 768px
- **lg:** 1024px
- **xl:** 1280px
- **2xl:** 1536px

### Mobile-First Approach
All component designs should begin with mobile layouts and progressively enhance for larger screens.

## Animation Guidelines

### Durations
- **fast:** 150ms
- **default:** 250ms
- **slow:** 350ms

### Easing
- **default:** ease-in-out
- **in:** ease-in
- **out:** ease-out
- **linear:** linear

## Accessibility Guidelines

- All interactive elements must have proper focus states
- Color contrast must meet WCAG AA standards
- All images must have alt text
- Form elements must have associated labels
- Proper heading hierarchy must be maintained

## Component Implementation Guidelines

- Use server components by default
- Only add 'use client' when necessary for interactivity
- Wrap client components in Suspense
- Keep component files small and focused
- Export named components rather than default exports 