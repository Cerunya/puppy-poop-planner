
import React, { useState } from 'react';
import { format } from "date-fns";
import { de } from "date-fns/locale";
import { Image, CalendarIcon, Clock } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";

interface DetailedEntryFormProps {
  selectedPuppyId: string | null;
  puppies: Array<{ id: string; name: string }>;
  onSubmit: (data: {
    puppy_id: string;
    type: "pee" | "poop" | "both";
    notes: string;
    image_url?: string;
    created_at: string;
  }) => Promise<void>;
  onImageUpload: (file: File) => Promise<string>;
  setSelectedPuppyId?: (id: string | null) => void;
}

export const DetailedEntryForm = ({ 
  selectedPuppyId,
  puppies,
  onSubmit,
  onImageUpload,
  setSelectedPuppyId
}: DetailedEntryFormProps) => {
  const [eventType, setEventType] = useState<"pee" | "poop" | "both">("pee");
  const [notes, setNotes] = useState("");
  const [poopDescription, setPoopDescription] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedTime, setSelectedTime] = useState<string>(() => {
    const now = new Date();
    return `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
  });

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

    let imageUrl: string | undefined = undefined;
    if (image) {
      imageUrl = await onImageUpload(image);
    }

    let combinedNotes = notes;
    if (poopDescription && (eventType === "poop" || eventType === "both")) {
      combinedNotes = `${poopDescription}${notes ? ': ' + notes : ''}`;
    }

    const [hours, minutes] = selectedTime.split(':').map(Number);
    const eventTime = new Date(selectedDate);
    eventTime.setHours(hours, minutes);

    await onSubmit({
      puppy_id: selectedPuppyId,
      type: eventType,
      notes: combinedNotes.trim() || undefined,
      image_url: imageUrl,
      created_at: eventTime.toISOString(),
    });

    setNotes("");
    setPoopDescription("");
    setImage(null);
    setImagePreview(null);
  };

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
    <Card>
      <CardContent className="p-6">
        <h2 className="text-xl font-semibold mb-4">Detaillierter Eintrag</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="puppy">Welpe</Label>
            <Select
              value={selectedPuppyId || ""}
              onValueChange={(value) => setSelectedPuppyId && setSelectedPuppyId(value)}
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
              onValueChange={(value: "pee" | "poop" | "both") => setEventType(value)}
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
            <Label>Datum & Zeit</Label>
            <div className="flex flex-wrap gap-4">
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-[200px] justify-start text-left font-normal",
                      !selectedDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {selectedDate ? (
                      format(selectedDate, "dd.MM.yyyy", { locale: de })
                    ) : (
                      <span>Datum wählen</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={(date) => setSelectedDate(date || new Date())}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>

              <div className="flex items-center">
                <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="time"
                  value={selectedTime}
                  onChange={(e) => setSelectedTime(e.target.value)}
                  className="w-[150px]"
                />
              </div>
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
                    className="mt-2 text-destructive"
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
  );
};
