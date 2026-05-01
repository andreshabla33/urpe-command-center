import { withApi } from "@/features/api/with-api";
import { ok, serverError } from "@/features/api/responses";
import { createServiceRoleClient } from "@/lib/supabase/service-role";

export const GET = withApi(
  { scopes: ["persons.read"] },
  async ({ request, token }) => {
    const activeOnly =
      request.nextUrl.searchParams.get("active") !== "false";

    const supabase = createServiceRoleClient();
    let q = supabase
      .from("dim_person")
      .select("email, full_name, role, is_active, agent_id")
      .order("full_name", { nullsFirst: false });
    if (activeOnly) q = q.eq("is_active", true);

    const { data, error } = await q;
    if (error) return serverError(error.message);
    return ok({ data: data ?? [] }, token);
  },
);
