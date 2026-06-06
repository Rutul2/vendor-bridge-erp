// src/utils/schemas.js
import { z } from 'zod';

export const registerSchema = z.object({
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  email: z.string().email(),
  password: z.string().min(6),
  phone: z.string().min(10).optional(),
  role: z.enum(['Admin', 'Officer', 'Vendor', 'Manager']),
  country: z.string().optional()
});

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export const rfqSchema = z.object({
  title: z.string().min(3),
  category: z.string().min(1),
  deadline: z.string(),
  description: z.string().optional(),
  lineItems: z.array(z.object({
    item: z.string().min(1),
    quantity: z.number().positive(),
    unit: z.string().min(1)
  })).min(1),
  assignedVendors: z.array(z.string()).optional()
});