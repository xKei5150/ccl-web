/**
 * Style utility functions for consistent component styling
 */

import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Combines multiple class names and resolves Tailwind conflicts
 * @param {...string} inputs - Class names to combine
 * @returns {string} - Merged class string
 */
export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

/**
 * Get responsive spacing value based on viewport size
 * @param {object} options - Spacing options
 * @param {string} options.mobile - Mobile spacing (default)
 * @param {string} options.tablet - Tablet spacing
 * @param {string} options.desktop - Desktop spacing
 * @returns {string} - Responsive spacing classes
 */
export function responsiveSpacing({ mobile, tablet, desktop }) {
  return cn(
    mobile,
    tablet ? `md:${tablet}` : '',
    desktop ? `lg:${desktop}` : ''
  );
}

/**
 * Generate container width classes
 * @param {string} size - Container size (xs, sm, md, lg, xl, 2xl, etc.)
 * @returns {string} - Container width classes
 */
export function containerSize(size = '5xl') {
  const baseClasses = 'w-full mx-auto px-4';
  const sizeMap = {
    xs: 'max-w-xs', // 20rem (320px)
    sm: 'max-w-sm', // 24rem (384px)
    md: 'max-w-md', // 28rem (448px)
    lg: 'max-w-lg', // 32rem (512px)
    xl: 'max-w-xl', // 36rem (576px)
    '2xl': 'max-w-2xl', // 42rem (672px)
    '3xl': 'max-w-3xl', // 48rem (768px)
    '4xl': 'max-w-4xl', // 56rem (896px)
    '5xl': 'max-w-5xl', // 64rem (1024px)
    '6xl': 'max-w-6xl', // 72rem (1152px)
    '7xl': 'max-w-7xl', // 80rem (1280px)
    none: '', // No max width
  };

  return cn(baseClasses, sizeMap[size] || sizeMap['5xl']);
}

/**
 * Generate grid classes for responsive layouts
 * @param {object} options - Grid options
 * @param {number} options.mobile - Mobile columns (default: 1)
 * @param {number} options.tablet - Tablet columns (default: 2)
 * @param {number} options.desktop - Desktop columns (default: 4)
 * @param {string} options.gap - Grid gap (default: 'gap-4')
 * @returns {string} - Grid classes
 */
export function responsiveGrid({ 
  mobile = 1, 
  tablet = 2, 
  desktop = 4,
  gap = 'gap-4'
}) {
  return cn(
    'grid w-full',
    gap,
    `grid-cols-${mobile}`,
    `md:grid-cols-${tablet}`,
    `lg:grid-cols-${desktop}`
  );
}

/**
 * Generate text size classes with proper line height
 * @param {string} size - Text size (xs, sm, base, lg, xl, 2xl, etc.)
 * @returns {string} - Text size classes
 */
export function textSize(size = 'base') {
  const sizeMap = {
    xs: 'text-xs leading-4',
    sm: 'text-sm leading-5',
    base: 'text-base leading-6',
    lg: 'text-lg leading-7',
    xl: 'text-xl leading-7',
    '2xl': 'text-2xl leading-8',
    '3xl': 'text-3xl leading-9',
    '4xl': 'text-4xl leading-10',
  };

  return sizeMap[size] || sizeMap.base;
}

/**
 * Generate responsive text alignment classes
 * @param {object} options - Alignment options
 * @param {string} options.mobile - Mobile alignment (default: 'left')
 * @param {string} options.tablet - Tablet alignment
 * @param {string} options.desktop - Desktop alignment
 * @returns {string} - Text alignment classes
 */
export function textAlign({ mobile = 'left', tablet, desktop }) {
  const alignMap = {
    left: 'text-left',
    center: 'text-center',
    right: 'text-right',
    justify: 'text-justify',
  };

  return cn(
    alignMap[mobile] || alignMap.left,
    tablet ? `md:${alignMap[tablet]}` : '',
    desktop ? `lg:${alignMap[desktop]}` : ''
  );
} 