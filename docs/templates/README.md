# Feature Implementation Templates

This directory contains templates for implementing new features in the CCL Web application following our architecture guidelines.

## Usage Instructions

When creating a new feature, use these templates as a starting point to ensure consistency with our application architecture.

### 1. Create the feature directory structure

```bash
mkdir -p app/(app)/dashboard/your-feature/{[id],new}
```

### 2. Copy the templates to your feature directory

```bash
cp -r docs/templates/feature-structure/* app/(app)/dashboard/your-feature/
```

### 3. Create the necessary component files

```bash
mkdir -p components/your-feature
```

Implement these components:
- `FeatureList.jsx` - To display a list of items
- `FeatureDetail.jsx` - To display detailed view of an item
- `FeatureForm.jsx` - For creating and editing items
- `FeatureFilters.jsx` - For filtering items

### 4. Replace placeholder names

Search and replace the following in all the copied files:
- `feature` with your feature name (lowercase, hyphenated)
- `Feature` with your feature name (capitalized)
- Update field names and types to match your data model

### 5. Implement the specific feature logic

1. Update the data model and fields in `data.js`
2. Customize the form fields in your `FeatureForm` component
3. Customize the display in your `FeatureList` and `FeatureDetail` components
4. Add any feature-specific actions to `actions.js`

## Template Components

### Key Server Components

- `page.jsx` - The main feature listing page
- `[id]/page.jsx` - The detail view for a specific item
- `new/page.jsx` - Page for creating a new item

### Data and Actions

- `data.js` - Server-side data fetching functions
- `actions.js` - Server actions for mutations

### Error and Loading States

- `error.jsx` - Error boundary component
- `loading.js` - Loading state (used with Suspense)

## Best Practices

1. Keep data fetching in server components
2. Use server actions for forms and mutations
3. Only use client components when necessary for interactivity
4. Make use of Suspense boundaries for loading states
5. Handle errors with appropriate error boundaries

For more detailed information, refer to the [Architecture Guidelines](../architecture-guidelines.md). 