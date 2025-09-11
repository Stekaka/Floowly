import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email');

    if (email) {
      // Get user by email
      const user = await prisma.user.findUnique({
        where: { email },
      });
      return NextResponse.json(user ? [user] : []);
    }

    // Get all users
    const users = await prisma.user.findMany({
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(users);
  } catch (error: any) {
    console.error('Error fetching users:', error);
    return NextResponse.json({ error: 'Failed to fetch users' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    const { email, name, role, phone, password } = data;

    if (!email || !name || !role) {
      return NextResponse.json({ error: 'Email, name, and role are required' }, { status: 400 });
    }

    // Generate a temporary password if not provided
    const tempPassword = password || 'temp123';
    const hashedPassword = await bcrypt.hash(tempPassword, 12);

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json({ error: 'User with this email already exists' }, { status: 400 });
    }

    // Get or create default company if no companyId provided
    let companyId = data.companyId;
    if (!companyId) {
      const defaultCompany = await prisma.company.findFirst({
        where: { name: 'Default Company' }
      });
      
      if (!defaultCompany) {
        const newCompany = await prisma.company.create({
          data: {
            name: 'Default Company',
            plan: 'professional',
            maxUsers: 50,
          }
        });
        companyId = newCompany.id;
      } else {
        companyId = defaultCompany.id;
      }
    }

    // Create user
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        role: role || 'user',
        phone: phone || null,
        status: 'active',
        companyId,
      },
    });

    return NextResponse.json(user, { status: 201 });
  } catch (error: any) {
    console.error('Error creating user:', error);
    return NextResponse.json({ error: 'Failed to create user' }, { status: 500 });
  }
}
