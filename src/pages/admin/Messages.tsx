import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { toast } from "@/hooks/use-toast";
import { Loader2, Mail, Phone, Trash2, Inbox, Archive, ArchiveRestore, MailOpen, Copy, ExternalLink, Clock } from "lucide-react";
import { formatDistanceToNow, format } from "date-fns";

type ContactMessage = {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  service: string | null;
  message: string;
  is_read: boolean | null;
  is_archived: boolean | null;
  created_at: string;
};

export default function AdminMessages() {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "unread" | "archived">("all");
  const [selected, setSelected] = useState<ContactMessage | null>(null);

  const load = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("contact_messages")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) {
        console.warn("Contact messages error (normal if table empty):", error.message);
        setMessages([]);
      } else {
        setMessages((data ?? []) as unknown as ContactMessage[]);
      }
    } catch (e) {
      console.warn("Error loading contact messages:", e);
      setMessages([]);
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

  // Keep drawer in sync with updated messages
  useEffect(() => {
    if (!selected) return;
    const fresh = messages.find((m) => m.id === selected.id);
    if (fresh && fresh !== selected) setSelected(fresh);
  }, [messages, selected]);

  const openDetail = async (m: ContactMessage) => {
    setSelected(m);
    if (!m.is_read) {
      await supabase.from("contact_messages").update({ is_read: true }).eq("id", m.id);
    }
  };

  const toggleRead = async (m: ContactMessage) => {
    const { error } = await supabase.from("contact_messages").update({ is_read: !m.is_read }).eq("id", m.id);
    if (error) toast({ title: "Failed", description: error.message, variant: "destructive" });
  };

  const toggleArchive = async (m: ContactMessage) => {
    const { error } = await supabase.from("contact_messages").update({ is_archived: !m.is_archived }).eq("id", m.id);
    if (error) toast({ title: "Failed", description: error.message, variant: "destructive" });
    else toast({ title: m.is_archived ? "Restored" : "Archived" });
  };

  const remove = async (id: string) => {
    if (!confirm("Delete this message permanently?")) return;
    const { error } = await supabase.from("contact_messages").delete().eq("id", id);
    if (error) toast({ title: "Failed", description: error.message, variant: "destructive" });
    else {
      toast({ title: "Deleted" });
      setSelected(null);
    }
  };

  const copy = (text: string, label: string) => {
    navigator.clipboard.writeText(text).then(() => toast({ title: `${label} copied` }));
  };

  const filtered = messages.filter((m) => {
    if (filter === "unread") return !m.is_read && !m.is_archived;
    if (filter === "archived") return m.is_archived;
    return !m.is_archived;
  });

  const unreadCount = messages.filter((m) => !m.is_read && !m.is_archived).length;

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="animate-spin text-accent" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3 mb-2 flex-wrap">
        <Inbox className="text-accent" />
        <h1 className="text-2xl font-bold text-gray-900">Contact Messages</h1>
        {unreadCount > 0 && (
          <span className="text-[10px] uppercase font-bold bg-accent text-white px-2 py-0.5 rounded">
            {unreadCount} new
          </span>
        )}
        <div className="ml-auto flex gap-1">
          {(["all", "unread", "archived"] as const).map((f) => (
            <Button key={f} size="sm" variant={filter === f ? "default" : "outline"} onClick={() => setFilter(f)}>
              {f}
            </Button>
          ))}
        </div>
      </div>

      {filtered.length === 0 && (
        <Card className="p-8 text-center text-muted-foreground">No messages here.</Card>
      )}

      <div className="grid gap-3">
        {filtered.map((m) => (
          <Card
            key={m.id}
            role="button"
            tabIndex={0}
            onClick={() => openDetail(m)}
            onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && openDetail(m)}
            className={`p-4 cursor-pointer hover:shadow-md transition-shadow ${!m.is_read ? "border-accent/40 bg-accent/5" : ""} ${m.is_archived ? "opacity-60" : ""}`}
          >
            <div className="flex items-start justify-between gap-4 flex-wrap">
              <div className="flex-1 min-w-[240px]">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-semibold text-gray-900">{m.name}</span>
                  {!m.is_read && (
                    <span className="text-[10px] uppercase font-bold bg-accent text-white px-2 py-0.5 rounded">New</span>
                  )}
                  {m.is_archived && (
                    <span className="text-[10px] uppercase font-bold bg-gray-500 text-white px-2 py-0.5 rounded">Archived</span>
                  )}
                  {m.service && (
                    <span className="text-[11px] bg-gray-100 text-gray-700 px-2 py-0.5 rounded">{m.service}</span>
                  )}
                </div>
                <div className="flex flex-wrap gap-3 mt-1 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Mail size={14} /> {m.email}
                  </span>
                  {m.phone && (
                    <span className="flex items-center gap-1">
                      <Phone size={14} /> {m.phone}
                    </span>
                  )}
                  <span className="text-xs flex items-center gap-1">
                    <Clock size={12} /> {formatDistanceToNow(new Date(m.created_at), { addSuffix: true })}
                  </span>
                </div>
                <p className="mt-2 text-sm text-gray-700 line-clamp-2">{m.message}</p>
              </div>
              <ExternalLink size={14} className="text-muted-foreground shrink-0" />
            </div>
          </Card>
        ))}
      </div>

      <Sheet open={!!selected} onOpenChange={(o) => !o && setSelected(null)}>
        <SheetContent side="right" className="w-full sm:max-w-lg overflow-y-auto">
          {selected && (
            <>
              <SheetHeader>
                <SheetTitle className="flex items-center gap-2 flex-wrap">
                  {selected.name}
                  {selected.service && (
                    <span className="text-[11px] bg-accent/10 text-accent px-2 py-0.5 rounded font-normal">
                      {selected.service}
                    </span>
                  )}
                </SheetTitle>
                <SheetDescription>Contact submission details</SheetDescription>
              </SheetHeader>

              <div className="mt-6 space-y-5">
                <div className="text-xs text-muted-foreground space-y-1">
                  <div className="flex items-center gap-2">
                    <Clock size={12} /> Received {format(new Date(selected.created_at), "PPpp")}
                  </div>
                  <div>({formatDistanceToNow(new Date(selected.created_at), { addSuffix: true })})</div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between gap-2 rounded-md border p-3">
                    <a href={`mailto:${selected.email}`} className="flex items-center gap-2 text-sm hover:text-accent">
                      <Mail size={14} /> {selected.email}
                    </a>
                    <Button size="sm" variant="ghost" onClick={() => copy(selected.email, "Email")}>
                      <Copy size={14} />
                    </Button>
                  </div>
                  {selected.phone && (
                    <div className="flex items-center justify-between gap-2 rounded-md border p-3">
                      <a href={`tel:${selected.phone}`} className="flex items-center gap-2 text-sm hover:text-accent">
                        <Phone size={14} /> {selected.phone}
                      </a>
                      <Button size="sm" variant="ghost" onClick={() => copy(selected.phone!, "Phone")}>
                        <Copy size={14} />
                      </Button>
                    </div>
                  )}
                </div>

                <div>
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">Message</h4>
                  <div className="rounded-md border bg-muted/30 p-4 text-sm whitespace-pre-wrap">{selected.message}</div>
                </div>

                <div className="flex flex-wrap gap-2 pt-2 border-t">
                  <Button size="sm" variant="outline" onClick={() => toggleRead(selected)}>
                    <MailOpen size={14} className="mr-1.5" />
                    Mark {selected.is_read ? "unread" : "read"}
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => toggleArchive(selected)}>
                    {selected.is_archived ? <ArchiveRestore size={14} className="mr-1.5" /> : <Archive size={14} className="mr-1.5" />}
                    {selected.is_archived ? "Restore" : "Archive"}
                  </Button>
                  <Button size="sm" variant="outline" asChild>
                    <a href={`mailto:${selected.email}?subject=Re:%20Your%20message%20to%20Ztech%20Electronics&body=Hi%20${encodeURIComponent(selected.name)},%0D%0A%0D%0A`}>
                      <Mail size={14} className="mr-1.5" /> Reply
                    </a>
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => remove(selected.id)}
                    className="text-red-600 hover:text-red-700 ml-auto"
                  >
                    <Trash2 size={14} className="mr-1.5" /> Delete
                  </Button>
                </div>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}
