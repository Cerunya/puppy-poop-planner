
import React from 'react';

interface BarChartTooltipProps {
  active?: boolean;
  payload?: Array<{
    value: number;
    name: string;
  }>;
  label?: string;
}

export const BarChartTooltip: React.FC<BarChartTooltipProps> = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;

  return (
    <div className="bg-background border border-border p-2 rounded-lg shadow-lg">
      <p className="text-sm font-medium text-foreground mb-1">{label}</p>
      {payload.map((entry, index) => (
        <p key={index} className="text-sm text-muted-foreground">
          {entry.name}: {entry.value}
        </p>
      ))}
    </div>
  );
};
