# Production Deployment Guide

## Environment Variables Setup

### Required Environment Variables

Set these environment variables in your production environment (Vercel, Netlify, etc.):

```bash
# NextAuth Configuration
NEXTAUTH_URL=https://your-production-domain.com
NEXTAUTH_SECRET=V0SFXM+i/w+GtMCiF8+qYAPhsDQk2985PFlpTDLwaaw=

# Database Configuration (Supabase PostgreSQL)
DATABASE_URL=postgresql://postgres.ufsgsaytiqvdccvfhqlm:IUGqUSmZMHY1Ay16@aws-1-eu-north-1.pooler.supabase.com:5432/postgres?sslmode=require

# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://ufsgsaytiqvdccvfhqlm.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVmc2dzYXl0aXF2ZGNjdmZocWxtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc1NzQyNjgsImV4cCI6MjA3MzE1MDI2OH0.lZypuC-MYM7p-g_Ql-QwLoFdqRUcmLvrFdxDW-GDq6w
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVmc2dzYXl0aXF2ZGNjdmZocWxtIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NzU3NDI2OCwiZXhwIjoyMDczMTUwMjY4fQ.lbcp2cNlwVv9MdrACzEQF5UYt--Nf5iWXVFGZlvxmWI

# App Configuration
NODE_ENV=production
```

### Important Notes

1. **NEXTAUTH_URL**: Must match your production domain exactly
2. **NEXTAUTH_SECRET**: Use the provided secure secret or generate a new one with `openssl rand -base64 32`
3. **Database URL**: Ensure SSL mode is required for production (`?sslmode=require`)

## Pre-Deployment Checklist

- [ ] All environment variables are set correctly
- [ ] Database migrations are up to date
- [ ] Authentication is working in development
- [ ] All API routes are functional
- [ ] Error handling is in place

## Testing Authentication

### Demo Credentials
- Email: `admin@floowly.com`
- Password: `admin123`

### Test Steps
1. Navigate to `/login`
2. Try logging in with demo credentials
3. Verify redirect to `/dashboard`
4. Test registration flow
5. Verify session persistence

## Troubleshooting

### Common Issues

1. **"NEXTAUTH_SECRET environment variable is required"**
   - Ensure NEXTAUTH_SECRET is set in your production environment

2. **"NEXTAUTH_URL environment variable is required"**
   - Ensure NEXTAUTH_URL matches your production domain exactly

3. **Login redirects to error page**
   - Check browser console for errors
   - Verify database connection
   - Check NextAuth debug logs

4. **Session not persisting**
   - Verify NEXTAUTH_SECRET is consistent
   - Check if cookies are being blocked
   - Verify domain configuration

### Debug Mode

Set `NODE_ENV=development` temporarily to enable NextAuth debug logging.

## Security Considerations

- Never commit `.env.local` or `.env` files
- Use strong, unique secrets for production
- Enable HTTPS in production
- Regularly rotate secrets
- Monitor authentication logs
