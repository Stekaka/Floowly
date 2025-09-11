# Floowly - Calendar Module Refactor

A comprehensive refactor of the existing Calendar module to support Month/Week/Day views, quick job creation, and customer linkage while maintaining URL compatibility.

## 🎯 Key Improvements

### Enhanced Calendar Views
- **Month View**: Full month grid with job pills and overflow indicators
- **Week View**: 7-day grid with detailed job information
- **Day View**: Single day focus with comprehensive job details
- **Keyboard Shortcuts**: M/W/D for quick view switching
- **Navigation**: Previous/Next buttons with Today functionality

### Quick Job Creation
- **Click to Create**: Click on any date to create a new job
- **Drag to Create**: Drag on week/day views to set time ranges
- **Pre-filled Dates**: Automatically set start/end dates based on selection
- **Customer Selection**: Dropdown with customer search and company info

### Advanced Job Management
- **Rich Job Forms**: Title, description, dates, times, hours, pricing
- **Status Management**: Pending, Confirmed, In Progress, Completed, Cancelled
- **Customer Integration**: Link jobs to customers and quotes
- **Quote Integration**: Show quote status and link to quote details
- **Notes and Timezone**: Support for job notes and timezone handling

### Visual Enhancements
- **Color-coded Status**: Different colors for each job status
- **Customer Avatars**: Initials-based avatars for quick identification
- **Overflow Handling**: "+X more" indicators for busy days
- **Responsive Design**: Works on all screen sizes
- **Loading States**: Skeleton loaders and disabled states

## 🏗️ Architecture

### Component Structure
```
src/
├── app/calendar/
│   └── page.tsx                    # Main calendar page
├── components/calendar/
│   ├── CalendarToolbar.tsx         # Navigation and view controls
│   ├── CalendarGrid.tsx            # Month/Week/Day grid views
│   ├── EventPill.tsx               # Job event display component
│   ├── JobDialog.tsx               # Create/edit job dialog
│   └── UpcomingList.tsx            # Sidebar upcoming jobs
├── lib/
│   ├── api/jobs.ts                 # Job API service layer
│   └── validations/job.ts          # Job validation schemas
└── types/job.ts                    # Job TypeScript definitions
```

### Key Technologies
- **Next.js 15**: App Router with TypeScript
- **TanStack Query**: Server state management with optimistic updates
- **React Hook Form**: Form state management with validation
- **Zod**: Schema validation with timezone support
- **shadcn/ui**: Premium UI components
- **Tailwind CSS**: Styling with design tokens

## 🚀 Features

### Calendar Views
- **Month View**: 6-week grid with job pills and overflow indicators
- **Week View**: 7-day grid with detailed job information
- **Day View**: Single day focus with comprehensive job details
- **Navigation**: Previous/Next buttons with Today functionality
- **Keyboard Shortcuts**: M/W/D for quick view switching

### Job Creation & Management
- **Quick Create**: Click on any date to create a new job
- **Rich Forms**: Title, description, dates, times, hours, pricing
- **Status Management**: Pending, Confirmed, In Progress, Completed, Cancelled
- **Customer Integration**: Link jobs to customers and quotes
- **Quote Integration**: Show quote status and link to quote details

### Visual Features
- **Color-coded Status**: Different colors for each job status
- **Customer Avatars**: Initials-based avatars for quick identification
- **Overflow Handling**: "+X more" indicators for busy days
- **Responsive Design**: Works on all screen sizes
- **Loading States**: Skeleton loaders and disabled states

### Sidebar Features
- **Upcoming Jobs**: Next 7 days with quick actions
- **Quick Actions**: Mark completed, open quote
- **Job Details**: Customer info, pricing, status
- **Empty States**: Helpful messages when no jobs

## 📊 Job Status System

### Status Types
- **Pending**: Newly created, awaiting confirmation
- **Confirmed**: Customer confirmed, ready to start
- **In Progress**: Currently being worked on
- **Completed**: Finished successfully
- **Cancelled**: Cancelled by customer or staff

### Status Colors
- **Pending**: Yellow (bg-yellow-500)
- **Confirmed**: Blue (bg-blue-500)
- **In Progress**: Orange (bg-orange-500)
- **Completed**: Green (bg-green-500)
- **Cancelled**: Red (bg-red-500)

### Status Transitions
- Pending → Confirmed (customer confirmation)
- Confirmed → In Progress (work started)
- In Progress → Completed (work finished)
- Any → Cancelled (cancellation)

## 🎨 Design System

### Layout Structure
- **Main Calendar**: 3/4 width with toolbar and grid
- **Sidebar**: 1/4 width with upcoming jobs
- **Toolbar**: Navigation, view toggle, and actions
- **Grid**: Month/Week/Day views with job pills

### Responsive Design
- **Mobile**: Stacked layout with touch-friendly controls
- **Tablet**: Optimized grid with adjusted spacing
- **Desktop**: Full feature set with side-by-side layout

### Color Scheme
- **Primary**: Blue for confirmed jobs
- **Success**: Green for completed jobs
- **Warning**: Orange for in-progress jobs
- **Danger**: Red for cancelled jobs
- **Muted**: Gray for pending jobs

## 🔧 API Compatibility

### Maintained Endpoints
- `GET /api/jobs` - List jobs with optional filters
- `POST /api/jobs` - Create new job
- `PUT /api/jobs` - Update existing job
- `DELETE /api/jobs` - Delete job

### Enhanced Data Structure
```typescript
interface Job {
  id: string
  customerId: string
  customer?: Customer
  quoteId?: string
  quote?: Quote
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
  isRecurring?: boolean
  recurrenceRule?: RecurrenceRule
  timezone?: string
}
```

### Backward Compatibility
- Existing jobId URLs continue to work
- New fields are optional with sensible defaults
- Legacy data is automatically migrated
- No breaking changes to existing integrations

## 🧪 Testing

### Test Coverage
- **Unit Tests**: Component logic and calculations
- **Integration Tests**: API service functions
- **Validation Tests**: Zod schema validation
- **Calendar Tests**: Date calculations and view logic

### Test Commands
```bash
npm run test        # Run tests in watch mode
npm run test:run    # Run tests once
npm run test:coverage # Run with coverage report
```

## 🚀 Usage Examples

### Basic Implementation
```tsx
import { CalendarPage } from '@/app/calendar/page'

export default function App() {
  return <CalendarPage />
}
```

### Creating a Job
```tsx
const createMutation = useMutation({
  mutationFn: jobApi.createJob,
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ["jobs"] })
  },
})

const handleCreate = (data: JobFormData) => {
  createMutation.mutate(data)
}
```

### Updating Job Status
```tsx
const statusMutation = useMutation({
  mutationFn: ({ id, status }) => jobApi.updateJobStatus(id, status),
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ["jobs"] })
  },
})

const handleStatusChange = (jobId: string, status: Job['status']) => {
  statusMutation.mutate({ id: jobId, status })
}
```

## 🔄 Migration Guide

### From Old to New
1. **Update Imports**: Use new component imports
2. **Update Types**: Use new TypeScript interfaces
3. **Update Forms**: Add new fields with validation
4. **Update Views**: Use new calendar grid system
5. **Update Actions**: Use new quick action system

### Breaking Changes
- None! The refactor maintains full backward compatibility
- All existing jobId URLs continue to work
- New features are additive, not replacing

## 🎯 Future Enhancements

### Planned Features
- **Drag & Drop**: Reschedule jobs by dragging
- **Recurring Jobs**: RRULE support for recurring jobs
- **Time Zones**: Full timezone support
- **Bulk Operations**: Select multiple jobs for batch actions
- **Advanced Filtering**: Filter by status, customer, date range

### Technical Improvements
- **Real-time Updates**: WebSocket support for live updates
- **Offline Support**: PWA capabilities
- **Mobile App**: Native mobile calendar
- **Advanced Reporting**: Job analytics and insights
- **Integration**: Calendar sync with external systems

## 📚 API Reference

### Job API
```typescript
// Get jobs with filters
jobApi.getJobs(filters?: JobFilters): Promise<Job[]>

// Get single job
jobApi.getJob(id: string): Promise<Job>

// Create job
jobApi.createJob(data: JobCreateRequest): Promise<Job>

// Update job
jobApi.updateJob(data: JobUpdateRequest): Promise<Job>

// Delete job
jobApi.deleteJob(id: string): Promise<void>

// Update job status
jobApi.updateJobStatus(id: string, status: Job['status']): Promise<Job>

// Get upcoming jobs
jobApi.getUpcomingJobs(days: number): Promise<UpcomingJob[]>

// Get calendar events
jobApi.getCalendarEvents(startDate: Date, endDate: Date): Promise<CalendarEvent[]>
```

### Validation Schemas
```typescript
// Job form validation
const jobSchema = z.object({
  customerId: z.string().min(1, "Customer is required"),
  quoteId: z.string().optional(),
  title: z.string().min(1, "Job title is required"),
  description: z.string().optional(),
  startDate: z.string().min(1, "Start date is required"),
  endDate: z.string().min(1, "End date is required"),
  startTime: z.string().optional(),
  endTime: z.string().optional(),
  hours: z.number().min(0, "Hours cannot be negative"),
  materialCost: z.number().min(0, "Material cost cannot be negative"),
  quotedPrice: z.number().min(0, "Quoted price cannot be negative"),
  status: z.enum(['pending', 'confirmed', 'in_progress', 'completed', 'cancelled']).default('pending'),
  notes: z.string().optional(),
  isRecurring: z.boolean().default(false),
  recurrenceRule: recurrenceRuleSchema.optional(),
  timezone: z.string().optional(),
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
