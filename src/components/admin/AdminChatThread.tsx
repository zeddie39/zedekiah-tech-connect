
import { useEffect, useState, useRef, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useRealtimeChat, sendChatEvent } from "@/hooks/useRealtimeChat";

type Thread = {
  id: string;
  user_id: string | null;
  created_at: string | null;
  content: string;
};

type Message = {
  id: string;
  created_at: string;
  content: string;
  isAdmin?: boolean;
};

export default function AdminChatThread({
  thread,
  onBack,
}: {
  thread: Thread;
  onBack: () => void;
}) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const chatEndRef = useRef<HTMLDivElement | null>(null);

  const fetchData = useCallback(async () => {
    const { data: mainMsg } = await supabase
      .from("messages")
      .select("*")
      .eq("id", thread.id)
      .maybeSingle();
    const { data: replies } = await supabase
      .from("message_replies")
      .select("*")
      .eq("message_id", thread.id)
      .order("created_at", { ascending: true });

    const allMsgs: Message[] = mainMsg
      ? [
          { ...mainMsg, isAdmin: false },
          ...(replies || []).map((r: any) => ({
            id: r.id,
            created_at: r.created_at,
            content: r.content,
            isAdmin: true,
          })),
        ]
      : [];
    setMessages(allMsgs);
  }, [thread.id]);

  // Subscribe for instant messages
  useRealtimeChat(thread.id, () => {
    fetchData();
  });

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line
  }, [fetchData, thread.id]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    await supabase.from("message_replies").insert({
      message_id: thread.id,
      content: input,
      // Optionally, set admin_id.
    });

    // Broadcast event (notifies all listening clients)
    sendChatEvent({
      type: "admin_reply",
      threadId: thread.id,
      data: { content: input },
    });

    setInput("");
    setSubmitting(false);
  };

  return (
    <Card className="p-8 h-full flex flex-col">
      <div className="mb-6 flex items-center gap-3">
        <Button variant="ghost" size="sm" onClick={onBack}>
          ← Back
        </Button>
        <span className="font-semibold">
          Conversation with {thread.user_id?.slice(0, 8) || "User"}
        </span>
      </div>
      <div className="flex-1 h-64 overflow-y-auto bg-muted mb-4 rounded p-4">
        {messages.length === 0 ? (
          <div className="text-gray-500 text-sm">
            No messages in this thread yet.
          </div>
        ) : (
          messages.map((msg) => (
            <div
              key={msg.id}
              className={`mb-3 flex ${
                msg.isAdmin ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`rounded px-3 py-2 max-w-lg ${
                  msg.isAdmin
                    ? "bg-blue-100 text-blue-900"
                    : "bg-gray-200 text-gray-900"
                }`}
              >
                <div className="text-xs font-mono text-gray-500">
                  {msg.isAdmin ? "Support" : "User"}
                </div>
                <div>{msg.content}</div>
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
          placeholder="Type your reply as admin..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          disabled={submitting}
        />
        <Button type="submit" disabled={submitting || !input}>
          Send
        </Button>
      </form>
    </Card>
  );
}
