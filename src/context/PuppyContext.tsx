
import React, { createContext, useState, useContext, useEffect } from "react";
import { Puppy, PuppyEvent, EventType } from "../types";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Session } from "@supabase/supabase-js";

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
  const [puppies, setPuppies] = useState<Puppy[]>([]);
  const [events, setEvents] = useState<PuppyEvent[]>([]);
  const [selectedPuppyId, setSelectedPuppyId] = useState<string | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const { toast } = useToast();

  // Handle auth changes
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Fetch puppies when session changes
  useEffect(() => {
    if (session) {
      fetchPuppies();
      fetchEvents();
    } else {
      setPuppies([]);
      setEvents([]);
      setSelectedPuppyId(null);
    }
  }, [session]);

  const fetchPuppies = async () => {
    const { data, error } = await supabase
      .from('puppies')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      toast({
        title: "Fehler beim Laden der Welpen",
        description: error.message,
        variant: "destructive",
      });
      return;
    }

    setPuppies(data);
    if (data.length > 0 && !selectedPuppyId) {
      setSelectedPuppyId(data[0].id);
    }
  };

  const fetchEvents = async () => {
    const { data, error } = await supabase
      .from('events')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      toast({
        title: "Fehler beim Laden der Ereignisse",
        description: error.message,
        variant: "destructive",
      });
      return;
    }

    setEvents(data);
  };

  const addPuppy = async (puppy: Omit<Puppy, "id" | "user_id" | "created_at" | "updated_at">) => {
    const { data, error } = await supabase
      .from('puppies')
      .insert([puppy])
      .select()
      .single();

    if (error) {
      toast({
        title: "Fehler beim Hinzufügen",
        description: error.message,
        variant: "destructive",
      });
      return;
    }

    setPuppies([data, ...puppies]);
    if (!selectedPuppyId) {
      setSelectedPuppyId(data.id);
    }

    toast({
      title: "Welpe hinzugefügt",
      description: `${puppy.name} wurde hinzugefügt!`,
    });
  };

  const updatePuppy = async (id: string, updatedFields: Partial<Puppy>) => {
    const { data, error } = await supabase
      .from('puppies')
      .update(updatedFields)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      toast({
        title: "Fehler beim Aktualisieren",
        description: error.message,
        variant: "destructive",
      });
      return;
    }

    setPuppies(puppies.map(puppy => puppy.id === id ? data : puppy));
    toast({
      title: "Welpe aktualisiert",
      description: "Die Informationen wurden aktualisiert.",
    });
  };

  const removePuppy = async (id: string) => {
    const { error } = await supabase
      .from('puppies')
      .delete()
      .eq('id', id);

    if (error) {
      toast({
        title: "Fehler beim Löschen",
        description: error.message,
        variant: "destructive",
      });
      return;
    }

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
  };

  const addEvent = async (event: Omit<PuppyEvent, "id" | "created_at">) => {
    const { data, error } = await supabase
      .from('events')
      .insert([event])
      .select()
      .single();

    if (error) {
      toast({
        title: "Fehler beim Hinzufügen des Ereignisses",
        description: error.message,
        variant: "destructive",
      });
      return;
    }

    setEvents([data, ...events]);

    const eventPuppy = puppies.find(p => p.id === event.puppy_id);
    const eventTypeText = 
      event.type === "pee" ? "Urinieren" : 
      event.type === "poop" ? "Stuhlgang" : 
      "Beides";

    toast({
      title: "Ereignis hinzugefügt",
      description: `${eventTypeText} für ${eventPuppy?.name || "Welpe"} wurde aufgezeichnet.`,
    });
  };

  const removeEvent = async (id: string) => {
    const { error } = await supabase
      .from('events')
      .delete()
      .eq('id', id);

    if (error) {
      toast({
        title: "Fehler beim Löschen des Ereignisses",
        description: error.message,
        variant: "destructive",
      });
      return;
    }

    setEvents(events.filter(event => event.id !== id));
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
