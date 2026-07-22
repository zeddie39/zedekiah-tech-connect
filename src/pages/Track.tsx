import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Loader2,
  ArrowLeft,
  Package,
  Wrench,
  Clock,
  CheckCircle2,
  XCircle,
  RadioTower,
  Eye,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import ShopNavbar from "@/components/ShopNavbar";
import StatusTimeline from "@/components/StatusTimeline";
import { ChevronDown, ChevronUp } from "lucide-react";
import { toast } from "@/components/ui/use-toast";

type Order = {
  id: string;
  created_at: string;
  amount: number;
  status: string | null;
  payment_status: string | null;
  product_id: string;
  delivery_location: string | null;
  mpesa_receipt?: string | null;
};

type RepairRequest = {
  id: string;
  created_at: string;
  device_type: string;
  problem_description: string;
  status: string;
};

type Product = { id: string; title: string };

const statusTone = (s: string | null | undefined) => {
  switch ((s || "pending").toLowerCase()) {
    case "paid":
    case "completed":
    case "delivered":
    case "confirmed":
      return "bg-green-500/10 text-green-600 border-green-500/20";
    case "in_progress":
      return "bg-blue-500/10 text-blue-600 border-blue-500/20";
    case "cancelled":
    case "failed":
    case "payment_failed":
      return "bg-red-500/10 text-red-600 border-red-500/20";
    default:
      return "bg-yellow-500/10 text-yellow-600 border-yellow-500/20";
  }
};

const statusIcon = (s: string | null | undefined) => {
  const v = (s || "pending").toLowerCase();
  if (["paid", "completed", "delivered", "confirmed"].includes(v))
    return <CheckCircle2 className="w-3 h-3" />;
  if (["cancelled", "failed", "payment_failed"].includes(v))
    return <XCircle className="w-3 h-3" />;
  return <Clock className="w-3 h-3" />;
};

export default function TrackPage() {
  const [tab, setTab] = useState<"orders" | "repairs">("orders");
  const [orders, setOrders] = useState<Order[]>([]);
  const [repairs, setRepairs] = useState<RepairRequest[]>([]);
  const [products, setProducts] = useState<Record<string, Product>>({});
  const [userId, setUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [live, setLive] = useState(false);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  const toggle = (id: string) => setExpanded((p) => ({ ...p, [id]: !p[id] }));
  const navigate = useNavigate();

  useEffect(() => {
    let mounted = true;

    const load = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate("/auth?redirect=/track");
        return;
      }
      const uid = session.user.id;
      if (!mounted) return;
      setUserId(uid);

      const [{ data: ordersData }, { data: repairsData }] = await Promise.all([
        supabase.from("orders").select("*").eq("buyer_id", uid).order("created_at", { ascending: false }),
        supabase.from("repair_requests").select("*").eq("user_id", uid).order("created_at", { ascending: false }),
      ]);

      if (!mounted) return;

      if (ordersData) {
        setOrders(ordersData as Order[]);
        const ids = [...new Set(ordersData.map((o: Order) => o.product_id).filter(Boolean))];
        if (ids.length) {
          const { data: prods } = await supabase.from("products").select("id, title").in("id", ids);
          if (prods) {
            const map: Record<string, Product> = {};
            prods.forEach((p) => { map[p.id] = p; });
            setProducts(map);
          }
        }
      }
      if (repairsData) setRepairs(repairsData as RepairRequest[]);
      setLoading(false);
    };

    load();
    return () => { mounted = false; };
  }, [navigate]);

  // Realtime subscriptions for the current user
  useEffect(() => {
    if (!userId) return;

    const channel = supabase
      .channel(`track-${userId}`)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "orders", filter: `buyer_id=eq.${userId}` },
        (payload) => {
          setLastUpdate(new Date());
          setOrders((prev) => {
            if (payload.eventType === "INSERT") {
              toast({ title: "New order", description: "A new order was added to your account." });
              return [payload.new as Order, ...prev];
            }
            if (payload.eventType === "UPDATE") {
              const next = payload.new as Order;
              const old = prev.find((o) => o.id === next.id);
              if (old && old.status !== next.status) {
                toast({ title: "Order status updated", description: `Now: ${next.status}` });
              } else if (old && old.payment_status !== next.payment_status) {
                toast({ title: "Payment update", description: `Now: ${next.payment_status}` });
              }
              return prev.map((o) => (o.id === next.id ? next : o));
            }
            if (payload.eventType === "DELETE") {
              return prev.filter((o) => o.id !== (payload.old as Order).id);
            }
            return prev;
          });
        }
      )
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "repair_requests", filter: `user_id=eq.${userId}` },
        (payload) => {
          setLastUpdate(new Date());
          setRepairs((prev) => {
            if (payload.eventType === "INSERT") return [payload.new as RepairRequest, ...prev];
            if (payload.eventType === "UPDATE") {
              const next = payload.new as RepairRequest;
              const old = prev.find((r) => r.id === next.id);
              if (old && old.status !== next.status) {
                toast({ title: "Repair status updated", description: `Now: ${next.status.replace("_", " ")}` });
              }
              return prev.map((r) => (r.id === next.id ? next : r));
            }
            if (payload.eventType === "DELETE") {
              return prev.filter((r) => r.id !== (payload.old as RepairRequest).id);
            }
            return prev;
          });
        }
      )
      .subscribe((status) => {
        setLive(status === "SUBSCRIBED");
      });

    return () => {
      supabase.removeChannel(channel);
    };
  }, [userId]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="animate-spin" size={32} />
      </div>
    );
  }

  return (
    <>
      <ShopNavbar />
      <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-accent/5">
        <div className="max-w-5xl mx-auto py-10 px-4">
          <Button
            variant="ghost"
            className="mb-2 pl-0 hover:bg-transparent text-muted-foreground"
            onClick={() => navigate("/dashboard")}
          >
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to Dashboard
          </Button>

          <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Track Orders & Inquiries</h1>
              <p className="text-sm text-muted-foreground">
                Live updates whenever the status of your orders or repair inquiries changes.
              </p>
            </div>
            <Badge
              variant="outline"
              className={`flex items-center gap-1.5 ${live ? "border-green-500/40 text-green-600" : "border-muted-foreground/30 text-muted-foreground"}`}
            >
              <RadioTower className={`w-3.5 h-3.5 ${live ? "animate-pulse" : ""}`} />
              {live ? "Live" : "Connecting…"}
              {lastUpdate && <span className="text-[10px] opacity-70">· {lastUpdate.toLocaleTimeString()}</span>}
            </Badge>
          </div>

          <div className="flex gap-2 mb-6">
            <Button
              variant={tab === "orders" ? "default" : "outline"}
              onClick={() => setTab("orders")}
              size="sm"
            >
              <Package className="w-4 h-4 mr-2" /> Orders ({orders.length})
            </Button>
            <Button
              variant={tab === "repairs" ? "default" : "outline"}
              onClick={() => setTab("repairs")}
              size="sm"
            >
              <Wrench className="w-4 h-4 mr-2" /> Repair Inquiries ({repairs.length})
            </Button>
          </div>

          {tab === "orders" && (
            <div className="space-y-4">
              {orders.length === 0 ? (
                <Card className="p-10 text-center border-accent/20 bg-card/40 backdrop-blur-md">
                  <Package className="w-8 h-8 mx-auto mb-3 text-muted-foreground" />
                  <p className="text-muted-foreground">No orders yet.</p>
                  <Button className="mt-4" onClick={() => navigate("/shop")}>Start Shopping</Button>
                </Card>
              ) : (
                orders.map((o) => (
                  <Card key={o.id} className="p-4 sm:p-6 border-accent/20 bg-card/40 backdrop-blur-sm hover:border-accent/40 transition-all">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                      <div className="flex-1 space-y-1">
                        <div className="text-xs text-muted-foreground font-mono uppercase tracking-widest">
                          Order #{o.id.slice(0, 8)} · {new Date(o.created_at).toLocaleDateString()}
                        </div>
                        <h3 className="font-semibold text-lg">
                          {products[o.product_id]?.title || "Product"}
                        </h3>
                        <div className="flex flex-wrap gap-2 pt-1">
                          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium border ${statusTone(o.status)}`}>
                            {statusIcon(o.status)} {o.status || "pending"}
                          </span>
                          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium border ${statusTone(o.payment_status)}`}>
                            {statusIcon(o.payment_status)} payment: {o.payment_status || "pending"}
                          </span>
                        </div>
                      </div>
                      <div className="flex flex-col items-start md:items-end gap-2">
                        <span className="text-lg font-bold text-primary">Ksh {o.amount.toLocaleString()}</span>
                        <div className="flex gap-2">
                          <Button size="sm" variant="ghost" onClick={() => toggle(`o-${o.id}`)}>
                            {expanded[`o-${o.id}`] ? <ChevronUp className="w-3.5 h-3.5 mr-1.5" /> : <ChevronDown className="w-3.5 h-3.5 mr-1.5" />}
                            History
                          </Button>
                          <Button size="sm" variant="outline" onClick={() => navigate(`/orders/${o.id}`)}>
                            <Eye className="w-3.5 h-3.5 mr-1.5" /> Details
                          </Button>
                        </div>
                      </div>
                    </div>
                    {expanded[`o-${o.id}`] && (
                      <div className="mt-5 pt-4 border-t border-border/50">
                        <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">Status Timeline</h4>
                        <StatusTimeline entityType="order" entityId={o.id} />
                      </div>
                    )}
                  </Card>
                ))
              )}
            </div>
          )}

          {tab === "repairs" && (
            <div className="space-y-4">
              {repairs.length === 0 ? (
                <Card className="p-10 text-center border-accent/20 bg-card/40 backdrop-blur-md">
                  <Wrench className="w-8 h-8 mx-auto mb-3 text-muted-foreground" />
                  <p className="text-muted-foreground">No repair inquiries submitted yet.</p>
                  <Button className="mt-4" onClick={() => navigate("/dashboard")}>Submit a Repair</Button>
                </Card>
              ) : (
                repairs.map((r) => (
                  <Card key={r.id} className="p-4 sm:p-6 border-accent/20 bg-card/40 backdrop-blur-sm">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                      <div className="flex-1 space-y-1">
                        <div className="text-xs text-muted-foreground font-mono uppercase tracking-widest">
                          Inquiry #{r.id.slice(0, 8)} · {new Date(r.created_at).toLocaleDateString()}
                        </div>
                        <h3 className="font-semibold text-lg">{r.device_type}</h3>
                        <p className="text-sm text-muted-foreground line-clamp-2">{r.problem_description}</p>
                      </div>
                      <div className="flex flex-col items-start md:items-end gap-2">
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium border ${statusTone(r.status)}`}>
                          {statusIcon(r.status)} {r.status.replace("_", " ")}
                        </span>
                        <Button size="sm" variant="ghost" onClick={() => toggle(`r-${r.id}`)}>
                          {expanded[`r-${r.id}`] ? <ChevronUp className="w-3.5 h-3.5 mr-1.5" /> : <ChevronDown className="w-3.5 h-3.5 mr-1.5" />}
                          History
                        </Button>
                      </div>
                    </div>
                    {expanded[`r-${r.id}`] && (
                      <div className="mt-5 pt-4 border-t border-border/50">
                        <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">Status Timeline</h4>
                        <StatusTimeline entityType="repair_request" entityId={r.id} />
                      </div>
                    )}
                  </Card>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
