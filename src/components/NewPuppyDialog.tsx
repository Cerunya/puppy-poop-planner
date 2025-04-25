
import { useState } from "react";
import { usePuppy } from "@/context/PuppyContext";
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

const NewPuppyDialog = () => {
  const { addPuppy } = usePuppy();
  const [name, setName] = useState("");
  const [breed, setBreed] = useState("");
  const [birthdate, setBirthdate] = useState("");
  const [open, setOpen] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addPuppy({
      name,
      breed,
      birthdate,
    });
    setOpen(false);
    setName("");
    setBreed("");
    setBirthdate("");
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" className="w-full flex items-center space-x-2">
          <Plus size={16} />
          <span>Neuen Welpen</span>
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Neuen Welpen hinzufügen</DialogTitle>
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
          <Button type="submit">Hinzufügen</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default NewPuppyDialog;
