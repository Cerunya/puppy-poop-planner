
import React, { createContext, useContext, useEffect } from "react";
import { Puppy, PuppyEvent } from "@/types";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { usePuppyState } from "@/hooks/usePuppyState";
import * as puppyService from "@/services/puppyService";
import { Session } from '@supabase/supabase-js'; // Added this import for Session type

interface PuppyContextType {
  puppies: Puppy[];
  events: PuppyEvent[];
  addPuppy: (puppy: Omit<Puppy, "id" | "user_id" | "created_at" | "updated_at">) => Promise<void>;
  updatePuppy: (id: string, puppy: Partial<Puppy>) => Promise<void>;
  removePuppy: (id: string) => Promise<void>;
  addEvent: (event: Omit<PuppyEvent, "id" | "created_at">) => Promise<void>;
  removeEvent: (id: string) => Promise<void>;
  selectedPuppyId: string | null;
  setSelectedPuppyId: (id: string | null) => void;
  session: Session | null;
}

const PuppyContext = createContext<PuppyContextType | undefined>(undefined);

export const PuppyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { session } = useAuth();
  const { toast } = useToast();
  const {
    puppies,
    events,
    selectedPuppyId,
    setSelectedPuppyId,
    setPuppies,
    setEvents,
    fetchPuppyData,
  } = usePuppyState();

  useEffect(() => {
    if (session) {
      fetchPuppyData();
    }
  }, [session, fetchPuppyData]);

  const addPuppy = async (puppy: Omit<Puppy, "id" | "user_id" | "created_at" | "updated_at">) => {
    try {
      const newPuppy = await puppyService.createPuppy(puppy);
      setPuppies([newPuppy, ...puppies]);
      
      toast({
        title: "Welpe hinzugefügt",
        description: `${puppy.name} wurde hinzugefügt!`,
      });
    } catch (error) {
      toast({
        title: "Fehler beim Hinzufügen",
        description: error instanceof Error ? error.message : "Unbekannter Fehler",
        variant: "destructive",
      });
    }
  };

  const updatePuppy = async (id: string, updatedFields: Partial<Puppy>) => {
    try {
      const updatedPuppy = await puppyService.updatePuppy(id, updatedFields);
      setPuppies(puppies.map(puppy => puppy.id === id ? updatedPuppy : puppy));
      
      toast({
        title: "Welpe aktualisiert",
        description: "Die Informationen wurden aktualisiert.",
      });
    } catch (error) {
      toast({
        title: "Fehler beim Aktualisieren",
        description: error instanceof Error ? error.message : "Unbekannter Fehler",
        variant: "destructive",
      });
    }
  };

  const removePuppy = async (id: string) => {
    try {
      await puppyService.deletePuppy(id);
      const removedPuppy = puppies.find(p => p.id === id);
      setPuppies(puppies.filter(puppy => puppy.id !== id));
      setEvents(events.filter(event => event.puppy_id !== id));

      if (selectedPuppyId === id) {
        const remainingPuppies = puppies.filter(p => p.id !== id);
        setSelectedPuppyId(remainingPuppies.length > 0 ? remainingPuppies[0].id : null);
      }

      if (removedPuppy) {
        toast({
          title: "Welpe entfernt",
          description: `${removedPuppy.name} wurde entfernt.`,
        });
      }
    } catch (error) {
      toast({
        title: "Fehler beim Löschen",
        description: error instanceof Error ? error.message : "Unbekannter Fehler",
        variant: "destructive",
      });
    }
  };

  const addEvent = async (event: Omit<PuppyEvent, "id" | "created_at">) => {
    try {
      const newEvent = await puppyService.createEvent(event);
      setEvents([newEvent, ...events]);

      const eventPuppy = puppies.find(p => p.id === event.puppy_id);
      const eventTypeText = 
        event.type === "pee" ? "Urinieren" : 
        event.type === "poop" ? "Stuhlgang" : 
        "Beides";

      toast({
        title: "Ereignis hinzugefügt",
        description: `${eventTypeText} für ${eventPuppy?.name || "Welpe"} wurde aufgezeichnet.`,
      });
    } catch (error) {
      toast({
        title: "Fehler beim Hinzufügen des Ereignisses",
        description: error instanceof Error ? error.message : "Unbekannter Fehler",
        variant: "destructive",
      });
    }
  };

  const removeEvent = async (id: string) => {
    try {
      await puppyService.deleteEvent(id);
      setEvents(events.filter(event => event.id !== id));
      toast({
        title: "Ereignis entfernt",
        description: "Das Ereignis wurde gelöscht.",
      });
    } catch (error) {
      toast({
        title: "Fehler beim Löschen des Ereignisses",
        description: error instanceof Error ? error.message : "Unbekannter Fehler",
        variant: "destructive",
      });
    }
  };

  return (
    <PuppyContext.Provider
      value={{
        puppies,
        events,
        addPuppy,
        updatePuppy,
        removePuppy,
        addEvent,
        removeEvent,
        selectedPuppyId,
        setSelectedPuppyId,
        session,
      }}
    >
      {children}
    </PuppyContext.Provider>
  );
};

export const usePuppy = () => {
  const context = useContext(PuppyContext);
  if (context === undefined) {
    throw new Error("usePuppy must be used within a PuppyProvider");
  }
  return context;
};
