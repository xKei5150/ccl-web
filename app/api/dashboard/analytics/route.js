import { NextResponse } from 'next/server';
import { fetchMetricAnalytics } from '@/app/(app)/dashboard/dashboard-data';

/**
 * GET handler for dashboard analytics data
 * 
 * @param {Request} request - The request object
 * @returns {Promise<NextResponse>} The response object
 */
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const metric = searchParams.get('metric');
    const year = parseInt(searchParams.get('year')) || new Date().getFullYear();
    
    if (!metric) {
      return NextResponse.json(
        { error: 'Missing required parameter: metric' },
        { status: 400 }
      );
    }
    
    const analytics = await fetchMetricAnalytics(metric, year);
    
    return NextResponse.json(analytics);
  } catch (error) {
    console.error('API route error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch analytics data' },
      { status: 500 }
    );
  }
} 