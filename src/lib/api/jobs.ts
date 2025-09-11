import { Job, JobCreateRequest, JobUpdateRequest, JobFilters, JobStats, UpcomingJob, CalendarEvent } from "@/types/job"
import { formatJobTime, getJobDuration, getCustomerInitials } from "@/lib/validations/job"

// Mock data - replace with actual API calls
const mockJobs: Job[] = [
  {
    id: '1',
    customerId: '1',
    customer: {
      id: '1',
      name: 'John Doe',
      company: 'Acme Corp',
      email: 'john@acme.com',
      phone: '+46 70 123 4567',
    },
    quoteId: '1',
    quote: {
      id: '1',
      quoteNumber: 'Q20241201-001',
      title: 'BMW X5 Full Wrap',
      total: 31250,
      status: 'accepted',
    },
    title: 'BMW X5 Full Wrap',
    description: 'Complete vehicle wrap with matte black vinyl',
    startDate: '2024-12-15',
    endDate: '2024-12-20',
    startTime: '09:00',
    endTime: '17:00',
    hours: 40,
    materialCost: 15000,
    quotedPrice: 31250,
    status: 'confirmed',
    notes: 'Customer prefers matte finishes',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    timezone: 'Europe/Stockholm',
  },
  {
    id: '2',
    customerId: '2',
    customer: {
      id: '2',
      name: 'Jane Smith',
      company: 'Tech Solutions AB',
      email: 'jane@techsolutions.se',
      phone: '+46 70 987 6543',
    },
    quoteId: '2',
    quote: {
      id: '2',
      quoteNumber: 'Q20241201-002',
      title: 'Tesla Model 3 Partial Wrap',
      total: 12500,
      status: 'sent',
    },
    title: 'Tesla Model 3 Partial Wrap',
    description: 'Hood and roof wrap with gloss white vinyl',
    startDate: '2024-12-18',
    endDate: '2024-12-19',
    startTime: '10:00',
    endTime: '16:00',
    hours: 12,
    materialCost: 6000,
    quotedPrice: 12500,
    status: 'in_progress',
    notes: 'Customer wants to see progress photos',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    timezone: 'Europe/Stockholm',
  },
  {
    id: '3',
    customerId: '3',
    customer: {
      id: '3',
      name: 'Mike Johnson',
      company: 'Auto Parts Ltd',
      email: 'mike@autoparts.com',
      phone: '+46 70 555 1234',
    },
    title: 'Mercedes E-Class Hood Wrap',
    description: 'Hood wrap with carbon fiber pattern',
    startDate: '2024-12-22',
    endDate: '2024-12-22',
    startTime: '14:00',
    endTime: '18:00',
    hours: 4,
    materialCost: 2000,
    quotedPrice: 3750,
    status: 'pending',
    notes: 'Quick job, customer in a hurry',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    timezone: 'Europe/Stockholm',
  },
  {
    id: '4',
    customerId: '1',
    customer: {
      id: '1',
      name: 'John Doe',
      company: 'Acme Corp',
      email: 'john@acme.com',
      phone: '+46 70 123 4567',
    },
    title: 'BMW X5 Maintenance',
    description: 'Regular maintenance and touch-ups',
    startDate: '2024-12-25',
    endDate: '2024-12-25',
    startTime: '09:00',
    endTime: '12:00',
    hours: 3,
    materialCost: 500,
    quotedPrice: 1500,
    status: 'completed',
    notes: 'Completed successfully',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    timezone: 'Europe/Stockholm',
  },
]

export const jobApi = {
  async getJobs(filters?: JobFilters): Promise<Job[]> {
    await new Promise(resolve => setTimeout(resolve, 500)) // Simulate API delay
    
    let filteredJobs = [...mockJobs]
    
    if (filters?.status?.length) {
      filteredJobs = filteredJobs.filter(job => 
        filters.status!.includes(job.status)
      )
    }
    
    if (filters?.customerId) {
      filteredJobs = filteredJobs.filter(job => 
        job.customerId === filters.customerId
      )
    }
    
    if (filters?.search) {
      const searchLower = filters.search.toLowerCase()
      filteredJobs = filteredJobs.filter(job => 
        job.title.toLowerCase().includes(searchLower) ||
        job.description?.toLowerCase().includes(searchLower) ||
        job.customer?.name.toLowerCase().includes(searchLower) ||
        job.customer?.company?.toLowerCase().includes(searchLower)
      )
    }
    
    if (filters?.dateFrom) {
      filteredJobs = filteredJobs.filter(job => 
        new Date(job.startDate) >= new Date(filters.dateFrom!)
      )
    }
    
    if (filters?.dateTo) {
      filteredJobs = filteredJobs.filter(job => 
        new Date(job.startDate) <= new Date(filters.dateTo!)
      )
    }
    
    return filteredJobs
  },

  async getJob(id: string): Promise<Job> {
    await new Promise(resolve => setTimeout(resolve, 300))
    
    const job = mockJobs.find(j => j.id === id)
    if (!job) {
      throw new Error('Job not found')
    }
    
    return job
  },

  async createJob(data: JobCreateRequest): Promise<Job> {
    await new Promise(resolve => setTimeout(resolve, 800))
    
    const newJob: Job = {
      id: (mockJobs.length + 1).toString(),
      ...data,
      status: data.status || 'pending',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      timezone: data.timezone || 'Europe/Stockholm',
    }
    
    mockJobs.push(newJob)
    return newJob
  },

  async updateJob(data: JobUpdateRequest): Promise<Job> {
    await new Promise(resolve => setTimeout(resolve, 600))
    
    const index = mockJobs.findIndex(j => j.id === data.id)
    if (index === -1) {
      throw new Error('Job not found')
    }
    
    mockJobs[index] = {
      ...mockJobs[index],
      ...data,
      updatedAt: new Date().toISOString(),
    }
    
    return mockJobs[index]
  },

  async deleteJob(id: string): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 400))
    
    const index = mockJobs.findIndex(j => j.id === id)
    if (index === -1) {
      throw new Error('Job not found')
    }
    
    mockJobs.splice(index, 1)
  },

  async updateJobStatus(id: string, status: Job['status']): Promise<Job> {
    await new Promise(resolve => setTimeout(resolve, 300))
    
    const job = mockJobs.find(j => j.id === id)
    if (!job) {
      throw new Error('Job not found')
    }
    
    job.status = status
    job.updatedAt = new Date().toISOString()
    
    return job
  },

  async getJobStats(): Promise<JobStats> {
    await new Promise(resolve => setTimeout(resolve, 200))
    
    const total = mockJobs.length
    const pending = mockJobs.filter(j => j.status === 'pending').length
    const confirmed = mockJobs.filter(j => j.status === 'confirmed').length
    const inProgress = mockJobs.filter(j => j.status === 'in_progress').length
    const completed = mockJobs.filter(j => j.status === 'completed').length
    const cancelled = mockJobs.filter(j => j.status === 'cancelled').length
    
    const totalHours = mockJobs.reduce((sum, j) => sum + j.hours, 0)
    const totalRevenue = mockJobs.reduce((sum, j) => sum + j.quotedPrice, 0)
    const averageJobDuration = total > 0 ? totalHours / total : 0
    
    return {
      total,
      pending,
      confirmed,
      inProgress,
      completed,
      cancelled,
      totalHours,
      totalRevenue,
      averageJobDuration,
    }
  },

  async getUpcomingJobs(days: number = 7): Promise<UpcomingJob[]> {
    await new Promise(resolve => setTimeout(resolve, 200))
    
    const now = new Date()
    const futureDate = new Date(now.getTime() + (days * 24 * 60 * 60 * 1000))
    
    return mockJobs
      .filter(job => {
        const jobDate = new Date(job.startDate)
        return jobDate >= now && jobDate <= futureDate
      })
      .map(job => ({
        id: job.id,
        title: job.title,
        customer: {
          id: job.customer!.id,
          name: job.customer!.name,
          company: job.customer!.company,
          avatar: job.customer!.avatar,
        },
        startDate: job.startDate,
        endDate: job.endDate,
        status: job.status,
        quotedPrice: job.quotedPrice,
        quote: job.quote ? {
          id: job.quote.id,
          quoteNumber: job.quote.quoteNumber,
          status: job.quote.status,
        } : undefined,
      }))
      .sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime())
  },

  async getCalendarEvents(startDate: Date, endDate: Date): Promise<CalendarEvent[]> {
    await new Promise(resolve => setTimeout(resolve, 300))
    
    return mockJobs
      .filter(job => {
        const jobStart = new Date(job.startDate)
        const jobEnd = new Date(job.endDate)
        return jobStart <= endDate && jobEnd >= startDate
      })
      .map(job => {
        const start = new Date(job.startDate)
        const end = new Date(job.endDate)
        
        // Add time if specified
        if (job.startTime) {
          const [hours, minutes] = job.startTime.split(':')
          start.setHours(parseInt(hours), parseInt(minutes))
        }
        
        if (job.endTime) {
          const [hours, minutes] = job.endTime.split(':')
          end.setHours(parseInt(hours), parseInt(minutes))
        }
        
        return {
          id: job.id,
          title: job.title,
          start,
          end,
          resource: job,
          allDay: !job.startTime && !job.endTime,
        }
      })
  },

  async duplicateJob(id: string): Promise<Job> {
    await new Promise(resolve => setTimeout(resolve, 500))
    
    const originalJob = mockJobs.find(j => j.id === id)
    if (!originalJob) {
      throw new Error('Job not found')
    }
    
    const duplicatedJob: Job = {
      ...originalJob,
      id: (mockJobs.length + 1).toString(),
      title: `${originalJob.title} (Copy)`,
      status: 'pending',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    
    mockJobs.push(duplicatedJob)
    return duplicatedJob
  },
}
