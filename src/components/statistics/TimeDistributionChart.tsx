
import {
  ResponsiveContainer,
  AreaChart,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  Area
} from "recharts";

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
            <linearGradient id="peeColor" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#D3E4FD" stopOpacity={0.8}/>
              <stop offset="95%" stopColor="#D3E4FD" stopOpacity={0}/>
            </linearGradient>
            <linearGradient id="poopColor" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#E6D7B9" stopOpacity={0.8}/>
              <stop offset="95%" stopColor="#E6D7B9" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <XAxis 
            dataKey="name"
            stroke="var(--muted-foreground)"
          />
          <YAxis stroke="var(--muted-foreground)" />
          <Tooltip />
          <Legend />
          <Area
            type="monotone"
            dataKey="pee"
            name="Urin"
            stroke="#D3E4FD"
            fillOpacity={1}
            fill="url(#peeColor)"
          />
          <Area
            type="monotone"
            dataKey="poop"
            name="Kot"
            stroke="#E6D7B9"
            fillOpacity={1}
            fill="url(#poopColor)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};
