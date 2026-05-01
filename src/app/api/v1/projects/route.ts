import { withApi } from "@/features/api/with-api";
import { ok, serverError } from "@/features/api/responses";
import { createServiceRoleClient } from "@/lib/supabase/service-role";

export const GET = withApi(
  { scopes: ["projects.read"] },
  async ({ token }) => {
    const supabase = createServiceRoleClient();
    const { data, error } = await supabase
      .from("dim_project")
      .select("id, name, parent_id, color")
      .order("id");
    if (error) return serverError(error.message);
    return ok({ data: data ?? [] }, token);
  },
);
