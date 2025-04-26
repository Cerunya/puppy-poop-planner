
import { useState } from "react";
import { usePuppy } from "@/context/PuppyContext";
import { Image as ImageIcon } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Puppy } from "@/types";
import { uploadImageToStorage, deleteImageFromStorage } from "@/services/puppyService";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface EditPuppyDialogProps {
  puppy: Puppy;
  trigger?: React.ReactNode;
}

const EditPuppyDialog = ({ puppy, trigger }: EditPuppyDialogProps) => {
  const { updatePuppy } = usePuppy();
  const [name, setName] = useState(puppy.name);
  const [breed, setBreed] = useState(puppy.breed);
  const [birthdate, setBirthdate] = useState(puppy.birthdate);
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(puppy.image_url || null);
  const [isUploading, setIsUploading] = useState(false);
  const [open, setOpen] = useState(false);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUploading(true);
    
    try {
      let imageUrl = puppy.image_url;
      
      // If there's a new image, upload it and delete the old one
      if (image) {
        if (puppy.image_url) {
          // Delete the old image first
          await deleteImageFromStorage(puppy.image_url);
        }
        
        // Upload the new image and get the URL
        imageUrl = await uploadImageToStorage(image);
      }
      
      // Update the puppy with the new data
      await updatePuppy(puppy.id, {
        name,
        breed,
        birthdate,
        image_url: imageUrl || undefined,
      });
      
      setOpen(false);
    } catch (error) {
      console.error("Error updating puppy:", error);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || <Button variant="ghost">Bearbeiten</Button>}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Welpen bearbeiten</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex items-center space-x-4 mb-4">
            <Avatar className="w-16 h-16 border">
              {imagePreview ? (
                <AvatarImage src={imagePreview} alt={name} />
              ) : (
                <AvatarFallback>{name[0]}</AvatarFallback>
              )}
            </Avatar>
            <div>
              <Label htmlFor="puppy-image" className="mb-2 block">Foto</Label>
              <div className="flex items-center space-x-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => document.getElementById("puppy-image")?.click()}
                >
                  <ImageIcon className="w-4 h-4 mr-2" />
                  Foto hochladen
                </Button>
                <Input
                  id="puppy-image"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageChange}
                />
              </div>
            </div>
          </div>
          
          <div>
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div>
            <Label htmlFor="breed">Rasse</Label>
            <Input
              id="breed"
              value={breed}
              onChange={(e) => setBreed(e.target.value)}
              required
            />
          </div>
          <div>
            <Label htmlFor="birthdate">Geburtsdatum</Label>
            <Input
              id="birthdate"
              type="date"
              value={birthdate}
              onChange={(e) => setBirthdate(e.target.value)}
              required
            />
          </div>
          
          <Button type="submit" disabled={isUploading}>
            {isUploading ? "Wird gespeichert..." : "Speichern"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditPuppyDialog;
