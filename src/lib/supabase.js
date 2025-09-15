// src/lib/supabase.ts
import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://wyesjaxdykcofrykjrgp.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind5ZXNqYXhkeWtjb2ZyeWtqcmdwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc5MzIyNDMsImV4cCI6MjA3MzUwODI0M30.5-5UXknfM1x9JuCrMqjcJi-e5TSAyNITgCdmZ68NTdo";

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
