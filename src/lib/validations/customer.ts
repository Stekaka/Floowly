import { z } from "zod"

export const customerSchema = z.object({
  name: z.string().min(2, "Namnet måste vara minst 2 tecken"),
  company: z.string().optional(),
  email: z.string().email("Ange en giltig e-postadress").optional().or(z.literal("")),
  phone: z.string().min(10, "Telefonnumret måste vara minst 10 siffror"),
  address: z.object({
    street: z.string().min(1, "Gata krävs"),
    city: z.string().min(1, "Stad krävs"),
    postalCode: z.string().min(1, "Postnummer krävs"),
    country: z.string().min(1, "Land krävs"),
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
  content: z.string().min(1, "Anteckningsinnehåll krävs"),
  author: z.string().min(1, "Författare krävs"),
})

export type CustomerFormData = z.infer<typeof customerSchema>
export type CustomerFiltersData = z.infer<typeof customerFiltersSchema>
export type NoteFormData = z.infer<typeof noteSchema>
