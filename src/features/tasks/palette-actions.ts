"use server";

import { createClient } from "@/lib/supabase/server";

export type PaletteTask = {
  id: string;
  title: string;
  status: string;
  owner_email: string | null;
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
