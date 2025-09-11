import { Quote, QuoteCreateRequest, QuoteUpdateRequest, QuoteFilters, QuoteStats, QuoteItem } from "@/types/quote"
import { calculateItemTotals, calculateQuoteTotals, generateQuoteNumber } from "@/lib/validations/quote"

// Mock data - replace with actual API calls
const mockQuotes: Quote[] = [
  {
    id: '1',
    quoteNumber: 'Q20241201-001',
    customerId: '1',
    customer: {
      id: '1',
      name: 'John Doe',
      company: 'Acme Corp',
      email: 'john@acme.com',
      phone: '+46 70 123 4567',
    },
    title: 'BMW X5 Full Wrap',
    description: 'Complete vehicle wrap with matte black vinyl',
    items: [
      {
        id: 'item1',
        name: 'Full Vehicle Wrap',
        description: 'Matte black vinyl wrap',
        quantity: 1,
        unitPrice: 20000,
        taxRate: 25,
        subtotal: 20000,
        taxAmount: 5000,
        total: 25000,
      },
      {
        id: 'item2',
        name: 'Design & Installation',
        description: 'Custom design and professional installation',
        quantity: 1,
        unitPrice: 5000,
        taxRate: 25,
        subtotal: 5000,
        taxAmount: 1250,
        total: 6250,
      }
    ],
    subtotal: 25000,
    taxAmount: 6250,
    total: 31250,
    status: 'sent',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    sentAt: new Date().toISOString(),
    expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days
    hours: 16,
    materialCost: 15000,
    markupPercentage: 33,
    profitEstimate: 10250,
  },
  {
    id: '2',
    quoteNumber: 'Q20241201-002',
    customerId: '2',
    customer: {
      id: '2',
      name: 'Jane Smith',
      company: 'Tech Solutions AB',
      email: 'jane@techsolutions.se',
      phone: '+46 70 987 6543',
    },
    title: 'Tesla Model 3 Partial Wrap',
    description: 'Hood and roof wrap with gloss white vinyl',
    items: [
      {
        id: 'item3',
        name: 'Partial Wrap',
        description: 'Hood and roof only',
        quantity: 1,
        unitPrice: 8000,
        taxRate: 25,
        subtotal: 8000,
        taxAmount: 2000,
        total: 10000,
      },
      {
        id: 'item4',
        name: 'Design & Installation',
        description: 'Custom design and professional installation',
        quantity: 1,
        unitPrice: 2000,
        taxRate: 25,
        subtotal: 2000,
        taxAmount: 500,
        total: 2500,
      }
    ],
    subtotal: 10000,
    taxAmount: 2500,
    total: 12500,
    status: 'accepted',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    sentAt: new Date().toISOString(),
    hours: 8,
    materialCost: 6000,
    markupPercentage: 25,
    profitEstimate: 2500,
  },
  {
    id: '3',
    quoteNumber: 'Q20241201-003',
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
    items: [
      {
        id: 'item5',
        name: 'Hood Wrap',
        description: 'Carbon fiber pattern vinyl',
        quantity: 1,
        unitPrice: 3000,
        taxRate: 25,
        subtotal: 3000,
        taxAmount: 750,
        total: 3750,
      }
    ],
    subtotal: 3000,
    taxAmount: 750,
    total: 3750,
    status: 'draft',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    hours: 4,
    materialCost: 2000,
    markupPercentage: 50,
    profitEstimate: 1750,
  },
]

export const quoteApi = {
  async getQuotes(filters?: QuoteFilters): Promise<Quote[]> {
    await new Promise(resolve => setTimeout(resolve, 500)) // Simulate API delay
    
    let filteredQuotes = [...mockQuotes]
    
    if (filters?.status?.length) {
      filteredQuotes = filteredQuotes.filter(quote => 
        filters.status!.includes(quote.status)
      )
    }
    
    if (filters?.customerId) {
      filteredQuotes = filteredQuotes.filter(quote => 
        quote.customerId === filters.customerId
      )
    }
    
    if (filters?.search) {
      const searchLower = filters.search.toLowerCase()
      filteredQuotes = filteredQuotes.filter(quote => 
        quote.title.toLowerCase().includes(searchLower) ||
        quote.quoteNumber.toLowerCase().includes(searchLower) ||
        quote.customer?.name.toLowerCase().includes(searchLower) ||
        quote.customer?.company?.toLowerCase().includes(searchLower)
      )
    }
    
    if (filters?.dateFrom) {
      filteredQuotes = filteredQuotes.filter(quote => 
        new Date(quote.createdAt) >= new Date(filters.dateFrom!)
      )
    }
    
    if (filters?.dateTo) {
      filteredQuotes = filteredQuotes.filter(quote => 
        new Date(quote.createdAt) <= new Date(filters.dateTo!)
      )
    }
    
    return filteredQuotes
  },

  async getQuote(id: string): Promise<Quote> {
    await new Promise(resolve => setTimeout(resolve, 300))
    
    const quote = mockQuotes.find(q => q.id === id)
    if (!quote) {
      throw new Error('Quote not found')
    }
    
    return quote
  },

  async createQuote(data: QuoteCreateRequest): Promise<Quote> {
    await new Promise(resolve => setTimeout(resolve, 800))
    
    // Calculate item totals
    const items: QuoteItem[] = data.items.map((item, index) => ({
      id: `item_${Date.now()}_${index}`,
      ...item,
      ...calculateItemTotals(item),
    }))
    
    // Calculate quote totals
    const totals = calculateQuoteTotals(items)
    
    const newQuote: Quote = {
      id: (mockQuotes.length + 1).toString(),
      quoteNumber: generateQuoteNumber(),
      ...data,
      items,
      ...totals,
      status: 'draft',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    
    mockQuotes.push(newQuote)
    return newQuote
  },

  async updateQuote(data: QuoteUpdateRequest): Promise<Quote> {
    await new Promise(resolve => setTimeout(resolve, 600))
    
    const index = mockQuotes.findIndex(q => q.id === data.id)
    if (index === -1) {
      throw new Error('Quote not found')
    }
    
    let items = mockQuotes[index].items
    
    // If items are being updated, recalculate totals
    if (data.items) {
      items = data.items.map((item, itemIndex) => ({
        id: `item_${Date.now()}_${itemIndex}`,
        ...item,
        ...calculateItemTotals(item),
      }))
    }
    
    const totals = calculateQuoteTotals(items)
    
    mockQuotes[index] = {
      ...mockQuotes[index],
      ...data,
      items,
      ...totals,
      updatedAt: new Date().toISOString(),
    }
    
    return mockQuotes[index]
  },

  async deleteQuote(id: string): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 400))
    
    const index = mockQuotes.findIndex(q => q.id === id)
    if (index === -1) {
      throw new Error('Quote not found')
    }
    
    mockQuotes.splice(index, 1)
  },

  async updateQuoteStatus(id: string, status: Quote['status']): Promise<Quote> {
    await new Promise(resolve => setTimeout(resolve, 300))
    
    const quote = mockQuotes.find(q => q.id === id)
    if (!quote) {
      throw new Error('Quote not found')
    }
    
    quote.status = status
    quote.updatedAt = new Date().toISOString()
    
    if (status === 'sent' && !quote.sentAt) {
      quote.sentAt = new Date().toISOString()
    }
    
    return quote
  },

  async getQuoteStats(): Promise<QuoteStats> {
    await new Promise(resolve => setTimeout(resolve, 200))
    
    const total = mockQuotes.length
    const draft = mockQuotes.filter(q => q.status === 'draft').length
    const sent = mockQuotes.filter(q => q.status === 'sent').length
    const accepted = mockQuotes.filter(q => q.status === 'accepted').length
    const rejected = mockQuotes.filter(q => q.status === 'rejected').length
    const expired = mockQuotes.filter(q => q.status === 'expired').length
    
    const totalValue = mockQuotes.reduce((sum, q) => sum + q.total, 0)
    const acceptedValue = mockQuotes
      .filter(q => q.status === 'accepted')
      .reduce((sum, q) => sum + q.total, 0)
    
    const conversionRate = sent > 0 ? (accepted / sent) * 100 : 0
    
    return {
      total,
      draft,
      sent,
      accepted,
      rejected,
      expired,
      totalValue,
      acceptedValue,
      conversionRate,
    }
  },

  async duplicateQuote(id: string): Promise<Quote> {
    await new Promise(resolve => setTimeout(resolve, 500))
    
    const originalQuote = mockQuotes.find(q => q.id === id)
    if (!originalQuote) {
      throw new Error('Quote not found')
    }
    
    const duplicatedQuote: Quote = {
      ...originalQuote,
      id: (mockQuotes.length + 1).toString(),
      quoteNumber: generateQuoteNumber(),
      status: 'draft',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      sentAt: undefined,
      items: originalQuote.items.map((item, index) => ({
        ...item,
        id: `item_${Date.now()}_${index}`,
      })),
    }
    
    mockQuotes.push(duplicatedQuote)
    return duplicatedQuote
  },

  async exportQuote(id: string, format: 'pdf' | 'excel' | 'csv'): Promise<Blob> {
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    const quote = mockQuotes.find(q => q.id === id)
    if (!quote) {
      throw new Error('Quote not found')
    }
    
    // Mock export - in real implementation, this would generate actual files
    const content = `Quote ${quote.quoteNumber}\nCustomer: ${quote.customer?.name}\nTotal: ${quote.total} SEK`
    return new Blob([content], { type: 'text/plain' })
  },
}
