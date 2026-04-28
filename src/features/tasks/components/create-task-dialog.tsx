"use client";

import { useEffect, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TASK_PRIORITY } from "../types";
import { createTask } from "../actions";
import {
  listActivePersons,
  type PalettePerson,
} from "../palette-actions";

export const CREATE_TASK_EVENT = "urpe:create-task-open";

export function CreateTaskDialog() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [persons, setPersons] = useState<PalettePerson[] | null>(null);
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const [id, setId] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [ownerEmail, setOwnerEmail] = useState("");
  const [priority, setPriority] = useState<string>("p2");
  const [projectId, setProjectId] = useState("");
  const [dueDate, setDueDate] = useState("");

  useEffect(() => {
    function handler() {
      setOpen(true);
    }
    window.addEventListener(CREATE_TASK_EVENT, handler);
    return () => window.removeEventListener(CREATE_TASK_EVENT, handler);
  }, []);

  useEffect(() => {
    if (open && persons === null) {
      listActivePersons().then(setPersons);
    }
  }, [open, persons]);

  function reset() {
    setId("");
    setTitle("");
    setDescription("");
    setOwnerEmail("");
    setPriority("p2");
    setProjectId("");
    setDueDate("");
    setError(null);
  }

  function onClose(next: boolean) {
    setOpen(next);
    if (!next) reset();
  }

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    startTransition(async () => {
      const res = await createTask({
        id: id.trim().toUpperCase(),
        title,
        description,
        owner_email: ownerEmail,
        priority,
        project_id: projectId,
        due_date: dueDate ? new Date(dueDate).toISOString() : "",
      });
      if (res.ok) {
        onClose(false);
        router.push(`/tasks/${res.id}`);
      } else {
        setError(res.error);
      }
    });
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Nueva tarea</DialogTitle>
          <DialogDescription className="text-xs">
            Crea una tarea en el ecosistema URPE. Emite un fact_event(created).
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={onSubmit} className="space-y-3">
          <div className="grid grid-cols-3 gap-2">
            <div className="col-span-1">
              <Label htmlFor="id" className="text-xs">
                ID
              </Label>
              <Input
                id="id"
                value={id}
                onChange={(e) => setId(e.target.value.toUpperCase())}
                placeholder="URPE-IS-NNN"
                required
                className="font-mono text-xs"
              />
            </div>
            <div className="col-span-2">
              <Label htmlFor="title" className="text-xs">
                Título
              </Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Acción concreta y verbal"
                required
              />
            </div>
          </div>

          <div>
            <Label htmlFor="description" className="text-xs">
              Descripción
            </Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Contexto extra (opcional)"
              rows={3}
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <Label htmlFor="owner" className="text-xs">
                Owner
              </Label>
              <Select value={ownerEmail} onValueChange={setOwnerEmail} required>
                <SelectTrigger id="owner">
                  <SelectValue placeholder="Asignar a…" />
                </SelectTrigger>
                <SelectContent>
                  {persons === null ? (
                    <SelectItem value="loading" disabled>
                      Cargando…
                    </SelectItem>
                  ) : (
                    persons.map((p) => (
                      <SelectItem key={p.email} value={p.email}>
                        {p.full_name ?? p.email}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="priority" className="text-xs">
                Prioridad
              </Label>
              <Select value={priority} onValueChange={setPriority}>
                <SelectTrigger id="priority">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {TASK_PRIORITY.map((p) => (
                    <SelectItem key={p} value={p}>
                      {p.toUpperCase()}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <Label htmlFor="project" className="text-xs">
                Proyecto
              </Label>
              <Input
                id="project"
                value={projectId}
                onChange={(e) => setProjectId(e.target.value)}
                placeholder="URPE-IS, OPS, etc."
                className="font-mono text-xs"
              />
            </div>
            <div>
              <Label htmlFor="due" className="text-xs">
                Due date
              </Label>
              <Input
                id="due"
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
              />
            </div>
          </div>

          {error && (
            <p className="text-xs text-destructive">{error}</p>
          )}

          <div className="flex justify-end gap-2 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onClose(false)}
              disabled={pending}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={pending}>
              {pending ? "Creando…" : "Crear tarea"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
