import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';

export async function POST(request: NextRequest) {
  try {
    console.log('=== REGISTRATION REQUEST START ===');
    console.log('Request headers:', Object.fromEntries(request.headers.entries()));
    
    const body = await request.json();
    console.log('Request body:', body);
    
    const { email, password, name, companyName } = body;

    console.log('Parsed data:', { 
      email, 
      companyName, 
      name,
      hasPassword: !!password,
      passwordLength: password?.length 
    });

    if (!email || !password || !companyName) {
      console.log('Missing required fields:', { email: !!email, password: !!password, companyName: !!companyName });
      return NextResponse.json({ error: 'Email, password, and company name are required' }, { status: 400 });
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      console.log('User already exists:', email);
      return NextResponse.json({ error: 'User already exists' }, { status: 400 });
    }

    // Check if company already exists
    const existingCompany = await prisma.company.findUnique({
      where: { name: companyName },
    });

    if (existingCompany) {
      console.log('Company already exists:', companyName);
      return NextResponse.json({ error: 'Company already exists' }, { status: 400 });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);
    console.log('Password hashed successfully');

    // Create company and user
    let company, user;

    try {
      // Create company first
      company = await prisma.company.create({
        data: {
          name: companyName,
          domain: email.split('@')[1], // Extract domain from email
        },
      });
      console.log('Company created:', company.id);

      // Create user as company admin
      user = await prisma.user.create({
        data: {
          email,
          password: hashedPassword,
          name: name || null,
          role: 'admin',
          companyId: company.id,
        },
      });
      console.log('User created:', user.id);

    } catch (dbError) {
      console.error('Database error during creation:', dbError);
      throw dbError;
    }

    // Return user without password
    const { password: _, ...userWithoutPassword } = user;
    const result = {
      user: userWithoutPassword,
      company: company,
      message: 'Company and admin user created successfully'
    };

    console.log('Registration successful:', { userId: user.id, companyId: company.id });
    console.log('=== REGISTRATION REQUEST SUCCESS ===');
    return NextResponse.json(result, { status: 201 });

  } catch (error: any) {
    console.error('=== REGISTRATION REQUEST ERROR ===');
    console.error('Registration error details:', {
      message: error.message,
      stack: error.stack,
      name: error.name,
      code: error.code
    });
    
    // Return more specific error messages
    if (error.message?.includes('Unique constraint')) {
      return NextResponse.json({ error: 'Email or company name already exists' }, { status: 400 });
    }
    
    if (error.message?.includes('Validation')) {
      return NextResponse.json({ error: 'Invalid data provided' }, { status: 400 });
    }

    return NextResponse.json({ 
      error: 'Failed to create company and user',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    }, { status: 500 });
  }
}
