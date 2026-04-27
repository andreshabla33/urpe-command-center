"use client";

import { useMemo } from "react";
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  type Node,
  type Edge,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import type { TaskRow } from "../queries";

const COLUMN_WIDTH = 280;
const ROW_HEIGHT = 70;

export function TaskGraph({ tasks }: { tasks: TaskRow[] }) {
  const { nodes, edges } = useMemo(() => buildGraph(tasks), [tasks]);

  return (
    <div className="h-full w-full">
      <ReactFlow nodes={nodes} edges={edges} fitView fitViewOptions={{ padding: 0.2 }}>
        <Background />
        <Controls />
        <MiniMap pannable zoomable />
      </ReactFlow>
    </div>
  );
}

function buildGraph(tasks: TaskRow[]): { nodes: Node[]; edges: Edge[] } {
  const owners = new Map<string, TaskRow[]>();
  for (const t of tasks) {
    const key = t.owner_email ?? "(sin asignar)";
    const arr = owners.get(key) ?? [];
    arr.push(t);
    owners.set(key, arr);
  }

  const nodes: Node[] = [];
  const edges: Edge[] = [];
  const nodeById = new Map<string, string>();

  Array.from(owners.entries()).forEach(([owner, group], colIdx) => {
    nodes.push({
      id: `owner:${owner}`,
      data: { label: owner },
      position: { x: colIdx * COLUMN_WIDTH, y: 0 },
      style: {
        background: "var(--muted)",
        border: "1px solid var(--border)",
        borderRadius: 8,
        padding: 6,
        fontSize: 11,
        fontFamily: "var(--font-mono)",
        width: 220,
      },
      draggable: false,
      connectable: false,
    });

    group.forEach((task, rowIdx) => {
      const id = `task:${task.id}`;
      nodes.push({
        id,
        data: {
          label: (
            <div style={{ fontSize: 11 }}>
              <div style={{ fontFamily: "var(--font-mono)", fontSize: 9, opacity: 0.6 }}>
                {task.id} · {task.priority ?? "p2"}
              </div>
              <div style={{ marginTop: 2 }}>{task.title}</div>
            </div>
          ),
        },
        position: { x: colIdx * COLUMN_WIDTH, y: 90 + rowIdx * ROW_HEIGHT },
        style: {
          background: "var(--card)",
          border: "1px solid var(--border)",
          borderRadius: 6,
          padding: 8,
          width: 220,
          color: "var(--foreground)",
        },
      });
      nodeById.set(task.id ?? "", id);

      edges.push({
        id: `e:${owner}->${id}`,
        source: `owner:${owner}`,
        target: id,
        style: { stroke: "var(--border)" },
        animated: false,
      });
    });
  });

  const byProject = new Map<string, string[]>();
  for (const t of tasks) {
    if (!t.project_id || !t.id) continue;
    const arr = byProject.get(t.project_id) ?? [];
    arr.push(t.id);
    byProject.set(t.project_id, arr);
  }

  for (const [project, ids] of byProject) {
    for (let i = 0; i < ids.length - 1; i++) {
      const a = nodeById.get(ids[i]!);
      const b = nodeById.get(ids[i + 1]!);
      if (a && b) {
        edges.push({
          id: `proj:${project}:${i}`,
          source: a,
          target: b,
          style: { stroke: "var(--primary)", strokeWidth: 1, opacity: 0.4 },
          animated: false,
        });
      }
    }
  }

  return { nodes, edges };
}
