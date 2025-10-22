import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { auth } from '@/lib/better-auth/auth';
import { connectToDatabase } from '@/database/mongoose';

export async function POST(request: NextRequest) {
  try {
    console.log('Sign out API called');
    
    // Get current session before clearing it
    let currentSession = null;
    try {
      currentSession = await auth.api.getSession({ headers: request.headers });
      console.log('Current session:', currentSession?.session?.id);
    } catch (e) {
      console.log('No current session found');
    }
    
    // Clear session from database manually
    if (currentSession?.session?.id) {
      try {
        const mongoose = await connectToDatabase();
        const db = mongoose.connection.db;
        
        if (db) {
          // Clear session from Better Auth sessions collection
          await db.collection('session').deleteMany({ 
            id: currentSession.session.id 
          });
          
          // Also clear any sessions for this user
          await db.collection('session').deleteMany({ 
            userId: currentSession.user.id 
          });
          
          console.log('Cleared sessions from database');
        }
      } catch (dbError) {
        console.error('Failed to clear session from database:', dbError);
      }
    }
    
    // Try Better Auth signout
    try {
      await auth.api.signOut({ headers: request.headers });
      console.log('Better Auth signout successful');
    } catch (authError) {
      console.log('Better Auth signout failed, proceeding with manual cleanup:', authError);
    }
    
    // Clear all Better Auth related cookies manually
    const cookieStore = await cookies();
    
    // Get all cookies and clear the ones related to Better Auth
    const allCookies = cookieStore.getAll();
    console.log('Current cookies:', allCookies.map(c => c.name));
    
    // Clear common Better Auth cookie names
    const cookiesToClear = [
      'better-auth.session_token',
      'better-auth.csrf_token',
      'better-auth.session',
      'session',
      'auth-token',
      '__Secure-better-auth.session_token',
      '__Host-better-auth.session_token'
    ];
    
    cookiesToClear.forEach(cookieName => {
      try {
        cookieStore.delete(cookieName);
        console.log(`Cleared cookie: ${cookieName}`);
      } catch (e) {
        console.log(`Cookie ${cookieName} not found or already cleared`);
      }
    });
    
    // Also clear any cookies that contain 'better-auth' or 'session'
    allCookies.forEach(cookie => {
      if (cookie.name.includes('better-auth') || cookie.name.includes('session')) {
        try {
          cookieStore.delete(cookie.name);
          console.log(`Cleared cookie: ${cookie.name}`);
        } catch (e) {
          console.log(`Failed to clear cookie: ${cookie.name}`);
        }
      }
    });
    
    console.log('Sign out successful - session and cookies cleared');
    
    // Return response with headers to clear cookies on client side too
    const response = NextResponse.json({ 
      success: true, 
      message: 'Signed out successfully' 
    });
    
    // Set multiple cookie variations to expire immediately
    const cookieOptions = [
      { name: 'better-auth.session_token', options: { expires: new Date(0), path: '/', httpOnly: true } },
      { name: 'better-auth.csrf_token', options: { expires: new Date(0), path: '/', httpOnly: true } },
      { name: 'better-auth.session', options: { expires: new Date(0), path: '/' } },
      { name: 'session', options: { expires: new Date(0), path: '/' } },
      { name: '__Secure-better-auth.session_token', options: { expires: new Date(0), path: '/', secure: true, httpOnly: true } },
      { name: '__Host-better-auth.session_token', options: { expires: new Date(0), path: '/', secure: true, httpOnly: true } }
    ];
    
    cookieOptions.forEach(({ name, options }) => {
      response.cookies.set(name, '', options);
    });
    
    return response;
    
  } catch (error: any) {
    console.error('Sign out API error:', error);
    return NextResponse.json({ 
      success: false, 
      error: error.message || 'Sign out failed' 
    }, { status: 500 });
  }
}