export interface Customer {
  id: string
  name: string
  company?: string
  email?: string
  phone: string
  address?: {
    street: string
    city: string
    postalCode: string
    country: string
  }
  tags: string[]
  status: 'active' | 'inactive' | 'prospect'
  createdAt: string
  updatedAt: string
  quotes: any[] // Will be properly typed when Quote is imported
  orders: Order[]
  notes: Note[]
  files: File[]
}

// Quote interface moved to /types/quote.ts to avoid conflicts

export interface Order {
  id: string
  customerId: string
  title: string
  amount: number
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled'
  createdAt: string
  updatedAt: string
}

export interface Note {
  id: string
  customerId: string
  content: string
  author: string
  createdAt: string
  updatedAt: string
}

export interface File {
  id: string
  customerId: string
  name: string
  url: string
  type: string
  size: number
  createdAt: string
}

export interface CustomerFilters {
  search: string
  status: string[]
  tags: string[]
}

export interface CustomerCreateRequest {
  name: string
  company?: string
  email?: string
  phone: string
  address?: {
    street: string
    city: string
    postalCode: string
    country: string
  }
  tags: string[]
  status: 'active' | 'inactive' | 'prospect'
}

export interface CustomerUpdateRequest extends Partial<CustomerCreateRequest> {
  id: string
}

export interface CustomerStats {
  total: number
  active: number
  inactive: number
  prospects: number
  totalQuotes: number
  totalOrders: number
  totalRevenue: number
}
