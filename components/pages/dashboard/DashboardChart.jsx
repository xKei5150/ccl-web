import { memo } from "react";
import { Area, AreaChart, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend, CartesianGrid } from "recharts";
import { ChartLoadingSkeleton } from "./ChartLoadingSkeleton";
import { motion, AnimatePresence } from "framer-motion";

const chartCategories = [
  { key: "requests", color: "#2563eb", label: "Requests" },
  { key: "reports", color: "#dc2626", label: "Reports" },
  { key: "records", color: "#16a34a", label: "Records" }
];

const CustomTooltip = memo(({ active, payload, label }) => {
  if (!active || !payload) return null;
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 5 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-lg border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/85 p-3 shadow-xl"
      role="tooltip"
    >
      <div className="font-medium mb-1">{label}</div>
      <div className="space-y-1">
        {payload.map((entry, index) => (
          <div key={index} className="flex items-center gap-2 min-w-[150px]">
            <div
              className="h-2 w-2 rounded-full"
              style={{ backgroundColor: entry.color }}
              aria-hidden="true"
            />
            <span className="text-sm text-muted-foreground flex-1">
              {entry.name}:
            </span>
            <span className="text-sm font-medium">
              {entry.value || 0}
            </span>
          </div>
        ))}
      </div>
    </motion.div>
  );
});

CustomTooltip.displayName = "CustomTooltip";

const EmptyState = memo(() => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    className="flex flex-col items-center justify-center h-[300px] text-muted-foreground"
  >
    <p className="text-sm">No data available for selected year</p>
  </motion.div>
));

EmptyState.displayName = "EmptyState";

export const DashboardChart = memo(({ data, year, isLoading }) => {
  // Filter and validate data
  const yearData = data?.filter(item => item.year === year) || [];
  
  if (isLoading) {
    return <ChartLoadingSkeleton />;
  }

  if (!yearData?.length) {
    return <EmptyState />;
  }

  // Calculate Y-axis domain
  const allValues = yearData.flatMap(item => [
    item.requests || 0,
    item.reports || 0,
    item.records || 0,
    item.requestsPredicted || 0,
    item.reportsPredicted || 0,
    item.recordsPredicted || 0
  ]);

  const maxValue = Math.max(...allValues);
  const minValue = Math.min(...allValues);
  const padding = Math.ceil(maxValue * 0.1); // 10% padding

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={year}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        className="w-full h-[300px]"
        role="figure"
        aria-label="Monthly trends chart"
      >
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart 
            data={yearData} 
            margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
          >
            <defs>
              {chartCategories.map(({ key, color }) => (
                <linearGradient key={key} id={`gradient-${key}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={color} stopOpacity={0.3} />
                  <stop offset="95%" stopColor={color} stopOpacity={0} />
                </linearGradient>
              ))}
            </defs>
            <CartesianGrid 
              strokeDasharray="3 3" 
              className="stroke-muted/30"
              vertical={false}
            />
            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
              className="text-sm fill-muted-foreground"
              dy={8}
              tick={{ fontSize: 12 }}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              className="text-sm fill-muted-foreground"
              width={45}
              domain={[Math.max(0, minValue - padding), maxValue + padding]}
              dx={-8}
              tick={{ fontSize: 12 }}
            />
            <Tooltip 
              content={<CustomTooltip />}
              animationDuration={200}
              animationEasing="ease-out"
              cursor={{ stroke: 'hsl(var(--muted-foreground))', strokeDasharray: '3 3' }}
            />
            <Legend 
              verticalAlign="top"
              height={36}
              iconSize={8}
              iconType="circle"
              wrapperClassName="text-sm fill-muted-foreground"
            />
            {chartCategories.map(({ key, color, label }) => (
              <g key={key}>
                <Area
                  type="monotone"
                  name={label}
                  dataKey={key}
                  stroke={color}
                  fill={`url(#gradient-${key})`}
                  strokeWidth={2}
                  activeDot={{ r: 6, strokeWidth: 1 }}
                  isAnimationActive={true}
                  animationDuration={1000}
                  animationEasing="ease-out"
                />
                <Area
                  type="monotone"
                  name={`${label} (Predicted)`}
                  dataKey={`${key}Predicted`}
                  stroke={color}
                  fill="none"
                  strokeWidth={2}
                  strokeDasharray="4 4"
                  activeDot={{ r: 4, strokeWidth: 1 }}
                  isAnimationActive={true}
                  animationDuration={1000}
                  animationEasing="ease-out"
                  animationBegin={300}
                />
              </g>
            ))}
          </AreaChart>
        </ResponsiveContainer>
      </motion.div>
    </AnimatePresence>
  );
});

DashboardChart.displayName = "DashboardChart";