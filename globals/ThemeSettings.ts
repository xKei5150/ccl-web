import { GlobalConfig } from 'payload';

const ThemeSettings: GlobalConfig = {
  slug: 'theme-settings',
  label: 'Theme Settings',
  fields: [
    {
      name: 'sidebarColor',
      type: 'text',
      label: 'Sidebar Color',
    },
    {
      name: 'textColor',
      type: 'text',
      label: 'Text Color',
    },
    {
      name: 'pageBackgroundColor',
      type: 'text',
      label: 'Page Background Color',
    },
    {
      name: 'tableHeaderColor',
      type: 'text',
      label: 'Table Header Color',
    },
    {
      name: 'tableItemColor',
      type: 'text',
      label: 'Table Item Color',
    },
    {
      name: 'primaryButtonColor',
      type: 'text',
      label: 'Primary Button Color',
    },
    {
      name: 'secondaryButtonColor',
      type: 'text',
      label: 'Secondary Button Color',
    },
  ],
};

export default ThemeSettings;