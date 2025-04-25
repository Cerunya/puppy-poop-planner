
export interface Puppy {
  id: string;
  name: string;
  breed: string;
  birthdate: string;
  image?: string;
}

export type EventType = 'pee' | 'poop' | 'both';

export interface PuppyEvent {
  id: string;
  puppyId: string;
  type: EventType;
  timestamp: string;
  notes?: string;
}
