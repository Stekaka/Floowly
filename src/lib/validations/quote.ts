import { z } from "zod"
import { QuoteItem, Quote } from "@/types/quote"

export const quoteItemSchema = z.object({
  name: z.string().min(1, "Item name is required"),
  description: z.string().optional(),
  quantity: z.number().min(0.01, "Quantity must be greater than 0"),
  unitPrice: z.number().min(0, "Unit price cannot be negative"),
  taxRate: z.number().min(0).max(100, "Tax rate must be between 0 and 100"),
})

export const customerDataSchema = z.object({
  name: z.string().min(2, "Customer name must be at least 2 characters"),
  company: z.string().optional(),
  email: z.string().email("Invalid email address").optional(),
  phone: z.string().min(8, "Phone number must be at least 8 characters"),
  address: z.object({
    street: z.string().optional(),
    city: z.string().optional(),
    postalCode: z.string().optional(),
    country: z.string().optional(),
  }).optional(),
})

export const quoteSchema = z.object({
  customerId: z.string().optional(),
  newCustomer: z.boolean(),
  customerData: customerDataSchema.optional(),
  saveCustomer: z.boolean(),
  title: z.string().min(1, "Quote title is required"),
  description: z.string().optional(),
  items: z.array(quoteItemSchema).min(1, "At least one item is required"),
  notes: z.string().optional(),
  terms: z.string().optional(),
  hours: z.number().min(0).optional(),
  materialCost: z.number().min(0).optional(),
  markupPercentage: z.number().min(0).max(1000).optional(),
  expiresAt: z.string().optional(),
}).refine((data) => {
  // Either customerId or customerData must be provided
  return data.customerId || data.customerData
}, {
  message: "Either select an existing customer or provide new customer details",
  path: ["customerId"]
})

export const quoteStatusSchema = z.enum(['draft', 'sent', 'accepted', 'rejected', 'expired'])

export const quoteFiltersSchema = z.object({
  status: z.array(z.string()).optional(),
  customerId: z.string().optional(),
  search: z.string().optional(),
  dateFrom: z.string().optional(),
  dateTo: z.string().optional(),
})

export const quoteExportSchema = z.object({
  format: z.enum(['pdf', 'excel', 'csv']),
  includeItems: z.boolean().default(true),
  includeTerms: z.boolean().default(true),
  includeNotes: z.boolean().default(false),
})

export type QuoteFormData = z.infer<typeof quoteSchema>
export type QuoteItemFormData = z.infer<typeof quoteItemSchema>
export type QuoteStatus = z.infer<typeof quoteStatusSchema>
export type QuoteFiltersData = z.infer<typeof quoteFiltersSchema>
export type QuoteExportData = z.infer<typeof quoteExportSchema>
export type CustomerData = z.infer<typeof customerDataSchema>

// Utility functions for calculations
export const calculateItemTotals = (item: Omit<QuoteItem, 'id' | 'subtotal' | 'taxAmount' | 'total'>): Pick<QuoteItem, 'subtotal' | 'taxAmount' | 'total'> => {
  const subtotal = Math.round((item.quantity * item.unitPrice) * 100) / 100
  const taxAmount = Math.round((subtotal * item.taxRate / 100) * 100) / 100
  const total = Math.round((subtotal + taxAmount) * 100) / 100
  
  return { subtotal, taxAmount, total }
}

export const calculateQuoteTotals = (items: QuoteItem[]): Pick<Quote, 'subtotal' | 'taxAmount' | 'total'> => {
  const subtotal = Math.round(items.reduce((sum, item) => sum + item.subtotal, 0) * 100) / 100
  const taxAmount = Math.round(items.reduce((sum, item) => sum + item.taxAmount, 0) * 100) / 100
  const total = Math.round((subtotal + taxAmount) * 100) / 100
  
  return { subtotal, taxAmount, total }
}

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('sv-SE', {
    style: 'currency',
    currency: 'SEK',
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount)
}

export const generateQuoteNumber = (): string => {
  const now = new Date()
  const year = now.getFullYear()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  const day = String(now.getDate()).padStart(2, '0')
  const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0')
  
  return `Q${year}${month}${day}-${random}`
}
