import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ChartContainer, ChartLegendContent, ChartTooltipContent } from "@/components/ui/chart";
import {
  AreaChart, Area, XAxis, YAxis, ResponsiveContainer, Tooltip, PieChart, Pie, Cell, Legend,
} from "recharts";
import { BarChart2, TrendingUp, DollarSign, ShoppingCart, Users, Loader2 } from "lucide-react";
import { motion } from "framer-motion";

type OrderRow = {
  amount: number;
  status: string | null;
  payment_status: string | null;
  buyer_id: string;
  created_at: string | null;
};

const chartConfig = {
  revenue: { label: "Revenue (Ksh)", color: "hsl(var(--primary))", icon: DollarSign },
  orders: { label: "Orders", color: "hsl(var(--accent))", icon: ShoppingCart },
};

const STATUS_COLORS = ["hsl(var(--primary))", "#34d399", "#818cf8", "#f59e0b", "#ef4444", "#a78bfa"];

export default function AdminAnalyticsWidget() {
  const [orders, setOrders] = useState<OrderRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    (async () => {
      const since = new Date();
      since.setDate(since.getDate() - 180);
      const { data } = await supabase
        .from("orders")
        .select("amount, status, payment_status, buyer_id, created_at")
        .gte("created_at", since.toISOString())
        .order("created_at", { ascending: true });
      if (!mounted) return;
      setOrders((data ?? []) as OrderRow[]);
      setLoading(false);
    })();

    const channel = supabase
      .channel("admin-analytics-orders")
      .on("postgres_changes", { event: "*", schema: "public", table: "orders" }, () => {
        supabase
          .from("orders")
          .select("amount, status, payment_status, buyer_id, created_at")
          .order("created_at", { ascending: true })
          .then(({ data }) => setOrders((data ?? []) as OrderRow[]));
      })
      .subscribe();

    return () => {
      mounted = false;
      supabase.removeChannel(channel);
    };
  }, []);

  const { monthly, statusBreakdown, totals } = useMemo(() => {
    const map: Record<string, { month: string; revenue: number; orders: number }> = {};
    const statusMap: Record<string, number> = {};
    const buyers = new Set<string>();
    let revenue = 0;
    let paidRevenue = 0;

    orders.forEach((o) => {
      const d = o.created_at ? new Date(o.created_at) : new Date();
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
      const label = d.toLocaleDateString("en-US", { month: "short" });
      if (!map[key]) map[key] = { month: label, revenue: 0, orders: 0 };
      map[key].orders += 1;
      const amt = Number(o.amount) || 0;
      revenue += amt;
      if (o.payment_status === "paid") { paidRevenue += amt; map[key].revenue += amt; }
      const s = o.status || "pending";
      statusMap[s] = (statusMap[s] || 0) + 1;
      buyers.add(o.buyer_id);
    });

    const monthly = Object.entries(map)
      .sort(([a], [b]) => a.localeCompare(b))
      .slice(-6)
      .map(([, v]) => v);

    const statusBreakdown = Object.entries(statusMap).map(([name, value]) => ({ name, value }));
    return {
      monthly,
      statusBreakdown,
      totals: {
        orders: orders.length,
        revenue,
        paidRevenue,
        buyers: buyers.size,
      },
    };
  }, [orders]);

  if (loading) {
    return (
      <Card>
        <CardContent className="py-12 flex justify-center">
          <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { label: "Total Revenue", value: `Ksh ${totals.revenue.toLocaleString()}`, icon: DollarSign, tone: "text-primary" },
          { label: "Paid Revenue", value: `Ksh ${totals.paidRevenue.toLocaleString()}`, icon: TrendingUp, tone: "text-green-500" },
          { label: "Orders", value: totals.orders.toLocaleString(), icon: ShoppingCart, tone: "text-blue-500" },
          { label: "Unique Buyers", value: totals.buyers.toLocaleString(), icon: Users, tone: "text-purple-500" },
        ].map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.06 }}
          >
            <Card className="border-accent/20 hover:border-primary/40 transition-colors">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <p className="text-xs uppercase tracking-wider text-muted-foreground">{s.label}</p>
                  <s.icon className={`w-4 h-4 ${s.tone}`} />
                </div>
                <p className="text-2xl font-bold mt-1">{s.value}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <BarChart2 className="text-primary" size={20} /> Revenue & Orders — Last 6 Months
            </CardTitle>
            <CardDescription>Live from your orders table</CardDescription>
          </CardHeader>
          <CardContent>
            {monthly.length === 0 ? (
              <p className="text-sm text-muted-foreground py-8 text-center">No orders yet.</p>
            ) : (
              <ChartContainer config={chartConfig} className="h-[260px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={monthly}>
                    <defs>
                      <linearGradient id="rev" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity={0.5} />
                        <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="ord" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="hsl(var(--accent))" stopOpacity={0.5} />
                        <stop offset="100%" stopColor="hsl(var(--accent))" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                    <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                    <Tooltip content={<ChartTooltipContent />} />
                    <Area type="monotone" dataKey="revenue" stroke="hsl(var(--primary))" fill="url(#rev)" strokeWidth={2} />
                    <Area type="monotone" dataKey="orders" stroke="hsl(var(--accent))" fill="url(#ord)" strokeWidth={2} />
                    <Legend content={<ChartLegendContent />} />
                  </AreaChart>
                </ResponsiveContainer>
              </ChartContainer>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Order Status</CardTitle>
            <CardDescription>Breakdown by state</CardDescription>
          </CardHeader>
          <CardContent>
            {statusBreakdown.length === 0 ? (
              <p className="text-sm text-muted-foreground py-8 text-center">No data.</p>
            ) : (
              <ResponsiveContainer width="100%" height={240}>
                <PieChart>
                  <Pie
                    data={statusBreakdown}
                    dataKey="value"
                    nameKey="name"
                    innerRadius={50}
                    outerRadius={80}
                    paddingAngle={3}
                  >
                    {statusBreakdown.map((_, i) => (
                      <Cell key={i} fill={STATUS_COLORS[i % STATUS_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend wrapperStyle={{ fontSize: 12 }} />
                </PieChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
