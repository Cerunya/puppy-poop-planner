
import React, { useState } from "react";
import { usePuppy } from "@/context/PuppyContext";
import { Button } from "@/components/ui/button";
import { Image, Plus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { EventType } from "@/types";

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
      // In a real app, you would upload the image to a server here
      // and get back a URL. For now, we'll use the object URL
      imageUrl = URL.createObjectURL(image);
    }
    
    addEvent({
      puppy_id: puppyId,
      type,
      notes: notes || undefined,
      image_url: imageUrl || undefined,
    });
    
    setNotes("");
    setImage(null);
    setImagePreview(null);
    onSuccess?.();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
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
          <div className="mt-2">
            <img
              src={imagePreview}
              alt="Preview"
              className="max-w-[200px] rounded-md"
            />
          </div>
        )}
      </div>
      
      <Button type="submit" className="w-full">
        Speichern
      </Button>
    </form>
  );
};
