export interface QuoteItem {
  id: string
  name: string
  description?: string
  quantity: number
  unitPrice: number
  taxRate: number // Percentage (e.g., 25 for 25%)
  subtotal: number
  taxAmount: number
  total: number
}

export interface Quote {
  id: string
  quoteNumber: string
  customerId: string
  customer?: {
    id: string
    name: string
    company?: string
    email?: string
    phone: string
  }
  title: string
  description: string
  items: QuoteItem[]
  subtotal: number
  taxAmount: number
  total: number
  status: 'draft' | 'sent' | 'accepted' | 'rejected' | 'expired'
  createdAt: string
  updatedAt: string
  sentAt?: string
  expiresAt?: string
  notes?: string
  terms?: string
  // Cost calculation helpers
  hours?: number
  materialCost?: number
  markupPercentage?: number
  profitEstimate?: number
}

export interface QuoteCreateRequest {
  customerId: string
  title: string
  description: string
  items: Omit<QuoteItem, 'id' | 'subtotal' | 'taxAmount' | 'total'>[]
  notes?: string
  terms?: string
  hours?: number
  materialCost?: number
  markupPercentage?: number
  expiresAt?: string
}

export interface QuoteUpdateRequest extends Partial<QuoteCreateRequest> {
  id: string
  status?: Quote['status']
}

export interface QuoteFilters {
  status?: string[]
  customerId?: string
  search?: string
  dateFrom?: string
  dateTo?: string
}

export interface QuoteStats {
  total: number
  draft: number
  sent: number
  accepted: number
  rejected: number
  expired: number
  totalValue: number
  acceptedValue: number
  conversionRate: number
}

export interface QuoteExportOptions {
  format: 'pdf' | 'excel' | 'csv'
  includeItems: boolean
  includeTerms: boolean
  includeNotes: boolean
}
