import { z } from "zod"

export const recurrenceRuleSchema = z.object({
  frequency: z.enum(['daily', 'weekly', 'monthly', 'yearly']),
  interval: z.number().min(1, "Intervall måste vara minst 1"),
  daysOfWeek: z.array(z.number().min(0).max(6)).optional(),
  dayOfMonth: z.number().min(1).max(31).optional(),
  endDate: z.string().optional(),
  count: z.number().min(1).optional(),
})

export const customerDataSchema = z.object({
  name: z.string().min(2, "Kundnamn måste vara minst 2 tecken"),
  company: z.string().optional(),
  email: z.string().email("Ogiltig e-postadress").optional(),
  phone: z.string().min(8, "Telefonnummer måste vara minst 8 tecken"),
  address: z.object({
    street: z.string().optional(),
    city: z.string().optional(),
    postalCode: z.string().optional(),
    country: z.string().optional(),
  }).optional(),
  tags: z.array(z.string()).optional(),
  status: z.enum(['active', 'inactive', 'prospect']),
})

export const jobSchema = z.object({
  customerId: z.string().optional(),
  newCustomer: z.boolean(),
  customerData: customerDataSchema.optional(),
  saveCustomer: z.boolean(),
  quoteId: z.string().optional(),
  title: z.string().min(1, "Jobbtitel krävs"),
  description: z.string().optional(),
  startDate: z.string().min(1, "Startdatum krävs"),
  endDate: z.string().min(1, "Slutdatum krävs"),
  startTime: z.string().optional(),
  endTime: z.string().optional(),
  hours: z.number().min(0, "Timmar kan inte vara negativa"),
  materialCost: z.number().min(0, "Materialkostnad kan inte vara negativ"),
  quotedPrice: z.number().min(0, "Offeratpris kan inte vara negativt"),
  status: z.enum(['pending', 'confirmed', 'in_progress', 'completed', 'cancelled']),
  notes: z.string().optional(),
  isRecurring: z.boolean(),
  recurrenceRule: recurrenceRuleSchema.optional(),
  timezone: z.string().optional(),
}).refine((data) => {
  // Either customerId or customerData must be provided
  return data.customerId || data.customerData
}, {
  message: "Välj antingen en befintlig kund eller ange nya kunduppgifter",
  path: ["customerId"]
})

export const jobFiltersSchema = z.object({
  status: z.array(z.string()).optional(),
  customerId: z.string().optional(),
  dateFrom: z.string().optional(),
  dateTo: z.string().optional(),
  search: z.string().optional(),
})

export type JobFormData = z.infer<typeof jobSchema>
export type JobFiltersData = z.infer<typeof jobFiltersSchema>
export type RecurrenceRuleData = z.infer<typeof recurrenceRuleSchema>
export type CustomerData = z.infer<typeof customerDataSchema>

// Utility functions
export const formatJobTime = (date: string, time?: string): string => {
  const dateObj = new Date(date)
  if (time) {
    const [hours, minutes] = time.split(':')
    dateObj.setHours(parseInt(hours), parseInt(minutes))
  }
  return dateObj.toLocaleString('sv-SE', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export const getJobDuration = (startDate: string, endDate: string): number => {
  const start = new Date(startDate)
  const end = new Date(endDate)
  return Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24))
}

export const getJobStatusColor = (status: string): "default" | "success" | "destructive" | "outline" | "secondary" | "warning" => {
  switch (status) {
    case 'pending': return 'warning'
    case 'confirmed': return 'default'
    case 'in_progress': return 'secondary'
    case 'completed': return 'success'
    case 'cancelled': return 'destructive'
    default: return 'default'
  }
}

export const getJobStatusLabel = (status: string): string => {
  switch (status) {
    case 'pending': return 'Väntande'
    case 'confirmed': return 'Bekräftad'
    case 'in_progress': return 'Pågående'
    case 'completed': return 'Slutförd'
    case 'cancelled': return 'Inställd'
    default: return status
  }
}

export const generateRecurringJobs = (
  job: JobFormData,
  recurrenceRule: RecurrenceRuleData
): JobFormData[] => {
  const jobs: JobFormData[] = []
  const startDate = new Date(job.startDate)
  const endDate = new Date(job.endDate)
  const duration = endDate.getTime() - startDate.getTime()
  
  const currentDate = new Date(startDate)
  let count = 0
  
  while (count < (recurrenceRule.count || 10)) {
    if (recurrenceRule.endDate && currentDate > new Date(recurrenceRule.endDate)) {
      break
    }
    
    const newEndDate = new Date(currentDate.getTime() + duration)
    
    jobs.push({
      ...job,
      startDate: currentDate.toISOString().split('T')[0],
      endDate: newEndDate.toISOString().split('T')[0],
    })
    
    // Calculate next occurrence
    switch (recurrenceRule.frequency) {
      case 'daily':
        currentDate.setDate(currentDate.getDate() + recurrenceRule.interval)
        break
      case 'weekly':
        currentDate.setDate(currentDate.getDate() + (7 * recurrenceRule.interval))
        break
      case 'monthly':
        currentDate.setMonth(currentDate.getMonth() + recurrenceRule.interval)
        break
      case 'yearly':
        currentDate.setFullYear(currentDate.getFullYear() + recurrenceRule.interval)
        break
    }
    
    count++
  }
  
  return jobs
}

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('sv-SE', {
    style: 'currency',
    currency: 'SEK',
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount)
}

export const getCustomerInitials = (name: string): string => {
  return name
    .split(' ')
    .map(word => word.charAt(0))
    .join('')
    .toUpperCase()
    .slice(0, 2)
}
