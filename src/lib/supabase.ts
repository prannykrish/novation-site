// src/lib/supabase.ts
import { createClient } from '@supabase/supabase-js';
import { createClientComponentClient, createServerComponentClient } from '@supabase/auth-helpers-nextjs';
// Import cookies dynamically to avoid errors in client components
import type { cookies } from 'next/headers';
import { Database } from '../types/database';

// Base Supabase URL and key
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Validate environment variables
if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase environment variables. Please check your .env file.');
}

// Cache for singleton instances
let browserClientInstance: ReturnType<typeof createClientComponentClient<Database>> | null = null;

/**
 * Creates a Supabase client for browser/client components
 * Uses Next.js's createClientComponentClient with proper caching
 */
export function createBrowserSupabaseClient() {
  if (typeof window === 'undefined') {
    console.warn('Attempted to use browser client in server context, creating an ephemeral client');
    // For SSR, return a non-cached client
    return createClient<Database>(supabaseUrl || '', supabaseAnonKey || '', {
      auth: {
        persistSession: false,
        autoRefreshToken: false
      }
    });
  }
  
  // For client-side, use cached instance for better performance
  if (!browserClientInstance) {
    try {
      if (!supabaseUrl || !supabaseAnonKey) {
        throw new Error('Missing Supabase environment variables');
      }
      browserClientInstance = createClientComponentClient<Database>({
        supabaseUrl,
        supabaseKey: supabaseAnonKey,
      });
    } catch (error) {
      console.error('Failed to create Supabase client:', error);
      throw error;
    }
  }
  
  return browserClientInstance;
}

/**
 * Creates a Supabase client for server components
 * Uses Next.js's createServerComponentClient with cookies
 */
export function createServerSupabaseClient() {
  if (typeof window !== 'undefined') {
    console.warn('Attempted to use server client in browser context, using browser client instead');
    return createBrowserSupabaseClient();
  }
  
  try {
    // Dynamically import cookies to avoid errors in client components
    const { cookies } = require('next/headers');
    // Don't cache server client - needs fresh cookies each time
    return createServerComponentClient<Database>({ cookies });
  } catch (error) {
    console.error('Error creating server client:', error);
    // Fallback to regular client with server-appropriate settings
    return createClient<Database>(supabaseUrl || '', supabaseAnonKey || '', {
      auth: {
        persistSession: false,
        autoRefreshToken: false
      }
    });
  }
}

/**
 * Auto-detects environment and returns appropriate client
 * Use this as the main entry point for getting a Supabase client
 */
export function getSupabase() {
  const isServer = typeof window === 'undefined';
  return isServer ? createServerSupabaseClient() : createBrowserSupabaseClient();
}

/**
 * Helper function to safely execute Supabase operations with proper error handling
 */
export async function safeSupabaseOperation<T>(
  operation: () => Promise<T>,
  errorMessage: string = 'Database operation failed'
): Promise<T | null> {
  try {
    const result = await operation();
    return result;
  } catch (error) {
    console.error(`${errorMessage}:`, error);
    return null;
  }
}

// Singleton export - main recommended way to access Supabase
export const supabase = getSupabase();