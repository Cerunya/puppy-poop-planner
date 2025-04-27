
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DailyEventsChart } from "@/components/statistics/DailyEventsChart";

interface DailyEventsCardProps {
  data: Array<{ date: string; pee: number; poop: number; }>;
}

export const DailyEventsCard = ({ data }: DailyEventsCardProps) => {
  return (
    <Card className="mb-6">
      <CardHeader className="pb-2">
        <CardTitle>Ereignisse im Zeitverlauf</CardTitle>
      </CardHeader>
      <CardContent>
        <DailyEventsChart data={data} />
      </CardContent>
    </Card>
  );
};
