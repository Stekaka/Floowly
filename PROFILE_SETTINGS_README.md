# Floowly - Profile Settings Component

A comprehensive, refactored Profile Settings component built with Next.js 15, TypeScript, Tailwind CSS, and shadcn/ui components.

## 🎯 Features

### Layout & Design
- **Two-column responsive layout**: Profile on left, Security/Notifications on right
- **Mobile-first design**: Stacks vertically on small screens
- **Premium UI**: Stripe/Linear-inspired design using shadcn/ui components
- **Dark theme**: Consistent with the existing CarWrap CRM design

### Profile Management
- **Avatar upload**: Drag & drop or click to upload with preview
- **File validation**: Size (5MB max) and type (images only) validation
- **Profile fields**: Full name, email, phone, company name
- **Real-time validation**: Zod schema validation with inline error messages

### Security Features
- **Password change**: Current password verification required
- **Strong password requirements**: 
  - Minimum 8 characters
  - Uppercase and lowercase letters
  - Numbers and special characters
- **Password visibility toggle**: Show/hide passwords for better UX
- **Form validation**: Comprehensive validation with helpful error messages

### Notifications
- **Toggle switches**: Email, SMS, and push notifications
- **Optimistic updates**: Immediate UI feedback with TanStack Query
- **Auto-save**: Changes are saved automatically
- **Visual feedback**: Clear indication of current settings

### Accessibility
- **ARIA labels**: Proper labeling for screen readers
- **Keyboard navigation**: Full keyboard accessibility
- **Focus management**: Clear focus indicators
- **Error announcements**: Screen reader accessible error messages

## 🏗️ Architecture

### Component Structure
```
src/
├── app/profile/
│   └── page.tsx                 # Main profile settings page
├── components/profile/
│   ├── AvatarCard.tsx          # Avatar upload/management
│   ├── ProfileForm.tsx         # Profile information form
│   ├── SecurityForm.tsx        # Password change form
│   └── NotificationsForm.tsx   # Notification preferences
├── components/ui/              # shadcn/ui components
├── lib/
│   ├── api/profile.ts          # API service functions
│   ├── validations/profile.ts  # Zod validation schemas
│   └── utils.ts               # Utility functions
└── types/profile.ts           # TypeScript type definitions
```

### Key Technologies
- **Next.js 15**: App Router with TypeScript
- **React Hook Form**: Form state management
- **Zod**: Schema validation
- **TanStack Query**: Server state management
- **shadcn/ui**: Premium UI components
- **Tailwind CSS**: Styling with design tokens
- **Vitest**: Unit testing

## 🚀 Usage

### Basic Implementation
```tsx
import ProfileSettingsPage from '@/app/profile/page'

export default function App() {
  return <ProfileSettingsPage />
}
```

### API Integration
The component uses mock API functions that can be easily replaced with real API calls:

```typescript
// src/lib/api/profile.ts
export const profileApi = {
  async getProfile(): Promise<UserProfile> { /* ... */ },
  async updateProfile(data: ProfileUpdateRequest): Promise<UserProfile> { /* ... */ },
  async changePassword(data: PasswordChangeRequest): Promise<void> { /* ... */ },
  async getNotificationSettings(): Promise<NotificationSettings> { /* ... */ },
  async updateNotificationSettings(data: NotificationUpdateRequest): Promise<NotificationSettings> { /* ... */ },
  async uploadAvatar(file: File): Promise<string> { /* ... */ },
}
```

## 🧪 Testing

### Running Tests
```bash
npm run test        # Run tests in watch mode
npm run test:run    # Run tests once
```

### Test Coverage
- **Validation schemas**: Comprehensive Zod schema testing
- **Form validation**: Input validation and error handling
- **Password requirements**: Strength validation testing
- **Notification settings**: Boolean value validation

### Test Examples
```typescript
// Profile validation
const validData = {
  fullName: 'John Doe',
  email: 'john@example.com',
  phone: '1234567890',
  companyName: 'Acme Corp',
}
expect(profileSchema.safeParse(validData).success).toBe(true)

// Password validation
const weakPassword = { currentPassword: 'old', newPassword: 'weak', confirmPassword: 'weak' }
expect(passwordSchema.safeParse(weakPassword).success).toBe(false)
```

## 🎨 Design System

### Color Palette
- **Background**: Dark slate with subtle gradients
- **Cards**: Semi-transparent with backdrop blur
- **Primary**: Blue accent for interactive elements
- **Destructive**: Red for error states
- **Muted**: Gray for secondary text

### Typography
- **Font**: Inter (Google Fonts)
- **Hierarchy**: Clear heading and body text sizes
- **Weight**: 300-700 range for different emphasis levels

### Components
- **Cards**: Elevated containers with subtle borders
- **Buttons**: Multiple variants (primary, secondary, ghost)
- **Inputs**: Consistent styling with focus states
- **Switches**: Toggle controls for notifications
- **Toasts**: Success/error feedback messages

## 🔧 Configuration

### Environment Variables
```env
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key
```

### Tailwind Configuration
The component uses custom CSS variables for theming:
```css
:root {
  --background: 222.2 84% 4.9%;
  --foreground: 210 40% 98%;
  --primary: 210 40% 98%;
  --border: 217.2 32.6% 17.5%;
  /* ... more variables */
}
```

## 📱 Responsive Design

### Breakpoints
- **Mobile**: < 768px (stacked layout)
- **Tablet**: 768px - 1024px (side-by-side with adjustments)
- **Desktop**: > 1024px (full two-column layout)

### Mobile Optimizations
- Touch-friendly button sizes
- Optimized form layouts
- Collapsible navigation
- Swipe gestures for mobile interactions

## 🔒 Security Considerations

### Password Security
- Client-side validation for UX
- Server-side validation required
- Password strength requirements
- Secure password change flow

### File Upload Security
- File type validation
- File size limits
- Secure file handling
- Image processing considerations

### Data Validation
- Input sanitization
- XSS prevention
- CSRF protection (via NextAuth)
- Rate limiting considerations

## 🚀 Performance

### Optimizations
- **Code splitting**: Component-level lazy loading
- **Memoization**: React.memo for expensive components
- **Query caching**: TanStack Query for server state
- **Image optimization**: Next.js Image component ready

### Bundle Size
- **Tree shaking**: Only used components included
- **Dynamic imports**: Lazy loading for heavy components
- **Minimal dependencies**: Carefully selected packages

## 🔄 State Management

### Form State
- **React Hook Form**: Efficient form state management
- **Zod validation**: Schema-based validation
- **Optimistic updates**: Immediate UI feedback

### Server State
- **TanStack Query**: Caching and synchronization
- **Background refetching**: Keep data fresh
- **Error handling**: Graceful error recovery

## 🎯 Future Enhancements

### Planned Features
- **Two-factor authentication**: Additional security layer
- **Profile picture cropping**: Image editing capabilities
- **Export data**: Download user data
- **Account deletion**: Self-service account removal

### Technical Improvements
- **Real-time updates**: WebSocket integration
- **Offline support**: PWA capabilities
- **Advanced validation**: Server-side schema validation
- **Audit logging**: Track profile changes

## 📚 API Reference

### Types
```typescript
interface UserProfile {
  id: string
  fullName: string
  email: string
  phone: string
  companyName: string
  avatar?: string
  createdAt: string
  updatedAt: string
}

interface NotificationSettings {
  email: boolean
  sms: boolean
  push: boolean
}
```

### Validation Schemas
```typescript
const profileSchema = z.object({
  fullName: z.string().min(2, "Full name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().min(10, "Phone number must be at least 10 digits"),
  companyName: z.string().min(2, "Company name must be at least 2 characters"),
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
- **Conventional commits**: Commit message format

### Pull Request Process
1. Create feature branch
2. Write tests for new features
3. Ensure all tests pass
4. Update documentation
5. Submit pull request

## 📄 License

This component is part of the CarWrap CRM project and follows the same licensing terms.
