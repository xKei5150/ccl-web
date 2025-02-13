import { memo } from "react";

export const ChartLoadingSkeleton = memo(() => (
  <svg
    className="w-full h-full animate-pulse"
    viewBox="0 0 800 300"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    preserveAspectRatio="none"
  >
    {/* Background Grid */}
    <rect width="800" height="300" className="fill-muted/5" />
    
    {/* Y-Axis */}
    <rect x="0" y="20" width="40" height="10" rx="2" className="fill-muted/20" />
    <rect x="0" y="80" width="30" height="10" rx="2" className="fill-muted/20" />
    <rect x="0" y="140" width="35" height="10" rx="2" className="fill-muted/20" />
    <rect x="0" y="200" width="25" height="10" rx="2" className="fill-muted/20" />
    <rect x="0" y="260" width="30" height="10" rx="2" className="fill-muted/20" />
    
    {/* X-Axis */}
    {Array.from({ length: 6 }).map((_, i) => (
      <rect
        key={i}
        x={50 + i * 125}
        y="280"
        width="30"
        height="10"
        rx="2"
        className="fill-muted/20"
      />
    ))}
    
    {/* Chart Lines */}
    <path
      d="M50,200 Q200,180 350,150 T650,100"
      className="stroke-muted/20"
      strokeWidth="2"
      fill="none"
    />
    <path
      d="M50,220 Q200,200 350,170 T650,120"
      className="stroke-muted/20"
      strokeWidth="2"
      fill="none"
      strokeDasharray="4 4"
    />
    
    {/* Legend */}
    <rect x="50" y="10" width="80" height="15" rx="2" className="fill-muted/20" />
    <rect x="150" y="10" width="80" height="15" rx="2" className="fill-muted/20" />
    <rect x="250" y="10" width="80" height="15" rx="2" className="fill-muted/20" />
  </svg>
));

ChartLoadingSkeleton.displayName = "ChartLoadingSkeleton";