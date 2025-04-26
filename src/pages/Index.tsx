
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
import { Calendar as CalendarIcon, CalendarPlus, CalendarMinus, Image, Clock } from "lucide-react";
import * as puppyService from "@/services/puppyService";

const Index = () => {
  const { puppies, events, addEvent, selectedPuppyId, setSelectedPuppyId } = usePuppy();
  const [eventType, setEventType] = useState<EventType>("pee");
  const [notes, setNotes] = useState("");
  const [date, setDate] = useState<Date>(new Date());
  const [poopDescription, setPoopDescription] = useState<string>("");
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [selectedTime, setSelectedTime] = useState<string>(() => {
    const now = new Date();
    return `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
  });

  const handleQuickAdd = async (type: EventType) => {
    if (!selectedPuppyId) {
      return;
    }
    
    // Create event with current time
    const now = new Date();
    const eventTime = now.toISOString();
    
    await addEvent({
      puppy_id: selectedPuppyId,
      type,
      created_at: eventTime,
    });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedPuppyId) return;
    
    // Handle image upload
    let imageUrl: string | undefined = undefined;
    if (image) {
      imageUrl = await puppyService.uploadImageToStorage(image);
    }

    // Combine notes and poop description if available
    let combinedNotes = notes;
    if (poopDescription && (eventType === "poop" || eventType === "both")) {
      combinedNotes = `${poopDescription}${notes ? ': ' + notes : ''}`;
    }
    
    // Create event with custom time
    const now = new Date();
    const [hours, minutes] = selectedTime.split(':').map(Number);
    const eventTime = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
      hours,
      minutes
    );
    
    await addEvent({
      puppy_id: selectedPuppyId,
      type: eventType,
      notes: combinedNotes.trim() || undefined,
      image_url: imageUrl,
      created_at: eventTime.toISOString(),
    });
    
    // Reset form
    setNotes("");
    setPoopDescription("");
    setImage(null);
    setImagePreview(null);
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

  const poopDescriptions = [
    "Normal fest",
    "Weich",
    "Wässrig",
    "Hart",
    "Mit Schleim",
    "Mit Blut",
    "Dunkel gefärbt",
    "Hell gefärbt"
  ];

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
                className="text-5xl event-button hover:scale-110 transition-transform"
                aria-label="Jetzt hat er gepullert"
                type="button"
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
                className="text-5xl event-button hover:scale-110 transition-transform"
                aria-label="Jetzt hat er gekackt"
                type="button"
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
                className="text-5xl event-button hover:scale-110 transition-transform"
                aria-label="Jetzt hat er beides gemacht"
                type="button"
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
                <Label htmlFor="time">Uhrzeit</Label>
                <div className="flex items-center">
                  <Clock className="mr-2 h-4 w-4 text-gray-500" />
                  <Input
                    id="time"
                    type="time"
                    value={selectedTime}
                    onChange={(e) => setSelectedTime(e.target.value)}
                  />
                </div>
              </div>

              {(eventType === "poop" || eventType === "both") && (
                <div className="space-y-2">
                  <Label htmlFor="poopDescription">Kot-Beschreibung</Label>
                  <Select
                    value={poopDescription}
                    onValueChange={setPoopDescription}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Beschreibung auswählen" />
                    </SelectTrigger>
                    <SelectContent>
                      {poopDescriptions.map((desc) => (
                        <SelectItem key={desc} value={desc}>
                          {desc}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
              
              <div className="space-y-2">
                <Label htmlFor="image">Foto</Label>
                <div className="flex flex-wrap items-center gap-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => document.getElementById("imageUpload")?.click()}
                    className="flex items-center gap-2"
                  >
                    <Image className="w-4 h-4" />
                    Foto hochladen
                  </Button>
                  <Input
                    id="imageUpload"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageChange}
                  />
                  
                  {imagePreview && (
                    <div className="mt-2">
                      <img
                        src={imagePreview}
                        alt="Vorschau"
                        className="max-w-xs rounded-md"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="mt-2 text-red-500"
                        onClick={() => {
                          setImage(null);
                          setImagePreview(null);
                        }}
                      >
                        Entfernen
                      </Button>
                    </div>
                  )}
                </div>
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
