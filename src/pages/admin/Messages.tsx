import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { Loader2, Mail, Phone, Trash2, Inbox } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

type ContactMessage = {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  service: string | null;
  message: string;
  status: string | null;
  created_at: string;
};

export default function AdminMessages() {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("contact_messages")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) {
      toast({ title: "Error loading messages", description: error.message, variant: "destructive" });
    } else {
      setMessages((data ?? []) as ContactMessage[]);
    }
    setLoading(false);
  };

  useEffect(() => {
    load();
    const channel = supabase
      .channel("admin-contact-messages")
      .on("postgres_changes", { event: "*", schema: "public", table: "contact_messages" }, () => load())
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const markRead = async (id: string) => {
    const { error } = await supabase.from("contact_messages").update({ status: "read" }).eq("id", id);
    if (error) toast({ title: "Failed", description: error.message, variant: "destructive" });
  };

  const remove = async (id: string) => {
    if (!confirm("Delete this message?")) return;
    const { error } = await supabase.from("contact_messages").delete().eq("id", id);
    if (error) toast({ title: "Failed", description: error.message, variant: "destructive" });
    else toast({ title: "Deleted" });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="animate-spin text-accent" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3 mb-2">
        <Inbox className="text-accent" />
        <h1 className="text-2xl font-bold text-gray-900">Contact Messages</h1>
        <span className="ml-auto text-sm text-muted-foreground">{messages.length} total</span>
      </div>

      {messages.length === 0 && (
        <Card className="p-8 text-center text-muted-foreground">No messages yet.</Card>
      )}

      <div className="grid gap-3">
        {messages.map((m) => (
          <Card key={m.id} className={`p-4 ${m.status !== "read" ? "border-accent/40 bg-accent/5" : ""}`}>
            <div className="flex items-start justify-between gap-4 flex-wrap">
              <div className="flex-1 min-w-[240px]">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-semibold text-gray-900">{m.name}</span>
                  {m.status !== "read" && (
                    <span className="text-[10px] uppercase font-bold bg-accent text-white px-2 py-0.5 rounded">New</span>
                  )}
                  {m.service && (
                    <span className="text-[11px] bg-gray-100 text-gray-700 px-2 py-0.5 rounded">{m.service}</span>
                  )}
                </div>
                <div className="flex flex-wrap gap-3 mt-1 text-sm text-muted-foreground">
                  <a href={`mailto:${m.email}`} className="flex items-center gap-1 hover:text-accent">
                    <Mail size={14} /> {m.email}
                  </a>
                  {m.phone && (
                    <a href={`tel:${m.phone}`} className="flex items-center gap-1 hover:text-accent">
                      <Phone size={14} /> {m.phone}
                    </a>
                  )}
                  <span className="text-xs">{formatDistanceToNow(new Date(m.created_at), { addSuffix: true })}</span>
                </div>
                <p className="mt-3 text-sm text-gray-800 whitespace-pre-wrap">{m.message}</p>
              </div>
              <div className="flex flex-col gap-2">
                {m.status !== "read" && (
                  <Button size="sm" variant="outline" onClick={() => markRead(m.id)}>
                    Mark read
                  </Button>
                )}
                <Button size="sm" variant="ghost" onClick={() => remove(m.id)} className="text-red-600 hover:text-red-700">
                  <Trash2 size={14} className="mr-1" /> Delete
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
