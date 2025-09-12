# Testa Supabase Anslutning

## 1. Skapa .env.local fil

Skapa en `.env.local` fil med dina Supabase-uppgifter:

```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key_here

# Database Configuration (Supabase PostgreSQL)
DATABASE_URL=postgresql://postgres:[YOUR-PASSWORD]@db.[YOUR-PROJECT-REF].supabase.co:5432/postgres?sslmode=require

# NextAuth Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_nextauth_secret_key_here

# App Configuration
NODE_ENV=development
```

## 2. Testa Anslutningen

```bash
# Generera Prisma client
npx prisma generate

# Testa databasanslutning
npx prisma db push

# Kör seed data
npx prisma db seed

# Starta utvecklingsserver
npm run dev
```

## 3. Verifiera att det fungerar

1. Gå till http://localhost:3000
2. Kontrollera att login-sidan laddas
3. Testa att skapa en användare
4. Kontrollera att data sparas i Supabase

## 4. Felsökning

### Problem: "Can't reach database server"
- Kontrollera att DATABASE_URL är korrekt
- Kontrollera att lösenordet är rätt
- Kontrollera att projektet är aktivt i Supabase

### Problem: "Invalid credentials"
- Kontrollera att NEXTAUTH_SECRET är satt
- Kontrollera att NEXTAUTH_URL matchar din miljö

### Problem: "Prisma schema out of sync"
- Kör `npx prisma db push` för att synka schema
- Kör `npx prisma generate` för att uppdatera client
