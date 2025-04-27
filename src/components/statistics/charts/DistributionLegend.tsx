
import React from 'react';
import { LegendProps } from 'recharts';

export const DistributionLegend: React.FC<LegendProps> = ({ 
  payload 
}) => {
  if (!payload) return null;

  return (
    <div className="flex justify-center gap-4 text-foreground">
      {payload.map((entry, index) => (
        <div key={index} className="flex items-center gap-2">
          <div 
            className="w-3 h-3 rounded"
            style={{ backgroundColor: entry.color }}
          />
          <span>{entry.value}</span>
        </div>
      ))}
    </div>
  );
};
