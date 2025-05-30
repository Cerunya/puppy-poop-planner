
import React from 'react';
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  Radar,
  ResponsiveContainer,
  Legend
} from 'recharts';

interface CircularHourlyPatternProps {
  data: Array<{
    name: string;
    pee: number;
    poop: number;
  }>;
}

export const CircularHourlyPattern = ({ data }: CircularHourlyPatternProps) => {
  return (
    <div className="h-[500px] w-full p-4">
      <h3 className="text-lg font-semibold mb-4 text-center text-foreground">Circular Hourly Pattern</h3>
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart 
          data={data}
          margin={{ top: 20, right: 30, bottom: 20, left: 30 }}
        >
          <PolarGrid 
            gridType="circle"
            stroke="var(--muted-foreground)"
            strokeOpacity={0.2}
          />
          <PolarAngleAxis
            dataKey="name"
            tick={{ 
              fill: "#C8C8C9",
              fontSize: 12
            }}
            stroke="var(--muted-foreground)"
            tickLine={{ stroke: "var(--muted-foreground)" }}
          />
          <Legend 
            align="center"
            verticalAlign="top"
            formatter={(value) => (
              <span style={{ color: '#C8C8C9' }}>
                {value === "pee" ? "Pee Pattern" : "Poo Pattern"}
              </span>
            )}
            wrapperStyle={{ paddingBottom: '20px' }}
          />
          <Radar
            name="pee"
            dataKey="pee"
            stroke="#7DD3FC"
            fill="#7DD3FC"
            fillOpacity={0.3}
            connectNulls={true}
          />
          <Radar
            name="poop"
            dataKey="poop"
            stroke="#FDA4AF"
            fill="#FDA4AF"
            fillOpacity={0.3}
            connectNulls={true}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
};
