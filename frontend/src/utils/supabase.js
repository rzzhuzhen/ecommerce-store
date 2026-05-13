import { createBrowserClient } from '@supabase/ssr';

const supabaseUrl = import.meta.env.REACT_APP_SUPABASE_URL;
const supabaseKey = import.meta.env.REACT_APP_SUPABASE_ANON_KEY;

export const createClient = () =>
  createBrowserClient(supabaseUrl, supabaseKey);