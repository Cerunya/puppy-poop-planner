
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
    <div className="h-[500px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart data={data}>
          <PolarGrid gridType="circle" />
          <PolarAngleAxis
            dataKey="hour"
            tick={{ fill: 'var(--foreground)', fontSize: 12 }}
          />
          <Tooltip />
          <Legend />
          <Radar
            name="Urin"
            dataKey="pee"
            stroke="#D3E4FD"
            fill="#D3E4FD"
            fillOpacity={0.6}
          />
          <Radar
            name="Kot"
            dataKey="poop"
            stroke="#E6D7B9"
            fill="#E6D7B9"
            fillOpacity={0.6}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
};
