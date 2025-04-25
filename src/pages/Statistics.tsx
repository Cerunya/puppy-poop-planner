
import React, { useMemo, useState } from "react";
import { format, parseISO, startOfDay, subDays } from "date-fns";
import { usePuppy } from "@/context/PuppyContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PuppyEvent } from "@/types";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Layout from "@/components/Layout";
import {
  ResponsiveContainer,
  BarChart,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  Bar
} from "recharts";

type TimeframeOption = "7days" | "30days" | "90days" | "custom";

const StatisticsPage: React.FC = () => {
  const { events, puppies, selectedPuppyId, setSelectedPuppyId } = usePuppy();
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
        const eventDate = new Date(event.timestamp);
        const isInTimeframe = eventDate >= startDate && eventDate <= endDate;
        const isPuppyMatch = !selectedPuppyId || event.puppyId === selectedPuppyId;
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
      const eventDate = new Date(event.timestamp);
      const isInTimeframe = eventDate >= startDate;
      const isPuppyMatch = !selectedPuppyId || event.puppyId === selectedPuppyId;
      return isInTimeframe && isPuppyMatch;
    });
  }, [events, selectedPuppyId, timeframe, customStartDate, customEndDate]);
  
  const eventsByDay = useMemo(() => {
    const grouped: Record<string, { date: string, pee: number, poop: number }> = {};
    const now = new Date();
    const days = timeframe === "7days" ? 7 : 30;
    
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
      const dateKey = format(parseISO(event.timestamp), "yyyy-MM-dd");
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
    const totalDays = timeframe === "7days" ? 7 : 30;
    const totalPee = filteredEvents.filter(e => e.type === "pee" || e.type === "both").length;
    const totalPoop = filteredEvents.filter(e => e.type === "poop" || e.type === "both").length;
    
    return {
      peePerDay: (totalPee / totalDays).toFixed(1),
      poopPerDay: (totalPoop / totalDays).toFixed(1)
    };
  }, [filteredEvents, timeframe]);
  
  const timeDistribution = useMemo(() => {
    const distribution = [
      { name: "Morgens (6-12)", pee: 0, poop: 0 },
      { name: "Mittags (12-18)", pee: 0, poop: 0 },
      { name: "Abends (18-24)", pee: 0, poop: 0 },
      { name: "Nachts (0-6)", pee: 0, poop: 0 }
    ];
    
    filteredEvents.forEach(event => {
      const date = new Date(event.timestamp);
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
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Statistiken</h1>
          
          <div className="flex space-x-2">
            <select 
              className="border rounded px-2 py-1 text-sm" 
              value={selectedPuppyId || ""}
              onChange={(e) => setSelectedPuppyId(e.target.value || null)}
            >
              <option value="">Alle Welpen</option>
              {puppies.map((puppy) => (
                <option key={puppy.id} value={puppy.id}>
                  {puppy.name}
                </option>
              ))}
            </select>
          </div>
        </div>
        
        <div className="mb-6">
          <Tabs defaultValue="7days" onValueChange={(v: TimeframeOption) => setTimeframe(v)}>
            <TabsList className="mb-4">
              <TabsTrigger value="7days">7 Tage</TabsTrigger>
              <TabsTrigger value="30days">30 Tage</TabsTrigger>
              <TabsTrigger value="90days">90 Tage</TabsTrigger>
              <TabsTrigger value="custom">Benutzerdefiniert</TabsTrigger>
            </TabsList>
            
            {timeframe === "custom" && (
              <div className="flex gap-4 mt-4">
                <div>
                  <Label htmlFor="startDate">Von</Label>
                  <Input
                    id="startDate"
                    type="date"
                    value={customStartDate}
                    onChange={(e) => setCustomStartDate(e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="endDate">Bis</Label>
                  <Input
                    id="endDate"
                    type="date"
                    value={customEndDate}
                    onChange={(e) => setCustomEndDate(e.target.value)}
                  />
                </div>
              </div>
            )}
          </Tabs>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Durchschnitt pro Tag</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex justify-around">
                <div className="text-center">
                  <span className="text-3xl">💧</span>
                  <p className="text-2xl font-bold mt-2">{averages.peePerDay}</p>
                  <p className="text-sm text-gray-500">Urin</p>
                </div>
                
                <div className="text-center">
                  <span className="text-3xl">💩</span>
                  <p className="text-2xl font-bold mt-2">{averages.poopPerDay}</p>
                  <p className="text-sm text-gray-500">Kot</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <Card className="mb-6">
          <CardHeader className="pb-2">
            <CardTitle>Ereignisse im Zeitverlauf</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={eventsByDay}>
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="pee" name="Urin" fill="#D3E4FD" />
                  <Bar dataKey="poop" name="Kot" fill="#E6D7B9" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Verteilung nach Tageszeit</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={timeDistribution}>
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="pee" name="Urin" fill="#D3E4FD" />
                  <Bar dataKey="poop" name="Kot" fill="#E6D7B9" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default StatisticsPage;
