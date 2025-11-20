import { createClient } from '@supabase/supabase-js';

// Supabase configuration from environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// Create Supabase client only if config is provided
let supabase: any = null;

if (supabaseUrl && supabaseAnonKey && supabaseUrl !== '' && supabaseAnonKey !== '') {
  try {
    supabase = createClient(supabaseUrl, supabaseAnonKey);
    console.log('✅ Supabase initialized successfully');
    console.log('🔗 Supabase URL:', supabaseUrl);
    console.log('🔑 Supabase Key:', supabaseAnonKey.substring(0, 20) + '...');
    
    // Test connection immediately
    supabase.from('site_data').select('count').then(({ error }) => {
      if (error) {
        console.error('⚠️ Supabase connection test failed:', error);
      } else {
        console.log('✅ Supabase connection test passed');
      }
    });
  } catch (error) {
    console.error("❌ Supabase initialization error:", error);
  }
} else {
  console.warn('⚠️ Supabase not configured - missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY');
  console.warn('URL:', supabaseUrl || 'NOT SET');
  console.warn('Key:', supabaseAnonKey ? 'SET' : 'NOT SET');
}

// Check if Supabase is available
export const isSupabaseAvailable = () => {
  const available = supabase !== null;
  if (!available) {
    console.warn('⚠️ Supabase is not available. Check your .env file for VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY');
    console.log('Current URL:', import.meta.env.VITE_SUPABASE_URL || 'NOT SET');
    console.log('Current Key:', import.meta.env.VITE_SUPABASE_ANON_KEY ? 'SET (hidden)' : 'NOT SET');
  }
  return available;
};

// Get site data from Supabase
export const getSiteData = async () => {
  if (!supabase) {
    console.warn('⚠️ Cannot get data: Supabase client not initialized');
    return null;
  }

  try {
    console.log('📡 Fetching data from Supabase...');
    const { data, error } = await supabase
      .from('site_data')
      .select('*')
      .eq('id', 'main')
      .single();

    if (error) {
      // If document doesn't exist, return null (first time setup)
      if (error.code === 'PGRST116') {
        console.log('ℹ️ No data found in Supabase (first time setup)');
        return null;
      }
      console.error("❌ Error getting site data:", error);
      console.error("Error details:", {
        message: error.message,
        code: error.code,
        details: error.details,
        hint: error.hint
      });
      return null;
    }

    console.log('✅ Data retrieved from Supabase:', data);
    return data?.data || null;
  } catch (error: any) {
    console.error("❌ Exception getting site data:", error);
    return null;
  }
};

// Save site data to Supabase
export const saveSiteData = async (data: any) => {
  if (!supabase) {
    console.error("❌ Cannot save: Supabase client not initialized");
    console.error("Supabase URL:", import.meta.env.VITE_SUPABASE_URL || 'NOT SET');
    console.error("Supabase Key:", import.meta.env.VITE_SUPABASE_ANON_KEY ? 'SET' : 'NOT SET');
    return false;
  }

  try {
    console.log('💾 Attempting to save data to Supabase...');
    console.log('📦 Data being saved:', JSON.stringify(data, null, 2));
    console.log('🔗 Supabase URL:', import.meta.env.VITE_SUPABASE_URL);
    
    const { data: result, error } = await supabase
      .from('site_data')
      .upsert({
        id: 'main',
        data: data,
        updated_at: new Date().toISOString(),
      }, {
        onConflict: 'id'
      });

    if (error) {
      console.error("❌ Error saving site data:", error);
      console.error("Error details:", {
        message: error.message,
        code: error.code,
        details: error.details,
        hint: error.hint
      });
      return false;
    }

    console.log('✅ Data saved successfully to Supabase!');
    console.log('📊 Result:', result);
    
    // Verify the save by reading it back
    const { data: verifyData, error: verifyError } = await supabase
      .from('site_data')
      .select('*')
      .eq('id', 'main')
      .single();
    
    if (verifyError) {
      console.warn('⚠️ Could not verify save:', verifyError);
    } else {
      console.log('✅ Verified: Data in Supabase:', verifyData);
    }
    
    return true;
  } catch (error: any) {
    console.error("❌ Exception saving site data:", error);
    console.error("Exception stack:", error.stack);
    return false;
  }
};

export { supabase };

