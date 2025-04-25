
import { useState, useCallback } from 'react';
import { Puppy, PuppyEvent } from '@/types';
import { useToast } from '@/hooks/use-toast';
import * as puppyService from '@/services/puppyService';

export const usePuppyState = () => {
  const [puppies, setPuppies] = useState<Puppy[]>([]);
  const [events, setEvents] = useState<PuppyEvent[]>([]);
  const [selectedPuppyId, setSelectedPuppyId] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchPuppyData = useCallback(async () => {
    try {
      const [puppiesData, eventsData] = await Promise.all([
        puppyService.fetchPuppies(),
        puppyService.fetchEvents(),
      ]);

      setPuppies(puppiesData);
      setEvents(eventsData);
      
      if (puppiesData.length > 0 && !selectedPuppyId) {
        setSelectedPuppyId(puppiesData[0].id);
      }
    } catch (error) {
      toast({
        title: "Fehler beim Laden",
        description: error instanceof Error ? error.message : "Unbekannter Fehler",
        variant: "destructive",
      });
    }
  }, [selectedPuppyId, toast]);

  return {
    puppies,
    events,
    selectedPuppyId,
    setSelectedPuppyId,
    setPuppies,
    setEvents,
    fetchPuppyData,
  };
};
