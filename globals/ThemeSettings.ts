import { GlobalConfig } from 'payload';

const ThemeSettings: GlobalConfig = {
  slug: 'theme-settings',
  label: 'Theme Settings',
  access: {
    read: () => true,
    update: ({ req: { user } }) => user && ['admin', 'staff'].includes(user.role),
  },
  fields: [
    { name: 'background', type: 'text', label: 'Background' },
    { name: 'foreground', type: 'text', label: 'Foreground' },
    { name: 'card', type: 'text', label: 'Card' },
    { name: 'cardForeground', type: 'text', label: 'Card Foreground' },
    { name: 'popover', type: 'text', label: 'Popover' },
    { name: 'popoverForeground', type: 'text', label: 'Popover Foreground' },
    { name: 'primary', type: 'text', label: 'Primary' },
    { name: 'primaryForeground', type: 'text', label: 'Primary Foreground' },
    { name: 'secondary', type: 'text', label: 'Secondary' },
    { name: 'secondaryForeground', type: 'text', label: 'Secondary Foreground' },
    { name: 'muted', type: 'text', label: 'Muted' },
    { name: 'mutedForeground', type: 'text', label: 'Muted Foreground' },
    { name: 'accent', type: 'text', label: 'Accent' },
    { name: 'accentForeground', type: 'text', label: 'Accent Foreground' },
    { name: 'destructive', type: 'text', label: 'Destructive' },
    { name: 'destructiveForeground', type: 'text', label: 'Destructive Foreground' },
    { name: 'border', type: 'text', label: 'Border' },
    { name: 'input', type: 'text', label: 'Input' },
    { name: 'ring', type: 'text', label: 'Ring' },
    { name: 'sidebarBackground', type: 'text', label: 'Sidebar Background' },
    { name: 'sidebarForeground', type: 'text', label: 'Sidebar Foreground' },
    { name: 'sidebarPrimary', type: 'text', label: 'Sidebar Primary' },
    { name: 'sidebarPrimaryForeground', type: 'text', label: 'Sidebar Primary Foreground' },
    { name: 'sidebarAccent', type: 'text', label: 'Sidebar Accent' },
    { name: 'sidebarAccentForeground', type: 'text', label: 'Sidebar Accent Foreground' },
    { name: 'sidebarBorder', type: 'text', label: 'Sidebar Border' }
  ],
};

export default ThemeSettings;