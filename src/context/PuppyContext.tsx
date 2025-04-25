
import React, { createContext, useState, useContext, useEffect } from "react";
import { Puppy, PuppyEvent } from "../types";
import { useToast } from "@/hooks/use-toast";

interface PuppyContextType {
  puppies: Puppy[];
  events: PuppyEvent[];
  addPuppy: (puppy: Omit<Puppy, "id">) => void;
  updatePuppy: (id: string, puppy: Partial<Puppy>) => void;
  removePuppy: (id: string) => void;
  addEvent: (event: Omit<PuppyEvent, "id">) => void;
  removeEvent: (id: string) => void;
  selectedPuppyId: string | null;
  setSelectedPuppyId: (id: string | null) => void;
}

const PuppyContext = createContext<PuppyContextType | undefined>(undefined);

// Sample data
const initialPuppies: Puppy[] = [
  {
    id: "1",
    name: "Bruno",
    breed: "Labrador",
    birthdate: "2024-02-15",
  },
  {
    id: "2",
    name: "Luna",
    breed: "Deutscher Schäferhund",
    birthdate: "2024-03-01",
  },
];

const generateInitialEvents = (): PuppyEvent[] => {
  const events: PuppyEvent[] = [];
  const now = new Date();
  
  // Generate some events for the past 5 days
  for (let i = 0; i < 20; i++) {
    const puppyId = Math.random() > 0.5 ? "1" : "2";
    const type: EventType = Math.random() > 0.6 ? "pee" : Math.random() > 0.5 ? "poop" : "both";
    const timestamp = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate() - Math.floor(Math.random() * 5),
      Math.floor(Math.random() * 24),
      Math.floor(Math.random() * 60)
    ).toISOString();
    
    events.push({
      id: `event-${i}`,
      puppyId,
      type,
      timestamp,
    });
  }
  
  return events;
};

export const PuppyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [puppies, setPuppies] = useState<Puppy[]>(() => {
    const savedData = localStorage.getItem("puppyTrackerPuppies");
    return savedData ? JSON.parse(savedData) : initialPuppies;
  });
  
  const [events, setEvents] = useState<PuppyEvent[]>(() => {
    const savedData = localStorage.getItem("puppyTrackerEvents");
    return savedData ? JSON.parse(savedData) : generateInitialEvents();
  });
  
  const [selectedPuppyId, setSelectedPuppyId] = useState<string | null>(() => {
    if (puppies.length > 0) {
      return puppies[0].id;
    }
    return null;
  });

  const { toast } = useToast();

  // Save to local storage whenever data changes
  useEffect(() => {
    localStorage.setItem("puppyTrackerPuppies", JSON.stringify(puppies));
  }, [puppies]);

  useEffect(() => {
    localStorage.setItem("puppyTrackerEvents", JSON.stringify(events));
  }, [events]);

  const addPuppy = (puppy: Omit<Puppy, "id">) => {
    const newPuppy = {
      ...puppy,
      id: `puppy-${Date.now()}`,
    };
    setPuppies([...puppies, newPuppy]);
    if (selectedPuppyId === null) {
      setSelectedPuppyId(newPuppy.id);
    }
    toast({
      title: "Welpe hinzugefügt",
      description: `${puppy.name} wurde hinzugefügt!`,
    });
  };

  const updatePuppy = (id: string, updatedFields: Partial<Puppy>) => {
    setPuppies(
      puppies.map((puppy) =>
        puppy.id === id ? { ...puppy, ...updatedFields } : puppy
      )
    );
    toast({
      title: "Welpe aktualisiert",
      description: "Die Informationen wurden aktualisiert.",
    });
  };

  const removePuppy = (id: string) => {
    const puppyToRemove = puppies.find(puppy => puppy.id === id);
    setPuppies(puppies.filter((puppy) => puppy.id !== id));
    setEvents(events.filter((event) => event.puppyId !== id));
    
    // If we're removing the selected puppy, select another one or null
    if (selectedPuppyId === id) {
      const remainingPuppies = puppies.filter(p => p.id !== id);
      setSelectedPuppyId(remainingPuppies.length > 0 ? remainingPuppies[0].id : null);
    }
    
    if (puppyToRemove) {
      toast({
        title: "Welpe entfernt",
        description: `${puppyToRemove.name} wurde entfernt.`,
      });
    }
  };

  const addEvent = (event: Omit<PuppyEvent, "id">) => {
    const newEvent = {
      ...event,
      id: `event-${Date.now()}`,
    };
    setEvents([...events, newEvent]);
    
    const eventPuppy = puppies.find(p => p.id === event.puppyId);
    const eventTypeText = 
      event.type === "pee" ? "Urinieren" : 
      event.type === "poop" ? "Stuhlgang" : 
      "Beides";
    
    toast({
      title: "Ereignis hinzugefügt",
      description: `${eventTypeText} für ${eventPuppy?.name || "Welpe"} wurde aufgezeichnet.`,
    });
  };

  const removeEvent = (id: string) => {
    setEvents(events.filter((event) => event.id !== id));
    toast({
      title: "Ereignis entfernt",
      description: "Das Ereignis wurde gelöscht.",
    });
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
