// dashboard-app/lib/validations.ts

import { z } from 'zod';

// User validations
export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

export const registerSchema = z.object({
  fullName: z.string().min(1, 'Full name is required').max(255),
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
});

export const updateUserSchema = z.object({
  fullName: z.string().min(1).max(255).optional(),
  email: z.string().email().optional(),
  status: z.enum(['pending', 'active', 'inactive', 'suspended']).optional(),
  password: z.string().min(8).optional(),
});

// Data model validations
export const fieldDefinitionSchema = z.object({
  name: z.string().min(1, 'Field name is required'),
  type: z.enum(['string', 'number', 'date', 'boolean', 'text']),
  displayName: z.string().optional(),
  required: z.boolean().default(false),
  unique: z.boolean().default(false),
  default: z.any().optional(),
  constraints: z.record(z.any()).optional(),
});

export const dataModelSchema = z.object({
  name: z.string().min(1, 'Model name is required').max(255),
  displayName: z.string().min(1, 'Display name is required').max(255),
  description: z.string().optional(),
  schemaJson: z.array(fieldDefinitionSchema).min(1, 'At least one field is required'),
});

export const dataModelUpdateSchema = z.object({
  displayName: z.string().min(1).max(255).optional(),
  description: z.string().optional(),
  schemaJson: z.array(fieldDefinitionSchema).optional(),
  isActive: z.boolean().optional(),
});

// Dashboard validations
export const dashboardSchema = z.object({
  name: z.string().min(1, 'Dashboard name is required').max(255),
  description: z.string().optional(),
  layout: z.any().optional(),
});

export const visualizationSchema = z.object({
  type: z.string().min(1, 'Visualization type is required'),
  title: z.string().max(255).optional(),
  config: z.record(z.any()),
  query: z.string().optional(),
  order: z.number().default(0),
  refreshRate: z.number().default(0),
});

export const dashboardTabSchema = z.object({
  name: z.string().min(1, 'Tab name is required').max(255),
  order: z.number().default(0),
  config: z.record(z.any()).optional(),
});

// Upload validations
export const uploadSchema = z.object({
  modelId: z.number().int().positive('Valid data model is required'),
  fileName: z.string().min(1, 'File name is required'),
  columnMapping: z.record(z.string()).optional(),
});

// Relationship validations
export const relationshipSchema = z.object({
  name: z.string().min(1, 'Relationship name is required'),
  sourceModelId: z.number().int().positive(),
  targetModelId: z.number().int().positive(),
  type: z.enum(['one_to_one', 'one_to_many', 'many_to_many']),
  config: z.object({
    sourceField: z.string(),
    targetField: z.string(),
  }),
});

// Role validations
export const roleSchema = z.object({
  name: z.string().min(1, 'Role name is required').max(100),
  description: z.string().optional(),
  permissionIds: z.array(z.number()).default([]),
});

export const permissionSchema = z.object({
  resource: z.string().min(1, 'Resource is required').max(100),
  action: z.string().min(1, 'Action is required').max(50),
  description: z.string().optional(),
});

// Organization validations
export const organizationalUnitSchema = z.object({
  name: z.string().min(1, 'Unit name is required').max(255),
  type: z.enum(['company', 'division', 'department', 'team']),
  parentId: z.number().int().positive().optional(),
  description: z.string().optional(),
});

// Settings validations
export const profileSettingsSchema = z.object({
  fullName: z.string().min(1).max(255).optional(),
  email: z.string().email().optional(),
  phone: z.string().optional(),
  jobTitle: z.string().max(255).optional(),
  bio: z.string().max(1000).optional(),
});

export const passwordChangeSchema = z.object({
  currentPassword: z.string().min(1, 'Current password is required'),
  newPassword: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string(),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
});

// Validation helper functions
export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export function validatePassword(password: string): {
  isValid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  if (password.length < 8) {
    errors.push('Password must be at least 8 characters long');
  }
  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
  }
  if (!/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter');
  }
  if (!/[0-9]/.test(password)) {
    errors.push('Password must contain at least one number');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

export function validateFileSize(size: number, maxSize: number = 52428800): boolean {
  return size <= maxSize; // Default 50MB
}

export function validateFileExtension(filename: string, allowedExtensions: string[] = ['xlsx', 'xls', 'csv']): boolean {
  const ext = filename.split('.').pop()?.toLowerCase();
  return ext ? allowedExtensions.includes(ext) : false;
}