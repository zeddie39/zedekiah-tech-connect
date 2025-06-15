
import { useEffect, useState, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

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

  // Fetch chat on load and listen for real-time updates
  useEffect(() => {
    let active = true;

    const fetchData = async () => {
      // User's main message thread
      const { data: userMsgs } = await supabase
        .from("messages")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: true });
      if (!userMsgs?.length) {
        setMessages([]);
        return;
      }
      const mainMsg = userMsgs[0];

      // Get all replies to this message thread
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
      if (active) setMessages(allMsgs);
    };
    fetchData();

    // Realtime: subscribe to new message_replies
    const channel = supabase
      .channel("chat")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "message_replies" },
        payload => {
          fetchData();
        }
      )
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "messages" },
        payload => {
          fetchData();
        }
      )
      .subscribe();

    return () => {
      active = false;
      supabase.removeChannel(channel);
    };
    // eslint-disable-next-line
  }, [userId]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Send: create or append to user's thread
  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    // Look for existing chat
    const { data: userMsgs } = await supabase
      .from("messages")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: true });
    let threadId: string;
    if (!(userMsgs && userMsgs.length)) {
      // Start new thread
      const { data, error } = await supabase
        .from("messages")
        .insert({ user_id: userId, content: input })
        .select()
        .single();
      threadId = data?.id;
    } else {
      // Append as a new message by the user (replace this with actual thread support if needed)
      threadId = userMsgs[0].id;
      await supabase
        .from("messages")
        .update({ content: input })
        .eq("id", threadId);
    }
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
