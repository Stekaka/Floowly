# Floowly - Premium Workflow Management

A premium, tech-luxe workflow management system designed for modern businesses. Built with Next.js, TypeScript, Prisma, and Supabase for a modern, secure, and scalable solution.

## ✨ Features

### 🔐 **Secure Authentication**
- NextAuth.js integration with Supabase
- Password hashing with bcryptjs
- Protected routes with middleware
- User registration and login

### 👥 **Customer Management**
- Premium customer profiles
- Contact information tracking
- Quote history and relationship insights
- Advanced search and filtering

### 📋 **Quote & Job System**
- Professional quote creation
- Real-time profit calculations
- Material cost tracking
- Status management (Draft, Sent, Accepted)

### 📅 **Advanced Calendar**
- Visual job scheduling
- Drag-and-drop interface
- Month, week, and day views
- Profit-based color coding

### 🎨 **Premium Design**
- Dark theme with purple/pink gradients
- Glassmorphism effects
- Smooth animations and transitions
- Mobile-responsive design
- Tech-luxe aesthetic

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Supabase account
- PostgreSQL database

### 1. Clone and Install

```bash
git clone <repository-url>
cd floowly
npm install
```

### 2. Environment Setup

Create a `.env.local` file in the root directory:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# Database Configuration
DATABASE_URL=your_supabase_database_url

# NextAuth Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_nextauth_secret_key_here

# App Configuration
NODE_ENV=development
```

### 3. Database Setup

```bash
# Generate Prisma client
npx prisma generate

# Run database migrations
npx prisma db push

# (Optional) Seed the database
npx prisma db seed
```

### 4. Start Development Server

```bash
npm run dev
```

Visit `http://localhost:3000` to see the application.

## 🛠️ Technology Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: Tailwind CSS with custom design system
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: NextAuth.js with Supabase
- **Calendar**: React Big Calendar
- **Deployment**: Vercel (recommended)

## 📁 Project Structure

```
src/
├── app/                    # Next.js app directory
│   ├── api/               # API routes
│   │   ├── auth/          # Authentication endpoints
│   │   ├── customers/     # Customer management
│   │   ├── quotes/        # Quote management
│   │   └── jobs/          # Job management
│   ├── calendar/          # Calendar page
│   ├── customers/         # Customer management page
│   ├── quotes/            # Quote management page
│   ├── login/             # Authentication page
│   └── layout.tsx         # Root layout
├── components/            # Reusable components
│   ├── Modal.tsx          # Modal component
│   └── Navbar.tsx         # Navigation component
├── lib/                   # Utility libraries
│   ├── providers.tsx      # Context providers
│   └── supabase.ts        # Supabase client
└── middleware.ts          # Route protection
```

## 🔧 Configuration

### Supabase Setup

1. Create a new Supabase project
2. Get your project URL and anon key from Settings > API
3. Create a service role key for server-side operations
4. Set up Row Level Security (RLS) policies if needed

### Database Schema

The application uses the following main entities:

- **Users**: Authentication and user management
- **Customers**: Client information and relationships
- **Quotes**: Project estimates and pricing
- **Jobs**: Scheduled work and profit tracking

## 🎨 Design System

### Color Palette
- **Primary**: Purple (#9333ea) to Pink (#ec4899) gradients
- **Background**: Slate (#0f172a) with dark gradients
- **Text**: White and slate variants
- **Accents**: Green for success, Red for warnings

### Typography
- **Font**: Inter (Google Fonts)
- **Headings**: Bold with gradient text effects
- **Body**: Clean, readable text with proper contrast

## 🔒 Security Features

- Password hashing with bcryptjs
- JWT-based session management
- Protected API routes
- Input validation and sanitization
- CSRF protection via NextAuth

## 📱 Responsive Design

- Mobile-first approach
- Breakpoints: sm (640px), md (768px), lg (1024px), xl (1280px)
- Touch-friendly interface
- Optimized for all screen sizes

## 🚀 Deployment

### Vercel (Recommended)

1. Connect your GitHub repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Other Platforms

The application can be deployed to any platform that supports Next.js:
- Netlify
- Railway
- DigitalOcean App Platform
- AWS Amplify

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Check the documentation
- Review the code comments

## 🔮 Future Enhancements

- [ ] Advanced reporting and analytics
- [ ] Mobile app (React Native)
- [ ] Email notifications
- [ ] File upload for images
- [ ] Advanced search and filtering
- [ ] Multi-language support
- [ ] API documentation
- [ ] Unit and integration tests

---

**Built with ❤️ for modern businesses**