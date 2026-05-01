"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";
import { revokeUserTokenByPrefix } from "../actions";
import type { ListTokensRow } from "../actions";

export function TokenList({ tokens }: { tokens: ListTokensRow[] }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  if (tokens.length === 0) {
    return (
      <div className="rounded-md border border-dashed bg-muted/20 px-4 py-12 text-center">
        <p className="text-sm text-muted-foreground">
          Aún no tenés tokens. Creá uno con el botón de arriba.
        </p>
      </div>
    );
  }

  function onRevoke(hashPrefix: string, name: string) {
    if (
      !confirm(
        `Revocar el token "${name}"? Cualquier script/agente que lo use va a perder acceso inmediatamente.`,
      )
    )
      return;
    startTransition(async () => {
      const res = await revokeUserTokenByPrefix(hashPrefix);
      if (res.ok) router.refresh();
      else alert(`Error: ${res.error}`);
    });
  }

  return (
    <ul className="space-y-3">
      {tokens.map((t) => {
        const expired = t.expires_at && new Date(t.expires_at) < new Date();
        const revoked = !!t.revoked_at;
        const inactive = revoked || expired;
        return (
          <li
            key={t.hash_prefix}
            className={
              "rounded-md border bg-card p-4 " +
              (inactive ? "opacity-60" : "")
            }
          >
            <div className="flex flex-wrap items-start justify-between gap-2">
              <div className="min-w-0 flex-1">
                <p className="font-medium text-sm">
                  {t.name}
                  {revoked && (
                    <span className="ml-2 rounded bg-destructive/10 px-1.5 py-0.5 font-mono text-[9px] text-destructive">
                      revoked
                    </span>
                  )}
                  {expired && !revoked && (
                    <span className="ml-2 rounded bg-muted px-1.5 py-0.5 font-mono text-[9px] text-muted-foreground">
                      expired
                    </span>
                  )}
                </p>
                <p className="mt-0.5 font-mono text-[10px] text-muted-foreground">
                  hash: {t.hash_prefix}…
                </p>
              </div>
              {!inactive && (
                <button
                  type="button"
                  onClick={() => onRevoke(t.hash_prefix, t.name)}
                  disabled={pending}
                  className="inline-flex items-center gap-1 rounded text-[11px] text-muted-foreground hover:text-destructive"
                  aria-label={`Revocar ${t.name}`}
                >
                  <Trash2 className="h-3 w-3" />
                  Revocar
                </button>
              )}
            </div>

            <div className="mt-2 flex flex-wrap gap-1">
              {t.scopes.map((s) => (
                <span
                  key={s}
                  className="rounded bg-muted/60 px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground"
                >
                  {s}
                </span>
              ))}
            </div>

            <div className="mt-2 flex flex-wrap gap-x-3 gap-y-0.5 text-[10px] text-muted-foreground">
              <span>Creado: {new Date(t.created_at).toLocaleDateString()}</span>
              <span>
                Último uso:{" "}
                {t.last_used_at
                  ? new Date(t.last_used_at).toLocaleString()
                  : "nunca"}
              </span>
              {t.expires_at && (
                <span>
                  Expira: {new Date(t.expires_at).toLocaleDateString()}
                </span>
              )}
              {!t.expires_at && <span>Expira: nunca</span>}
            </div>
          </li>
        );
      })}
    </ul>
  );
}
