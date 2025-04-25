
import React, { useMemo, useState } from "react";
import { format, startOfMonth, endOfMonth, eachDayOfInterval, getDay, addMonths, subMonths, isSameDay } from "date-fns";
import { de } from "date-fns/locale";
import Layout from "@/components/Layout";
import { usePuppy } from "@/context/PuppyContext";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PuppyEvent } from "@/types";
import { Calendar } from "lucide-react";

const CalendarPage: React.FC = () => {
  const { events, puppies, selectedPuppyId, setSelectedPuppyId } = usePuppy();
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date());
  
  const dayNames = ["So", "Mo", "Di", "Mi", "Do", "Fr", "Sa"];
  
  const daysInMonth = useMemo(() => {
    const start = startOfMonth(currentMonth);
    const end = endOfMonth(currentMonth);
    return eachDayOfInterval({ start, end });
  }, [currentMonth]);
  
  const firstDayOfMonth = getDay(startOfMonth(currentMonth));
  
  const filteredEvents = selectedPuppyId 
    ? events.filter(event => event.puppy_id === selectedPuppyId)
    : events;
  
  // Group events by day for easier lookup
  const eventsByDay = useMemo(() => {
    const grouped: Record<string, PuppyEvent[]> = {};
    
    filteredEvents.forEach(event => {
      const day = format(new Date(event.created_at), "yyyy-MM-dd");
      if (!grouped[day]) {
        grouped[day] = [];
      }
      grouped[day].push(event);
    });
    
    return grouped;
  }, [filteredEvents]);
  
  const goToNextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));
  const goToPrevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));
  const goToCurrentMonth = () => setCurrentMonth(new Date());
  
  return (
    <Layout>
      <div className="max-w-3xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Kalender</h1>
          
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
        
        <Card>
          <CardContent className="p-6">
            <div className="flex justify-between items-center mb-4">
              <Button variant="outline" onClick={goToPrevMonth}>&lt;</Button>
              <div className="flex items-center">
                <h2 className="text-xl font-semibold">
                  {format(currentMonth, "MMMM yyyy", { locale: de })}
                </h2>
                <Button variant="ghost" size="sm" onClick={goToCurrentMonth} className="ml-2">
                  <Calendar size={16} className="mr-1" /> Heute
                </Button>
              </div>
              <Button variant="outline" onClick={goToNextMonth}>&gt;</Button>
            </div>
            
            <div className="grid grid-cols-7 gap-1">
              {/* Day names */}
              {dayNames.map((day) => (
                <div key={day} className="text-center py-2 font-medium text-sm">
                  {day}
                </div>
              ))}
              
              {/* Empty cells for days before the first day of month */}
              {Array.from({ length: firstDayOfMonth }).map((_, i) => (
                <div key={`empty-${i}`} className="h-24 border rounded-md bg-gray-50"></div>
              ))}
              
              {/* Days of month */}
              {daysInMonth.map((day) => {
                const dateKey = format(day, "yyyy-MM-dd");
                const dayEvents = eventsByDay[dateKey] || [];
                const peeEvents = dayEvents.filter(e => e.type === "pee" || e.type === "both");
                const poopEvents = dayEvents.filter(e => e.type === "poop" || e.type === "both");
                const isToday = isSameDay(day, new Date());
                
                return (
                  <div 
                    key={day.toString()} 
                    className={`h-24 border rounded-md p-1 overflow-hidden ${isToday ? 'border-puppy-purple border-2' : ''}`}
                  >
                    <div className="text-right text-sm">
                      {format(day, "d")}
                    </div>
                    
                    {dayEvents.length > 0 && (
                      <div className="mt-1">
                        {peeEvents.length > 0 && (
                          <div className="flex items-center text-sm bg-puppy-blue/30 rounded px-1 mb-1">
                            <span>💧</span>
                            <span className="ml-1">{peeEvents.length}</span>
                          </div>
                        )}
                        
                        {poopEvents.length > 0 && (
                          <div className="flex items-center text-sm bg-puppy-brown/30 rounded px-1">
                            <span>💩</span>
                            <span className="ml-1">{poopEvents.length}</span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default CalendarPage;
