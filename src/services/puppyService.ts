
import { supabase } from "@/integrations/supabase/client";
import { Puppy, PuppyEvent, EventType } from "@/types";

export const fetchPuppies = async () => {
  const { data, error } = await supabase
    .from('puppies')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
};

export const fetchEvents = async () => {
  const { data, error } = await supabase
    .from('events')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data.map(event => ({
    ...event,
    type: event.type as EventType
  }));
};

export const createPuppy = async (puppy: Omit<Puppy, "id" | "user_id" | "created_at" | "updated_at">) => {
  const { data: session } = await supabase.auth.getSession();
  if (!session?.user) throw new Error("Not authenticated");

  const { data, error } = await supabase
    .from('puppies')
    .insert([{ ...puppy, user_id: session.user.id }])
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const updatePuppy = async (id: string, puppy: Partial<Puppy>) => {
  const { data, error } = await supabase
    .from('puppies')
    .update(puppy)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const deletePuppy = async (id: string) => {
  const { error } = await supabase
    .from('puppies')
    .delete()
    .eq('id', id);

  if (error) throw error;
};

export const createEvent = async (event: Omit<PuppyEvent, "id" | "created_at">) => {
  const { data, error } = await supabase
    .from('events')
    .insert([event])
    .select()
    .single();

  if (error) throw error;
  return { ...data, type: data.type as EventType };
};

export const deleteEvent = async (id: string) => {
  const { error } = await supabase
    .from('events')
    .delete()
    .eq('id', id);

  if (error) throw error;
};
