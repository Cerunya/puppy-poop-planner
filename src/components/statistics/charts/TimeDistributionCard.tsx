
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TimeDistributionChart } from "@/components/statistics/TimeDistributionChart";

interface TimeDistributionCardProps {
  data: Array<{ name: string; pee: number; poop: number; }>;
}

export const TimeDistributionCard = ({ data }: TimeDistributionCardProps) => {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle>Verteilung nach Tageszeit</CardTitle>
      </CardHeader>
      <CardContent>
        <TimeDistributionChart data={data} />
      </CardContent>
    </Card>
  );
};
