import { createClient } from "@supabase/supabase-js";

const supabaseUrl =
  import.meta.env.VITE_SUPABASE_URL ||
  "https://xwcvucpsixuzdiuxcndl.supabase.co";
const supabaseAnonKey =
  import.meta.env.VITE_SUPABASE_ANON_KEY ||
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh3Y3Z1Y3BzaXh1emRpdXhjbmRsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQzMzc2NDAsImV4cCI6MjA2OTkxMzY0MH0.VfiATwNXZu4mmoMz8A3mmvXY7D5TV7DpLaNgG-ph8QY";

// Validate environment variables
if (!supabaseUrl || !supabaseAnonKey) {
  console.error("Missing Supabase environment variables");
}

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
