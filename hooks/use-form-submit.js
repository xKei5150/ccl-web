"use client";

import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';

/**
 * Hook for consistent form submission handling
 * 
 * @param {object} options - Hook options
 * @param {Function} options.onSubmit - Submit function that returns a promise
 * @param {string} options.successMessage - Message to show on success
 * @param {string} options.errorMessage - Message to show on error
 * @param {string} options.redirectTo - Path to redirect to on success
 * @param {boolean} options.resetOnSuccess - Whether to reset the form on success
 * @returns {object} Form submission utilities
 */
export function useFormSubmit({
  onSubmit,
  successMessage = 'Form submitted successfully',
  errorMessage = 'Failed to submit form',
  redirectTo,
  resetOnSuccess = false,
}) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  async function handleSubmit(data, formMethods) {
    setIsSubmitting(true);
    try {
      const result = await onSubmit(data);
      
      toast({
        title: 'Success',
        description: successMessage,
      });
      
      if (resetOnSuccess && formMethods?.reset) {
        formMethods.reset();
      }
      
      if (redirectTo) {
        router.push(redirectTo);
      }
      
      return result;
    } catch (error) {
      toast({
        title: 'Error',
        description: error.message || errorMessage,
        variant: 'destructive',
      });
      throw error;
    } finally {
      setIsSubmitting(false);
    }
  }

  return {
    isSubmitting,
    handleSubmit,
  };
} 