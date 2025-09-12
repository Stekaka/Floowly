# Supabase Setup för Produktion

## 1. Skapa Supabase-projekt

1. Gå till [supabase.com](https://supabase.com)
2. Skapa ett nytt projekt
3. Välj region (Stockholm för bästa prestanda)
4. Välj lösenord för databasen

## 2. Hämta Connection String

1. Gå till Settings > Database
2. Kopiera "Connection string" under "Connection parameters"
3. Ersätt `[YOUR-PASSWORD]` med ditt databaslösenord

## 3. Skapa .env.local fil

Skapa en `.env.local` fil i projektets root med följande innehåll:

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

## 4. Hämta API Keys

1. Gå till Settings > API
2. Kopiera "anon public" key till `NEXT_PUBLIC_SUPABASE_ANON_KEY`
3. Kopiera "service_role" key till `SUPABASE_SERVICE_ROLE_KEY`

## 5. Kör Prisma Migration

```bash
npx prisma generate
npx prisma db push
npx prisma db seed
```

## 6. Testa Anslutningen

```bash
npm run dev
```

## 7. För Vercel Deployment

Uppdatera miljövariabler i Vercel dashboard:

- `DATABASE_URL`: Din Supabase connection string
- `NEXTAUTH_URL`: https://din-app.vercel.app
- `NEXTAUTH_SECRET`: Generera en ny secret key
- `NEXT_PUBLIC_SUPABASE_URL`: Din Supabase URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Din Supabase anon key
- `SUPABASE_SERVICE_ROLE_KEY`: Din Supabase service role key
