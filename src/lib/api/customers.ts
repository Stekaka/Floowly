import { Customer, CustomerCreateRequest, CustomerUpdateRequest, CustomerFilters, CustomerStats, Note, Order } from "@/types/customer"
import { Quote } from "@/types/quote"

// Mock data - replace with actual API calls
const mockCustomers: Customer[] = [
  {
    id: '1',
    name: 'John Doe',
    company: 'Acme Corp',
    email: 'john@acme.com',
    phone: '+46 70 123 4567',
    address: {
      street: 'Storgatan 1',
      city: 'Stockholm',
      postalCode: '111 22',
      country: 'Sweden',
    },
    tags: ['vip', 'repeat'],
    status: 'active',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    quotes: [
      {
        id: 'q1',
        customerId: '1',
        title: 'Full Wrap - BMW X5',
        amount: 25000,
        status: 'sent',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }
    ],
    orders: [
      {
        id: 'o1',
        customerId: '1',
        title: 'Full Wrap - BMW X5',
        amount: 25000,
        status: 'completed',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }
    ],
    notes: [
      {
        id: 'n1',
        customerId: '1',
        content: 'Customer prefers matte finishes',
        author: 'Admin',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }
    ],
    files: [],
  },
  {
    id: '2',
    name: 'Jane Smith',
    company: 'Tech Solutions AB',
    email: 'jane@techsolutions.se',
    phone: '+46 70 987 6543',
    address: {
      street: 'Teknikgatan 15',
      city: 'Göteborg',
      postalCode: '412 58',
      country: 'Sweden',
    },
    tags: ['new', 'corporate'],
    status: 'prospect',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    quotes: [],
    orders: [],
    notes: [],
    files: [],
  },
  {
    id: '3',
    name: 'Mike Johnson',
    company: 'Auto Parts Ltd',
    email: 'mike@autoparts.com',
    phone: '+46 70 555 1234',
    address: {
      street: 'Bilvägen 8',
      city: 'Malmö',
      postalCode: '211 15',
      country: 'Sweden',
    },
    tags: ['wholesale'],
    status: 'active',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    quotes: [
      {
        id: 'q2',
        customerId: '3',
        title: 'Partial Wrap - Mercedes E-Class',
        amount: 15000,
        status: 'accepted',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }
    ],
    orders: [],
    notes: [],
    files: [],
  },
]

export const customerApi = {
  async getCustomers(filters?: CustomerFilters): Promise<Customer[]> {
    await new Promise(resolve => setTimeout(resolve, 500)) // Simulate API delay
    
    let filteredCustomers = [...mockCustomers]
    
    if (filters?.search) {
      const searchLower = filters.search.toLowerCase()
      filteredCustomers = filteredCustomers.filter(customer => 
        customer.name.toLowerCase().includes(searchLower) ||
        customer.company?.toLowerCase().includes(searchLower) ||
        customer.email?.toLowerCase().includes(searchLower) ||
        customer.phone.includes(searchLower)
      )
    }
    
    if (filters?.status && filters.status.length > 0) {
      filteredCustomers = filteredCustomers.filter(customer => 
        filters.status!.includes(customer.status)
      )
    }
    
    if (filters?.tags && filters.tags.length > 0) {
      filteredCustomers = filteredCustomers.filter(customer => 
        filters.tags!.some(tag => customer.tags.includes(tag))
      )
    }
    
    return filteredCustomers
  },

  async getCustomer(id: string): Promise<Customer> {
    await new Promise(resolve => setTimeout(resolve, 300))
    
    const customer = mockCustomers.find(c => c.id === id)
    if (!customer) {
      throw new Error('Customer not found')
    }
    
    return customer
  },

  async createCustomer(data: CustomerCreateRequest): Promise<Customer> {
    await new Promise(resolve => setTimeout(resolve, 800))
    
    const newCustomer: Customer = {
      id: (mockCustomers.length + 1).toString(),
      ...data,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      quotes: [],
      orders: [],
      notes: [],
      files: [],
    }
    
    mockCustomers.push(newCustomer)
    return newCustomer
  },

  async updateCustomer(data: CustomerUpdateRequest): Promise<Customer> {
    await new Promise(resolve => setTimeout(resolve, 600))
    
    const index = mockCustomers.findIndex(c => c.id === data.id)
    if (index === -1) {
      throw new Error('Customer not found')
    }
    
    mockCustomers[index] = {
      ...mockCustomers[index],
      ...data,
      updatedAt: new Date().toISOString(),
    }
    
    return mockCustomers[index]
  },

  async deleteCustomer(id: string): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 400))
    
    const index = mockCustomers.findIndex(c => c.id === id)
    if (index === -1) {
      throw new Error('Customer not found')
    }
    
    mockCustomers.splice(index, 1)
  },

  async getCustomerStats(): Promise<CustomerStats> {
    await new Promise(resolve => setTimeout(resolve, 200))
    
    const total = mockCustomers.length
    const active = mockCustomers.filter(c => c.status === 'active').length
    const inactive = mockCustomers.filter(c => c.status === 'inactive').length
    const prospects = mockCustomers.filter(c => c.status === 'prospect').length
    
    const totalQuotes = mockCustomers.reduce((sum, c) => sum + c.quotes.length, 0)
    const totalOrders = mockCustomers.reduce((sum, c) => sum + c.orders.length, 0)
    const totalRevenue = mockCustomers.reduce((sum, c) => 
      sum + c.orders.reduce((orderSum, o) => orderSum + o.amount, 0), 0
    )
    
    return {
      total,
      active,
      inactive,
      prospects,
      totalQuotes,
      totalOrders,
      totalRevenue,
    }
  },

  async addNote(customerId: string, data: { content: string; author: string }): Promise<Note> {
    await new Promise(resolve => setTimeout(resolve, 400))
    
    const customer = mockCustomers.find(c => c.id === customerId)
    if (!customer) {
      throw new Error('Customer not found')
    }
    
    const newNote: Note = {
      id: `note_${Date.now()}`,
      customerId,
      content: data.content,
      author: data.author,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    
    customer.notes.push(newNote)
    return newNote
  },

  async updateCustomerTags(customerId: string, tags: string[]): Promise<Customer> {
    await new Promise(resolve => setTimeout(resolve, 300))
    
    const customer = mockCustomers.find(c => c.id === customerId)
    if (!customer) {
      throw new Error('Customer not found')
    }
    
    customer.tags = tags
    customer.updatedAt = new Date().toISOString()
    
    return customer
  },
}
