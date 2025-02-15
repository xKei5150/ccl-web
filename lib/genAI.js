import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;

if (!apiKey) {
  throw new Error('GEMINI_API_KEY is not defined in the environment variables');
}

export const genAI = new GoogleGenerativeAI(apiKey);

export const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-lite-preview-02-05" });

export const ANALYSIS_PROMPT = `Analyze the following time-series data:
{data}

Provide a concise analysis in the following JSON format. Ensure all fields are present and properly formatted:

{
  "trend": "upward|downward|stable",
  "percentageChange": "+0.0%|-0.0%",
  "analysis": "Single sentence analysis of current trend.",
  "prediction": "Single sentence prediction for next period.",
  "insights": ["Key insight 1", "Key insight 2", "Key insight 3"],
  "recommendations": ["Action item 1", "Action item 2", "Action item 3"]
}`;

export const PREDICTION_PROMPT = `Analyze and generate predictions based on the following historical data:
{data}

Consider:
1. The data shows monthly values for each metric
2. There are {remainingMonths} months left in the year
3. Historical patterns, seasonality, and trends in the data
4. Each metric's individual growth pattern

Generate predictions for the remaining {remainingMonths} months of the year. Return ONLY a JSON object in this exact format:

{
  "predictions": [number, number, ...] // Array length should match remaining months
}

Requirements:
- Each prediction should be a whole number greater than 0
- Follow the established trends while accounting for seasonality
- Maintain realistic variations based on historical patterns
- The array length must exactly match the number of remaining months`;
