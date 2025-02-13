'use server'

import { model, ANALYSIS_PROMPT, PREDICTION_PROMPT } from '../genAI';
import { cache } from 'react';

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

  try {
    for (const category of categories) {
      const historicalData = data
        .filter(item => item.year === year)
        .map(item => ({
          month: item.month,
          value: item[category]
        }));

      const prompt = PREDICTION_PROMPT.replace('{data}', JSON.stringify(historicalData));
      const result = await model.generateContent(prompt);
      const response = result.response.text();
      const { predictions } = await parseAIResponse(response);

      if (!Array.isArray(predictions) || predictions.length !== 6 || 
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

// Historical data for multiple years
const HISTORICAL_DATA = {
  2023: [
    { month: "Jan", year: 2023, requests: 40, reports: 24, records: 35 },
    { month: "Feb", year: 2023, requests: 30, reports: 13, records: 45 },
    { month: "Mar", year: 2023, requests: 20, reports: 38, records: 30 },
    { month: "Apr", year: 2023, requests: 27, reports: 39, records: 28 },
    { month: "May", year: 2023, requests: 45, reports: 48, records: 52 },
    { month: "Jun", year: 2023, requests: 37, reports: 38, records: 42 },
  ],
  2024: [
    { month: "Jan", year: 2024, requests: 45, reports: 28, records: 38 },
    { month: "Feb", year: 2024, requests: 35, reports: 18, records: 48 },
    { month: "Mar", year: 2024, requests: 25, reports: 42, records: 33 },
    { month: "Apr", year: 2024, requests: 32, reports: 44, records: 31 },
    { month: "May", year: 2024, requests: 50, reports: 52, records: 55 },
    { month: "Jun", year: 2024, requests: 42, reports: 41, records: 45 },
  ]
};

export const getAvailableYears = cache(async() => {
  return Object.keys(HISTORICAL_DATA).map(Number).sort((a, b) => b - a);
});

export const getDashboardData = cache(async (year = new Date().getFullYear()) => {
  try {
    const baseData = HISTORICAL_DATA[year] || [];
    if (!baseData.length) {
      return { data: [], error: 'No data available for selected year' };
    }

    const { data: predictions, error: predError } = await generatePredictions(baseData, year);
    
    if (predError) throw new Error(predError);
    
    const futureMonths = ["Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const futureData = futureMonths.map((month, index) => ({
      month,
      year,
      requestsPredicted: predictions.requests[index],
      reportsPredicted: predictions.reports[index],
      recordsPredicted: predictions.records[index],
    }));

    return { 
      data: [...baseData, ...futureData],
      availableYears: getAvailableYears(),
      error: null 
    };
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    return { 
      data: [], 
      availableYears: getAvailableYears(),
      error: 'Failed to load dashboard data' 
    };
  }
});