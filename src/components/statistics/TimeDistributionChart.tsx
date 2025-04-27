
import React from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  Area
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
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data}>
          <defs>
            <linearGradient id="peeGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#7DD3FC" stopOpacity={0.8}/>
              <stop offset="95%" stopColor="#7DD3FC" stopOpacity={0}/>
            </linearGradient>
            <linearGradient id="poopGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#FDA4AF" stopOpacity={0.8}/>
              <stop offset="95%" stopColor="#FDA4AF" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <XAxis 
            dataKey="name"
            stroke="var(--foreground)"
            tick={{ fill: "var(--foreground)" }}
          />
          <YAxis 
            stroke="var(--foreground)"
            tick={{ fill: "var(--foreground)" }}
          />
          <Tooltip content={<DistributionTooltip />} />
          <Legend content={<DistributionLegend />} />
          <Area
            type="monotone"
            dataKey="pee"
            name="Urin"
            stroke="#7DD3FC"
            fillOpacity={1}
            fill="url(#peeGradient)"
          />
          <Area
            type="monotone"
            dataKey="poop"
            name="Kot"
            stroke="#FDA4AF"
            fillOpacity={1}
            fill="url(#poopGradient)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};
