import { supabase, Class, Event, RSVP } from './supabase';

// Classes API
export const classesApi = {
  // Get all classes
  async getAll(): Promise<Class[]> {
    const { data, error } = await supabase
      .from('classes')
      .select('*')
      .order('name');
    
    if (error) throw error;
    return data || [];
  },

  // Get class by ID
  async getById(id: number): Promise<Class | null> {
    const { data, error } = await supabase
      .from('classes')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) {
      if (error.code === 'PGRST116') return null; // Not found
      throw error;
    }
    return data;
  }
};

// Events API
export const eventsApi = {
  // Get all events for a class
  async getByClassId(classId: number): Promise<Event[]> {
    const { data, error } = await supabase
      .from('events')
      .select(`
        *,
        class:classes(*)
      `)
      .eq('class_id', classId)
      .order('datetime');
    
    if (error) throw error;
    return data || [];
  },

  // Get upcoming events for a class
  async getUpcomingByClassId(classId: number): Promise<Event[]> {
    // Get current time in UTC
    const now = new Date();
    const utcNow = new Date(now.getTime() - (now.getTimezoneOffset() * 60000)).toISOString();

    console.log('Fetching events for class:', classId, 'after:', utcNow);

    const { data, error } = await supabase
      .from('events')
      .select(`
        *,
        class:classes(*)
      `)
      .eq('class_id', classId)
      .gte('datetime', utcNow)
      .order('datetime');

    if (error) {
      console.error('Error fetching events for class', classId, error);
      throw error;
    }

    console.log('Found events:', data);
    return data || [];
  },

  // Get event by ID
  async getById(id: number): Promise<Event | null> {
    const { data, error } = await supabase
      .from('events')
      .select(`
        *,
        class:classes(*)
      `)
      .eq('id', id)
      .single();
    
    if (error) {
      if (error.code === 'PGRST116') return null; // Not found
      throw error;
    }
    return data;
  }
};

// RSVPs API
export const rsvpsApi = {
  // Create new RSVP
  async create(eventId: number, name: string, email: string): Promise<RSVP> {
    const { data, error } = await supabase
      .from('rsvps')
      .insert({
        event_id: eventId,
        name: name,
        email: email
      })
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  // Check if user already RSVP'd for an event
  async checkExisting(eventId: number, email: string): Promise<boolean> {
    const { data, error } = await supabase
      .from('rsvps')
      .select('id')
      .eq('event_id', eventId)
      .eq('email', email)
      .single();
    
    if (error && error.code !== 'PGRST116') throw error;
    return !!data;
  },

  // Get RSVPs for an event
  async getByEventId(eventId: number): Promise<RSVP[]> {
    const { data, error } = await supabase
      .from('rsvps')
      .select(`
        *,
        event:events(
          *,
          class:classes(*)
        )
      `)
      .eq('event_id', eventId)
      .order('created_at');
    
    if (error) throw error;
    return data || [];
  },

  // Get RSVPs by email (for user's RSVP history)
  async getByEmail(email: string): Promise<RSVP[]> {
    const { data, error } = await supabase
      .from('rsvps')
      .select(`
        *,
        event:events(
          *,
          class:classes(*)
        )
      `)
      .eq('email', email)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data || [];
  }
};

// Database initialization and seeding
export const databaseSetup = {
  // Create the database schema
  createTables() {
    // This would typically be done via Supabase SQL editor or migrations
    // Including here for reference of the schema structure
    return `
      -- Classes table
      CREATE TABLE IF NOT EXISTS classes (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL UNIQUE,
        meet_link TEXT NOT NULL,
        category TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );

      -- Events table
      CREATE TABLE IF NOT EXISTS events (
        id SERIAL PRIMARY KEY,
        class_id INTEGER REFERENCES classes(id) ON DELETE CASCADE,
        datetime TIMESTAMP WITH TIME ZONE NOT NULL,
        description TEXT NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );

      -- RSVPs table
      CREATE TABLE IF NOT EXISTS rsvps (
        id SERIAL PRIMARY KEY,
        event_id INTEGER REFERENCES events(id) ON DELETE CASCADE,
        name TEXT NOT NULL,
        email TEXT NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        UNIQUE(event_id, email)
      );

      -- Indexes for performance
      CREATE INDEX IF NOT EXISTS idx_events_class_id ON events(class_id);
      CREATE INDEX IF NOT EXISTS idx_events_datetime ON events(datetime);
      CREATE INDEX IF NOT EXISTS idx_rsvps_event_id ON rsvps(event_id);
      CREATE INDEX IF NOT EXISTS idx_rsvps_email ON rsvps(email);
    `;
  },

  // Seed initial AP classes data
  async seedClasses() {
    const apClasses = [
      { id: 1, name: 'AP Calculus AB', meet_link: 'https://meet.google.com/calc-ab-tutoring', category: 'Mathematics' },
      { id: 2, name: 'AP Calculus BC', meet_link: 'https://meet.google.com/calc-bc-tutoring', category: 'Mathematics' },
      { id: 3, name: 'AP Statistics', meet_link: 'https://meet.google.com/stats-tutoring', category: 'Mathematics' },
      { id: 4, name: 'AP Physics 1', meet_link: 'https://meet.google.com/physics1-tutoring', category: 'Science' },
      { id: 5, name: 'AP Physics 2', meet_link: 'https://meet.google.com/physics2-tutoring', category: 'Science' },
      { id: 6, name: 'AP Physics C: Mechanics', meet_link: 'https://meet.google.com/physics-c-mech', category: 'Science' },
      { id: 7, name: 'AP Physics C: Electricity and Magnetism', meet_link: 'https://meet.google.com/physics-c-em', category: 'Science' },
      { id: 8, name: 'AP Chemistry', meet_link: 'https://meet.google.com/chemistry-tutoring', category: 'Science' },
      { id: 9, name: 'AP Biology', meet_link: 'https://meet.google.com/biology-tutoring', category: 'Science' },
      { id: 10, name: 'AP Environmental Science', meet_link: 'https://meet.google.com/env-science', category: 'Science' },
      { id: 11, name: 'AP Computer Science A', meet_link: 'https://meet.google.com/cs-a-tutoring', category: 'Computer Science' },
      { id: 12, name: 'AP Computer Science Principles', meet_link: 'https://meet.google.com/cs-principles', category: 'Computer Science' },
      { id: 13, name: 'AP English Language and Composition', meet_link: 'https://meet.google.com/eng-lang', category: 'English' },
      { id: 14, name: 'AP English Literature and Composition', meet_link: 'https://meet.google.com/eng-lit', category: 'English' },
      { id: 15, name: 'AP United States History', meet_link: 'https://meet.google.com/us-history', category: 'History' },
      { id: 16, name: 'AP World History: Modern', meet_link: 'https://meet.google.com/world-history', category: 'History' },
      { id: 17, name: 'AP European History', meet_link: 'https://meet.google.com/euro-history', category: 'History' },
      { id: 18, name: 'AP Art History', meet_link: 'https://meet.google.com/art-history', category: 'Arts' },
      { id: 19, name: 'AP Music Theory', meet_link: 'https://meet.google.com/music-theory', category: 'Arts' },
      { id: 20, name: 'AP Studio Art: Drawing', meet_link: 'https://meet.google.com/art-drawing', category: 'Arts' },
      { id: 21, name: 'AP Studio Art: 2-D Design', meet_link: 'https://meet.google.com/art-2d', category: 'Arts' },
      { id: 22, name: 'AP Studio Art: 3-D Design', meet_link: 'https://meet.google.com/art-3d', category: 'Arts' },
      { id: 23, name: 'AP Spanish Language and Culture', meet_link: 'https://meet.google.com/spanish-lang', category: 'World Languages' },
      { id: 24, name: 'AP Spanish Literature and Culture', meet_link: 'https://meet.google.com/spanish-lit', category: 'World Languages' },
      { id: 25, name: 'AP French Language and Culture', meet_link: 'https://meet.google.com/french-lang', category: 'World Languages' },
      { id: 26, name: 'AP German Language and Culture', meet_link: 'https://meet.google.com/german-lang', category: 'World Languages' },
      { id: 27, name: 'AP Italian Language and Culture', meet_link: 'https://meet.google.com/italian-lang', category: 'World Languages' },
      { id: 28, name: 'AP Chinese Language and Culture', meet_link: 'https://meet.google.com/chinese-lang', category: 'World Languages' },
      { id: 29, name: 'AP Japanese Language and Culture', meet_link: 'https://meet.google.com/japanese-lang', category: 'World Languages' },
      { id: 30, name: 'AP Latin', meet_link: 'https://meet.google.com/latin-tutoring', category: 'World Languages' },
      { id: 31, name: 'AP Psychology', meet_link: 'https://meet.google.com/psychology', category: 'Social Sciences' },
      { id: 32, name: 'AP Human Geography', meet_link: 'https://meet.google.com/human-geo', category: 'Social Sciences' },
      { id: 33, name: 'AP Macroeconomics', meet_link: 'https://meet.google.com/macro-econ', category: 'Social Sciences' },
      { id: 34, name: 'AP Microeconomics', meet_link: 'https://meet.google.com/micro-econ', category: 'Social Sciences' },
      { id: 35, name: 'AP United States Government and Politics', meet_link: 'https://meet.google.com/us-gov', category: 'Social Sciences' },
      { id: 36, name: 'AP Comparative Government and Politics', meet_link: 'https://meet.google.com/comp-gov', category: 'Social Sciences' },
      { id: 37, name: 'AP Seminar', meet_link: 'https://meet.google.com/ap-seminar', category: 'AP Capstone' },
      { id: 38, name: 'AP Research', meet_link: 'https://meet.google.com/ap-research', category: 'AP Capstone' },
      { id: 39, name: 'AP Precalculus', meet_link: 'https://meet.google.com/precalc', category: 'Mathematics' },
      { id: 40, name: 'AP African American Studies', meet_link: 'https://meet.google.com/african-am-studies', category: 'Social Sciences' }
    ];

    const { data, error } = await supabase
      .from('classes')
      .upsert(apClasses, { onConflict: 'name' })
      .select();
    
    if (error) throw error;
    return data;
  },

  // Seed sample events
  async seedSampleEvents() {
    const sampleEvents = [
      {
        class_id: 1,
        datetime: '2025-01-15T17:00:00Z',
        description: 'Calculus AB Unit 1: Limits and Continuity Review'
      },
      {
        class_id: 1,
        datetime: '2025-01-22T17:00:00Z',
        description: 'Calculus AB Unit 2: Derivatives Practice'
      },
      {
        class_id: 4,
        datetime: '2025-01-16T18:00:00Z',
        description: 'Physics 1: Kinematics Problem Solving'
      },
      {
        class_id: 8,
        datetime: '2025-01-17T19:00:00Z',
        description: 'Chemistry: Stoichiometry and Chemical Equations'
      },
      {
        class_id: 15,
        datetime: '2025-01-18T16:00:00Z',
        description: 'US History: Constitutional Convention and Early Republic'
      }
    ];

    const { data, error } = await supabase
      .from('events')
      .upsert(sampleEvents)
      .select();

    if (error) throw error;
    return data;
  }
};
