import { Quote, QuoteCreateRequest, QuoteUpdateRequest, QuoteFilters, QuoteStats, QuoteItem } from "@/types/quote"
import { calculateItemTotals, calculateQuoteTotals, generateQuoteNumber } from "@/lib/validations/quote"

export const quoteApi = {
  async getQuotes(filters?: QuoteFilters): Promise<Quote[]> {
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
    
    const response = await fetch(`/api/quotes?${params.toString()}`)
    if (!response.ok) {
      throw new Error('Failed to fetch quotes')
    }
    
    return response.json()
  },

  async getQuote(id: string): Promise<Quote> {
    const response = await fetch(`/api/quotes/${id}`)
    if (!response.ok) {
      throw new Error('Failed to fetch quote')
    }
    
    return response.json()
  },

  async createQuote(data: QuoteCreateRequest): Promise<Quote> {
    const response = await fetch('/api/quotes', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
    
    if (!response.ok) {
      throw new Error('Failed to create quote')
    }
    
    return response.json()
  },

  async updateQuote(data: QuoteUpdateRequest): Promise<Quote> {
    const response = await fetch(`/api/quotes/${data.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
    
    if (!response.ok) {
      throw new Error('Failed to update quote')
    }
    
    return response.json()
  },

  async deleteQuote(id: string): Promise<void> {
    const response = await fetch(`/api/quotes/${id}`, {
      method: 'DELETE',
    })
    
    if (!response.ok) {
      throw new Error('Failed to delete quote')
    }
  },

  async getQuoteStats(): Promise<QuoteStats> {
    const response = await fetch('/api/quotes/stats')
    if (!response.ok) {
      throw new Error('Failed to fetch quote stats')
    }
    
    return response.json()
  },

  async markAsSent(id: string): Promise<Quote> {
    const response = await fetch(`/api/quotes/${id}/mark-sent`, {
      method: 'POST',
    })
    
    if (!response.ok) {
      throw new Error('Failed to mark quote as sent')
    }
    
    return response.json()
  },

  async exportQuote(id: string): Promise<Blob> {
    const response = await fetch(`/api/quotes/${id}/export`)
    if (!response.ok) {
      throw new Error('Failed to export quote')
    }
    
    return response.blob()
  },

  async updateQuoteStatus(id: string, status: Quote['status']): Promise<Quote> {
    const response = await fetch(`/api/quotes/${id}/status`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ status }),
    })
    
    if (!response.ok) {
      throw new Error('Failed to update quote status')
    }
    
    return response.json()
  },

  async duplicateQuote(id: string): Promise<Quote> {
    const response = await fetch(`/api/quotes/${id}/duplicate`, {
      method: 'POST',
    })
    
    if (!response.ok) {
      throw new Error('Failed to duplicate quote')
    }
    
    return response.json()
  },
}