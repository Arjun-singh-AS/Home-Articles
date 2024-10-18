import { z } from 'zod';

// Username validation schema
export const usernameValidation = z
  .string()
  .min(2, 'Username must be at least 2 characters')
  .max(20, 'Username must not exceed 20 characters')
  .regex(/^[a-zA-Z0-9_]{3,}$/, 'Invalid username format (letters, numbers, and underscores allowed)');

// Signup schema
export const signUpSchema = z.object({
  username: usernameValidation,
  password: z.string().min(8, 'Password must be at least 8 characters'),
  email: z.string().email({ message: 'Please enter a valid email address' }),
  phone: z.string()
    .length(10, 'Phone number should have exactly 10 digits')
    .regex(/^\d{10}$/, 'Phone number should only contain digits'),  // Ensures phone number contains only digits
});

