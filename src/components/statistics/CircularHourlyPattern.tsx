
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
            stroke="var(--foreground)"
            strokeOpacity={0.2}
          />
          <PolarAngleAxis
            dataKey="hour"
            tick={{ 
              fill: 'var(--foreground)',
              fontSize: 12,
              opacity: 0.8
            }}
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
            formatter={(value) => <span style={{ color: 'var(--foreground)' }}>{value}</span>}
          />
          <Radar
            name="Urin"
            dataKey="pee"
            stroke="#7DD3FC"
            fill="#7DD3FC"
            fillOpacity={0.6}
          />
          <Radar
            name="Kot"
            dataKey="poop"
            stroke="#FDA4AF"
            fill="#FDA4AF"
            fillOpacity={0.6}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
};
