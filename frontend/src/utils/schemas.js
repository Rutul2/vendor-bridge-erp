// src/utils/schemas.js
import { z } from 'zod';

const passwordSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters')
  .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
  .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
  .regex(/\d/, 'Password must contain at least one number')
  .regex(/[@$!%*?&]/, 'Password must contain at least one special character (@$!%*?&)');

export const registerSchema = z.object({
  firstName: z.string().trim().min(2, 'First name must be at least 2 characters'),
  lastName: z.string().trim().min(2, 'Last name must be at least 2 characters'),
  email: z.string().trim().email('Invalid email address'),
  password: passwordSchema,
  phone: z.string().min(10, 'Phone number must be at least 10 digits').optional().or(z.literal('')),
  role: z.enum(['Admin', 'Officer', 'Vendor', 'Manager']),
  country: z.string().optional(),
});

export const loginSchema = z.object({
  email: z.string().trim().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

export const rfqSchema = z.object({
  title: z.string().trim().min(5, 'Title must be at least 5 characters'),
  category: z.string().trim().min(1, 'Category is required'),
  description: z.string().trim().optional(),
  deadline: z.string().refine((val) => {
    const d = new Date(val);
    return !isNaN(d.getTime()) && d > new Date();
  }, { message: 'Deadline must be a valid future date' }),
  lineItems: z.array(z.object({
    item: z.string().trim().min(2, 'Item name is required'),
    quantity: z.number({ invalid_type_error: 'Quantity must be a number' }).int().positive('Quantity must be at least 1'),
    unit: z.string().trim().min(1, 'Unit is required'),
    estimatedPrice: z.number({ invalid_type_error: 'Price must be a number' }).min(0, 'Price cannot be negative'),
  })).min(1, 'At least one line item is required'),
  assignedVendors: z.array(z.string()).optional(),
});

export const vendorSchema = z.object({
  company_name: z.string().trim().min(2, 'Company name is required'),
  category: z.string().trim().min(1, 'Category is required'),
  email: z.string().trim().email('Invalid email address'),
  phone: z.string().trim().optional(),
  address: z.string().trim().optional(),
  gst_number: z.string().trim().optional(),
});

export { passwordSchema };