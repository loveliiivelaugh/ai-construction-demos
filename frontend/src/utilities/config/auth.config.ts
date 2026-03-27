// Required Packages
import { createClient } from '@supabase/supabase-js';

// Direct Supabase Connection
const {
    VITE_SUPABASE_URL: supabaseUrl,
    VITE_SUPABASE_KEY: supabaseAnonKey
} = import.meta.env;

const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Export Connection's
export { supabase };
