import { createClient } from "@supabase/supabase-js";
import { env } from "./env";

// Cliente SOLO para el backend (usa la service role key, nunca en la app móvil)
export const supabase = createClient(env.supabaseUrl, env.supabaseServiceKey, {
  auth: { persistSession: false, autoRefreshToken: false },
});
