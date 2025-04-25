
import { useState } from "react";
import { usePuppy } from "@/context/PuppyContext";
import { Image } from "lucide-react";
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
  const [imagePreview, setImagePreview] = useState<string | null>(puppy.image || null);
  const [open, setOpen] = useState(false);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    let imageUrl = puppy.image;
    if (image) {
      // In a real app, you would upload the image to a server here
      // and get back a URL. For now, we'll use the object URL
      imageUrl = URL.createObjectURL(image);
    }
    
    updatePuppy(puppy.id, {
      name,
      breed,
      birthdate,
      image: imageUrl,
    });
    
    setOpen(false);
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
          <div>
            <Label htmlFor="puppy-image">Foto</Label>
            <div className="flex items-center space-x-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => document.getElementById("puppy-image")?.click()}
              >
                <Image className="w-4 h-4 mr-2" />
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
          <Button type="submit">Speichern</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditPuppyDialog;
