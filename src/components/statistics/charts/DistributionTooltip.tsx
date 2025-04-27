
import React from 'react';
import { TooltipProps } from 'recharts';
import { NameType, ValueType } from 'recharts/types/component/DefaultTooltipContent';

export const DistributionTooltip: React.FC<TooltipProps<ValueType, NameType>> = ({ 
  active, 
  payload, 
  label 
}) => {
  if (!active || !payload) return null;

  return (
    <div className="bg-background border border-border p-2 rounded-lg shadow-lg">
      <p className="text-foreground font-medium mb-1">{label}</p>
      {payload.map((entry, index) => (
        <p 
          key={index} 
          className="text-sm"
          style={{ color: entry.color }}
        >
          {entry.name}: {entry.value}
        </p>
      ))}
    </div>
  );
};
