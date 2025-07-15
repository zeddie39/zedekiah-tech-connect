
import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

type MessageEvent = {
  type: "admin_reply" | "user_message";
  threadId: string;
  data: { content: string };
};

/**
 * Subscribes to a chat thread and calls onNewMessage whenever a new message or reply is sent.
 * Broadcasts new sent messages/replies to the channel, so both participants get instant updates.
 */
export function useRealtimeChat(
  threadId: string,
  onNewMessage: (event: MessageEvent) => void
) {
  useEffect(() => {
    if (!threadId) return;
    const channel = supabase.channel(`chat-thread-${threadId}`);

    // Listen for broadcast events (admin or user sends message/reply)
    channel
      .on(
        "broadcast",
        { event: "message" },
        (payload) => {
          if (payload.payload.threadId === threadId) {
            onNewMessage(payload.payload as MessageEvent);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
     
  }, [threadId, onNewMessage]);
}

/**
 * Call this to broadcast a new message or reply so the other participant updates instantly.
 */
export function sendChatEvent(event: MessageEvent) {
  if (!event.threadId) return;
  supabase.channel(`chat-thread-${event.threadId}`).send({
    type: "broadcast",
    event: "message",
    payload: event,
  });
}
