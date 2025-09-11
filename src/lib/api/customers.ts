import { Customer, CustomerCreateRequest, CustomerUpdateRequest, CustomerFilters, CustomerStats, Note, Order } from "@/types/customer"
import { Quote } from "@/types/quote"

export const customerApi = {
  async getCustomers(filters?: CustomerFilters): Promise<Customer[]> {
    const params = new URLSearchParams()
    
    if (filters?.search) {
      params.append('search', filters.search)
    }
    if (filters?.status && filters.status.length > 0) {
      params.append('status', filters.status.join(','))
    }
    if (filters?.tags && filters.tags.length > 0) {
      params.append('tags', filters.tags.join(','))
    }
    
    const response = await fetch(`/api/customers?${params.toString()}`)
    if (!response.ok) {
      throw new Error('Failed to fetch customers')
    }
    
    return response.json()
  },

  async getCustomer(id: string): Promise<Customer> {
    const response = await fetch(`/api/customers/${id}`)
    if (!response.ok) {
      throw new Error('Failed to fetch customer')
    }
    
    return response.json()
  },

  async createCustomer(data: CustomerCreateRequest): Promise<Customer> {
    const response = await fetch('/api/customers', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
    
    if (!response.ok) {
      throw new Error('Failed to create customer')
    }
    
    return response.json()
  },

  async updateCustomer(data: CustomerUpdateRequest): Promise<Customer> {
    const response = await fetch(`/api/customers/${data.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
    
    if (!response.ok) {
      throw new Error('Failed to update customer')
    }
    
    return response.json()
  },

  async deleteCustomer(id: string): Promise<void> {
    const response = await fetch(`/api/customers/${id}`, {
      method: 'DELETE',
    })
    
    if (!response.ok) {
      throw new Error('Failed to delete customer')
    }
  },

  async getCustomerStats(): Promise<CustomerStats> {
    const response = await fetch('/api/customers/stats')
    if (!response.ok) {
      throw new Error('Failed to fetch customer stats')
    }
    
    return response.json()
  },

  async addNote(customerId: string, data: { content: string; author: string }): Promise<Note> {
    const response = await fetch(`/api/customers/${customerId}/notes`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
    
    if (!response.ok) {
      throw new Error('Failed to add note')
    }
    
    return response.json()
  },

  async updateCustomerTags(customerId: string, tags: string[]): Promise<Customer> {
    const response = await fetch(`/api/customers/${customerId}/tags`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ tags }),
    })
    
    if (!response.ok) {
      throw new Error('Failed to update customer tags')
    }
    
    return response.json()
  },
}