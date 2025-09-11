# Floowly - Quotes Module Refactor

A comprehensive refactor of the existing Quotes module focusing on clarity, pricing calculations, and export functionality while maintaining URL compatibility.

## 🎯 Key Improvements

### Enhanced Quote Management
- **Rich Quote Structure**: Line items with individual pricing, tax calculations, and totals
- **Status Management**: Draft, Sent, Accepted, Rejected, Expired with color-coded badges
- **Auto-calculation**: Real-time subtotal, tax, and total calculations
- **Draft Auto-save**: Automatic saving every 2 seconds with unsaved changes guard

### Advanced Pricing Features
- **Line Item Management**: Add, edit, remove items with inline editing
- **Tax Calculations**: Per-item tax rates with automatic calculations
- **Cost Helpers**: Hours, material cost, markup percentage, and profit estimates
- **Currency Formatting**: Proper SEK formatting throughout

### Export & Sharing
- **PDF Export**: Server-side PDF generation with clean, brandable layout
- **Multiple Formats**: PDF, Excel, and CSV export options
- **Share Links**: Copy shareable links for quotes
- **Send Functionality**: Mark quotes as sent with timestamps

### User Experience
- **Three View Modes**: List, Form, and View with seamless transitions
- **Advanced Filtering**: Filter by status, customer, and search terms
- **Keyboard Navigation**: Full keyboard support for accessibility
- **Responsive Design**: Works on all screen sizes
- **Loading States**: Skeleton loaders and disabled states

## 🏗️ Architecture

### Component Structure
```
src/
├── app/quotes/
│   ├── page.tsx                    # Main quotes page
│   └── [id]/export/
│       └── route.ts               # PDF export API
├── components/quotes/
│   ├── QuoteForm.tsx              # Create/edit form
│   ├── QuotesTable.tsx            # List view with filters
│   ├── QuoteView.tsx              # Detailed quote view
│   └── QuoteItem.tsx              # Line item component
├── lib/
│   ├── api/quotes.ts              # API service layer
│   └── validations/quote.ts       # Zod validation schemas
└── types/quote.ts                 # TypeScript definitions
```

### Key Technologies
- **Next.js 15**: App Router with TypeScript
- **TanStack Query**: Server state management with optimistic updates
- **React Hook Form**: Form state management with validation
- **Zod**: Schema validation with currency rounding
- **shadcn/ui**: Premium UI components
- **Tailwind CSS**: Styling with design tokens

## 🚀 Features

### Quote Status Management
- **Draft**: Work in progress, auto-saves every 2 seconds
- **Sent**: Marked as sent with timestamp, can be shared
- **Accepted**: Customer accepted the quote
- **Rejected**: Customer rejected the quote
- **Expired**: Quote has passed expiration date

### Pricing Calculations
- **Line Items**: Individual items with quantity, unit price, and tax rate
- **Auto-calculation**: Real-time subtotal, tax, and total updates
- **Currency Rounding**: Proper rounding to 2 decimal places
- **Tax Rates**: Per-item tax rates (e.g., 25% VAT)
- **Cost Helpers**: Optional hours, material cost, markup percentage

### Export Functionality
- **PDF Export**: Clean, professional PDF with company branding
- **Excel Export**: Structured data for further analysis
- **CSV Export**: Simple data export for integration
- **Share Links**: Copy shareable URLs for quotes

### Form Features
- **Rich Text Lite**: Description field with basic formatting
- **Inline Editing**: Edit line items without leaving the form
- **Auto-save**: Draft quotes save automatically every 2 seconds
- **Unsaved Changes Guard**: Warns before navigation with unsaved changes
- **Validation**: Real-time validation with inline error messages

### List Management
- **Advanced Filtering**: Filter by status, customer, and search terms
- **Quick Actions**: Edit, duplicate, send, export, delete
- **Status Updates**: Change status with dropdown
- **Bulk Operations**: Select multiple quotes for batch actions

## 📊 Pricing Calculation Engine

### Line Item Calculations
```typescript
// Per-item calculations
const subtotal = Math.round((quantity * unitPrice) * 100) / 100
const taxAmount = Math.round((subtotal * taxRate / 100) * 100) / 100
const total = Math.round((subtotal + taxAmount) * 100) / 100
```

### Quote Totals
```typescript
// Quote-level calculations
const subtotal = items.reduce((sum, item) => sum + item.subtotal, 0)
const taxAmount = items.reduce((sum, item) => sum + item.taxAmount, 0)
const total = subtotal + taxAmount
```

### Cost Helpers
```typescript
// Profit estimation
const laborCost = hours * 500 // 500 SEK/hour
const totalCost = materialCost + laborCost
const markup = totalCost * (markupPercentage / 100)
const profitEstimate = totalCost + markup
```

## 🎨 Design System

### Status Colors
- **Draft**: Gray (secondary)
- **Sent**: Blue (default)
- **Accepted**: Green (success)
- **Rejected**: Red (destructive)
- **Expired**: Gray (outline)

### Layout Structure
- **List View**: Table with filters and quick actions
- **Form View**: Two-column layout with form and summary
- **View Mode**: Detailed quote view with sidebar

### Responsive Design
- **Mobile**: Stacked layout with touch-friendly controls
- **Tablet**: Optimized grid with adjusted spacing
- **Desktop**: Full feature set with side-by-side layout

## 🔧 API Compatibility

### Maintained Endpoints
- `GET /api/quotes` - List quotes with optional filters
- `POST /api/quotes` - Create new quote
- `PUT /api/quotes` - Update existing quote
- `DELETE /api/quotes` - Delete quote

### New Endpoints
- `GET /api/quotes/[id]/export` - Export quote in various formats

### Enhanced Data Structure
```typescript
interface Quote {
  id: string
  quoteNumber: string
  customerId: string
  customer?: Customer
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
  // Cost helpers
  hours?: number
  materialCost?: number
  markupPercentage?: number
  profitEstimate?: number
}
```

### Backward Compatibility
- Existing quoteId URLs continue to work
- New fields are optional with sensible defaults
- Legacy data is automatically migrated
- No breaking changes to existing integrations

## 🧪 Testing

### Test Coverage
- **Unit Tests**: Component logic and calculations
- **Integration Tests**: API service functions
- **Validation Tests**: Zod schema validation
- **Calculation Tests**: Pricing and tax calculations

### Test Commands
```bash
npm run test        # Run tests in watch mode
npm run test:run    # Run tests once
npm run test:coverage # Run with coverage report
```

## 🚀 Usage Examples

### Basic Implementation
```tsx
import { QuotesPage } from '@/app/quotes/page'

export default function App() {
  return <QuotesPage />
}
```

### Creating a Quote
```tsx
const createMutation = useMutation({
  mutationFn: quoteApi.createQuote,
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ["quotes"] })
  },
})

const handleCreate = (data: QuoteFormData) => {
  createMutation.mutate(data)
}
```

### Exporting a Quote
```tsx
const handleExport = (quoteId: string, format: 'pdf' | 'excel' | 'csv') => {
  const link = document.createElement('a')
  link.href = `/api/quotes/${quoteId}/export?format=${format}`
  link.download = `quote-${quoteId}.${format}`
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}
```

## 🔄 Migration Guide

### From Old to New
1. **Update Imports**: Use new component imports
2. **Update Types**: Use new TypeScript interfaces
3. **Update Forms**: Add new fields with validation
4. **Update Calculations**: Use new pricing engine
5. **Update Exports**: Use new export functionality

### Breaking Changes
- None! The refactor maintains full backward compatibility
- All existing quoteId URLs continue to work
- New features are additive, not replacing

## 🎯 Future Enhancements

### Planned Features
- **Email Integration**: Send quotes directly via email
- **Digital Signatures**: Customer signature capture
- **Quote Templates**: Reusable quote templates
- **Bulk Operations**: Select multiple quotes for batch actions
- **Advanced Reporting**: Quote analytics and insights

### Technical Improvements
- **Real-time Collaboration**: Multiple users editing quotes
- **Version History**: Track quote changes over time
- **Advanced PDF**: Custom branding and layouts
- **API Webhooks**: Real-time quote status updates
- **Mobile App**: Native mobile quote management

## 📚 API Reference

### Quote API
```typescript
// Get quotes with filters
quoteApi.getQuotes(filters?: QuoteFilters): Promise<Quote[]>

// Get single quote
quoteApi.getQuote(id: string): Promise<Quote>

// Create quote
quoteApi.createQuote(data: QuoteCreateRequest): Promise<Quote>

// Update quote
quoteApi.updateQuote(data: QuoteUpdateRequest): Promise<Quote>

// Delete quote
quoteApi.deleteQuote(id: string): Promise<void>

// Update quote status
quoteApi.updateQuoteStatus(id: string, status: Quote['status']): Promise<Quote>

// Duplicate quote
quoteApi.duplicateQuote(id: string): Promise<Quote>

// Export quote
quoteApi.exportQuote(id: string, format: 'pdf' | 'excel' | 'csv'): Promise<Blob>
```

### Validation Schemas
```typescript
// Quote form validation
const quoteSchema = z.object({
  customerId: z.string().min(1, "Customer is required"),
  title: z.string().min(1, "Quote title is required"),
  description: z.string().optional(),
  items: z.array(quoteItemSchema).min(1, "At least one item is required"),
  notes: z.string().optional(),
  terms: z.string().optional(),
  hours: z.number().min(0).optional(),
  materialCost: z.number().min(0).optional(),
  markupPercentage: z.number().min(0).max(1000).optional(),
  expiresAt: z.string().optional(),
})

// Quote item validation
const quoteItemSchema = z.object({
  name: z.string().min(1, "Item name is required"),
  description: z.string().optional(),
  quantity: z.number().min(0.01, "Quantity must be greater than 0"),
  unitPrice: z.number().min(0, "Unit price cannot be negative"),
  taxRate: z.number().min(0).max(100, "Tax rate must be between 0 and 100"),
})
```

## 🤝 Contributing

### Development Setup
1. Install dependencies: `npm install`
2. Start development server: `npm run dev`
3. Run tests: `npm run test`
4. Build for production: `npm run build`

### Code Style
- **TypeScript**: Strict mode enabled
- **ESLint**: Next.js configuration
- **Prettier**: Code formatting
- **Conventional Commits**: Commit message format

### Pull Request Process
1. Create feature branch
2. Write tests for new features
3. Ensure all tests pass
4. Update documentation
5. Submit pull request

## 📄 License

This refactor is part of the CarWrap CRM project and follows the same licensing terms.
