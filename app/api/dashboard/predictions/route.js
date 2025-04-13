import { NextResponse } from 'next/server';
import { generatePrediction } from '@/app/(app)/dashboard/actions';

/**
 * POST handler for dashboard predictions
 * 
 * @param {Request} request - The request object
 * @returns {Promise<NextResponse>} The response object
 */
export async function POST(request) {
  try {
    const body = await request.json();
    
    if (!body.data || !Array.isArray(body.data)) {
      return NextResponse.json(
        { error: 'Invalid request: data array is required' },
        { status: 400 }
      );
    }
    
    // Generate predictions using the existing action
    const predictions = await generatePrediction(body.data);
    
    // If there's an error in the prediction
    if (!predictions) {
      return NextResponse.json(
        { error: 'Failed to generate predictions' },
        { status: 500 }
      );
    }
    
    return NextResponse.json(predictions);
  } catch (error) {
    console.error('API prediction error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to generate predictions' },
      { status: 500 }
    );
  }
} 