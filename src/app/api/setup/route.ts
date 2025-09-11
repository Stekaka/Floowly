import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';

export async function POST(request: NextRequest) {
  try {
    // Check if admin user already exists
    const existingAdmin = await prisma.user.findUnique({
      where: { email: 'admin@floowly.com' }
    });

    if (existingAdmin) {
      return NextResponse.json({ 
        message: 'Database already initialized',
        adminExists: true 
      });
    }

    // Create admin user
    const hashedPassword = await bcrypt.hash('admin123', 12);
    
    const adminUser = await prisma.user.create({
      data: {
        email: 'admin@floowly.com',
        password: hashedPassword,
        name: 'Admin User',
        role: 'admin',
        status: 'active',
      },
    });

    // Create sample data
    const customer1 = await prisma.customer.create({
      data: {
        name: 'John Doe',
        company: 'Acme Corp',
        email: 'john@acme.com',
        phone: '+46 70 123 4567',
        address: {
          street: 'Storgatan 1',
          city: 'Stockholm',
          postalCode: '111 22',
          country: 'Sweden',
        },
        tags: ['vip', 'repeat'],
        status: 'active',
      },
    });

    const customer2 = await prisma.customer.create({
      data: {
        name: 'Jane Smith',
        company: 'Tech Solutions AB',
        email: 'jane@techsolutions.se',
        phone: '+46 70 987 6543',
        address: {
          street: 'Teknikgatan 15',
          city: 'Göteborg',
          postalCode: '412 58',
          country: 'Sweden',
        },
        tags: ['new', 'corporate'],
        status: 'prospect',
      },
    });

    const quote1 = await prisma.quote.create({
      data: {
        customerId: customer1.id,
        title: 'BMW X5 Full Wrap',
        description: 'Complete vehicle wrap with matte black vinyl',
        items: [
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
        ],
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

    const job1 = await prisma.job.create({
      data: {
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

    return NextResponse.json({ 
      message: 'Database initialized successfully',
      adminUser: { id: adminUser.id, email: adminUser.email },
      sampleData: {
        customers: 2,
        quotes: 1,
        jobs: 1
      }
    });

  } catch (error: any) {
    console.error('Setup error:', error);
    return NextResponse.json({ 
      error: 'Failed to initialize database',
      details: error.message 
    }, { status: 500 });
  }
}
