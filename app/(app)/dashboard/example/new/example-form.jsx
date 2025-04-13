"use client";

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { createBusinessSchema } from '@/lib/validation';
import { useFormSubmit } from '@/hooks/use-form-submit';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CalendarIcon } from 'lucide-react';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import { cn } from '@/lib/style-utils';

/**
 * Example form using standardized form handling patterns
 * 
 * @param {object} props - Component props 
 * @param {Function} props.action - Form submission action
 * @returns {JSX.Element} Example form
 */
export function ExampleForm({ action }) {
  // Initialize form with zod validation
  const form = useForm({
    resolver: zodResolver(createBusinessSchema()),
    defaultValues: {
      businessName: '',
      address: '',
      registrationDate: new Date(),
      typeOfOwnership: '',
      typeOfCorporation: undefined,
      businessContactNo: '',
      businessEmailAddress: '',
      status: 'active',
    },
  });
  
  // Use form submit hook for consistent handling
  const { isSubmitting, handleSubmit } = useFormSubmit({
    onSubmit: (data) => {
      // Convert form data to FormData for server action
      const formData = new FormData();
      Object.entries(data).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          formData.append(key, value instanceof Date ? value.toISOString() : value);
        }
      });
      
      return action(formData);
    },
    successMessage: 'Business created successfully',
    errorMessage: 'Failed to create business',
    redirectTo: '/dashboard/example',
  });
  
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Business Name */}
          <FormField
            control={form.control}
            name="businessName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Business Name</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Enter business name" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          {/* Business Email */}
          <FormField
            control={form.control}
            name="businessEmailAddress"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email Address</FormLabel>
                <FormControl>
                  <Input {...field} type="email" placeholder="Enter business email" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          {/* Business Contact */}
          <FormField
            control={form.control}
            name="businessContactNo"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Contact Number</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="09XXXXXXXXX" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          {/* Registration Date */}
          <FormField
            control={form.control}
            name="registrationDate"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Registration Date</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full pl-3 text-left font-normal",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value ? (
                          format(field.value, "PPP")
                        ) : (
                          <span>Pick a date</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />
          
          {/* Address */}
          <FormField
            control={form.control}
            name="address"
            render={({ field }) => (
              <FormItem className="md:col-span-2">
                <FormLabel>Address</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Enter business address" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          {/* Ownership Type */}
          <FormField
            control={form.control}
            name="typeOfOwnership"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Type of Ownership</FormLabel>
                <Select 
                  onValueChange={field.onChange} 
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select ownership type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="single_proprietorship">Single Proprietorship</SelectItem>
                    <SelectItem value="partnership">Partnership</SelectItem>
                    <SelectItem value="corporation">Corporation</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          
          {/* Corporation Type (conditional) */}
          {form.watch("typeOfOwnership") === "corporation" && (
            <FormField
              control={form.control}
              name="typeOfCorporation"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Type of Corporation</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select corporation type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="private">Private</SelectItem>
                      <SelectItem value="public">Public</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}
          
          {/* Status */}
          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Status</FormLabel>
                <Select 
                  onValueChange={field.onChange} 
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="closed">Closed</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <div className="flex justify-end gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => window.history.back()}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Creating..." : "Create Business"}
          </Button>
        </div>
      </form>
    </Form>
  );
} 