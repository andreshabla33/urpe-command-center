import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { createServiceRoleClient } from "@/lib/supabase/service-role";
import { listMyTokens } from "@/features/api/actions";
import { ROLE_SCOPES } from "@/features/api/scopes";
import { TokenList } from "@/features/api/components/token-list";
import { CreateTokenDialog } from "@/features/api/components/create-token-dialog";

export default async function SettingsTokensPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user?.email) redirect("/login");

  const service = createServiceRoleClient();
  const { data: person } = await service
    .from("dim_person")
    .select("role")
    .eq("email", user.email)
    .single();

  const role = person?.role ?? "n/a";
  const allowedScopes = ROLE_SCOPES[role] ?? [];
  const tokens = await listMyTokens();

  return (
    <main className="flex flex-1 flex-col overflow-y-auto">
      <header className="border-b px-4 sm:px-6 pt-4 sm:pt-6 pb-3 sm:pb-4">
        <h1 className="text-base sm:text-lg font-semibold tracking-tight">
          Tokens de API
        </h1>
        <p className="mt-0.5 text-xs text-muted-foreground">
          Generá tokens para que tus scripts, bots o agentes IA puedan
          automatizar acciones en el dashboard. Cada token actúa con tus
          mismos permisos y deja audit trail completo.
        </p>
      </header>

      <section className="px-4 sm:px-6 py-5">
        <div className="mb-4 flex items-center justify-between gap-2">
          <p className="text-xs text-muted-foreground">
            {tokens.filter((t) => !t.revoked_at).length} activos ·{" "}
            {tokens.length} total
          </p>
          <CreateTokenDialog allowedScopes={allowedScopes} />
        </div>

        <TokenList tokens={tokens} />

        <div className="mt-8 rounded-md border bg-muted/20 p-4 text-xs">
          <h2 className="font-medium">Cómo usar el token</h2>
          <p className="mt-1 text-muted-foreground">
            En tu script o agente, agregá el header en cada request:
          </p>
          <pre className="mt-2 overflow-x-auto rounded bg-background p-2 font-mono text-[11px]">{`curl -H "Authorization: Bearer <tu_token>" \\
     ${typeof window === "undefined" ? "https://urpe-command-center.vercel.app" : window.location.origin}/api/v1/auth/me`}</pre>
          <p className="mt-3 text-muted-foreground">
            Documentación completa en{" "}
            <a href="/api/v1/docs" className="underline hover:text-foreground">
              /api/v1/docs
            </a>{" "}
            (OpenAPI Scalar UI).
          </p>
        </div>
      </section>
    </main>
  );
}
