"use server";

import { genAI } from "@/lib/genAI";
import { SchemaType } from "@google/generative-ai";

const model = genAI.getGenerativeModel({
    model: "gemini-2.0-flash-lite-preview-02-05",
    generationConfig: {
        temperature: 0.3,
        maxOutputTokens: 1024,
    }
});

export async function generatePrediction(data) {
    try {
        const predictionSchema = {
            type: SchemaType.OBJECT,
            properties: {
                requestGrowth: {
                    type: SchemaType.NUMBER,
                    description: "Predicted percentage change in requests",
                },
                permitEfficiency: {
                    type: SchemaType.NUMBER,
                    description: "Predicted improvement in permit processing efficiency",
                },
                householdGrowth: {
                    type: SchemaType.NUMBER,
                    description: "Predicted absolute number of new households",
                },
                trends: {
                    type: SchemaType.ARRAY,
                    description: "Monthly predictions for the next 3 months",
                    items: {
                        type: SchemaType.OBJECT,
                        properties: {
                            month: {
                                type: SchemaType.STRING,
                                description: "Month name",
                            },
                            requests: {
                                type: SchemaType.NUMBER,
                                description: "Predicted number of requests",
                            },
                            permits: {
                                type: SchemaType.NUMBER,
                                description: "Predicted number of permits",
                            },
                            households: {
                                type: SchemaType.NUMBER,
                                description: "Predicted number of households",
                            }
                        },
                        required: ["month", "requests", "permits", "households"]
                    }
                }
            },
            required: ["requestGrowth", "permitEfficiency", "householdGrowth", "trends"]
        };

        const stats = calculateStats(data);
        const months = getNextThreeMonths();

        const prompt = `Analyze this historical data and generate predictions:
        
        Historical Data: ${JSON.stringify(data)}
        
        Current Statistics:
        ${JSON.stringify(stats)}
        
        Requirements:
        1. Calculate growth percentages (-100 to 100) for requests and permits
        2. Predict new household growth (positive number)
        3. Project next 3 months (${months.join(", ")}) with realistic values
        4. Consider seasonal patterns and recent trends
        5. Ensure predictions stay within reasonable historical ranges`;

        const result = await model.generateContent({
            contents: [{ role: "user", parts: [{ text: prompt }] }],
            generationConfig: {
                temperature: 0.3,
                maxOutputTokens: 1024,
                responseMimeType: "application/json",
                responseSchema: predictionSchema,
            },
        });

        const response = await result.response;
        const predictions = response.text();
        console.log('Predictions:', predictions);
        return JSON.parse(predictions);
    } catch (error) {
        console.error('Prediction error:', error);
        throw new Error('Failed to generate predictions');
    }
}

function getNextThreeMonths() {
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 
                   'July', 'August', 'September', 'October', 'November', 'December'];
    const currentMonth = new Date().getMonth();
    return Array.from({length: 3}, (_, i) => months[(currentMonth + i + 1) % 12]);
}

function calculateStats(data) {
    const metrics = ['requests', 'permits', 'households'];
    const stats = {};
    
    metrics.forEach(metric => {
        const values = data.map(item => item[metric]).filter(Boolean);
        stats[metric] = {
            min: Math.min(...values),
            max: Math.max(...values),
            avg: values.reduce((a, b) => a + b, 0) / values.length,
            total: values.reduce((a, b) => a + b, 0),
            recent: values.slice(-3)  // Last 3 months
        };
    });
    
    return stats;
}