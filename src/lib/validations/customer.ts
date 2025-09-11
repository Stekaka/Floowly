import { z } from "zod"

export const customerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  company: z.string().optional(),
  email: z.string().email("Please enter a valid email address").optional().or(z.literal("")),
  phone: z.string().min(10, "Phone number must be at least 10 digits"),
  address: z.object({
    street: z.string().min(1, "Street is required"),
    city: z.string().min(1, "City is required"),
    postalCode: z.string().min(1, "Postal code is required"),
    country: z.string().min(1, "Country is required"),
  }).optional(),
  tags: z.array(z.string()),
  status: z.enum(['active', 'inactive', 'prospect']),
})

export const customerFiltersSchema = z.object({
  search: z.string().default(""),
  status: z.array(z.string()).default([]),
  tags: z.array(z.string()).default([]),
})

export const noteSchema = z.object({
  content: z.string().min(1, "Note content is required"),
  author: z.string().min(1, "Author is required"),
})

export type CustomerFormData = z.infer<typeof customerSchema>
export type CustomerFiltersData = z.infer<typeof customerFiltersSchema>
export type NoteFormData = z.infer<typeof noteSchema>
