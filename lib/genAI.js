import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from "@google/generative-ai";

const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;

if (!apiKey) {
  throw new Error('GEMINI_API_KEY is not defined in the environment variables');
}

export const genAI = new GoogleGenerativeAI(apiKey);

// Basic model without schema
export const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-lite" });

// Create a model with structured output capabilities
export function createStructuredModel(responseSchema) {
  return genAI.getGenerativeModel({
    model: "gemini-2.0-flash-lite",
    safetySettings: [
      {
        category: HarmCategory.HARM_CATEGORY_HARASSMENT,
        threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH,
      },
      {
        category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
        threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH,
      },
      {
        category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
        threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH,
      },
      {
        category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
        threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH,
      },
    ],
    generationConfig: {
      temperature: 0.2,
      topP: 0.8,
      topK: 40,
      maxOutputTokens: 8192,
      responseMimeType: "application/json",
      responseSchema: responseSchema
    },
  });
}

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

// Schema definitions for mock data generation
export const personalInfoSchema = {
  type: "object",
  properties: {
    records: {
      type: "array",
      items: {
        type: "object",
        properties: {
          name: {
            type: "object",
            properties: {
              firstName: { type: "string" },
              middleName: { type: "string" },
              lastName: { type: "string" }
            },
            required: ["firstName", "lastName"]
          },
          contact: {
            type: "object",
            properties: {
              emailAddress: { type: "string" },
              localAddress: { type: "string" }
            },
            required: ["emailAddress", "localAddress"]
          },
          demographics: {
            type: "object",
            properties: {
              sex: { type: "string", enum: ["male", "female"] },
              birthDate: { type: "string" },
              maritalStatus: { type: "string", enum: ["single", "married", "divorced", "widowed"] }
            },
            required: ["sex", "birthDate", "maritalStatus"]
          },
          status: {
            type: "object",
            properties: {
              residencyStatus: { type: "string", enum: ["renting", "own-mortgage", "own-outright"] },
              lifeStatus: { type: "string", enum: ["alive", "deceased"] }
            },
            required: ["residencyStatus", "lifeStatus"]
          }
        },
        required: ["name", "contact", "demographics", "status"]
      }
    }
  },
  required: ["records"]
};
