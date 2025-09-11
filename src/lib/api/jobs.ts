import { Job, JobCreateRequest, JobUpdateRequest, JobFilters, JobStats, UpcomingJob, CalendarEvent } from "@/types/job"
import { formatJobTime, getJobDuration, getCustomerInitials } from "@/lib/validations/job"

export const jobApi = {
  async getJobs(filters?: JobFilters): Promise<Job[]> {
    const params = new URLSearchParams()
    
    if (filters?.search) {
      params.append('search', filters.search)
    }
    if (filters?.status && filters.status.length > 0) {
      params.append('status', filters.status.join(','))
    }
    if (filters?.customerId) {
      params.append('customerId', filters.customerId)
    }
    if (filters?.dateFrom) {
      params.append('dateFrom', filters.dateFrom)
    }
    if (filters?.dateTo) {
      params.append('dateTo', filters.dateTo)
    }
    
    const response = await fetch(`/api/jobs?${params.toString()}`)
    if (!response.ok) {
      throw new Error('Failed to fetch jobs')
    }
    
    return response.json()
  },

  async getJob(id: string): Promise<Job> {
    const response = await fetch(`/api/jobs/${id}`)
    if (!response.ok) {
      throw new Error('Failed to fetch job')
    }
    
    return response.json()
  },

  async createJob(data: JobCreateRequest): Promise<Job> {
    const response = await fetch('/api/jobs', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
    
    if (!response.ok) {
      throw new Error('Failed to create job')
    }
    
    return response.json()
  },

  async updateJob(data: JobUpdateRequest): Promise<Job> {
    const response = await fetch(`/api/jobs/${data.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
    
    if (!response.ok) {
      throw new Error('Failed to update job')
    }
    
    return response.json()
  },

  async deleteJob(id: string): Promise<void> {
    const response = await fetch(`/api/jobs/${id}`, {
      method: 'DELETE',
    })
    
    if (!response.ok) {
      throw new Error('Failed to delete job')
    }
  },

  async getJobStats(): Promise<JobStats> {
    const response = await fetch('/api/jobs/stats')
    if (!response.ok) {
      throw new Error('Failed to fetch job stats')
    }
    
    return response.json()
  },

  async getUpcomingJobs(limit: number = 10): Promise<UpcomingJob[]> {
    const response = await fetch(`/api/jobs/upcoming?limit=${limit}`)
    if (!response.ok) {
      throw new Error('Failed to fetch upcoming jobs')
    }
    
    return response.json()
  },

  async getCalendarEvents(startDate: string, endDate: string): Promise<CalendarEvent[]> {
    const params = new URLSearchParams({
      startDate,
      endDate,
    })
    
    const response = await fetch(`/api/jobs/calendar?${params.toString()}`)
    if (!response.ok) {
      throw new Error('Failed to fetch calendar events')
    }
    
    return response.json()
  },

  async updateJobStatus(id: string, status: Job['status']): Promise<Job> {
    const response = await fetch(`/api/jobs/${id}/status`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ status }),
    })
    
    if (!response.ok) {
      throw new Error('Failed to update job status')
    }
    
    return response.json()
  },
}