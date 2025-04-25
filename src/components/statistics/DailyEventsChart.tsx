
import {
  ResponsiveContainer,
  BarChart,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  Bar
} from "recharts";

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
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="pee" name="Urin" fill="#D3E4FD" />
          <Bar dataKey="poop" name="Kot" fill="#E6D7B9" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};
