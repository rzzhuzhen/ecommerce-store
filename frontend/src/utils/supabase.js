import { createBrowserClient } from '@supabase/ssr';

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseKey = process.env.REACT_APP_SUPABASE_ANON_KEY;

export const createClient = () =>
  createBrowserClient(supabaseUrl, supabaseKey);