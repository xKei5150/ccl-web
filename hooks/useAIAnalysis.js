import { useState, useEffect, useCallback } from "react";
import {model} from "@/lib/genAI";

const useAIAnalysis = ({ type, data }) => {
  const [analysisData, setAnalysisData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const generateAnalysis = useCallback(async (dataType, chartData) => {
    setLoading(true);
    setError(null);

    // Filter data based on the selected type (requests, reports, records)
    const filteredData = chartData.map((item) => ({
      month: item.month,
      value: item[dataType],
      predictedValue: item[`${dataType}Predicted`],
    }));

    const prompt = `Analyze the following time-series data for ${dataType}:
      ${JSON.stringify(filteredData)}
  
      Provide the analysis in JSON format:
      \`\`\`json
      {
        "trend": "upward|downward|stable",
        "percentageChange": "+0.0%",
        "analysis": "Concise analysis (1-2 sentences).",
        "prediction": "Prediction for next month (1-2 sentences).",
        "insights": ["Insight 1", "Insight 2", "Insight 3"],
        "recommendations": ["Recommendation 1", "Recommendation 2", "Recommendation 3"]
      }
      \`\`\`
      `;

    try {
      const result = await model.generateContent(prompt);
      const response = result.response;
      const text = response.text();

      // Improved JSON Parsing
      let parsedAnalysis;
      try {
        const jsonStartIndex = text.indexOf("{");
        const jsonEndIndex = text.lastIndexOf("}") + 1;
        const jsonString = text.substring(jsonStartIndex, jsonEndIndex);
        parsedAnalysis = JSON.parse(jsonString);
      } catch (parseError) {
        console.error("Error parsing JSON:", parseError);
        setError("Failed to parse AI response.  Invalid JSON.");
        return;
      }

      // Validate the parsed JSON
      if (
        !parsedAnalysis ||
        typeof parsedAnalysis.trend !== "string" ||
        typeof parsedAnalysis.percentageChange !== "string" ||
        typeof parsedAnalysis.analysis !== "string" ||
        typeof parsedAnalysis.prediction !== "string" ||
        !Array.isArray(parsedAnalysis.insights) ||
        !Array.isArray(parsedAnalysis.recommendations)
      ) {
        console.error("Invalid JSON structure:", parsedAnalysis);
        setError("Failed to parse AI response.  Incomplete data.");
        return;
      }
      setAnalysisData(parsedAnalysis);
    } catch (e) {
      setError(e.message || "An error occurred.");
      console.error("Error generating analysis:", e);
    } finally {
      setLoading(false);
    }
  }, []);
  useEffect(() => {
    if (data && data.length > 0) {
      generateAnalysis(type, data);
    }
  }, [data, type, generateAnalysis]);
  return { analysisData, loading, error, refetch: generateAnalysis};
};
export default useAIAnalysis;
