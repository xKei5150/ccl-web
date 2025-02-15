'use client';

import { usePredictions } from '@/hooks/usePredictions';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { TrendingUpIcon, TrendingDownIcon, BrainCircuitIcon } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

function PredictionCard({ title, value, trend, description }) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {trend === 'up' ? (
          <TrendingUpIcon className="h-4 w-4 text-green-500" />
        ) : (
          <TrendingDownIcon className="h-4 w-4 text-red-500" />
        )}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className="text-xs text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  );
}

export function PredictionsTab({ data }) {
  const { isPredicting, predictions, error } = usePredictions(data);

  if (isPredicting) {
    return (
      <Card>
        <CardContent className="h-[400px] flex items-center justify-center">
          <div className="space-y-4 text-center">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-r-transparent mx-auto" />
            <p className="text-sm text-muted-foreground">Analyzing trends...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="border-destructive">
        <CardContent className="pt-6">
          <p className="text-destructive">{error}</p>
        </CardContent>
      </Card>
    );
  }

  if (!predictions) {
    return null;
  }

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h3 className="text-2xl font-semibold tracking-tight">Trend Predictions</h3>
        <p className="text-sm text-muted-foreground">
          AI-powered analysis of future trends based on historical data
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <PredictionCard
          title="Request Growth"
          value={`${predictions.requestGrowth}%`}
          trend={predictions.requestGrowth > 0 ? 'up' : 'down'}
          description="Predicted change in request volume"
        />
        <PredictionCard
          title="Permit Processing"
          value={`${predictions.permitEfficiency}%`}
          trend={predictions.permitEfficiency > 0 ? 'up' : 'down'}
          description="Predicted improvement in processing time"
        />
        <PredictionCard
          title="Community Growth"
          value={predictions.householdGrowth}
          trend={predictions.householdGrowth > 0 ? 'up' : 'down'}
          description="Predicted new households"
        />
      </div>

      {predictions?.trends && (
        <Card>
          <CardHeader>
            <CardTitle>Trend Forecast</CardTitle>
            <CardDescription>Predicted trends for the next 3 months</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={predictions.trends}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="requests" stroke="#2563eb" />
                  <Line type="monotone" dataKey="permits" stroke="#16a34a" />
                  <Line type="monotone" dataKey="households" stroke="#9333ea" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}