
import React, { useMemo, useState } from "react";
import { format, parseISO, startOfDay, subDays } from "date-fns";
import { usePuppy } from "@/context/PuppyContext";
import { Card } from "@/components/ui/card";
import Layout from "@/components/Layout";
import { TimeframeSelector } from "@/components/statistics/TimeframeSelector";
import { AveragesCard } from "@/components/statistics/AveragesCard";
import { StatisticsHeader } from "@/components/statistics/StatisticsHeader";
import { EventsSection } from "@/components/statistics/EventsSection";

type TimeframeOption = "7days" | "30days" | "90days" | "custom";

const StatisticsPage: React.FC = () => {
  const { events, selectedPuppyId, setSelectedPuppyId } = usePuppy();
  const [timeframe, setTimeframe] = useState<TimeframeOption>("7days");
  const [customStartDate, setCustomStartDate] = useState(
    format(subDays(new Date(), 7), "yyyy-MM-dd")
  );
  const [customEndDate, setCustomEndDate] = useState(
    format(new Date(), "yyyy-MM-dd")
  );
  
  const filteredEvents = useMemo(() => {
    const now = new Date();
    let startDate: Date;
    
    if (timeframe === "custom") {
      startDate = startOfDay(new Date(customStartDate));
      const endDate = new Date(customEndDate);
      return events.filter(event => {
        const eventDate = new Date(event.created_at);
        const isInTimeframe = eventDate >= startDate && eventDate <= endDate;
        const isPuppyMatch = !selectedPuppyId || event.puppy_id === selectedPuppyId;
        return isInTimeframe && isPuppyMatch;
      });
    }
    
    const days = {
      "7days": 7,
      "30days": 30,
      "90days": 90,
    }[timeframe] || 7;
    
    startDate = startOfDay(subDays(now, days));
    
    return events.filter(event => {
      const eventDate = new Date(event.created_at);
      const isInTimeframe = eventDate >= startDate;
      const isPuppyMatch = !selectedPuppyId || event.puppy_id === selectedPuppyId;
      return isInTimeframe && isPuppyMatch;
    });
  }, [events, selectedPuppyId, timeframe, customStartDate, customEndDate]);
  
  const eventsByDay = useMemo(() => {
    const grouped: Record<string, { date: string; pee: number; poop: number; }> = {};
    const now = new Date();
    const days = timeframe === "7days" ? 7 : timeframe === "30days" ? 30 : 90;
    
    for (let i = 0; i < days; i++) {
      const date = subDays(now, i);
      const dateKey = format(date, "yyyy-MM-dd");
      grouped[dateKey] = {
        date: format(date, "dd.MM"),
        pee: 0,
        poop: 0
      };
    }
    
    filteredEvents.forEach(event => {
      const dateKey = format(parseISO(event.created_at), "yyyy-MM-dd");
      if (grouped[dateKey]) {
        if (event.type === "pee" || event.type === "both") {
          grouped[dateKey].pee += 1;
        }
        if (event.type === "poop" || event.type === "both") {
          grouped[dateKey].poop += 1;
        }
      }
    });
    
    return Object.values(grouped).sort((a, b) => {
      return a.date.localeCompare(b.date);
    });
  }, [filteredEvents, timeframe]);
  
  const averages = useMemo(() => {
    const totalDays = timeframe === "custom" 
      ? Math.ceil((new Date(customEndDate).getTime() - new Date(customStartDate).getTime()) / (1000 * 60 * 60 * 24))
      : timeframe === "7days" ? 7 : timeframe === "30days" ? 30 : 90;
    
    const totalPee = filteredEvents.filter(e => e.type === "pee" || e.type === "both").length;
    const totalPoop = filteredEvents.filter(e => e.type === "poop" || e.type === "both").length;
    
    return {
      peePerDay: (totalPee / totalDays).toFixed(1),
      poopPerDay: (totalPoop / totalDays).toFixed(1)
    };
  }, [filteredEvents, timeframe, customStartDate, customEndDate]);
  
  const timeDistribution = useMemo(() => {
    const distribution = [
      { name: "Morgens (6-12)", pee: 0, poop: 0 },
      { name: "Mittags (12-18)", pee: 0, poop: 0 },
      { name: "Abends (18-24)", pee: 0, poop: 0 },
      { name: "Nachts (0-6)", pee: 0, poop: 0 }
    ];
    
    filteredEvents.forEach(event => {
      const date = new Date(event.created_at);
      const hour = date.getHours();
      
      let timeSlot: number;
      if (hour >= 6 && hour < 12) timeSlot = 0;
      else if (hour >= 12 && hour < 18) timeSlot = 1;
      else if (hour >= 18) timeSlot = 2;
      else timeSlot = 3;
      
      if (event.type === "pee" || event.type === "both") {
        distribution[timeSlot].pee += 1;
      }
      if (event.type === "poop" || event.type === "both") {
        distribution[timeSlot].poop += 1;
      }
    });
    
    return distribution;
  }, [filteredEvents]);
  
  return (
    <Layout>
      <div className="max-w-4xl mx-auto">
        <StatisticsHeader 
          selectedPuppyId={selectedPuppyId} 
          setSelectedPuppyId={setSelectedPuppyId} 
        />
        
        <TimeframeSelector
          timeframe={timeframe}
          setTimeframe={setTimeframe}
          customStartDate={customStartDate}
          setCustomStartDate={setCustomStartDate}
          customEndDate={customEndDate}
          setCustomEndDate={setCustomEndDate}
        />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <AveragesCard 
            peePerDay={averages.peePerDay} 
            poopPerDay={averages.poopPerDay} 
          />
        </div>
        
        <EventsSection 
          eventsByDay={eventsByDay} 
          timeDistribution={timeDistribution}
        />
      </div>
    </Layout>
  );
};

export default StatisticsPage;
