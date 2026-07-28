import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, CheckCircle2, XCircle, Clock, ArrowRight, CreditCard, Activity, Package, Truck } from "lucide-react";
import { formatDistanceToNow, format } from "date-fns";
import { motion, AnimatePresence } from "framer-motion";

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
  if (s === "shipped") return <Truck className="w-4 h-4 text-indigo-500" />;
  if (s === "processing") return <Package className="w-4 h-4 text-purple-500" />;
  if (field === "payment_status") return <CreditCard className="w-4 h-4 text-blue-500" />;
  if (s === "in_progress") return <Activity className="w-4 h-4 text-blue-500" />;
  return <Clock className="w-4 h-4 text-yellow-500" />;
};

const ringFor = (status: string) => {
  const s = (status || "").toLowerCase();
  if (["paid", "completed", "delivered", "confirmed"].includes(s)) return "ring-green-500/40 bg-green-500/10";
  if (["cancelled", "failed", "payment_failed"].includes(s)) return "ring-red-500/40 bg-red-500/10";
  if (["shipped", "in_progress", "processing"].includes(s)) return "ring-blue-500/40 bg-blue-500/10";
  return "ring-yellow-500/40 bg-yellow-500/10";
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
  const [pulseId, setPulseId] = useState<string | null>(null);

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
        { event: "INSERT", schema: "public", table: "status_history", filter: `entity_id=eq.${entityId}` },
        (payload) => {
          const next = payload.new as HistoryEntry;
          setEntries((prev) => [...prev, next]);
          setPulseId(next.id);
          setTimeout(() => setPulseId(null), 2500);
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
    <ol className="relative border-l-2 border-dashed border-border ml-2 space-y-5 pt-1">
      <AnimatePresence initial={false}>
        {entries.map((e, idx) => (
          <motion.li
            key={e.id}
            layout
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.04, type: "spring", stiffness: 260, damping: 24 }}
            className="ml-4"
          >
            <span
              className={`absolute -left-[13px] flex h-6 w-6 items-center justify-center rounded-full ring-2 ${ringFor(
                e.new_status
              )} ${pulseId === e.id ? "animate-pulse shadow-lg shadow-primary/50" : ""}`}
            >
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
              <span className="font-semibold capitalize">{e.new_status.replace(/_/g, " ")}</span>
              {e.field !== "status" && (
                <span className="text-[10px] uppercase tracking-wide bg-muted px-1.5 py-0.5 rounded text-muted-foreground">
                  {e.field.replace(/_/g, " ")}
                </span>
              )}
            </div>
            <time
              className="block text-xs text-muted-foreground mt-0.5"
              title={format(new Date(e.created_at), "PPpp")}
            >
              {format(new Date(e.created_at), "MMM d, yyyy · HH:mm")} ·{" "}
              {formatDistanceToNow(new Date(e.created_at), { addSuffix: true })}
            </time>
            {e.note && <p className="text-xs text-muted-foreground mt-1 italic">{e.note}</p>}
          </motion.li>
        ))}
      </AnimatePresence>
    </ol>
  );
}
