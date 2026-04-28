import "server-only";
import { createClient } from "@/lib/supabase/server";

export async function isCalendarConnected(email: string): Promise<boolean> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("dim_person_integration")
    .select("email")
    .eq("email", email)
    .eq("provider", "calendar")
    .maybeSingle();
  return !!data;
}
