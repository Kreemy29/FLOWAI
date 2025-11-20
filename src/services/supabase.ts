import { createClient } from '@supabase/supabase-js';

// Supabase configuration from environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// Create Supabase client only if config is provided
let supabase: any = null;

if (supabaseUrl && supabaseAnonKey && supabaseUrl !== '' && supabaseAnonKey !== '') {
  try {
    supabase = createClient(supabaseUrl, supabaseAnonKey);
  } catch (error) {
    console.error("Supabase initialization error:", error);
  }
}

// Check if Supabase is available
export const isSupabaseAvailable = () => {
  return supabase !== null;
};

// Get site data from Supabase
export const getSiteData = async () => {
  if (!supabase) {
    return null;
  }

  try {
    const { data, error } = await supabase
      .from('site_data')
      .select('*')
      .eq('id', 'main')
      .single();

    if (error) {
      // If document doesn't exist, return null (first time setup)
      if (error.code === 'PGRST116') {
        return null;
      }
      console.error("Error getting site data:", error);
      return null;
    }

    return data?.data || null;
  } catch (error) {
    console.error("Error getting site data:", error);
    return null;
  }
};

// Save site data to Supabase
export const saveSiteData = async (data: any) => {
  if (!supabase) {
    return false;
  }

  try {
    const { error } = await supabase
      .from('site_data')
      .upsert({
        id: 'main',
        data: data,
        updated_at: new Date().toISOString(),
      });

    if (error) {
      console.error("Error saving site data:", error);
      return false;
    }

    return true;
  } catch (error) {
    console.error("Error saving site data:", error);
    return false;
  }
};

export { supabase };

