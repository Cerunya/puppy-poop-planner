
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DailyEventsChart } from "@/components/statistics/DailyEventsChart";
import { TimeDistributionChart } from "@/components/statistics/TimeDistributionChart";

interface EventsSectionProps {
  eventsByDay: Array<{ date: string; pee: number; poop: number; }>;
  timeDistribution: Array<{ name: string; pee: number; poop: number; }>;
}

export const EventsSection = ({ 
  eventsByDay, 
  timeDistribution 
}: EventsSectionProps) => {
  return (
    <>
      <Card className="mb-6">
        <CardHeader className="pb-2">
          <CardTitle>Ereignisse im Zeitverlauf</CardTitle>
        </CardHeader>
        <CardContent>
          <DailyEventsChart data={eventsByDay} />
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle>Verteilung nach Tageszeit</CardTitle>
        </CardHeader>
        <CardContent>
          <TimeDistributionChart data={timeDistribution} />
        </CardContent>
      </Card>
    </>
  );
};
