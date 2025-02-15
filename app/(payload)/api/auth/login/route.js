import { payload } from '@/lib/payload';
import { cookies } from 'next/headers';

export async function POST(request) {
  try {
    const { email, password } = await request.json();
    const cookieStore = await cookies();

    // Attempt to login with payload
    const result = await payload.login({
      collection: "users",
      data: { email, password },
    });

    // Get the token from the result
    const { token, user } = result;

    if (!token) {
      throw new Error('No token received from authentication');
    }

    // Set the cookie with proper attributes
    cookieStore.set('payload-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
    });

    // Get user permissions after successful login
    const { permissions } = await payload.auth({
      headers: {
        Cookie: `payload-token=${token}`,
      },
    });
    console.log('permissions:', permissions);
    // Return success response with user data
    return Response.json({
      success: true,
      user: { ...user, permissions },
    });

  } catch (error) {
    console.error('Login error:', error);
    return Response.json({
      success: false,
      error: error.message || 'Authentication failed'
    }, { status: 401 });
  }
}