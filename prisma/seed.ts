import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  // Create default company
  const defaultCompany = await prisma.company.upsert({
    where: { name: 'Default Company' },
    update: {},
    create: {
      name: 'Default Company',
      plan: 'professional',
      maxUsers: 50,
    },
  });
  console.log('Default company created:', defaultCompany);

  // Create admin user
  const hashedPassword = await bcrypt.hash('admin123', 12);
  
  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@floowly.com' },
    update: {},
    create: {
      email: 'admin@floowly.com',
      password: hashedPassword,
      name: 'Admin User',
      role: 'admin',
      status: 'active',
      companyId: defaultCompany.id,
    },
  });

  console.log('Admin user created:', adminUser);

  // Create sample customers
  const customer1 = await prisma.customer.upsert({
    where: { id: 'customer-1' },
    update: {},
    create: {
      id: 'customer-1',
      name: 'John Doe',
      company: 'Acme Corp',
      email: 'john@acme.com',
      phone: '+46 70 123 4567',
      address: JSON.stringify({
        street: 'Storgatan 1',
        city: 'Stockholm',
        postalCode: '111 22',
        country: 'Sweden',
      }),
      tags: ['vip', 'repeat'],
      status: 'active',
    },
  });

  const customer2 = await prisma.customer.upsert({
    where: { id: 'customer-2' },
    update: {},
    create: {
      id: 'customer-2',
      name: 'Jane Smith',
      company: 'Tech Solutions AB',
      email: 'jane@techsolutions.se',
      phone: '+46 70 987 6543',
      address: JSON.stringify({
        street: 'Teknikgatan 15',
        city: 'Göteborg',
        postalCode: '412 58',
        country: 'Sweden',
      }),
      tags: ['new', 'corporate'],
      status: 'prospect',
    },
  });

  console.log('Sample customers created:', { customer1, customer2 });

  // Create sample quotes
  const quote1 = await prisma.quote.upsert({
    where: { id: 'quote-1' },
    update: {},
    create: {
      id: 'quote-1',
      customerId: customer1.id,
      title: 'BMW X5 Full Wrap',
      description: 'Complete vehicle wrap with matte black vinyl',
      items: JSON.stringify([
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
      ]),
      subtotal: 25000,
      taxAmount: 6250,
      total: 31250,
      status: 'sent',
      hours: 16,
      materialCost: 15000,
      markupPercentage: 50,
      profitEstimate: 16250,
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    },
  });

  console.log('Sample quote created:', quote1);

  // Create sample job
  const job1 = await prisma.job.upsert({
    where: { id: 'job-1' },
    update: {},
    create: {
      id: 'job-1',
      customerId: customer1.id,
      quoteId: quote1.id,
      title: 'BMW X5 Full Wrap',
      description: 'Complete vehicle wrap with matte black vinyl',
      startDate: new Date('2024-12-15'),
      endDate: new Date('2024-12-20'),
      startTime: '09:00',
      endTime: '17:00',
      hours: 40,
      materialCost: 15000,
      quotedPrice: 31250,
      status: 'confirmed',
      notes: 'Customer prefers matte finishes',
      timezone: 'Europe/Stockholm',
    },
  });

  console.log('Sample job created:', job1);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
