
import React from "react";
import { DailyEventsCard } from "@/components/statistics/charts/DailyEventsCard";
import { TimeDistributionCard } from "@/components/statistics/charts/TimeDistributionCard";

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
      <DailyEventsCard data={eventsByDay} />
      <TimeDistributionCard data={timeDistribution} />
    </>
  );
};
