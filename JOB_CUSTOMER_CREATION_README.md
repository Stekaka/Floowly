# Floowly - Job Customer Creation Feature

## Översikt

Denna funktion gör det möjligt att skapa jobb för kunder som inte finns i systemet än. När man skapar ett jobb kan man välja mellan att använda en befintlig kund eller skapa en ny kund direkt i jobbformuläret.

## Nya Funktioner

### 🆕 **Ny Kund Skapning i Jobbformulär**

#### **Kundtyp Val**
- **Befintlig Kund**: Välj från dropdown med alla befintliga kunder
- **Ny Kund**: Fyll i kunduppgifter direkt i formuläret

#### **Ny Kund Formulär**
- **Obligatoriska Fält**: Namn, Telefon
- **Valfria Fält**: Företag, E-post, Adress (gata, stad, postnummer, land)
- **Kundstatus**: Automatiskt satt till "Aktiv"
- **Spara Kund**: Checkbox för att spara kunden för framtida jobb

#### **Smart Validering**
- **Zod Schema**: Validering av alla kundfält
- **E-post Validering**: Korrekt e-postformat
- **Telefon Validering**: Minst 8 tecken
- **Namn Validering**: Minst 2 tecken

### 🔧 **Tekniska Förbättringar**

#### **Uppdaterad JobSchema**
```typescript
export const jobSchema = z.object({
  customerId: z.string().optional(),
  newCustomer: z.boolean().default(false),
  customerData: customerDataSchema.optional(),
  saveCustomer: z.boolean().default(false),
  // ... andra fält
}).refine((data) => {
  return data.customerId || data.customerData
}, {
  message: "Either select an existing customer or provide new customer data",
  path: ["customerId"]
})
```

#### **Kunddata Schema**
```typescript
export const customerDataSchema = z.object({
  name: z.string().min(2, "Customer name must be at least 2 characters"),
  company: z.string().optional(),
  email: z.string().email("Invalid email address").optional(),
  phone: z.string().min(8, "Phone number must be at least 8 characters"),
  address: z.object({
    street: z.string().optional(),
    city: z.string().optional(),
    postalCode: z.string().optional(),
    country: z.string().optional(),
  }).optional(),
  tags: z.array(z.string()).optional(),
  status: z.enum(['active', 'inactive', 'prospect']).default('active'),
})
```

### 🎨 **UI/UX Förbättringar**

#### **JobDialog Komponent**
- **Kundtyp Väljare**: Toggle mellan befintlig och ny kund
- **Dynamiskt Formulär**: Visar rätt fält baserat på val
- **Snygg Kundkort**: Visar kundinformation i ett snyggt kort
- **Spara Kund Toggle**: Tydlig checkbox för att spara kunden

#### **Formulär Layout**
- **Responsiv Design**: Fungerar på alla skärmstorlekar
- **Tydliga Labels**: Alla fält har beskrivande labels
- **Felhantering**: Inline felmeddelanden för validering
- **Loading States**: Disabled tillstånd under laddning

### 🔄 **API Förbättringar**

#### **Jobs API (POST/PUT)**
- **Ny Kund Hantering**: Skapar temporär kund för jobbet
- **Kundvalidering**: Kontrollerar att kunddata är korrekt
- **Spara Kund Flagga**: Loggar när kund ska sparas
- **Befintlig Kund**: Hittar och länkar befintlig kund

#### **Kunddata Struktur**
```typescript
const customer = {
  id: newCustomerId,
  name: customerData.name,
  company: customerData.company || undefined,
  email: customerData.email || undefined,
  phone: customerData.phone,
  address: customerData.address || undefined,
  tags: customerData.tags || [],
  status: customerData.status || 'active',
};
```

### 📋 **Användarflöde**

#### **Skapa Jobb med Ny Kund**
1. **Öppna Jobbformulär**: Klicka på "Create Job" i kalendern
2. **Välj Kundtyp**: Välj "New Customer"
3. **Fyll i Kunddata**: Namn, telefon, företag, e-post, adress
4. **Spara Kund**: Bocka i om kunden ska sparas för framtiden
5. **Fyll i Jobbdata**: Titel, beskrivning, datum, priser
6. **Skapa Jobb**: Klicka "Create Job"

#### **Skapa Jobb med Befintlig Kund**
1. **Öppna Jobbformulär**: Klicka på "Create Job" i kalendern
2. **Välj Kundtyp**: Välj "Existing Customer"
3. **Välj Kund**: Välj från dropdown med befintliga kunder
4. **Fyll i Jobbdata**: Titel, beskrivning, datum, priser
5. **Skapa Jobb**: Klicka "Create Job"

### 🎯 **Fördelar**

#### **För Användare**
- **Snabbare Workflow**: Skapa jobb utan att först skapa kund
- **Flexibilitet**: Välja om kunden ska sparas eller inte
- **Enklare Process**: Allt i ett formulär
- **Mindre Klick**: Färre steg för att skapa jobb

#### **För Systemet**
- **Bättre Data**: Kunder skapas med korrekt validering
- **Flexibel Integration**: Fungerar med befintliga kunder
- **Skalbarhet**: Enkelt att utöka med fler fält
- **Konsistens**: Samma validering som kundmodulen

### 🔮 **Framtida Förbättringar**

#### **Planerade Funktioner**
- **Kundimport**: Importera kunder från CSV/Excel
- **Kundduplicering**: Upptäcka liknande kunder
- **Automatisk Spara**: Spara kunder automatiskt baserat på regler
- **Kundintegration**: Direkt integration med kundmodulen

#### **Möjliga Utökningar**
- **Kundhistorik**: Visa tidigare jobb för nya kunder
- **Kundrekommendationer**: Föreslå liknande kunder
- **Bulk Import**: Skapa flera jobb med nya kunder samtidigt
- **Kundanalys**: Analysera nya vs befintliga kunder

## Teknisk Implementation

### Komponenter
- **JobDialog**: Huvudkomponent med kundval och formulär
- **CustomerDataSchema**: Zod schema för kundvalidering
- **Jobs API**: Uppdaterad för att hantera nya kunder

### Filer
- `src/components/calendar/JobDialog.tsx` - Huvudkomponent
- `src/lib/validations/job.ts` - Valideringsscheman
- `src/app/api/jobs/route.ts` - API endpoints

### Beroenden
- `react-hook-form` - Formulärhantering
- `zod` - Validering
- `@hookform/resolvers` - Zod integration
- `shadcn/ui` - UI komponenter

## Användning

### Grundläggande Användning
```typescript
// Skapa jobb med ny kund
const jobData = {
  newCustomer: true,
  customerData: {
    name: "John Doe",
    phone: "+46 70 123 4567",
    company: "Acme Corp",
    email: "john@acme.com"
  },
  saveCustomer: true,
  title: "BMW X5 Full Wrap",
  // ... andra jobbfält
}
```

### Validering
```typescript
// Automatisk validering via Zod
const result = jobSchema.parse(jobData)
```

### API Anrop
```typescript
// POST /api/jobs
const response = await fetch('/api/jobs', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(jobData)
})
```

## Sammanfattning

Denna funktion gör det mycket enklare att skapa jobb för nya kunder direkt i jobbformuläret. Användare kan nu:

1. **Välja mellan befintlig eller ny kund**
2. **Fylla i kunduppgifter direkt i jobbformuläret**
3. **Välja om kunden ska sparas för framtiden**
4. **Få full validering av alla kundfält**
5. **Se en snygg och intuitiv användargränssnitt**

Funktionen är helt integrerad med det befintliga systemet och kräver inga ändringar i andra delar av applikationen.
