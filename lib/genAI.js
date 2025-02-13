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

export const PREDICTION_PROMPT = `Based on the following historical data points:
{data}

Generate predictions for the next 6 months (Jul-Dec). Return ONLY a JSON object in this exact format:

{
  "predictions": [number, number, number, number, number, number]
}

The predictions should follow the historical trend with realistic variations. Each number should be a whole number greater than 0.`;
