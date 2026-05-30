"use client";
import { useEffect, useRef } from "react";
import { pusherClient } from "@/lib/pusher";

/**
 * Subscribes to a Pusher channel and binds a handler to an event.
 * Re-subscribes only when channelKey or event changes.
 * The handler is always up-to-date (no stale closure) without needing useCallback.
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
    const channel = pusherClient.subscribe(channelKey);
    channel.bind(event, stableHandler);
    return () => {
      channel.unbind(event, stableHandler);
      pusherClient.unsubscribe(channelKey);
    };
  }, [channelKey, event]);
}
