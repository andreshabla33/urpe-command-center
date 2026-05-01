"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Copy, Plus, ShieldAlert } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createUserToken, type CreateTokenResult } from "../actions";
import { API_SCOPES } from "../scopes";

const EXPIRES_OPTIONS = [
  { value: 30, label: "30 días" },
  { value: 90, label: "90 días" },
  { value: 365, label: "1 año" },
  { value: 0, label: "Nunca" },
] as const;

export function CreateTokenDialog({ allowedScopes }: { allowedScopes: string[] }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [pending, startTransition] = useTransition();
  const [name, setName] = useState("");
  const [selectedScopes, setSelectedScopes] = useState<string[]>([]);
  const [expiresInDays, setExpiresInDays] = useState<number>(90);
  const [result, setResult] = useState<CreateTokenResult | null>(null);

  function reset() {
    setName("");
    setSelectedScopes([]);
    setExpiresInDays(90);
    setResult(null);
  }

  function close() {
    setOpen(false);
    setTimeout(reset, 200);
  }

  function toggleScope(scope: string) {
    setSelectedScopes((prev) =>
      prev.includes(scope) ? prev.filter((s) => s !== scope) : [...prev, scope],
    );
  }

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || selectedScopes.length === 0) return;
    startTransition(async () => {
      const res = await createUserToken({
        name: name.trim(),
        scopes: selectedScopes,
        expires_in_days: expiresInDays,
      });
      setResult(res);
      if (res.ok) router.refresh();
    });
  }

  function copyToken() {
    if (result?.ok) {
      navigator.clipboard.writeText(result.token_plaintext);
    }
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(v) => (v ? setOpen(true) : close())}
    >
      <Button onClick={() => setOpen(true)} className="gap-1.5" size="sm">
        <Plus className="h-3.5 w-3.5" />
        Nuevo token
      </Button>

      <DialogContent className="sm:max-w-md">
        {result?.ok ? (
          <>
            <DialogHeader>
              <DialogTitle>Token creado</DialogTitle>
              <DialogDescription className="flex items-start gap-2 text-xs">
                <ShieldAlert className="mt-0.5 h-3.5 w-3.5 shrink-0 text-destructive" />
                Copialo ahora. No vas a poder verlo de nuevo después de cerrar
                este diálogo. Pegalo en la configuración de tu agente o
                script.
              </DialogDescription>
            </DialogHeader>

            <div className="rounded-md border bg-muted/30 p-3">
              <p className="font-mono text-[11px] break-all">
                {result.token_plaintext}
              </p>
            </div>

            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={copyToken}
              className="gap-1.5"
            >
              <Copy className="h-3 w-3" />
              Copiar al portapapeles
            </Button>

            <p className="text-[10px] text-muted-foreground">
              Hash prefix: {result.token.hash_prefix}…
            </p>

            <DialogFooter>
              <Button onClick={close}>Cerrar</Button>
            </DialogFooter>
          </>
        ) : (
          <form onSubmit={onSubmit}>
            <DialogHeader>
              <DialogTitle>Crear nuevo token</DialogTitle>
              <DialogDescription className="text-xs">
                El token actuará con tus mismos permisos. Solo lo verás una
                vez.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-3 py-3">
              <div>
                <Label htmlFor="name" className="text-xs">
                  Nombre (descriptivo)
                </Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ej. Rocky bot, sync N18, mi script de triage"
                  required
                  maxLength={100}
                />
              </div>

              <div>
                <Label className="text-xs">Scopes</Label>
                <div className="mt-1 space-y-1.5 rounded-md border p-2">
                  {API_SCOPES.map((scope) => {
                    const allowed = allowedScopes.includes(scope);
                    return (
                      <label
                        key={scope}
                        className={
                          "flex items-center gap-2 text-xs " +
                          (allowed ? "" : "opacity-40")
                        }
                      >
                        <input
                          type="checkbox"
                          checked={selectedScopes.includes(scope)}
                          onChange={() => toggleScope(scope)}
                          disabled={!allowed}
                        />
                        <span className="font-mono">{scope}</span>
                        {!allowed && (
                          <span className="ml-auto text-[10px] text-muted-foreground">
                            tu rol no permite
                          </span>
                        )}
                      </label>
                    );
                  })}
                </div>
              </div>

              <div>
                <Label className="text-xs">Expira</Label>
                <div className="mt-1 flex flex-wrap gap-1">
                  {EXPIRES_OPTIONS.map((opt) => (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => setExpiresInDays(opt.value)}
                      className={
                        "rounded border px-2 py-1 text-xs transition-colors " +
                        (expiresInDays === opt.value
                          ? "bg-primary text-primary-foreground border-primary"
                          : "hover:bg-muted")
                      }
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              {result && !result.ok && (
                <p className="text-xs text-destructive">
                  Error: {result.error}
                </p>
              )}
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={close}
                disabled={pending}
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                disabled={
                  pending || !name.trim() || selectedScopes.length === 0
                }
              >
                {pending ? "Creando…" : "Crear token"}
              </Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
