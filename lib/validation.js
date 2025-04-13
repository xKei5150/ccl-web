import { z } from 'zod';

/**
 * Common validation rules for reuse
 */
export const validations = {
  // String validations
  name: z.string().min(1, 'Name is required').max(100),
  email: z.string().email('Invalid email address'),
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number'),
  phone: z.string()
    .regex(/^(09|\+639)\d{9}$/, 'Invalid phone number format (e.g., 09XXXXXXXXX or +639XXXXXXXXX)'),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format (YYYY-MM-DD)'),
  website: z.string().url('Invalid URL').optional().or(z.literal('')),
  
  // Number validations
  positiveNumber: z.number().positive('Number must be positive'),
  wholeNumber: z.number().int('Number must be a whole number'),
  percentage: z.number().min(0, 'Percentage must be at least 0').max(100, 'Percentage cannot exceed 100'),
  
  // Boolean validations
  termsAccepted: z.boolean().refine(val => val === true, 'You must accept the terms and conditions'),
  
  // Array validations
  nonEmptyArray: z.array().min(1, 'At least one item is required'),
  
  // Transformations
  trimmedString: z.string().trim(),
  lowercase: z.string().transform(val => val.toLowerCase()),
  uppercase: z.string().transform(val => val.toUpperCase()),
};

/**
 * Creates a zod schema for a person
 * 
 * @returns {z.ZodObject} Person schema
 */
export function createPersonSchema() {
  return z.object({
    name: z.object({
      firstName: validations.name.min(2, 'First name must be at least 2 characters'),
      middleName: z.string().optional(),
      lastName: validations.name.min(2, 'Last name must be at least 2 characters'),
      fullName: z.string().optional(),
    }),
    contact: z.object({
      emailAddress: validations.email.optional(),
      localAddress: validations.name.min(5, 'Address must be at least 5 characters'),
      phoneNumber: validations.phone.optional(),
    }),
    demographics: z.object({
      sex: z.enum(['male', 'female', 'other'], { 
        errorMap: () => ({ message: 'Please select a valid gender' }) 
      }),
      birthDate: validations.date,
      maritalStatus: z.enum(['single', 'married', 'widowed', 'divorced', 'separated'], {
        errorMap: () => ({ message: 'Please select a valid marital status' })
      }),
    }),
    status: z.object({
      residencyStatus: z.enum(['resident', 'non-resident'], {
        errorMap: () => ({ message: 'Please select a valid residency status' })
      }),
      lifeStatus: z.enum(['alive', 'deceased'], {
        errorMap: () => ({ message: 'Please select a valid life status' })
      }).default('alive'),
    }),
  });
}

/**
 * Creates a zod schema for a business
 * 
 * @returns {z.ZodObject} Business schema
 */
export function createBusinessSchema() {
  return z.object({
    businessName: validations.name.min(3, 'Business name must be at least 3 characters'),
    address: validations.name.min(5, 'Address must be at least 5 characters'),
    registrationDate: z.date(),
    typeOfOwnership: z.enum(['single_proprietorship', 'partnership', 'corporation'], {
      errorMap: () => ({ message: 'Please select a valid ownership type' })
    }),
    typeOfCorporation: z.enum(['private', 'public']).optional().nullable(),
    businessContactNo: validations.phone,
    businessEmailAddress: validations.email,
    status: z.enum(['active', 'inactive', 'pending', 'closed'], {
      errorMap: () => ({ message: 'Please select a valid status' })
    }).default('active'),
  });
}

/**
 * Validates form data against a schema
 * 
 * @param {object} data - Form data
 * @param {z.ZodSchema} schema - Zod schema to validate against
 * @returns {object} Validation result with success and errors
 */
export function validateFormData(data, schema) {
  try {
    const validatedData = schema.parse(data);
    return { success: true, data: validatedData, errors: null };
  } catch (error) {
    if (error instanceof z.ZodError) {
      const formattedErrors = error.errors.reduce((acc, err) => {
        const path = err.path.join('.');
        acc[path] = err.message;
        return acc;
      }, {});
      
      return { success: false, data: null, errors: formattedErrors };
    }
    
    throw error;
  }
} 