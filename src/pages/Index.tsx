
import React, { useState } from "react";
import { format } from "date-fns";
import { de } from "date-fns/locale";
import Layout from "@/components/Layout";
import { usePuppy } from "@/context/PuppyContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { EventType } from "@/types";
import { Calendar as CalendarIcon, CalendarPlus, CalendarMinus } from "lucide-react";

const Index = () => {
  const { puppies, events, addEvent, selectedPuppyId, setSelectedPuppyId } = usePuppy();
  const [eventType, setEventType] = useState<EventType>("pee");
  const [notes, setNotes] = useState("");
  const [date, setDate] = useState<Date>(new Date());

  const handleQuickAdd = (type: EventType) => {
    if (!selectedPuppyId) return;
    
    addEvent({
      puppy_id: selectedPuppyId,
      type,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedPuppyId) return;
    
    addEvent({
      puppy_id: selectedPuppyId,
      type: eventType,
      notes: notes.trim() || undefined,
    });
    
    // Reset form
    setNotes("");
  };

  // Get today's events for the selected puppy
  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);
  
  const todayEnd = new Date();
  todayEnd.setHours(23, 59, 59, 999);
  
  const todayEvents = events.filter(event => {
    const eventDate = new Date(event.created_at);
    return (
      eventDate >= todayStart && 
      eventDate <= todayEnd && 
      (!selectedPuppyId || event.puppy_id === selectedPuppyId)
    );
  });
  
  const peeCount = todayEvents.filter(event => event.type === "pee" || event.type === "both").length;
  const poopCount = todayEvents.filter(event => event.type === "poop" || event.type === "both").length;

  return (
    <Layout>
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Neuer Eintrag</h1>
        
        {/* Quick Action Buttons */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <Card className="bg-puppy-blue border-0">
            <CardContent className="p-6 flex flex-col items-center justify-center">
              <button 
                onClick={() => handleQuickAdd("pee")}
                className="text-5xl event-button"
                aria-label="Jetzt hat er gepullert"
              >
                💧
              </button>
              <span className="mt-2 font-medium">Schnell: Urin</span>
            </CardContent>
          </Card>
          
          <Card className="bg-puppy-brown border-0">
            <CardContent className="p-6 flex flex-col items-center justify-center">
              <button 
                onClick={() => handleQuickAdd("poop")}
                className="text-5xl event-button"
                aria-label="Jetzt hat er gekackt"
              >
                💩
              </button>
              <span className="mt-2 font-medium">Schnell: Kot</span>
            </CardContent>
          </Card>
          
          <Card className="bg-puppy-peach border-0">
            <CardContent className="p-6 flex flex-col items-center justify-center">
              <button 
                onClick={() => handleQuickAdd("both")}
                className="text-5xl event-button"
                aria-label="Jetzt hat er beides gemacht"
              >
                💧💩
              </button>
              <span className="mt-2 font-medium">Schnell: Beides</span>
            </CardContent>
          </Card>
        </div>
        
        {/* Today's Summary */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <h2 className="text-xl font-semibold mb-3">Heute</h2>
            <div className="flex justify-around">
              <div className="text-center">
                <span className="text-3xl">💧</span>
                <p className="text-2xl font-bold mt-2">{peeCount}</p>
                <p className="text-sm text-gray-500">Urin</p>
              </div>
              
              <div className="text-center">
                <span className="text-3xl">💩</span>
                <p className="text-2xl font-bold mt-2">{poopCount}</p>
                <p className="text-sm text-gray-500">Kot</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Add Event Form */}
        <Card>
          <CardContent className="p-6">
            <h2 className="text-xl font-semibold mb-4">Detaillierter Eintrag</h2>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="puppy">Welpe</Label>
                <Select
                  value={selectedPuppyId || ""}
                  onValueChange={(value) => setSelectedPuppyId(value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Welpen auswählen" />
                  </SelectTrigger>
                  <SelectContent>
                    {puppies.map((puppy) => (
                      <SelectItem key={puppy.id} value={puppy.id}>
                        {puppy.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="eventType">Art des Ereignisses</Label>
                <Select
                  value={eventType}
                  onValueChange={(value: EventType) => setEventType(value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pee">Urin</SelectItem>
                    <SelectItem value="poop">Kot</SelectItem>
                    <SelectItem value="both">Beides</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="notes">Notizen</Label>
                <Textarea
                  id="notes"
                  placeholder="z. B. Konsistenz, Farbe, Besonderheiten"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                />
              </div>
              
              <Button type="submit" className="w-full bg-puppy-purple hover:bg-puppy-purple/90">
                Eintrag speichern
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default Index;
