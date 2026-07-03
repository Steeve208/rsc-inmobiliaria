"use client";

import { useEffect, useRef } from "react";
import { fetchChatThread } from "@/lib/leads/client";
import type { ChatThread } from "@/lib/leads/types";

const POLL_INTERVAL_MS = 5000;

export function useChatThreadPolling(
  threadId: string | null | undefined,
  enabled: boolean,
  onUpdate: (thread: ChatThread) => void,
) {
  const onUpdateRef = useRef(onUpdate);
  onUpdateRef.current = onUpdate;

  useEffect(() => {
    if (!enabled || !threadId) return;

    let cancelled = false;

    async function poll() {
      if (cancelled || document.hidden) return;

      try {
        const thread = await fetchChatThread(threadId!);
        if (!cancelled) onUpdateRef.current(thread);
      } catch {
        // Keep the last known thread state on transient failures.
      }
    }

    const intervalId = window.setInterval(poll, POLL_INTERVAL_MS);

    function handleVisibilityChange() {
      if (!document.hidden) void poll();
    }

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      cancelled = true;
      window.clearInterval(intervalId);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [threadId, enabled]);
}

export function mergeChatThread(
  current: ChatThread | null,
  updated: ChatThread,
): ChatThread {
  if (!current || current.id !== updated.id) return updated;

  const currentLastId = current.messages.at(-1)?.id;
  const updatedLastId = updated.messages.at(-1)?.id;

  if (
    current.messages.length === updated.messages.length &&
    currentLastId === updatedLastId &&
    current.updatedAt === updated.updatedAt
  ) {
    return current;
  }

  return updated;
}
