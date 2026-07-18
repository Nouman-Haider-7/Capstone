import { z } from 'zod'

const phoneRegex = /^\+?[\d\s\-().]{7,20}$/

export const settingsSchema = z.object({
  fullName: z
    .string()
    .min(2, 'Full Name must be at least 2 characters'),
  email: z
    .string()
    .email('Please enter a valid email address'),
  phone: z
    .string()
    .regex(phoneRegex, 'Please enter a valid phone number')
    .optional()
    .or(z.literal('')),
  bio: z
    .string()
    .max(300, 'Bio must not exceed 300 characters')
    .optional()
    .or(z.literal('')),
  experienceLevel: z.enum(['Beginner', 'Intermediate', 'Professional']),
  skills: z
    .array(z.string())
    .max(10, 'Maximum 10 skills allowed')
    .optional()
    .default([]),
  demoReelUrl: z
    .string()
    .url('Please enter a valid URL')
    .optional()
    .or(z.literal('')),
})

export type SettingsFormData = z.infer<typeof settingsSchema>
