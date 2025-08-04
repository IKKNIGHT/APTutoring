import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://tutoring.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'your-anon-key-from-tutoring-project';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database types based on the schema
export interface Class {
  id: number;
  name: string;
  meet_link: string;
  category?: string;
  created_at?: string;
}

export interface Event {
  id: number;
  class_id: number;
  datetime: string;
  description: string;
  created_at?: string;
  class?: Class;
}

export interface RSVP {
  id: number;
  event_id: number;
  name: string;
  email: string;
  created_at: string;
  event?: Event;
}
