# Dashboard Refactoring Implementation Plan

This document outlines the step-by-step approach for refactoring the dashboard and its routes to align with the CCL Web application's new standardized patterns. The goal is to implement proper separation of server and client components, standardized data fetching, and consistent form handling across all dashboard routes.

## Dashboard Main Page Refactoring

### Current Implementation
- Main dashboard page uses a combination of server components and client components
- Data fetching uses custom getDashboardData function
- Client-side DashboardCharts component with useState for UI state
- Loading states and error handling are implemented but not with standardized patterns

### Refactoring Tasks

1. **Server Component**
   - ✅ Convert page.js to properly use standardized data fetching patterns
   - ✅ Implement proper suspense boundaries
   - ✅ Create structured folder organization

2. **Client Components**
   - ✅ Refactor DashboardCharts.jsx to use React Query for additional data fetching
   - ✅ Update PredictionsTab to use React Query
   - ✅ Implement proper loading states using standardized Loading component

3. **Actions & API**
   - ✅ Create dashboard-data.js using standardized patterns
   - ✅ Create REST API endpoints for client-side data fetching
   - ✅ Implement proper error handling in API routes

## Dashboard Route Pages

### Personal Information Route (/dashboard/personal)

#### Current Implementation
- Uses a mix of custom hooks and direct API calls
- Form handling does not follow standardized patterns

#### Refactoring Tasks
- ✅ Convert page.js to use server component data fetching
  - ✅ Create data.js with standardized patterns
  - ✅ Use fetchPersonalRecords function
  - ✅ Add proper Suspense boundaries
- ✅ Refactor client components
  - ✅ Update PersonalPage.jsx to use React Query
  - ✅ Implement better error handling
- ✅ Create API endpoints
  - ✅ Add /api/personal/delete endpoint

### Business Route (/dashboard/business)

#### Current Implementation
- Uses custom data fetching logic
- Multiple client components with duplicated state management

#### Refactoring Tasks
- ✅ Create a detailed refactoring plan (docs/business-refactoring-plan.md)
- ✅ Update BusinessList.jsx to use server component pattern
- ✅ Update BusinessFilters.jsx to use URL patterns for filtering
- ✅ Enhance actions.js with proper server actions
- ✅ Clean up data.js to follow server component pattern
- ✅ Remove redundant client-side data fetching with React Query (useBusinesses.js)
- ✅ Create PageHeader component in shared directory
- ✅ Fix import issues and test basic functionality
- [ ] Add comprehensive error handling and tests

### Business Permits Route (/dashboard/business-permits)

#### Current Implementation
- Similar to business route but with permit-specific logic
- Inconsistent error handling

#### Refactoring Tasks
- [ ] Follow same pattern as business route refactoring
- [ ] Ensure consistent error handling
- [ ] Implement proper loading states

### Staff Route (/dashboard/staff)

#### Current Implementation
- Uses custom hook for staff management
- Inconsistent form validation

#### Refactoring Tasks
- [ ] Refactor to use consistent patterns
- [ ] Implement standardized Zod validation
- [ ] Update client components

### Reports Route (/dashboard/reports)

#### Current Implementation
- Uses direct API calls
- Custom chart components with local state

#### Refactoring Tasks
- [ ] Server-side data fetching for initial data
- [ ] Client-side components with React Query
- [ ] Proper loading states

### Remaining Routes

Apply the same patterns to the following routes:
- [ ] General Requests (/dashboard/general-requests)
- [ ] Household (/dashboard/household)
- [ ] Posts (/dashboard/posts)
- [ ] Profile (/dashboard/profile)
- [ ] Site Settings (/dashboard/site-settings)
- [ ] Theme (/dashboard/theme)
- [ ] Storage (/dashboard/storage)

## Implementation Approach

1. **Start with Main Dashboard**
   - ✅ Refactor server component
   - ✅ Update client components
   - ✅ Create proper API endpoints

2. **Apply Pattern to Major Routes**
   - ✅ Personal Information
   - [ ] Business
   - [ ] Staff
   - [ ] Reports

3. **Complete Remaining Routes**
   - [ ] Apply standardized patterns to all remaining routes
   - [ ] Final testing and validation

## Success Criteria

- All dashboard routes use standardized data fetching
- Server and client components are properly separated
- Form handling follows consistent patterns with Zod validation
- Loading and error states are consistent
- All UI patterns match design system guidelines 