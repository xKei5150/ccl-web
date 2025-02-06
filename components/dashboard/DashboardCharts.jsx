import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Area, AreaChart, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { TrendingUp, TrendingDown, AlertCircle } from "lucide-react";
import { model } from '@/lib/genAI'; // Import the Gemini model
import { Spinner } from '@/components/ui/spinner';

// Base data (without predictions)
const baseData = [
  { month: "Jan", requests: 40, reports: 24, records: 35 },
  { month: "Feb", requests: 30, reports: 13, records: 45 },
  { month: "Mar", requests: 20, reports: 38, records: 30 },
  { month: "Apr", requests: 27, reports: 39, records: 28 },
  { month: "May", requests: 45, reports: 48, records: 52 },
  { month: "Jun", requests: 37, reports: 38, records: 42 },
];

const Chart = ({ data }) => {
  if (!data || data.length === 0) {
    return <div>No chart data available.</div>;
  }

  return (
    <ResponsiveContainer width="100%" height={300}>
      <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
        <XAxis
          dataKey="month"
          tickLine={false}
          axisLine={false}
          className="text-sm"
        />
        <YAxis
          tickLine={false}
          axisLine={false}
          className="text-sm"
        />
        <Tooltip
          content={({ active, payload, label }) => {
            if (!active || !payload) return null;
            return (
              <div className="rounded-lg border bg-background p-2 shadow-sm">
                <div className="font-medium">{label}</div>
                {payload.map((entry, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <div
                      className="h-2 w-2 rounded-full"
                      style={{ backgroundColor: entry.color }}
                    />
                    <span className="text-sm text-muted-foreground">
                      {entry.name}: {entry.value}
                    </span>
                  </div>
                ))}
              </div>
            );
          }}
        />
        <Legend />
        <Area
          type="monotone"
          name="Requests"
          dataKey="requests"
          stroke="#2563eb"
          fill="#2563eb33"
          strokeWidth={2}
        />
        <Area
          type="monotone"
          name="Requests (Predicted)"
          dataKey="requestsPredicted"
          stroke="#2563eb"
          fill="none"
          strokeWidth={2}
          strokeDasharray="4 4"
        />
        <Area
          type="monotone"
          name="Reports"
          dataKey="reports"
          stroke="#dc2626"
          fill="#dc262633"
          strokeWidth={2}
        />
        <Area
          type="monotone"
          name="Reports (Predicted)"
          dataKey="reportsPredicted"
          stroke="#dc2626"
          fill="none"
          strokeWidth={2}
          strokeDasharray="4 4"
        />
        <Area
          type="monotone"
          name="Records"
          dataKey="records"
          stroke="#16a34a"
          fill="#16a34a33"
          strokeWidth={2}
        />
        <Area
          type="monotone"
          name="Records (Predicted)"
          dataKey="recordsPredicted"
          stroke="#16a34a"
          fill="none"
          strokeWidth={2}
          strokeDasharray="4 4"
        />
      </AreaChart>
    </ResponsiveContainer>
  );
};



const AIAnalysis = ({ type, data }) => {
  const [analysisData, setAnalysisData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const generateAnalysis = async (dataType, chartData) => {
    setLoading(true);
    setError(null);

      // Filter data based on the selected type (requests, reports, records)
    const filteredData = chartData.map(item => ({
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
          const jsonStartIndex = text.indexOf('{');
          const jsonEndIndex = text.lastIndexOf('}') + 1;
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
        typeof parsedAnalysis.trend !== 'string' ||
        typeof parsedAnalysis.percentageChange !== 'string' ||
        typeof parsedAnalysis.analysis !== 'string' ||
        typeof parsedAnalysis.prediction !== 'string' ||
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
  };


  useEffect(() => {
      if (data && data.length > 0) {
        generateAnalysis(type, data);
    }
  }, [type, data]);


  if (loading) {
    return <div className="flex justify-center items-center h-full"><Spinner /></div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!analysisData) {
    return <div>No Data</div>;
  }


  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        {analysisData.trend === "upward" && <TrendingUp className="text-green-500" />}
        {analysisData.trend === "downward" && <TrendingDown className="text-red-500" />}
        {analysisData.trend === "stable" && <AlertCircle className="text-yellow-500" />}
        <span className="font-medium">{analysisData.percentageChange} {analysisData.trend}</span>
      </div>

      <div className="space-y-4">
        <div className="rounded-lg bg-muted p-4">
          <h4 className="font-medium">Analysis</h4>
          <p className="mt-2 text-sm text-muted-foreground">{analysisData.analysis}</p>
        </div>

        <div className="rounded-lg bg-muted p-4">
          <h4 className="font-medium">Prediction</h4>
          <p className="mt-2 text-sm text-muted-foreground">{analysisData.prediction}</p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="rounded-lg bg-muted p-4">
            <h4 className="font-medium">Key Insights</h4>
            <ul className="mt-2 space-y-2 text-sm text-muted-foreground">
              {analysisData.insights.map((insight, index) => (
                <li key={index}>• {insight}</li>
              ))}
            </ul>
          </div>

          <div className="rounded-lg bg-muted p-4">
            <h4 className="font-medium">Recommendations</h4>
            <ul className="mt-2 space-y-2 text-sm text-muted-foreground">
              {analysisData.recommendations.map((rec, index) => (
                <li key={index}>• {rec}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};


const Dashboard = () => {
  const [data, setData] = useState([]);
  const [loadingPredictions, setLoadingPredictions] = useState(true);
  const [predictionError, setPredictionError] = useState(null);

  const generatePredictions = async () => {
    setLoadingPredictions(true);
    setPredictionError(null);

    try {
      // Create an array to store all the promises for the predictions
      const predictionPromises = [];

        for (const dataType of ["requests", "reports", "records"]) {
          // Create a separate promise for each data type
        const prompt = `Predict the values for each of the next 6 months (Jul, Aug, Sep, Oct, Nov, Dec) for ${dataType}, given the following data:
          ${JSON.stringify(baseData.map(item => ({ month: item.month, value: item[dataType] })))}
            
          Provide the output in JSON format, with an array of 6 numbers:
          \`\`\`json
          {
            "predictions": [number, number, number, number, number, number]
          }
          \`\`\`
          Do not include any other text other than the JSON.
          `;

        // Push the promise to the array
        predictionPromises.push(
            model.generateContent(prompt)
            .then(result => {
              const response = result.response;
              const predictionText = response.text();
              let parsedPrediction;
              try {
                const jsonStartIndex = predictionText.indexOf('{');
                const jsonEndIndex = predictionText.lastIndexOf('}') + 1;
                const jsonString = predictionText.substring(jsonStartIndex, jsonEndIndex);
                parsedPrediction = JSON.parse(jsonString);
              } catch (parseError) {
                throw new Error(`Failed to parse prediction for ${dataType}. Invalid JSON: ${parseError.message}`); // More specific error
              }

              if (!parsedPrediction || !Array.isArray(parsedPrediction.predictions) || parsedPrediction.predictions.length !== 6) {
                  throw new Error(`Invalid prediction format for ${dataType}. Expected an array of 6 numbers.`);
              }
              // Ensure all are numbers
              if (!parsedPrediction.predictions.every(Number.isFinite)) {
                  throw new Error(`Invalid prediction values for ${dataType}. All predictions must be numbers.`);
              }

              return { dataType, predictions: parsedPrediction.predictions };
            })
            .catch(error => {
              setPredictionError(error.message);  // Set the specific error
              console.error("Error generating prediction:", error);
              return { dataType, predictions: null }; // Return null predictions on error
            })
        );
      }

      // Wait for all promises to resolve
      const allPredictions = await Promise.all(predictionPromises);

      if (predictionError) {
          setLoadingPredictions(false); // Ensure loading is set to false even on error.
          return; // Stop if any error occurred.
      }


      // Combine the base data with the predictions
      const newData = [...baseData];  // Start with the base data

        // Add 6 months to base data
      const months = ["Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
      for (let i = 0; i < 6; i++){
          newData.push({month: months[i]})
      }

      allPredictions.forEach(({ dataType, predictions }) => {
        if (predictions) {
          // Iterate up to the length of newData or predictions, whichever is smaller
          for (let i = 0; i < newData.length; i++) {
            // Check if historical value exists, add predicted value to newData
            if (i < baseData.length) {
                newData[i][dataType] = baseData[i][dataType]; //Keeps original data point.
            }
            newData[i][`${dataType}Predicted`] = predictions[i]; //Correct key
          }
        }
      });
      setData(newData);

    } catch (error) {
      setPredictionError(error.message); // Global error handling
      console.error("Error in generatePredictions:", error);
    } finally {
      setLoadingPredictions(false);
    }
  };

  useEffect(() => {
    generatePredictions();
  }, []);


  if (loadingPredictions) {
    return <div className="flex justify-center items-center h-full"><Spinner /></div>;
  }

  if (predictionError) {
    return <div>Error generating predictions: {predictionError}</div>;
  }
  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <Card className="p-6">
        <CardHeader className="px-0 pt-0">
          <CardTitle>Barangay Management Overview</CardTitle>
          <CardDescription>
            Monthly activity trends with category-specific predictions
          </CardDescription>
        </CardHeader>
        <CardContent className="px-0">
          <Chart data={data} />
          <div className="mt-4 grid grid-cols-3 gap-4">
            <div className="space-y-1">
              <p className="text-sm font-medium">Certificate Requests</p>
              <p className="text-2xl font-bold">199</p>
              <p className="text-xs text-muted-foreground">+20.1% from last month</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium">Incident Reports</p>
              <p className="text-2xl font-bold">156</p>
              <p className="text-xs text-muted-foreground">+15.3% from last month</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium">Total Records</p>
              <p className="text-2xl font-bold">232</p>
              <p className="text-xs text-muted-foreground">+18.7% from last month</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="p-6">
        <CardHeader className="px-0 pt-0">
          <CardTitle>Insights</CardTitle>
          <CardDescription>
            Category-specific analysis and predictions
          </CardDescription>
        </CardHeader>
        <CardContent className="px-0">
          <Tabs defaultValue="requests" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="requests">Requests</TabsTrigger>
              <TabsTrigger value="reports">Reports</TabsTrigger>
              <TabsTrigger value="records">Records</TabsTrigger>
            </TabsList>
            <TabsContent value="requests">
              <AIAnalysis type="requests" data={data} />
            </TabsContent>
            <TabsContent value="reports">
              <AIAnalysis type="reports" data={data} />
            </TabsContent>
            <TabsContent value="records">
              <AIAnalysis type="records" data={data} />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;