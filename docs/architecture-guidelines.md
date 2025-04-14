# CCL Web Architecture Guidelines

## Overview

This document outlines the architectural patterns and standards for the CCL Web application. We follow a server-first approach using Next.js App Router with React Server Components to maximize performance, SEO, and maintainability.

## Core Principles

1. **Server-first**: Prefer server components over client components whenever possible
2. **Separation of concerns**: Keep data fetching, UI rendering, and business logic separate
3. **Progressive enhancement**: Start with server rendering and add client interactivity where needed
4. **Consistent patterns**: Follow established patterns for directory structure and component organization

## Preferred Architecture

### Server Components

Server Components are the foundation of our architecture. They:

- Execute entirely on the server
- Don't send component code to the client
- Can directly access backend resources
- Reduce client-side JavaScript bundle size
- Support streaming and partial rendering

Use server components for:
- Data fetching
- Page layouts
- Static or server-rendered content
- Components that don't need client-side interactivity

### Client Components

Client Components should be used sparingly and only when necessary:

- When you need interactivity or event listeners
- When you need to use React hooks
- When you need browser-only APIs
- When you need to maintain client-side state

Mark client components with the `'use client'` directive at the top of the file.

### Data Fetching

Data fetching should happen on the server using:

1. Server component direct data fetching (preferred)
2. Server actions for mutations and form submissions
3. Route handlers for API endpoints when needed

Avoid client-side data fetching libraries (like React Query) except when absolutely necessary for real-time updates or optimistic UI.

## Directory Structure

Each feature should follow this directory structure, modeled after the personal module:

```
app/(app)/dashboard/[feature]/
├── page.jsx              # Main server component page
├── data.js               # Data fetching functions
├── actions.js            # Server actions for mutations
├── error.jsx             # Error handling component
├── loading.js            # Loading state component
├── [id]/                 # Dynamic route for item details
│   ├── page.jsx          # Item detail page
│   └── ...               # Other item-specific files
└── new/                  # Route for creating new items
    └── page.jsx          # New item form page
```

## Component Organization

Components should be organized as follows:

1. **Page Components**: Server components in `app/(app)/dashboard/[feature]/page.jsx`
2. **Feature Components**: Specific feature components in `components/[feature]/`
3. **Shared Components**: Reusable components in `components/shared/`
4. **UI Components**: Primitive UI components in `components/ui/`

## Template Implementation

### Page Component (Server Component)

```jsx
// app/(app)/dashboard/[feature]/page.jsx
import { Suspense } from 'react';
import { fetchFeatureData } from "./data";
import FeaturePageContent from "@/components/pages/[feature]/FeaturePageContent";
import { Heading } from "@/components/ui/heading";
import { TableSkeleton } from "@/components/shared/TableSkeleton";
import { SearchSkeleton } from "@/components/shared/SearchSkeleton";

export const metadata = {
  title: "Feature Name | CCL",
  description: "Description of the feature",
};

/**
 * Content component with data fetching
 */
async function FeatureContent({ searchParams }) {
  const params = await searchParams;
  const page = Number(params.page) || 1;
  const limit = Number(params.limit) || 10;
  const data = await fetchFeatureData(page, limit);
  
  return <FeaturePageContent data={data} />;
}

/**
 * Main feature page with suspense boundary
 */
export default function FeaturePage({ searchParams }) {
  return (
    <div className="space-y-6">
      <Heading
        title="Feature Name"
        description="Description of the feature"
      />
      
      <div className="mt-6">
        <Suspense fallback={<SearchSkeleton />}>
          {/* Filters component here */}
        </Suspense>
        
        <div className="mt-6">
          <Suspense fallback={<TableSkeleton columns={5} rows={5} />}>
            <FeatureContent searchParams={searchParams} />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
```

### Data Fetching

```js
// app/(app)/dashboard/[feature]/data.js
"use server";

import { fetchCollection, fetchDocument } from '@/lib/data-fetching';

/**
 * Fetch feature data with pagination
 * 
 * @param {number} page - Page number
 * @param {number} limit - Records per page
 * @returns {Promise<object>} Feature data with pagination
 */
export async function fetchFeatureData(page = 1, limit = 10) {
  return fetchCollection('feature', {
    page,
    limit,
    sort: '-createdAt',
  });
}

/**
 * Fetch a single feature item by ID
 * 
 * @param {string} id - Item ID
 * @returns {Promise<object>} Feature item
 */
export async function fetchFeatureItem(id) {
  return fetchDocument('feature', id);
}
```

### Server Actions

```js
// app/(app)/dashboard/[feature]/actions.js
"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createDocument, updateDocument, deleteDocument } from '@/lib/data-fetching';

/**
 * Create a new feature item
 */
export async function createFeatureItem(formData) {
  const data = Object.fromEntries(formData.entries());
  
  try {
    await createDocument('feature', data);
    revalidatePath('/dashboard/feature');
    redirect('/dashboard/feature');
  } catch (error) {
    console.error('Error creating feature item:', error);
    return { error: 'Failed to create feature item' };
  }
}

/**
 * Update an existing feature item
 */
export async function updateFeatureItem(id, formData) {
  const data = Object.fromEntries(formData.entries());
  
  try {
    await updateDocument('feature', id, data);
    revalidatePath(`/dashboard/feature/${id}`);
    revalidatePath('/dashboard/feature');
    return { success: true };
  } catch (error) {
    console.error(`Error updating feature item ${id}:`, error);
    return { error: 'Failed to update feature item' };
  }
}

/**
 * Delete a feature item
 */
export async function deleteFeatureItem(id) {
  try {
    await deleteDocument('feature', id);
    revalidatePath('/dashboard/feature');
    return { success: true };
  } catch (error) {
    console.error(`Error deleting feature item ${id}:`, error);
    return { error: 'Failed to delete feature item' };
  }
}
```

### Error Handling

```jsx
// app/(app)/dashboard/[feature]/error.jsx
"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";

export default function ErrorPage({ error, reset }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] text-center">
      <AlertCircle className="h-16 w-16 text-destructive mb-4" />
      <h2 className="text-xl font-semibold mb-2">Something went wrong</h2>
      <p className="text-muted-foreground mb-4 max-w-md">
        We're sorry, but there was an error loading this page.
      </p>
      <Button onClick={reset}>Try again</Button>
    </div>
  );
}
```

### Loading State

```jsx
// app/(app)/dashboard/[feature]/loading.js
export default function Loading() {
  return null; // Handled by Suspense fallbacks
}
```

## Feature Component Implementation

Feature-specific components should be kept in the components directory:

```jsx
// components/pages/[feature]/FeaturePageContent.jsx
import { FeatureList } from "@/components/feature/FeatureList";

export default function FeaturePageContent({ data }) {
  return (
    <FeatureList
      items={data.docs}
      pagination={data}
    />
  );
}
```

## Advantages of This Approach

1. **Performance**:
   - Reduced client-side JavaScript
   - Faster initial page load
   - Improved Core Web Vitals

2. **SEO**:
   - Server-rendered content is better for search engines
   - Improved crawlability and indexability

3. **Developer Experience**:
   - Clear separation of concerns
   - Predictable data flow
   - Consistent patterns

4. **Maintainability**:
   - Easier to understand and debug
   - More consistent codebase
   - Reduced duplication

## When to Consider Alternatives

There are limited cases where client-side fetching might be appropriate:

1. Real-time data that needs frequent updates
2. Highly interactive UIs that depend on client state
3. Features requiring offline support

Even in these cases, consider using a hybrid approach where the initial data is served from the server and subsequent updates use client-side fetching.

## Migrating Existing Features

When migrating existing features to follow this architecture:

1. Move client-side data fetching to server components
2. Replace React Query with server component data fetching
3. Convert client components to server components where possible
4. Use server actions for mutations instead of client-side API calls

## Conclusion

Following these architecture guidelines will ensure a consistent, performant, and maintainable codebase across the CCL Web application. The server-first approach leverages the full capabilities of Next.js App Router and provides the best experience for both users and developers. 