import { NextResponse } from 'next/server';
import { deletePersonalRecord } from '@/app/(app)/dashboard/personal/data';

/**
 * DELETE handler for personal records
 * 
 * @param {Request} request - The request object
 * @returns {Promise<NextResponse>} The response object
 */
export async function DELETE(request) {
  try {
    const body = await request.json();
    
    if (!body.ids || !Array.isArray(body.ids) || !body.ids.length) {
      return NextResponse.json(
        { error: 'Missing required parameter: ids' },
        { status: 400 }
      );
    }
    
    await deletePersonalRecord(body.ids);
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('API delete error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to delete records' },
      { status: 500 }
    );
  }
} 