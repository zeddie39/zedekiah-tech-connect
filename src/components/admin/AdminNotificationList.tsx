import { useEffect, useState, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Loader2, CheckCircle2, Info, Bell, AlertTriangle, XCircle } from "lucide-react";
import { toast } from "@/hooks/use-toast";

type Notification = {
  id: string;
  created_at: string | null;
  title: string;
  description: string | null;
  type: "info" | "warning" | "success" | "error";
  is_read: boolean;
  read_at: string | null;
};

function getIcon(type: string) {
  switch (type) {
    case "success":
      return <CheckCircle2 className="text-green-500 mr-2" size={18} />;
    case "warning":
      return <AlertTriangle className="text-yellow-500 mr-2" size={18} />;
    case "error":
      return <XCircle className="text-red-500 mr-2" size={18} />;
    case "info":
    default:
      return <Info className="text-blue-500 mr-2" size={18} />;
  }
}

export default function AdminNotificationList() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [marking, setMarking] = useState<string | null>(null);

  // Listen for real-time changes to the notifications table
  useEffect(() => {
    fetchNotifications();
    const channel = supabase
      .channel("schema-db-changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "notifications",
        },
        (payload) => {
          fetchNotifications(); // Refresh notifications on insert/update/delete
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
    // eslint-disable-next-line
  }, []);

  async function fetchNotifications() {
    setLoading(true);
    // Get user id for filtering
    const { data: { session } } = await supabase.auth.getSession();
    const userId = session?.user?.id || null;

    // Fetch notifications: global (user_id is null) + those for this admin
    const { data, error } = await supabase
      .from("notifications")
      .select("*")
      .or(`user_id.is.null,user_id.eq.${userId}`)
      .order("created_at", { ascending: false });

    if (error) {
      toast({
        variant: "destructive",
        title: "Error loading notifications",
        description: error.message,
      });
    }
    setNotifications((data || []) as Notification[]);
    setLoading(false);
  }

  async function markAsRead(id: string) {
    setMarking(id);
    const { error } = await supabase
      .from("notifications")
      .update({ is_read: true, read_at: new Date().toISOString() })
      .eq("id", id);
    setMarking(null);
    if (error) {
      toast({
        variant: "destructive",
        title: "Failed to mark as read",
        description: error.message,
      });
    }
  }

  async function markAllAsRead() {
    setMarking("all");
    const ids = notifications.filter((n) => !n.is_read).map((n) => n.id);
    if (ids.length === 0) return setMarking(null);
    const { error } = await supabase
      .from("notifications")
      .update({ is_read: true, read_at: new Date().toISOString() })
      .in("id", ids);
    setMarking(null);
    if (error) {
      toast({
        variant: "destructive",
        title: "Could not mark all as read",
        description: error.message,
      });
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-2 flex items-center gap-2 font-playfair">
        <Bell size={22} /> Notifications
      </h2>
      <div className="mb-2 flex items-center justify-between">
        <span className="text-muted-foreground text-sm">
          {notifications.filter((n) => !n.is_read).length} unread
        </span>
        <Button
          variant="outline"
          size="sm"
          disabled={marking === "all" || notifications.every((n) => n.is_read)}
          onClick={markAllAsRead}
        >
          {marking === "all" ? (
            <Loader2 className="animate-spin mr-2 h-4 w-4" />
          ) : null}
          Mark all as read
        </Button>
      </div>
      <Card className="divide-y overflow-hidden">
        {loading ? (
          <div className="p-8 flex justify-center items-center">
            <Loader2 className="animate-spin mr-2" />
            <span>Loading notifications...</span>
          </div>
        ) : notifications.length === 0 ? (
          <div className="p-8 text-center text-muted-foreground">
            No notifications yet.
          </div>
        ) : (
          <>
            {notifications.map((n) => (
              <div
                key={n.id}
                className={`flex gap-2 items-start p-4 ${n.is_read ? "bg-background" : "bg-blue-50 dark:bg-blue-950/30"}`}
              >
                <div className="mt-1">{getIcon(n.type)}</div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className={`font-semibold text-base ${n.is_read ? "" : "text-primary"}`}>
                      {n.title}
                    </span>
                    <Badge
                      className={`text-xs ml-2 ${n.type === "warning"
                        ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-200"
                        : n.type === "error"
                        ? "bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-200"
                        : n.type === "success"
                        ? "bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-200"
                        : "bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-200"
                        }`}
                    >
                      {n.type}
                    </Badge>
                    {!n.is_read && (
                      <Badge variant="secondary" className="ml-2">
                        New
                      </Badge>
                    )}
                  </div>
                  {n.description && <div className="text-muted-foreground text-sm mt-1">{n.description}</div>}
                  <div className="text-xs text-gray-400 mt-1">
                    {n.created_at
                      ? new Date(n.created_at).toLocaleString()
                      : ""}
                  </div>
                </div>
                {!n.is_read && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="ml-2"
                    onClick={() => markAsRead(n.id)}
                    disabled={marking === n.id}
                    aria-label="Mark as read"
                  >
                    {marking === n.id ? (
                      <Loader2 className="animate-spin" size={18} />
                    ) : (
                      <CheckCircle2 className="text-green-500" size={18} />
                    )}
                  </Button>
                )}
              </div>
            ))}
          </>
        )}
      </Card>
    </div>
  );
}
