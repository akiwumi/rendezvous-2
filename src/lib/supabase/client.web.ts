import 'react-native-url-polyfill/auto';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || '';

// Validate environment variables
if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('⚠️  Supabase credentials not configured!');
  console.warn('Create a .env file with:');
  console.warn('EXPO_PUBLIC_SUPABASE_URL=your-url');
  console.warn('EXPO_PUBLIC_SUPABASE_ANON_KEY=your-key');
  console.warn('\nThe app will run but authentication features will not work.');
}

// Web-compatible storage using browser localStorage
const webStorage = {
  getItem: (key: string) => {
    if (typeof window === 'undefined') return null;
    return window.localStorage.getItem(key);
  },
  setItem: (key: string, value: string) => {
    if (typeof window === 'undefined') return;
    window.localStorage.setItem(key, value);
  },
  removeItem: (key: string) => {
    if (typeof window === 'undefined') return;
    window.localStorage.removeItem(key);
  },
};

// Create client with web-compatible storage
export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseAnonKey || 'placeholder-key',
  {
    auth: {
      storage: webStorage,
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true, // Enable for web (handles OAuth callbacks)
    },
  }
);
