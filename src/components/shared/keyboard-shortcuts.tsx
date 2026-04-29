"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { CREATE_TASK_EVENT } from "@/features/tasks/components/create-task-dialog";

const LEADER_TIMEOUT_MS = 1500;

const NAV: Record<string, string> = {
  l: "/",
  k: "/kanban",
  c: "/calendar",
  g: "/graph",
  a: "/analytics",
  o: "/office",
  i: "/",
};

export function KeyboardShortcuts() {
  const router = useRouter();

  useEffect(() => {
    let leaderActive = false;
    let leaderTimer: ReturnType<typeof setTimeout> | null = null;

    function isTypingTarget(target: EventTarget | null): boolean {
      if (!(target instanceof HTMLElement)) return false;
      const tag = target.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") return true;
      if (target.isContentEditable) return true;
      return false;
    }

    function clearLeader() {
      leaderActive = false;
      if (leaderTimer) clearTimeout(leaderTimer);
      leaderTimer = null;
    }

    function onKey(e: KeyboardEvent) {
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      if (isTypingTarget(e.target)) return;

      if (leaderActive) {
        const path = NAV[e.key.toLowerCase()];
        clearLeader();
        if (path) {
          e.preventDefault();
          router.push(path);
        }
        return;
      }

      if (e.key.toLowerCase() === "g") {
        leaderActive = true;
        leaderTimer = setTimeout(clearLeader, LEADER_TIMEOUT_MS);
        return;
      }

      if (e.key.toLowerCase() === "c") {
        e.preventDefault();
        window.dispatchEvent(new CustomEvent(CREATE_TASK_EVENT));
        return;
      }
    }

    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      clearLeader();
    };
  }, [router]);

  return null;
}
