
import React from 'react';
import {
  ResponsiveContainer,
  LineChart,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  Line,
  CartesianGrid
} from 'recharts';
import { DistributionTooltip } from './charts/DistributionTooltip';
import { DistributionLegend } from './charts/DistributionLegend';

interface TimeDistributionChartProps {
  data: Array<{
    name: string;
    pee: number;
    poop: number;
  }>;
}

export const TimeDistributionChart = ({ data }: TimeDistributionChartProps) => {
  return (
    <div className="h-72">
      <h3 className="text-lg font-semibold mb-4 text-center text-foreground">
        Hourly Distribution with Trends
      </h3>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <CartesianGrid 
            strokeDasharray="3 3" 
            stroke="var(--muted-foreground)"
            strokeOpacity={0.2}
          />
          <XAxis 
            dataKey="name"
            stroke="var(--foreground)"
            tick={{ fill: "var(--foreground)", fontSize: 11 }}
            interval={0}
            angle={-45}
            textAnchor="end"
            height={60}
          />
          <YAxis 
            stroke="var(--foreground)"
            tick={{ fill: "var(--foreground)" }}
          />
          <Tooltip content={<DistributionTooltip />} />
          <Legend content={<DistributionLegend />} />
          <Line
            type="monotone"
            dataKey="pee"
            name="Pee Events"
            stroke="#7DD3FC"
            strokeWidth={2}
            dot={false}
            connectNulls={true}
          />
          <Line
            type="monotone"
            dataKey="poop"
            name="Poo Events"
            stroke="#FDA4AF"
            strokeWidth={2}
            dot={false}
            connectNulls={true}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};
