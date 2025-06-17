import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Loader2 } from "lucide-react";

// Restrict supabaseTable to valid literal table names
type SupabaseTable =
  | "blog_posts"
  | "contact_messages"
  | "message_replies"
  | "messages"
  | "notifications"
  | "profiles"
  | "quotes"
  | "repair_requests"
  | "services"
  | "team_members"
  | "testimonials"
  | "user_roles";

interface DashboardWidgetProps {
  label: string;
  supabaseTable: SupabaseTable;
}

export default function DashboardWidget({ label, supabaseTable }: DashboardWidgetProps) {
  const [count, setCount] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    async function fetchCount() {
      setLoading(true);
      const { count, error } = await supabase
        .from(supabaseTable)
        .select("*", { count: "exact", head: true });
      if (mounted) setCount(typeof count === "number" ? count : 0);
      setLoading(false);
    }
    fetchCount();
    return () => {
      mounted = false;
    };
  }, [supabaseTable]);

  return (
    <Card className="p-4 flex flex-col items-center justify-center text-center bg-card border">
      <div className="text-sm text-muted-foreground">{label}</div>
      <div className="text-3xl font-bold mt-2 mb-1 h-10 flex items-center justify-center">
        {loading ? <Loader2 className="animate-spin" size={28} /> : count}
      </div>
    </Card>
  );
}
