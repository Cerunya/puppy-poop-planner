
import React from 'react';
import {
  ResponsiveContainer,
  BarChart,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  Bar,
  CartesianGrid
} from "recharts";
import { BarChartTooltip } from './charts/BarChartTooltip';

interface DailyEventsChartProps {
  data: Array<{
    date: string;
    pee: number;
    poop: number;
  }>;
}

export const DailyEventsChart = ({ data }: DailyEventsChartProps) => {
  return (
    <div className="h-72">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <CartesianGrid 
            strokeDasharray="3 3" 
            stroke="var(--muted-foreground)"
            strokeOpacity={0.2}
          />
          <XAxis 
            dataKey="date" 
            stroke="var(--foreground)"
            tick={{ fill: "var(--foreground)" }}
          />
          <YAxis 
            stroke="var(--foreground)"
            tick={{ fill: "var(--foreground)" }}
          />
          <Tooltip content={<BarChartTooltip />} />
          <Legend 
            formatter={(value) => (
              <span style={{ color: 'var(--foreground)' }}>
                {value === "pee" ? "Urin" : "Kot"}
              </span>
            )}
          />
          <Bar 
            dataKey="pee" 
            name="Urin" 
            fill="#7DD3FC" 
            fillOpacity={0.8}
          />
          <Bar 
            dataKey="poop" 
            name="Kot" 
            fill="#FDA4AF" 
            fillOpacity={0.8}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};
