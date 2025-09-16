import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.companyId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search');
    const status = searchParams.get('status');
    const tags = searchParams.get('tags');

    const where: any = {
      // Add company isolation - customers should be scoped to company
      // For now, we'll add a companyId field to customers later
    };

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { company: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (status) {
      where.status = status;
    }

    if (tags) {
      const tagArray = tags.split(',');
      where.tags = { hasSome: tagArray };
    }

    const customers = await prisma.customer.findMany({
      where,
      include: {
        quotes: {
          select: {
            id: true,
            title: true,
            total: true,
            status: true,
            createdAt: true,
          },
        },
        jobs: {
          select: {
            id: true,
            title: true,
            status: true,
            startDate: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    // Parse JSON fields for SQLite compatibility
    const parsedCustomers = customers.map(customer => ({
      ...customer,
      address: customer.address ? JSON.parse(customer.address) : null,
      tags: customer.tags ? JSON.parse(customer.tags) : []
    }));

    return NextResponse.json(parsedCustomers);
  } catch (error) {
    console.error('Error fetching customers:', error);
    return NextResponse.json({ error: 'Failed to fetch customers' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { 
      name, 
      company, 
      email, 
      phone, 
      address, 
      tags = [], 
      status = 'active' 
    } = await request.json();

    if (!name) {
      return NextResponse.json({ error: 'Name is required' }, { status: 400 });
    }

    const newCustomer = await prisma.customer.create({
      data: {
        name,
        company,
        email,
        phone,
        address: address ? JSON.stringify(address) : null,
        tags: JSON.stringify(tags || []),
        status,
      },
      include: {
        quotes: true,
        jobs: true,
      },
    });

    // Parse JSON fields for SQLite compatibility
    const parsedCustomer = {
      ...newCustomer,
      address: newCustomer.address ? JSON.parse(newCustomer.address) : null,
      tags: newCustomer.tags ? JSON.parse(newCustomer.tags) : []
    };

    return NextResponse.json(parsedCustomer, { status: 201 });
  } catch (error) {
    console.error('Error creating customer:', error);
    return NextResponse.json({ error: 'Failed to create customer' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { 
      id, 
      name, 
      company, 
      email, 
      phone, 
      address, 
      tags, 
      status 
    } = await request.json();

    if (!id) {
      return NextResponse.json({ error: 'Customer ID is required' }, { status: 400 });
    }

    const updateData: any = {};
    if (name !== undefined) updateData.name = name;
    if (company !== undefined) updateData.company = company;
    if (email !== undefined) updateData.email = email;
    if (phone !== undefined) updateData.phone = phone;
    if (address !== undefined) updateData.address = address ? JSON.stringify(address) : null;
    if (tags !== undefined) updateData.tags = JSON.stringify(tags);
    if (status !== undefined) updateData.status = status;

    const updatedCustomer = await prisma.customer.update({
      where: { id },
      data: updateData,
      include: {
        quotes: true,
        jobs: true,
      },
    });

    // Parse JSON fields for SQLite compatibility
    const parsedCustomer = {
      ...updatedCustomer,
      address: updatedCustomer.address ? JSON.parse(updatedCustomer.address) : null,
      tags: updatedCustomer.tags ? JSON.parse(updatedCustomer.tags) : []
    };

    return NextResponse.json(parsedCustomer);
  } catch (error: any) {
    console.error('Error updating customer:', error);
    if (error.code === 'P2025') {
      return NextResponse.json({ error: 'Customer not found' }, { status: 404 });
    }
    return NextResponse.json({ error: 'Failed to update customer' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { id } = await request.json();

    if (!id) {
      return NextResponse.json({ error: 'Customer ID is required' }, { status: 400 });
    }

    await prisma.customer.delete({
      where: { id },
    });

    return NextResponse.json({ message: 'Customer deleted' });
  } catch (error: any) {
    console.error('Error deleting customer:', error);
    if (error.code === 'P2025') {
      return NextResponse.json({ error: 'Customer not found' }, { status: 404 });
    }
    return NextResponse.json({ error: 'Failed to delete customer' }, { status: 500 });
  }
}