export interface Job {
  id: string
  customerId: string
  customer?: {
    id: string
    name: string
    company?: string
    email?: string
    phone: string
    avatar?: string
  }
  quoteId?: string
  quote?: {
    id: string
    quoteNumber: string
    title: string
    total: number
    status: 'draft' | 'sent' | 'accepted' | 'rejected' | 'expired'
  }
  title: string
  description?: string
  startDate: string
  endDate: string
  startTime?: string
  endTime?: string
  hours: number
  materialCost: number
  quotedPrice: number
  status: 'pending' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled'
  notes?: string
  createdAt: string
  updatedAt: string
  // Recurring job support
  isRecurring?: boolean
  recurrenceRule?: RecurrenceRule
  parentJobId?: string
  // Timezone support
  timezone?: string
}

export interface RecurrenceRule {
  frequency: 'daily' | 'weekly' | 'monthly' | 'yearly'
  interval: number
  daysOfWeek?: number[] // 0 = Sunday, 1 = Monday, etc.
  dayOfMonth?: number
  endDate?: string
  count?: number
}

export interface JobCreateRequest {
  customerId: string
  quoteId?: string
  title: string
  description?: string
  startDate: string
  endDate: string
  startTime?: string
  endTime?: string
  hours: number
  materialCost: number
  quotedPrice: number
  status?: 'pending' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled'
  notes?: string
  isRecurring?: boolean
  recurrenceRule?: RecurrenceRule
  timezone?: string
}

export interface JobUpdateRequest extends Partial<JobCreateRequest> {
  id: string
}

export interface JobFilters {
  status?: string[]
  customerId?: string
  dateFrom?: string
  dateTo?: string
  search?: string
}

export interface JobStats {
  total: number
  pending: number
  confirmed: number
  inProgress: number
  completed: number
  cancelled: number
  totalHours: number
  totalRevenue: number
  averageJobDuration: number
}

export interface CalendarEvent {
  id: string
  title: string
  start: Date
  end: Date
  resource: Job
  allDay?: boolean
}

export interface UpcomingJob {
  id: string
  title: string
  customer: {
    id: string
    name: string
    company?: string
    avatar?: string
  }
  startDate: string
  endDate: string
  status: Job['status']
  quotedPrice: number
  quote?: {
    id: string
    quoteNumber: string
    status: string
  }
}

export type CalendarView = 'month' | 'week' | 'day'

export interface CalendarState {
  currentDate: Date
  view: CalendarView
  selectedDate?: Date
  selectedJob?: Job
}
