import "server-only";
import { createClient } from "@/lib/supabase/server";
import type { Database } from "@/lib/supabase/database.types";

export type EmailRow = Database["public"]["Tables"]["fact_email"]["Row"];

export async function getTaskEmails(taskId: string): Promise<EmailRow[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("fact_email")
    .select("*")
    .eq("task_id", taskId)
    .order("sent_at", { ascending: true });
  if (error) throw error;
  return data ?? [];
}

export async function isGmailConnected(email: string): Promise<boolean> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("dim_person_integration")
    .select("email")
    .eq("email", email)
    .eq("provider", "gmail")
    .maybeSingle();
  return !!data;
}
