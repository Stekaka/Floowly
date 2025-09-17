# Vercel Production Setup

## Problem: DATABASE_URL behöver rätt lösenord

I `vercel.json` finns fortfarande placeholder `[YOUR-PASSWORD]` som behöver ersättas med ditt riktiga Supabase databaslösenord.

## Lösning:

### 1. Hitta ditt Supabase databaslösenord

1. Gå till [supabase.com](https://supabase.com)
2. Logga in på ditt projekt
3. Gå till **Settings > Database**
4. Under "Connection parameters" hittar du din connection string
5. Kopiera lösenordet från connection stringen

### 2. Uppdatera Vercel Environment Variables

**Alternativ A: Via Vercel Dashboard (REKOMMENDERAT)**
1. Gå till [vercel.com](https://vercel.com)
2. Välj ditt projekt "Floowly"
3. Gå till **Settings > Environment Variables**
4. Uppdatera `DATABASE_URL` med rätt lösenord:
   ```
   postgresql://postgres:DITT_RIKTIGA_LÖSENORD@db.ufsgsaytiqvdccvfhqlm.supabase.co:5432/postgres?sslmode=require
   ```

**Alternativ B: Via vercel.json (om du vill)**
Ersätt `[YOUR-PASSWORD]` i `vercel.json` med ditt riktiga lösenord och committa.

### 3. Redeploy

Efter att du uppdaterat environment variables:
1. Gå till **Deployments** i Vercel dashboard
2. Klicka på **Redeploy** på senaste deployment
3. Eller pusha en ny commit för att triggra ny deployment

### 4. Testa registrering

Efter deployment:
1. Gå till `https://floowly.vercel.app/login`
2. Klicka på "Registrera"
3. Fyll i formuläret och testa

## Viktigt:

- **Använd Vercel Dashboard** för environment variables (säkrare)
- **Kontrollera att lösenordet är korrekt** från Supabase
- **Vänta på att deployment slutförs** innan du testar

## Om det fortfarande inte fungerar:

Kontrollera Vercel deployment logs för felmeddelanden om databasanslutning.
