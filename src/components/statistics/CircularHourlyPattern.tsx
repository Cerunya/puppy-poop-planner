
import React from 'react';
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  Radar,
  ResponsiveContainer,
  Legend,
  Tooltip
} from 'recharts';

interface CircularHourlyPatternProps {
  data: Array<{
    hour: string;
    pee: number;
    poop: number;
  }>;
}

export const CircularHourlyPattern = ({ data }: CircularHourlyPatternProps) => {
  return (
    <div className="h-[500px] w-full p-4">
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart data={data}>
          <PolarGrid 
            gridType="circle" 
            stroke="var(--muted-foreground)"
            strokeOpacity={0.2}
          />
          <PolarAngleAxis
            dataKey="hour"
            tick={{ 
              fill: "var(--foreground)",
              fontSize: 12
            }}
            stroke="var(--muted-foreground)"
            tickLine={{ stroke: "var(--muted-foreground)" }}
          />
          <Tooltip 
            contentStyle={{
              backgroundColor: 'var(--background)',
              border: '1px solid var(--border)',
              borderRadius: '8px',
              color: 'var(--foreground)'
            }}
          />
          <Legend 
            formatter={(value) => (
              <span style={{ color: 'var(--foreground)' }}>{value}</span>
            )}
          />
          <Radar
            name="Pee Pattern"
            dataKey="pee"
            stroke="#7DD3FC"
            fill="#7DD3FC"
            fillOpacity={0.3}
          />
          <Radar
            name="Poo Pattern"
            dataKey="poop"
            stroke="#FDA4AF"
            fill="#FDA4AF"
            fillOpacity={0.3}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
};
