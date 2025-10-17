import { useEffect, useState, useRef, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useRealtimeChat, sendChatEvent } from "@/hooks/useRealtimeChat";
import { Send, User as UserIcon, Shield } from "lucide-react";

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
      ...(replies || []).map((r: { id: string; created_at: string; content: string }) => ({
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
  }, [fetchData, userId]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Send: create or append to user's thread
  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    setSubmitting(true);
    const { data: userMsgs } = await supabase
      .from("messages")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: true });
    let threadIdToSend: string;
    if (!(userMsgs && userMsgs.length)) {
      // Start new thread
      const { data } = await supabase
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
    <Card className="relative overflow-hidden border border-accent/30 rounded-2xl bg-card/90 shadow-md">
      {/* Header */}
      <div className="px-4 sm:px-5 py-3 border-b border-accent/20 bg-gradient-to-r from-primary/90 via-accent/80 to-primary/80 text-primary">
        <div className="flex items-center gap-2 text-accent">
          <Shield className="w-4 h-4" />
          <h3 className="font-bold">Support Chat</h3>
        </div>
        <p className="text-[11px] text-primary/90">Chat with our support team. Replies appear here in real-time.</p>
      </div>

      {/* Messages area */}
      <div className="p-3 sm:p-4">
        <div className="h-64 sm:h-80 overflow-y-auto bg-muted rounded-xl p-3 sm:p-4 border border-accent/20">
          {messages.length === 0 ? (
            <div className="text-muted-foreground text-sm flex h-full items-center justify-center text-center">
              <div>
                <div className="font-semibold mb-1">No chat started yet</div>
                <div className="text-xs">Send a message below to begin.</div>
              </div>
            </div>
          ) : (
            messages.map((msg) => (
              <div
                key={msg.id}
                className={`mb-3 flex ${msg.isAdmin ? "justify-end" : "justify-start"}`}
              >
                <div className={`max-w-[80%] sm:max-w-[75%] rounded-2xl px-3 py-2 border shadow-sm ${msg.isAdmin ? "bg-accent/10 border-accent/40" : "bg-primary/5 border-accent/20"}`}>
                  <div className="flex items-center gap-2 mb-0.5">
                    {msg.isAdmin ? (
                      <Shield className="w-3.5 h-3.5 text-accent" />
                    ) : (
                      <UserIcon className="w-3.5 h-3.5 text-muted-foreground" />
                    )}
                    <span className="text-[11px] text-muted-foreground">{msg.isAdmin ? "Support" : email || "You"}</span>
                  </div>
                  <div className="text-sm leading-snug whitespace-pre-wrap">{msg.content}</div>
                  <div className="text-[10px] text-muted-foreground mt-1 text-right">
                    {new Date(msg.created_at).toLocaleString()}
                  </div>
                </div>
              </div>
            ))
          )}
          <div ref={chatEndRef} />
        </div>

        {/* Input area */}
        <form className="mt-3 flex gap-2" onSubmit={handleSend}>
          <Input
            placeholder="Type your message..."
            value={input}
            onChange={e => setInput(e.target.value)}
            disabled={submitting}
            className="bg-background"
          />
          <Button type="submit" disabled={submitting || !input.trim()} className="inline-flex items-center gap-1">
            <Send className="w-4 h-4" /> Send
          </Button>
        </form>
      </div>
    </Card>
  );
}
