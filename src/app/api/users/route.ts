import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user || !(session.user as any).companyId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email');

    if (email) {
      // Get user by email (only from same company)
      const user = await prisma.user.findFirst({
        where: { 
          email,
          companyId: (session.user as any).companyId
        },
      });
      return NextResponse.json(user ? [user] : []);
    }

    // Get all users from the same company
    const users = await prisma.user.findMany({
      where: { companyId: (session.user as any).companyId },
      include: { company: true },
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
    const session = await getServerSession(authOptions);
    
    if (!session?.user || !(session.user as any).companyId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Only admins can create users
    if (session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Only admins can create users' }, { status: 403 });
    }

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

    // Create user in the same company as the admin
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        role: role || 'employee',
        phone: phone || null,
        status: 'active',
        companyId: (session.user as any).companyId,
      },
      include: { company: true },
    });

    return NextResponse.json(user, { status: 201 });
  } catch (error: any) {
    console.error('Error creating user:', error);
    return NextResponse.json({ error: 'Failed to create user' }, { status: 500 });
  }
}
