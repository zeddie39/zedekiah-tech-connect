
import { useEffect, useState, useRef, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useRealtimeChat, sendChatEvent } from "@/hooks/useRealtimeChat";

// Type for chat messages and admin replies
type Message = {
  id: string;
  created_at: string;
  content: string;
  isAdmin?: boolean;
};

export default function Chat({ userId, email }: { userId: string; email?: string }) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const chatEndRef = useRef<HTMLDivElement | null>(null);
  const [threadId, setThreadId] = useState<string | null>(null);

  // Fetch chat data
  const fetchData = useCallback(async () => {
    const { data: userMsgs } = await supabase
      .from("messages")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: true });
    if (!userMsgs?.length) {
      setMessages([]);
      setThreadId(null);
      return;
    }
    const mainMsg = userMsgs[0];
    setThreadId(mainMsg.id);

    const { data: replies } = await supabase
      .from("message_replies")
      .select("*")
      .eq("message_id", mainMsg.id)
      .order("created_at", { ascending: true });

    // Format messages for UI: user (+ main), admin replies
    const allMsgs: Message[] = [
      { ...mainMsg, isAdmin: false },
      ...(replies || []).map((r: any) => ({
        id: r.id,
        created_at: r.created_at,
        content: r.content,
        isAdmin: true,
      })),
    ];
    setMessages(allMsgs);
  }, [userId]);

  // Subscribe for instant updates
  useRealtimeChat(threadId || "", () => {
    fetchData();
  });

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line
  }, [fetchData, userId]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Send: create or append to user's thread
  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    const { data: userMsgs } = await supabase
      .from("messages")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: true });
    let threadIdToSend: string;
    if (!(userMsgs && userMsgs.length)) {
      // Start new thread
      const { data, error } = await supabase
        .from("messages")
        .insert({ user_id: userId, content: input })
        .select()
        .single();
      threadIdToSend = data?.id;
    } else {
      // Append as a new message by the user (replace this with actual thread support if needed)
      threadIdToSend = userMsgs[0].id;
      await supabase
        .from("messages")
        .update({ content: input })
        .eq("id", threadIdToSend);
    }

    // Broadcast user message event so admin sees it instantly
    sendChatEvent({
      type: "user_message",
      threadId: threadIdToSend,
      data: { content: input },
    });

    setInput("");
    setSubmitting(false);
  };

  return (
    <Card className="p-8">
      <h2 className="font-bold text-xl mb-4">Support Chat</h2>
      <div className="h-64 overflow-y-auto bg-muted mb-4 rounded p-4">
        {messages.length === 0 ? (
          <div className="text-gray-500 text-sm">
            <span className="block mb-2">No chat started yet.</span>
            <span>Type a message below to begin.</span>
          </div>
        ) : (
          messages.map((msg, i) => (
            <div
              key={msg.id}
              className={`mb-3 flex ${
                msg.isAdmin ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`rounded px-3 py-2 ${
                  msg.isAdmin
                    ? "bg-blue-100 text-blue-900"
                    : "bg-gray-200 text-gray-900"
                }`}
              >
                <div className="text-xs font-mono text-gray-500">
                  {msg.isAdmin ? "Support" : email || "You"}
                </div>
                <div className="">{msg.content}</div>
                <div className="text-[10px] text-gray-400 mt-1">
                  {new Date(msg.created_at).toLocaleString()}
                </div>
              </div>
            </div>
          ))
        )}
        <div ref={chatEndRef} />
      </div>
      <form className="flex gap-2" onSubmit={handleSend}>
        <Input
          placeholder="Type your message..."
          value={input}
          onChange={e => setInput(e.target.value)}
          disabled={submitting}
        />
        <Button type="submit" disabled={submitting || !input}>
          Send
        </Button>
      </form>
    </Card>
  );
}
