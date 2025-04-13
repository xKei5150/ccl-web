"use server";

import { cache } from 'react';
import { fetchCollection } from '@/lib/data-fetching';
import { payload } from '@/lib/payload';

/**
 * Fetch dashboard data using the standardized pattern
 * 
 * @param {number} year - Year to fetch data for
 * @returns {Promise<object>} Dashboard data and metadata
 */
export const fetchDashboardData = cache(async (year = new Date().getFullYear()) => {
  try {
    // For initial implementation, we'll reuse the mock data
    // In a real implementation, we would use fetchCollection
    
    // Example of how to use fetchCollection:
    // const requests = await fetchCollection('requests', {
    //   where: {
    //     createdAt: {
    //       greater_than: new Date(year, 0, 1).toISOString(),
    //       less_than: new Date(year + 1, 0, 1).toISOString()
    //     }
    //   }
    // });
    
    // Mock data for now - would be replaced with real data fetching
    const MOCK_DATA = {
      2024: Array.from({ length: 12 }, (_, i) => ({
        name: new Date(2024, i).toLocaleString('default', { month: 'short' }),
        requests: Math.floor(Math.random() * 30) + 20,
        permits: Math.floor(Math.random() * 25) + 15,
        households: Math.floor(Math.random() * 35) + 25
      })),
      2025: Array.from({ length: 2 }, (_, i) => ({
        name: new Date(2025, i).toLocaleString('default', { month: 'short' }),
        requests: Math.floor(Math.random() * 30) + 20,
        permits: Math.floor(Math.random() * 25) + 15,
        households: Math.floor(Math.random() * 35) + 25
      }))
    };
    
    const mockData = MOCK_DATA[year];
    if (!mockData) {
      throw new Error('No data available for selected year');
    }

    return {
      data: mockData,
      availableYears: Object.keys(MOCK_DATA).map(Number),
      error: null
    };
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    return {
      data: [],
      availableYears: [new Date().getFullYear()],
      error: 'Failed to fetch dashboard data'
    };
  }
});

/**
 * Fetch analytics data for a specific metric
 * 
 * @param {string} metric - Metric to analyze (requests, permits, households)
 * @param {number} year - Year to analyze
 * @returns {Promise<object>} Analytics data
 */
export async function fetchMetricAnalytics(metric, year) {
  try {
    // In production, this would fetch real data from a database
    const data = await fetchDashboardData(year);
    if (!data || data.error) {
      throw new Error(data?.error || 'Failed to fetch metric data');
    }
    
    const values = data.data.map(item => item[metric]);
    const total = values.reduce((sum, val) => sum + val, 0);
    const avg = total / values.length;
    const max = Math.max(...values);
    const min = Math.min(...values);

    // Calculate trend
    const trend = values[values.length - 1] > values[0] ? 'increasing' : 'decreasing';
    const percentChange = Math.abs(((values[values.length - 1] - values[0]) / values[0] * 100).toFixed(1));

    // Generate insights based on the data
    const insights = [
      `${trend === 'increasing' ? 'Growth' : 'Decline'} of ${percentChange}% observed`,
      `Peak activity: ${max} in ${data.data[values.indexOf(max)].name}`,
      `Average monthly ${metric}: ${avg.toFixed(1)}`,
      `Lowest activity: ${min} in ${data.data[values.indexOf(min)].name}`
    ];

    // Generate recommendations
    const recommendations = [];
    if (trend === 'decreasing') {
      recommendations.push(
        'Consider implementing community outreach programs',
        'Review and optimize processing times',
        'Analyze common bottlenecks in the workflow'
      );
    } else {
      recommendations.push(
        'Maintain current momentum with process improvements',
        'Consider scaling resources to match growth',
        'Document successful practices for replication'
      );
    }

    return {
      trend,
      percentChange: `${percentChange}%`,
      insights,
      recommendations,
      stats: {
        total,
        average: avg.toFixed(1),
        max,
        min
      }
    };
  } catch (error) {
    console.error('Error fetching analytics:', error);
    throw new Error('Failed to load analytics data');
  }
} 