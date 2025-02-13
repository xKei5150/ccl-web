'use client';

import { TrendingUp, TrendingDown, AlertCircle, AlertTriangle } from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Spinner } from "@/components/ui/spinner";
import { generateAnalysis } from "@/lib/actions/dashboard-actions";
import { useState, useEffect } from "react";

const AnalysisCard = ({ title, content, isLoading }) => {
  if (isLoading) {
    return (
      <div className="rounded-lg bg-muted p-4 animate-pulse">
        <div className="h-5 w-24 bg-muted-foreground/20 rounded mb-4" />
        {Array.isArray(content) ? (
          <div className="space-y-2">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-4 bg-muted-foreground/20 rounded w-full" />
            ))}
          </div>
        ) : (
          <div className="h-4 bg-muted-foreground/20 rounded w-full" />
        )}
      </div>
    );
  }

  return (
    <div className="rounded-lg bg-muted p-4">
      <h4 className="font-medium">{title}</h4>
      {Array.isArray(content) ? (
        <ul className="mt-2 space-y-2 text-sm text-muted-foreground">
          {content.map((item, index) => (
            <li key={index} className="flex items-start gap-2">
              <span className="mt-1.5 h-1 w-1 rounded-full bg-primary shrink-0" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-2 text-sm text-muted-foreground">{content}</p>
      )}
    </div>
  );
};

function AnalysisContent({ data, isLoading }) {
  if (!data && !isLoading) return null;

  const trendIcon = {
    upward: <TrendingUp className="text-green-500" />,
    downward: <TrendingDown className="text-red-500" />,
    stable: <AlertCircle className="text-yellow-500" />
  }[data?.trend];

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        {isLoading ? (
          <div className="animate-pulse flex items-center gap-2">
            <div className="h-5 w-5 bg-muted-foreground/20 rounded" />
            <div className="h-4 w-24 bg-muted-foreground/20 rounded" />
          </div>
        ) : (
          <>
            {trendIcon}
            <span className="font-medium">{data.percentageChange} {data.trend}</span>
          </>
        )}
      </div>

      <div className="space-y-4">
        <AnalysisCard 
          title="Analysis" 
          content={data?.analysis} 
          isLoading={isLoading} 
        />
        <AnalysisCard 
          title="Prediction" 
          content={data?.prediction} 
          isLoading={isLoading} 
        />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <AnalysisCard 
            title="Key Insights" 
            content={data?.insights} 
            isLoading={isLoading} 
          />
          <AnalysisCard 
            title="Recommendations" 
            content={data?.recommendations} 
            isLoading={isLoading} 
          />
        </div>
      </div>
    </div>
  );
}

function AnalysisSection({ type, data, year }) {
  const [state, setState] = useState({
    analysisData: null,
    loading: true,
    error: null,
  });

  useEffect(() => {
    let mounted = true;

    async function fetchAnalysis() {
      try {
        setState(prev => ({ ...prev, loading: true, error: null }));
        const { data: analysis, error } = await generateAnalysis(type, data, year);
        
        if (!mounted) return;

        if (error) {
          setState({
            analysisData: null,
            loading: false,
            error
          });
          return;
        }

        setState({
          analysisData: analysis,
          loading: false,
          error: null
        });
      } catch (err) {
        if (!mounted) return;
        setState({
          analysisData: null,
          loading: false,
          error: err?.message || 'Failed to generate analysis'
        });
      }
    }

    if (data?.length) {
      fetchAnalysis();
    }

    return () => {
      mounted = false;
    };
  }, [type, data, year]);

  if (state.error) {
    return (
      <div className="rounded-lg bg-destructive/10 p-4 text-destructive">
        <AlertTriangle className="h-4 w-4 mb-2" />
        Error: {state.error}
      </div>
    );
  }
  
  return <AnalysisContent data={state.analysisData} isLoading={state.loading} />;
}

export function DashboardAnalysis({ data, year }) {
  if (!data?.length) {
    return (
      <div className="flex flex-col items-center justify-center h-[400px] text-muted-foreground">
        <p className="text-sm">No data available for selected year</p>
      </div>
    );
  }

  return (
    <Tabs defaultValue="requests" className="w-full">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="requests">Requests</TabsTrigger>
        <TabsTrigger value="reports">Reports</TabsTrigger>
        <TabsTrigger value="records">Records</TabsTrigger>
      </TabsList>
      {["requests", "reports", "records"].map(type => (
        <TabsContent key={type} value={type} className="mt-4">
          <AnalysisSection type={type} data={data} year={year} />
        </TabsContent>
      ))}
    </Tabs>
  );
}