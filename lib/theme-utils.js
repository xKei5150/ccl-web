/**
 * Regular expression for validating hex color codes.
 * Matches 3-digit and 6-digit hex colors with optional # prefix.
 */
export const hexColorRegex = /^#?([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;

/**
 * Converts a hex color to RGB values
 * @param {string} hex - The hex color code
 * @returns {Object} RGB values as {r, g, b}
 */
export function hexToRGB(hex) {
  // Remove the hash if present
  hex = hex.replace('#', '');

  // Convert 3-digit hex to 6-digit
  if (hex.length === 3) {
    hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
  }

  // Parse the hex values
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);

  return { r, g, b };
}

/**
 * Converts RGB values to a hex color code
 * @param {number} r - Red value (0-255)
 * @param {number} g - Green value (0-255)
 * @param {number} b - Blue value (0-255)
 * @returns {string} Hex color code
 */
export function RGBToHex(r, g, b) {
  return '#' + [r, g, b]
    .map(x => {
      const hex = x.toString(16);
      return hex.length === 1 ? '0' + hex : hex;
    })
    .join('');
}

/**
 * Validates if a string is a valid hex color code
 * @param {string} color - The color string to validate
 * @returns {boolean} True if valid hex color
 */
export function isValidHexColor(color) {
  return hexColorRegex.test(color);
}

/**
 * Adjusts the brightness of a hex color
 * @param {string} hex - The hex color code
 * @param {number} percent - Percentage to adjust (-100 to 100)
 * @returns {string} Adjusted hex color
 */
export function adjustBrightness(hex, percent) {
  const { r, g, b } = hexToRGB(hex);
  const amount = Math.floor((percent / 100) * 255);

  const newR = Math.max(0, Math.min(255, r + amount));
  const newG = Math.max(0, Math.min(255, g + amount));
  const newB = Math.max(0, Math.min(255, b + amount));

  return RGBToHex(newR, newG, newB);
}

/**
 * Calculates the relative luminance of a color
 * @param {string} hex - The hex color code
 * @returns {number} Relative luminance value
 */
export function getLuminance(hex) {
  const { r, g, b } = hexToRGB(hex);
  const [rs, gs, bs] = [r / 255, g / 255, b / 255].map(v => 
    v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4)
  );
  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
}

/**
 * Checks if text should be dark or light based on background color
 * @param {string} bgColor - Background color in hex
 * @returns {string} '#000000' for dark text or '#FFFFFF' for light text
 */
export function getContrastText(bgColor) {
  const luminance = getLuminance(bgColor);
  return luminance > 0.5 ? '#000000' : '#FFFFFF';
}

/**
 * Detects system color scheme preference
 * @returns {string} 'dark' or 'light'
 */
export function getSystemTheme() {
  if (typeof window === 'undefined') return 'light';
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

/**
 * Adds a transition class to smooth theme changes
 * @param {number} duration - Transition duration in ms
 */
export function enableThemeTransition(duration = 200) {
  document.documentElement.classList.add('theme-transition');
  return () => {
    // Use RAF to ensure transition class is removed after styles are applied
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        document.documentElement.classList.remove('theme-transition');
      });
    });
  };
}

/**
 * Sets theme variables on the document root
 * @param {Object} theme - Theme object with color values
 */
export function applyThemeVariables(theme) {
  // Enable transition before applying theme
  const cleanup = enableThemeTransition();
  
  // Apply each theme variable
  Object.entries(theme).forEach(([key, value]) => {
    // Convert camelCase to kebab-case for CSS variables
    const cssKey = key.replace(/([A-Z])/g, '-$1').toLowerCase();
    document.documentElement.style.setProperty(`--${cssKey}`, value);
  });
  
  // Clean up transition class after changes are applied
  cleanup();
}

/**
 * Creates a derived color based on a base color
 * @param {string} baseColor - Base color in hex
 * @param {Object} options - Adjustment options
 * @returns {string} Derived color in hex
 */
export function derivedColor(baseColor, { 
  lighten = 0, // Percentage to lighten (-100 to 100)
  opacity = 100, // Opacity percentage (0 to 100)
  saturate = 0 // Saturation adjustment (-100 to 100)
} = {}) {
  const { r, g, b } = hexToRGB(baseColor);
  
  // Apply lightness adjustment
  const l = lighten / 100;
  const newR = Math.max(0, Math.min(255, r + (l > 0 ? (255 - r) * l : r * l)));
  const newG = Math.max(0, Math.min(255, g + (l > 0 ? (255 - g) * l : g * l)));
  const newB = Math.max(0, Math.min(255, b + (l > 0 ? (255 - b) * l : b * l)));
  
  return RGBToHex(Math.round(newR), Math.round(newG), Math.round(newB));
}

/**
 * Generates a monochromatic color scheme from a base color
 * @param {string} baseColor - Base color in hex
 * @param {number} steps - Number of colors to generate
 * @returns {string[]} Array of hex colors
 */
export function generateMonochromaticScheme(baseColor, steps = 5) {
  const { r, g, b } = hexToRGB(baseColor);
  const colors = [];
  
  for (let i = 0; i < steps; i++) {
    const factor = (i / (steps - 1)) * 2 - 1; // Range from -1 to 1
    const adjustedColor = adjustBrightness(baseColor, factor * 50);
    colors.push(adjustedColor);
  }
  
  return colors;
}

/**
 * Creates a complete theme object with all required color variables
 * @param {Object} baseColors - Base colors for the theme
 * @returns {Object} Complete theme object
 */
export function generateTheme({
  background = '#FFFFFF',
  foreground = '#000000',
  primary = '#000000',
  accent = '#F5F5F5',
  sidebar = '#FAFAFA'
} = {}) {
  // Generate complementary colors
  const primaryForeground = getContrastText(primary);
  const accentForeground = getContrastText(accent);
  const sidebarForeground = getContrastText(sidebar);

  // Generate secondary colors
  const secondary = derivedColor(primary, { lighten: 45 });
  const secondaryForeground = getContrastText(secondary);

  // Generate muted colors
  const muted = derivedColor(accent, { lighten: -10 });
  const mutedForeground = derivedColor(foreground, { opacity: 60 });

  // Generate sidebar colors
  const sidebarAccent = derivedColor(sidebar, { lighten: -5 });
  const sidebarPrimary = primary;
  const sidebarPrimaryForeground = primaryForeground;
  const sidebarAccentForeground = getContrastText(sidebarAccent);
  const sidebarBorder = derivedColor(sidebar, { lighten: -10 });

  return {
    background,
    foreground,
    card: background,
    cardForeground: foreground,
    popover: background,
    popoverForeground: foreground,
    primary,
    primaryForeground,
    secondary,
    secondaryForeground,
    muted,
    mutedForeground,
    accent,
    accentForeground,
    destructive: '#EF4444',
    destructiveForeground: '#FFFFFF',
    border: derivedColor(background, { lighten: -10 }),
    input: derivedColor(background, { lighten: -5 }),
    ring: primary,
    sidebarBackground: sidebar,
    sidebarForeground,
    sidebarPrimary,
    sidebarPrimaryForeground,
    sidebarAccent,
    sidebarAccentForeground,
    sidebarBorder
  };
}

/**
 * Validates a complete theme object
 * @param {Object} theme - Theme object to validate
 * @returns {boolean} True if theme is valid
 */
export function validateTheme(theme) {
  const requiredKeys = [
    'background',
    'foreground',
    'card',
    'cardForeground',
    'popover',
    'popoverForeground',
    'primary',
    'primaryForeground',
    'secondary',
    'secondaryForeground',
    'muted',
    'mutedForeground',
    'accent',
    'accentForeground',
    'destructive',
    'destructiveForeground',
    'border',
    'input',
    'ring',
    'sidebarBackground',
    'sidebarForeground',
    'sidebarPrimary',
    'sidebarPrimaryForeground',
    'sidebarAccent',
    'sidebarAccentForeground',
    'sidebarBorder'
  ];

  return requiredKeys.every(key => 
    key in theme && isValidHexColor(theme[key])
  );
}