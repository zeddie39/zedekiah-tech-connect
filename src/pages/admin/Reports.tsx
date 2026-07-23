import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { BarChart2, FileText, Loader2 } from "lucide-react";
import AdminAdvancedReport from "@/components/admin/AdminAdvancedReport";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export default function AdminReports() {
  const [stats, setStats] = useState<{
    users: number;
    products: number;
    repairs: number;
    messages: number;
  }>({ users: 0, products: 0, repairs: 0, messages: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRealStats();
  }, []);

  async function fetchRealStats() {
    setLoading(true);
    try {
      // 1. Fetch total users
      const { count: usersCount } = await supabase
        .from("profiles")
        .select("*", { count: "exact", head: true });

      // 2. Fetch total products
      const { count: productsCount } = await supabase
        .from("products")
        .select("*", { count: "exact", head: true });

      // 3. Fetch total repairs
      const { count: repairsCount } = await supabase
        .from("repairs")
        .select("*", { count: "exact", head: true });

      // 4. Fetch total messages
      const { count: messagesCount } = await supabase
        .from("messages")
        .select("*", { count: "exact", head: true });

      setStats({
        users: usersCount ?? 0,
        products: productsCount ?? 0,
        repairs: repairsCount ?? 0,
        messages: messagesCount ?? 0,
      });
    } catch (e) {
      console.error("Error fetching stats:", e);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="pt-6 sm:pt-8">
      <h1 className="text-2xl font-bold mb-2 flex items-center gap-2">
        <FileText className="text-primary" size={26} /> Reporting & Analytics
      </h1>
      <p className="mb-6 text-muted-foreground text-sm">
        Review real-time system metrics and activity reports.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center gap-3 pb-2">
            <BarChart2 size={24} className="text-primary" />
            <div>
              <CardTitle className="text-lg">Analytics Summary</CardTitle>
              <CardDescription>Live database metrics</CardDescription>
            </div>
          </CardHeader>
          <CardContent className="pt-2">
            {loading ? (
              <div className="flex items-center gap-2 py-4 text-sm text-muted-foreground">
                <Loader2 size={16} className="animate-spin" /> Loading stats...
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                <div className="flex justify-between text-sm py-1 border-b border-border/40">
                  <span className="text-muted-foreground font-medium">Registered Users</span>
                  <span className="font-bold text-primary">{stats.users}</span>
                </div>
                <div className="flex justify-between text-sm py-1 border-b border-border/40">
                  <span className="text-muted-foreground font-medium">Total Products</span>
                  <span className="font-bold text-primary">{stats.products}</span>
                </div>
                <div className="flex justify-between text-sm py-1 border-b border-border/40">
                  <span className="text-muted-foreground font-medium">Total Repairs</span>
                  <span className="font-bold text-primary">{stats.repairs}</span>
                </div>
                <div className="flex justify-between text-sm py-1">
                  <span className="text-muted-foreground font-medium">Customer Messages</span>
                  <span className="font-bold text-primary">{stats.messages}</span>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">System Reports</CardTitle>
            <CardDescription>Export and generate detailed reports</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="mb-4 text-muted-foreground text-sm">
              Download recent admin activity, repair requests, and message logs.
            </div>
            <button
              onClick={() => window.print()}
              className="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition shadow-sm"
            >
              Export Reports
            </button>
          </CardContent>
        </Card>
      </div>
      <div className="mt-8">
        <AdminAdvancedReport />
      </div>
    </div>
  );
}
