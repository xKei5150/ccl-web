import { useState, useEffect } from "react";
import { model } from "../lib/genAI";
import { useCallback } from "react";

const Predictions = ({baseData}) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const generatePredictions = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      // Create an array to store all the promises for the predictions
      const predictionPromises = [];

      for (const dataType of ["requests", "reports", "records"]) {
        // Create a separate promise for each data type
        const prompt = `Predict the values for each of the next 6 months (Jul, Aug, Sep, Oct, Nov, Dec) for ${dataType}, given the following data:
        ${JSON.stringify(baseData.map((item) => ({ month: item.month, value: item[dataType] })))}
          
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
          model
            .generateContent(prompt)
            .then((result) => {
              const response = result.response;
              const predictionText = response.text();
              let parsedPrediction;
              try {
                const jsonStartIndex = predictionText.indexOf("{");
                const jsonEndIndex = predictionText.lastIndexOf("}") + 1;
                const jsonString = predictionText.substring(
                  jsonStartIndex,
                  jsonEndIndex
                );
                parsedPrediction = JSON.parse(jsonString);
              } catch (parseError) {
                throw new Error(
                  `Failed to parse prediction for ${dataType}. Invalid JSON: ${parseError.message}`
                ); // More specific error
              }

              if (
                !parsedPrediction ||
                !Array.isArray(parsedPrediction.predictions) ||
                parsedPrediction.predictions.length !== 6
              ) {
                throw new Error(
                  `Invalid prediction format for ${dataType}. Expected an array of 6 numbers.`
                );
              }
              // Ensure all are numbers
              if (!parsedPrediction.predictions.every(Number.isFinite)) {
                throw new Error(
                  `Invalid prediction values for ${dataType}. All predictions must be numbers.`
                );
              }

              return { dataType, predictions: parsedPrediction.predictions };
            })
            .catch((error) => {
              setError(error.message); // Set the specific error
              console.error("Error generating prediction:", error);
              return { dataType, predictions: null }; // Return null predictions on error
            })
        );
      }

      // Wait for all promises to resolve
      const allPredictions = await Promise.all(predictionPromises);

      if (error) {
        setLoading(false); // Ensure loading is set to false even on error.
        return; // Stop if any error occurred.
      }

      // Combine the base data with the predictions
      const newData = [...baseData]; // Start with the base data

      // Add 6 months to base data
      const months = ["Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
      for (let i = 0; i < 6; i++) {
        newData.push({ month: months[i] });
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
      }, [baseData]);
      setData(newData);
    } catch (error) {
      setError(error.message); // Global error handling
      console.error("Error in generatePredictions:", error);
    } finally {
      setLoading(false);
    }
  });

  useEffect(() => {
    generatePredictions();
  }, [generatePredictions]);
};
