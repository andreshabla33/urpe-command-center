"use server";

import { createClient } from "@/lib/supabase/server";

export type PaletteTask = {
  id: string;
  title: string;
  status: string;
  owner_email: string | null;
};

export type PalettePerson = {
  email: string;
  full_name: string | null;
};

export async function listTasksForPalette(): Promise<PaletteTask[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("mv_task_current_state")
    .select("id, title, status, owner_email")
    .order("created_at", { ascending: false, nullsFirst: false })
    .limit(200);
  return (data ?? []).filter(
    (t): t is PaletteTask =>
      t.id != null && t.title != null && t.status != null,
  );
}

export async function listActivePersons(): Promise<PalettePerson[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("dim_person")
    .select("email, full_name")
    .eq("is_active", true)
    .order("full_name");
  return data ?? [];
}
