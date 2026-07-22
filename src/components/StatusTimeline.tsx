import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, CheckCircle2, XCircle, Clock, ArrowRight, CreditCard, Activity } from "lucide-react";
import { formatDistanceToNow, format } from "date-fns";

type HistoryEntry = {
  id: string;
  entity_type: string;
  entity_id: string;
  old_status: string | null;
  new_status: string;
  field: string;
  note: string | null;
  changed_by: string | null;
  created_at: string;
};

const iconFor = (field: string, status: string) => {
  const s = (status || "").toLowerCase();
  if (["paid", "completed", "delivered", "confirmed"].includes(s))
    return <CheckCircle2 className="w-4 h-4 text-green-500" />;
  if (["cancelled", "failed", "payment_failed"].includes(s))
    return <XCircle className="w-4 h-4 text-red-500" />;
  if (field === "payment_status") return <CreditCard className="w-4 h-4 text-blue-500" />;
  if (s === "in_progress") return <Activity className="w-4 h-4 text-blue-500" />;
  return <Clock className="w-4 h-4 text-yellow-500" />;
};

export default function StatusTimeline({
  entityType,
  entityId,
}: {
  entityType: "order" | "repair_request";
  entityId: string;
}) {
  const [entries, setEntries] = useState<HistoryEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      const { data } = await supabase
        .from("status_history")
        .select("*")
        .eq("entity_type", entityType)
        .eq("entity_id", entityId)
        .order("created_at", { ascending: true });
      if (mounted) {
        setEntries((data ?? []) as HistoryEntry[]);
        setLoading(false);
      }
    };
    load();

    const channel = supabase
      .channel(`history-${entityType}-${entityId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "status_history",
          filter: `entity_id=eq.${entityId}`,
        },
        (payload) => {
          setEntries((prev) => [...prev, payload.new as HistoryEntry]);
        }
      )
      .subscribe();

    return () => {
      mounted = false;
      supabase.removeChannel(channel);
    };
  }, [entityType, entityId]);

  if (loading) {
    return (
      <div className="flex items-center gap-2 text-sm text-muted-foreground py-3">
        <Loader2 className="w-4 h-4 animate-spin" /> Loading history…
      </div>
    );
  }

  if (entries.length === 0) {
    return <p className="text-sm text-muted-foreground py-2">No status changes recorded yet.</p>;
  }

  return (
    <ol className="relative border-l border-border ml-2 space-y-4 pt-1">
      {entries.map((e) => (
        <li key={e.id} className="ml-4">
          <span className="absolute -left-[9px] flex h-4 w-4 items-center justify-center rounded-full bg-background ring-2 ring-border">
            {iconFor(e.field, e.new_status)}
          </span>
          <div className="text-sm flex flex-wrap items-center gap-1.5">
            {e.old_status ? (
              <>
                <span className="text-muted-foreground line-through">{e.old_status}</span>
                <ArrowRight className="w-3 h-3 text-muted-foreground" />
              </>
            ) : (
              <span className="text-muted-foreground text-xs uppercase tracking-wide">Created</span>
            )}
            <span className="font-medium capitalize">{e.new_status.replace(/_/g, " ")}</span>
            {e.field !== "status" && (
              <span className="text-[10px] uppercase tracking-wide bg-muted px-1.5 py-0.5 rounded text-muted-foreground">
                {e.field.replace(/_/g, " ")}
              </span>
            )}
          </div>
          <time className="block text-xs text-muted-foreground mt-0.5" title={format(new Date(e.created_at), "PPpp")}>
            {format(new Date(e.created_at), "MMM d, yyyy · HH:mm")} · {formatDistanceToNow(new Date(e.created_at), { addSuffix: true })}
          </time>
          {e.note && <p className="text-xs text-muted-foreground mt-1 italic">{e.note}</p>}
        </li>
      ))}
    </ol>
  );
}
