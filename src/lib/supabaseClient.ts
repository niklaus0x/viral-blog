import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/integrations/supabase/types";

let client: ReturnType<typeof createClient<Database>> | null = null;

export const getSupabase = () => {
  if (client) return client;

  const projectId = import.meta.env.VITE_SUPABASE_PROJECT_ID as string | undefined;
  const url = (import.meta.env.VITE_SUPABASE_URL as string | undefined) ||
    (projectId ? `https://${projectId}.supabase.co` : undefined);
  const key = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY as string | undefined;

  if (!url || !key) {
    throw new Error(
      "Supabase URL or key missing. Ensure VITE_SUPABASE_URL (or VITE_SUPABASE_PROJECT_ID) and VITE_SUPABASE_PUBLISHABLE_KEY are set."
    );
  }

  client = createClient<Database>(url, key, {
    auth: {
      storage: localStorage,
      persistSession: true,
      autoRefreshToken: true,
    },
  });

  return client;
};
