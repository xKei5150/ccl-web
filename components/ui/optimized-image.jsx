"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { cn } from '@/lib/style-utils';
import { ImageOff } from 'lucide-react';

/**
 * Optimized image component with loading and error states
 * 
 * @param {object} props - Component properties
 * @param {string} props.src - Image source URL
 * @param {string} props.alt - Image alt text
 * @param {number} props.width - Image width
 * @param {number} props.height - Image height
 * @param {string} props.className - Additional CSS classes for the image container
 * @param {string} props.imgClassName - Additional CSS classes for the image element
 * @param {string} props.fallbackSrc - Fallback image source if main image fails to load
 * @param {boolean} props.showLoadingState - Whether to show loading state
 * @param {string} props.loadingClassName - Additional CSS classes for loading state
 * @param {string} props.errorClassName - Additional CSS classes for error state
 * @param {boolean} props.priority - Whether to prioritize image loading
 * @returns {JSX.Element} OptimizedImage component
 */
export function OptimizedImage({
  src,
  alt,
  width,
  height,
  className,
  imgClassName,
  fallbackSrc,
  showLoadingState = true,
  loadingClassName,
  errorClassName,
  priority = false,
  ...props
}) {
  const [isLoading, setIsLoading] = useState(showLoadingState);
  const [error, setError] = useState(false);
  const [imageSrc, setImageSrc] = useState(src);

  // Reset loading and error states when src changes
  useEffect(() => {
    setIsLoading(showLoadingState);
    setError(false);
    setImageSrc(src);
  }, [src, showLoadingState]);

  // Handle image load complete
  const handleLoadComplete = () => {
    setIsLoading(false);
  };

  // Handle image load error
  const handleError = () => {
    setIsLoading(false);
    setError(true);
    
    // Use fallback image if provided
    if (fallbackSrc) {
      setImageSrc(fallbackSrc);
    }
  };

  return (
    <div className={cn("relative overflow-hidden", className)}>
      {/* Loading state */}
      {isLoading && (
        <div 
          className={cn(
            "absolute inset-0 bg-muted/30 animate-pulse",
            loadingClassName
          )}
          style={{ zIndex: 1 }}
        />
      )}

      {/* Error state */}
      {error && !fallbackSrc && (
        <div 
          className={cn(
            "absolute inset-0 bg-muted flex items-center justify-center",
            errorClassName
          )}
        >
          <div className="flex flex-col items-center text-muted-foreground">
            <ImageOff className="h-6 w-6 mb-1" />
            <span className="text-xs">{alt ? alt : "Image failed to load"}</span>
          </div>
        </div>
      )}

      {/* Image element */}
      <Image
        src={imageSrc}
        alt={alt || ""}
        width={width}
        height={height}
        onLoad={handleLoadComplete}
        onError={handleError}
        className={cn(
          "object-cover",
          error && !fallbackSrc && "invisible",
          imgClassName
        )}
        priority={priority}
        {...props}
      />
    </div>
  );
} 