import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  // Get Firebase Auth token from cookies
  const token = request.cookies.get('firebase-token');

  // Check if the user is accessing a protected route
  if (request.nextUrl.pathname.startsWith('/coach') || 
      request.nextUrl.pathname.startsWith('/analyzer')) {
    
    if (!token) {
      // Redirect to login if there's no token
      return NextResponse.redirect(new URL('/auth/login', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/coach/:path*', '/analyzer/:path*'],
}; 