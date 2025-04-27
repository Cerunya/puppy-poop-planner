
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TimeDistributionChart } from "@/components/statistics/TimeDistributionChart";

interface TimeDistributionCardProps {
  data: Array<{ name: string; pee: number; poop: number; }>;
}

export const TimeDistributionCard = ({ data }: TimeDistributionCardProps) => {
  return (
    <Card className="bg-[#1A1F2C] border-gray-800">
      <CardHeader className="pb-2">
        <CardTitle className="text-gray-200">Verteilung nach Tageszeit</CardTitle>
      </CardHeader>
      <CardContent>
        <TimeDistributionChart data={data} />
      </CardContent>
    </Card>
  );
};
