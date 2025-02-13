import useAIAnalysis from "@/hooks/useAIAnalysis";
import {AlertCircle, TrendingDown, TrendingUp} from "lucide-react";



export default function AIAnalysis() {
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