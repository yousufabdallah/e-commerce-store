import { createClient } from '@supabase/supabase-js';

// These environment variables need to be set in a .env.local file
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://example.supabase.co';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV4YW1wbGUiLCJyb2xlIjoiYW5vbiIsImlhdCI6MTYxNjQyMjU0MCwiZXhwIjoxOTMyMDg0NTQwfQ.example';

// Create a Supabase client
export const supabase = createClient(supabaseUrl, supabaseKey);

// Mock functions for development without Supabase
export const mockSupabase = {
  from: (table: string) => ({
    select: (query?: string) => ({
      eq: (column: string, value: any) => ({
        single: () => Promise.resolve({ data: null, error: null }),
        limit: (limit: number) => Promise.resolve({ data: [], error: null }),
        order: (column: string, { ascending }: { ascending: boolean }) => Promise.resolve({ data: [], error: null }),
      }),
      limit: (limit: number) => Promise.resolve({ data: [], error: null }),
      order: (column: string, { ascending }: { ascending: boolean }) => Promise.resolve({ data: [], error: null }),
    }),
    insert: (data: any) => Promise.resolve({ data: null, error: null }),
    update: (data: any) => ({
      eq: (column: string, value: any) => Promise.resolve({ data: null, error: null }),
    }),
    delete: () => ({
      eq: (column: string, value: any) => Promise.resolve({ data: null, error: null }),
    }),
    lt: (column: string, value: any) => Promise.resolve({ data: [], error: null }),
  }),
  auth: {
    signInWithPassword: (credentials: { email: string; password: string }) => Promise.resolve({ data: null, error: null }),
    signUp: (credentials: { email: string; password: string; options?: any }) => Promise.resolve({ data: null, error: null }),
  },
};

// Use the mock if Supabase URL is not set
export const db = supabaseUrl === 'https://example.supabase.co' ? mockSupabase : supabase;
