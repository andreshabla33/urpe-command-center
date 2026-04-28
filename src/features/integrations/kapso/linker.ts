import "server-only";
import { createServiceRoleClient } from "@/lib/supabase/service-role";
import { normalizePhone, phoneSuffix } from "@/lib/phone/normalize";

const TASK_ID_REGEX = /\b([A-Z]{2,}(?:-[A-Z0-9]+){2,})\b/;

export async function resolveOwnerByPhone(
  rawPhone: string | null | undefined,
): Promise<string | null> {
  if (!rawPhone) return null;
  const norm = normalizePhone(rawPhone);
  if (norm.length < 7) return null;

  const supabase = createServiceRoleClient();

  const { data: exact } = await supabase
    .from("wp_team_humano")
    .select("email")
    .eq("telefono", norm)
    .in("empresa_id", [4, 13])
    .not("email", "is", null)
    .limit(1)
    .maybeSingle();
  if (exact?.email) return await ensureDimPersonEmail(exact.email);

  const suffix = phoneSuffix(norm, 10);
  const { data: bySuffix } = await supabase
    .from("wp_team_humano")
    .select("email, telefono")
    .ilike("telefono", `%${suffix}`)
    .in("empresa_id", [4, 13])
    .not("email", "is", null)
    .limit(1)
    .maybeSingle();
  if (bySuffix?.email) return await ensureDimPersonEmail(bySuffix.email);

  return null;
}

async function ensureDimPersonEmail(rawEmail: string): Promise<string | null> {
  const supabase = createServiceRoleClient();
  const email = rawEmail.toLowerCase().trim();
  const { data } = await supabase
    .from("dim_person")
    .select("email")
    .eq("email", email)
    .maybeSingle();
  return data?.email ?? null;
}

export async function resolveTaskFromText(
  text: string | null | undefined,
): Promise<string | null> {
  if (!text) return null;
  const match = TASK_ID_REGEX.exec(text)?.[1];
  if (!match) return null;
  const supabase = createServiceRoleClient();
  const { data } = await supabase
    .from("dim_task")
    .select("id")
    .eq("id", match)
    .maybeSingle();
  return data?.id ?? null;
}
