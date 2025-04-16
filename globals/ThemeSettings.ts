import { GlobalConfig } from 'payload';

const ThemeSettings: GlobalConfig = {
  slug: 'theme-settings',
  label: 'Theme Settings',
  access: {
    read: () => true,
    update: ({ req: { user } }) => user && ['admin', 'staff'].includes(user.role),
  },
  fields: [
    // Base colors
    { name: 'background', type: 'text', label: 'Background' },
    { name: 'foreground', type: 'text', label: 'Foreground' },
    
    // Component colors
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
    
    // State colors
    { name: 'destructive', type: 'text', label: 'Destructive' },
    { name: 'destructiveForeground', type: 'text', label: 'Destructive Foreground' },
    { name: 'border', type: 'text', label: 'Border' },
    { name: 'input', type: 'text', label: 'Input' },
    { name: 'ring', type: 'text', label: 'Ring' },
    
    // Sidebar colors
    { name: 'sidebarBackground', type: 'text', label: 'Sidebar Background' },
    { name: 'sidebarForeground', type: 'text', label: 'Sidebar Foreground' },
    { name: 'sidebarPrimary', type: 'text', label: 'Sidebar Primary' },
    { name: 'sidebarPrimaryForeground', type: 'text', label: 'Sidebar Primary Foreground' },
    { name: 'sidebarAccent', type: 'text', label: 'Sidebar Accent' },
    { name: 'sidebarAccentForeground', type: 'text', label: 'Sidebar Accent Foreground' },
    { name: 'sidebarBorder', type: 'text', label: 'Sidebar Border' },
    
    // Chart colors (using kebab-case to match CSS variables)
    { name: 'chart-1', type: 'text', label: 'Chart 1', defaultValue: '#4287F5' },
    { name: 'chart-2', type: 'text', label: 'Chart 2', defaultValue: '#2ECC71' }, 
    { name: 'chart-3', type: 'text', label: 'Chart 3', defaultValue: '#F1C40F' },
    { name: 'chart-4', type: 'text', label: 'Chart 4', defaultValue: '#9B59B6' },
    { name: 'chart-5', type: 'text', label: 'Chart 5', defaultValue: '#E74C3C' }
  ],
};

export default ThemeSettings;