"use server";

import { model, ANALYSIS_PROMPT, PREDICTION_PROMPT } from '../genAI';
import { cache } from 'react';
import { payload } from '../payload';

async function parseAIResponse(response) {
  try {
    const jsonStartIndex = response.indexOf('{');
    const jsonEndIndex = response.lastIndexOf('}') + 1;
    const jsonString = response.substring(jsonStartIndex, jsonEndIndex);
    return JSON.parse(jsonString);
  } catch (error) {
    throw new Error(`Failed to parse AI response: ${error?.message || 'Unknown error'}`);
  }
}

function getRemainingMonths(data, year) {
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const existingMonths = data.filter(item => item.year === year).map(item => item.month);
  return months.filter(month => !existingMonths.includes(month));
}

export const generateAnalysis = cache(async (dataType, data, year) => {
  const filteredData = data
  .filter(item => item.year === year)
  .map(item => ({
    month: item.month,
    value: item[dataType],
    predictedValue: item[`${dataType}Predicted`],
  }));


  const prompt = ANALYSIS_PROMPT.replace('{data}', JSON.stringify(filteredData));
  
  try {
    const result = await model.generateContent(prompt);
    const response = result.response.text();
    const analysis = await parseAIResponse(response);
    
    if (!analysis.trend || !analysis.percentageChange || !analysis.analysis ||
        !analysis.prediction || !Array.isArray(analysis.insights) || 
        !Array.isArray(analysis.recommendations)) {
      throw new Error('Invalid analysis format: missing required fields');
    }
    
    return { data: analysis, error: null };
  } catch (error) {
    console.error('Error generating analysis:', error);
    return { data: null, error: 'Failed to generate analysis' };
  }
});

export const generatePredictions = cache(async (data, year) => {
  const categories = ['requests', 'reports', 'records'];
  const results = {};
  const remainingMonths = getRemainingMonths(data, year);

  if (!remainingMonths.length) {
    return { data: null, error: 'No predictions needed - all months have data' };
  }

  try {
    for (const category of categories) {
        const historicalData = data
            .filter(item => item.year === year)
            .map(item => ({
                month: item.month,
                value: item[category]
            }));

        const prompt = PREDICTION_PROMPT
            .replace('{data}', JSON.stringify(historicalData))
            .replace(/{remainingMonths}/g, remainingMonths.length.toString());

        const result = await model.generateContent(prompt);
        const response = result.response.text();
        const { predictions } = await parseAIResponse(response);

        if (!Array.isArray(predictions) || predictions.length !== remainingMonths.length ||
            !predictions.every(n => typeof n === 'number' && n > 0)) {
            throw new Error(`Invalid predictions format for ${category}`);
        }

        results[category] = predictions;
    }

    return { data: results, error: null };
} catch (error) {
    console.error('Error generating predictions:', error);
    return { data: null, error: 'Failed to generate predictions' };
}
});

// Mock data for 2024-2025
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

export const getAnalytics = cache(async (metric, year) => {
  const data = MOCK_DATA[year];
  if (!data) return null;

  const values = data.map(item => item[metric]);
  const total = values.reduce((sum, val) => sum + val, 0);
  const avg = total / values.length;
  const max = Math.max(...values);
  const min = Math.min(...values);

  // Calculate trend
  const trend = values[values.length - 1] > values[0] ? 'increasing' : 'decreasing';
  const percentChange = ((values[values.length - 1] - values[0]) / values[0] * 100).toFixed(1);

  // Generate insights based on the data
  const insights = [
    `${trend === 'increasing' ? 'Growth' : 'Decline'} of ${percentChange}% observed`,
    `Peak activity: ${max} in ${data[values.indexOf(max)].name}`,
    `Average monthly ${metric}: ${avg.toFixed(1)}`,
    `Lowest activity: ${min} in ${data[values.indexOf(min)].name}`
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
});

export async function getDashboardData(year = new Date().getFullYear()) {
  try {
    // For now, return mock data
    const mockData = MOCK_DATA[year];
    if (!mockData) {
      throw new Error('No data available for selected year');
    }

    return {
      data: mockData,
      availableYears: Object.keys(MOCK_DATA).map(Number),
      error: null
    };

    // Real implementation (commented out for now)
    /*
    const [requests, permits, households] = await Promise.all([
      payload.find({
        collection: 'requests',
        where: {
          createdAt: {
            greater_than: new Date(year, 0, 1).toISOString(),
            less_than: new Date(year + 1, 0, 1).toISOString()
          }
        }
      }),
      // ...existing queries...
    ]);
    */
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    return {
      data: [],
      availableYears: [new Date().getFullYear()],
      error: 'Failed to fetch dashboard data'
    };
  }
}

export async function fetchAnalytics(metric, year) {
  return getAnalytics(metric, year);
}