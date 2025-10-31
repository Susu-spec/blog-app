/**
 * @fileoverview Initializes and exports the Supabase client.
 * Uses public (anon) key for browser-side authentication.
 */

import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

/** @type {import('@supabase/supabase-js').SupabaseClient} */
export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
