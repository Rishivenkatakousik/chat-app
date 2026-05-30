"use client";
import { useEffect, useRef } from "react";
import { pusherClient } from "@/lib/pusher";

// Tracks how many hook instances are subscribed to each channel key.
// Prevents one component's cleanup from unsubscribing a channel that
// another component is still using (e.g. both SidebarChatList and
// FriendRequestsSidebarOptions share user:X:friends).
const channelRefCounts = new Map<string, number>();

/**
 * Subscribes to a Pusher channel and binds a handler to an event.
 * - Re-subscribes only when channelKey or event changes.
 * - Handler is always up-to-date via ref (no stale closures, no useCallback needed).
 * - Reference-counted unsubscription: the channel is only truly removed when
 *   the last consumer unmounts.
 */
export function usePusherEvent<T>(
  channelKey: string,
  event: string,
  handler: (data: T) => void
) {
  const handlerRef = useRef(handler);
  handlerRef.current = handler;

  useEffect(() => {
    const stableHandler = (data: T) => handlerRef.current(data);

    channelRefCounts.set(channelKey, (channelRefCounts.get(channelKey) ?? 0) + 1);

    const channel = pusherClient.subscribe(channelKey);
    channel.bind(event, stableHandler);

    return () => {
      channel.unbind(event, stableHandler);

      const remaining = (channelRefCounts.get(channelKey) ?? 1) - 1;
      if (remaining <= 0) {
        channelRefCounts.delete(channelKey);
        pusherClient.unsubscribe(channelKey);
      } else {
        channelRefCounts.set(channelKey, remaining);
      }
    };
  }, [channelKey, event]);
}
