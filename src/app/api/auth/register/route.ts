import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';

export async function POST(request: NextRequest) {
  try {
    const { email, password, name, companyName } = await request.json();

    if (!email || !password || !companyName) {
      return NextResponse.json({ error: 'Email, password, and company name are required' }, { status: 400 });
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json({ error: 'User already exists' }, { status: 400 });
    }

    // Check if company already exists
    const existingCompany = await prisma.company.findUnique({
      where: { name: companyName },
    });

    if (existingCompany) {
      return NextResponse.json({ error: 'Company already exists' }, { status: 400 });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create company and user in a transaction
    const result = await prisma.$transaction(async (tx) => {
      // Create company
      const company = await tx.company.create({
        data: {
          name: companyName,
          domain: email.split('@')[1], // Extract domain from email
        },
      });

      // Create user as company admin
      const user = await tx.user.create({
        data: {
          email,
          password: hashedPassword,
          name: name || null,
          role: 'admin',
          companyId: company.id,
        },
      });

      return { user, company };
    });

    // Return user without password
    const { password: _, ...userWithoutPassword } = result.user;
    return NextResponse.json({
      user: userWithoutPassword,
      company: result.company,
      message: 'Company and admin user created successfully'
    }, { status: 201 });
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json({ error: 'Failed to create company and user' }, { status: 500 });
  }
}
