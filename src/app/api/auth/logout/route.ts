import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const response = NextResponse.json({ message: 'Logged out successfully' });
    
    // Clear all auth cookies
    response.cookies.set('next-auth.session-token', '', {
      expires: new Date(0),
      path: '/',
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax'
    });
    
    response.cookies.set('__Secure-next-auth.session-token', '', {
      expires: new Date(0),
      path: '/',
      httpOnly: true,
      secure: true,
      sameSite: 'lax'
    });
    
    return response;
  } catch (error) {
    console.error('Logout error:', error);
    return NextResponse.json({ error: 'Failed to logout' }, { status: 500 });
  }
}
