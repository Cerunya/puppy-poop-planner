
import React, { useState } from "react";
import { usePuppy } from "@/context/PuppyContext";
import { Button } from "@/components/ui/button";
import { Image, Plus, Trash2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { EventType } from "@/types";
import { supabase } from "@/integrations/supabase/client";
import { uploadImageToStorage } from "@/services/puppyService";

interface EventFormProps {
  puppyId: string;
  type: EventType;
  onSuccess?: () => void;
}

export const EventForm = ({ puppyId, type, onSuccess }: EventFormProps) => {
  const { addEvent } = usePuppy();
  const [notes, setNotes] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
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
    
    let imageUrl = null;
    if (image) {
      imageUrl = await uploadImageToStorage(image);
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
      puppy_id: puppyId,
      type,
      notes: notes || undefined,
      image_url: imageUrl || undefined,
      created_at: eventTime.toISOString(),
    });
    
    setNotes("");
    setImage(null);
    setImagePreview(null);
    onSuccess?.();
  };

  const handleRemoveImage = () => {
    setImage(null);
    setImagePreview(null);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="time">Uhrzeit</Label>
        <Input
          type="time"
          id="time"
          value={selectedTime}
          onChange={(e) => setSelectedTime(e.target.value)}
        />
      </div>
      
      <div>
        <Label htmlFor="notes">Notizen</Label>
        <Input
          id="notes"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Optional: Fügen Sie Notizen hinzu..."
        />
      </div>
      
      <div>
        <Label htmlFor="image">Foto</Label>
        <div className="flex items-center space-x-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => document.getElementById("image")?.click()}
          >
            <Image className="w-4 h-4 mr-2" />
            Foto hochladen
          </Button>
          <Input
            id="image"
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleImageChange}
          />
        </div>
        
        {imagePreview && (
          <div className="mt-2 flex items-center space-x-2">
            <img
              src={imagePreview}
              alt="Preview"
              className="max-w-[200px] rounded-md"
            />
            <Button
              type="button"
              variant="destructive"
              size="sm"
              onClick={handleRemoveImage}
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Entfernen
            </Button>
          </div>
        )}
      </div>
      
      <Button type="submit" className="w-full">
        Speichern
      </Button>
    </form>
  );
};
