import { useEffect, useState, useRef, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useRealtimeChat, sendChatEvent } from "@/hooks/useRealtimeChat";
import { Send, User as UserIcon, Shield, MessageSquare } from "lucide-react";

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
    <Card className="relative overflow-hidden border border-accent/20 rounded-2xl bg-card/40 backdrop-blur-md shadow-lg">
      {/* Header */}
      <div className="px-5 py-4 border-b border-accent/20 bg-gradient-to-r from-primary/10 via-accent/5 to-transparent">
        <div className="flex items-center gap-2 text-primary font-bold">
          <Shield className="w-5 h-5 text-accent" />
          <h3>Support Chat</h3>
        </div>
        <p className="text-xs text-muted-foreground mt-1">Connect with our support team instantly.</p>
      </div>

      {/* Messages area */}
      <div className="p-4 flex flex-col h-[400px]">
        <div className="flex-1 overflow-y-auto space-y-4 pr-2 custom-scrollbar">
          {messages.length === 0 ? (
            <div className="flex flex-col h-full items-center justify-center text-center opacity-60">
              <div className="bg-accent/10 p-4 rounded-full mb-3">
                <MessageSquare className="w-8 h-8 text-accent" />
              </div>
              <p className="text-sm font-medium">No messages yet</p>
              <p className="text-xs text-muted-foreground">Start the conversation below!</p>
            </div>
          ) : (
            messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-3 ${msg.isAdmin ? "flex-row" : "flex-row-reverse"}`}
              >
                <div className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center border ${msg.isAdmin ? "bg-accent/10 border-accent/30" : "bg-primary/10 border-primary/30"}`}>
                  {msg.isAdmin ? <Shield className="w-4 h-4 text-accent" /> : <UserIcon className="w-4 h-4 text-primary" />}
                </div>

                <div className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm shadow-sm ${msg.isAdmin
                    ? "bg-card/80 border border-accent/20 rounded-tl-none"
                    : "bg-primary text-primary-foreground rounded-tr-none"
                  }`}>
                  <p className="leading-relaxed">{msg.content}</p>
                  <span className={`text-[10px] block mt-1 opacity-70 ${msg.isAdmin ? "text-muted-foreground" : "text-primary-foreground/80"}`}>
                    {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              </div>
            ))
          )}
          <div ref={chatEndRef} />
        </div>

        {/* Input area */}
        <form className="mt-4 relative" onSubmit={handleSend}>
          <Input
            placeholder="Type your message..."
            value={input}
            onChange={e => setInput(e.target.value)}
            disabled={submitting}
            className="bg-background/50 backdrop-blur border-accent/20 pr-12 h-12 rounded-xl focus-visible:ring-accent"
          />
          <Button
            type="submit"
            size="icon"
            disabled={submitting || !input.trim()}
            className="absolute right-1 top-1 h-10 w-10 rounded-lg bg-accent text-primary hover:bg-accent/90 shadow-sm"
          >
            <Send className="w-4 h-4" />
          </Button>
        </form>
      </div>
    </Card>
  );
}
