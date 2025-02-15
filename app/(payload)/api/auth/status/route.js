import { payload } from '@/lib/payload';
import { headers } from 'next/headers';

export async function GET() {
  try {
    const headersList = headers();
    const authResult = await payload.auth({
      headers: {
        Cookie: headersList.get('Cookie'),
      },
    });

    return Response.json({
      success: true,
      ...authResult
    });
  } catch (error) {
    return Response.json({
      success: false,
      error: 'Not authenticated'
    }, { status: 401 });
  }
}