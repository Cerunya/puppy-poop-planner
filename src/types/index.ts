
export interface Puppy {
  id: string;
  user_id: string;
  name: string;
  breed: string;
  birthdate: string;
  image_url?: string;
  created_at: string;
  updated_at: string;
}

export type EventType = 'pee' | 'poop' | 'both';

export interface PuppyEvent {
  id: string;
  puppy_id: string;
  type: EventType;
  notes?: string;
  image_url?: string;
  created_at: string;
}

export interface Profile {
  id: string;
  created_at: string;
  updated_at: string;
}
