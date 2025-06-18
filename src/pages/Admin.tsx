import { Outlet, useLocation, useNavigate, NavLink } from "react-router-dom";
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import DashboardWidget from "@/components/admin/DashboardWidget";
import AdminUsers from "./admin/Users";
import AdminHamburger from "@/components/admin/AdminHamburger";
import AdminNavbar from "@/components/admin/AdminNavbar";
import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminDebugInfo from "@/components/admin/AdminDebugInfo";
import AdminAnalyticsWidget from "@/components/admin/AdminAnalyticsWidget";
import DashboardHome from "./admin/DashboardHome";

// Lucide icons for dashboard cards and quick links
import { BarChart2, FileText, Users, Activity } from "lucide-react";

type Role = "super_admin" | "support_admin" | "data_analyst";

export const ROLE_NAMES: Record<Role, string> = {
  super_admin: "Super Admin",
  support_admin: "Support Admin",
  data_analyst: "Data Analyst",
};

export default function AdminLayout() {
  const [loading, setLoading] = useState(true);
  const [role, setRole] = useState<Role | null>(null);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [statuses, setStatuses] = useState<{ roles: string[] }>({ roles: [] });
  const [denied, setDenied] = useState(false);
  const [showDebug, setShowDebug] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    let mounted = true;

    async function checkRole() {
      setLoading(true);
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) {
        navigate("/");
        return;
      }
      setUserEmail(session.user.email || null);
      setUserId(session.user.id || null);

      const { data: roles, error } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", session.user.id);

      setStatuses({ roles: roles ? roles.map((r) => r.role) : [] });

      if (error || !roles || roles.length === 0) {
        setDenied(true);
        setLoading(false);
        return;
      }

      const userRole = roles[0].role as Role;
      if (["super_admin", "support_admin", "data_analyst"].includes(userRole)) {
        if (mounted) setRole(userRole);
      } else {
        setDenied(true);
      }
      setLoading(false);
    }
    checkRole();

    return () => {
      mounted = false;
    };
  }, [navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background">
        <Loader2 className="animate-spin mb-4 text-accent" size={42} />
        <p className="text-lg text-muted-foreground">Checking admin access...</p>
      </div>
    );
  }

  if (denied || !role) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background">
        <Card className="p-8 text-center max-w-xl bg-card/95 border border-accent">
          <h2 className="text-2xl font-bold mb-2 text-destructive">Access Denied</h2>
          <p className="text-gray-500">
            This admin panel is only accessible to authorized staff.
          </p>
          <p className="text-gray-500 mt-2">
            If you believe this is a mistake, contact the site administrator.
          </p>
        </Card>
      </div>
    );
  }

  // --- Dashboard Content ---
  const isAdminDashboard = location.pathname === "/admin";
  return (
    <SidebarProvider>
      <AdminNavbar userEmail={userEmail} role={role} />
      <div className="pt-24 sm:pt-28" />
      <div className="min-h-screen flex flex-col md:flex-row w-full bg-gradient-to-br from-accent/10 via-muted/30 to-background">
        <AdminSidebar />
        <SidebarInset className="flex-1 flex flex-col px-2 sm:px-4 md:px-8 py-2 sm:py-4">
          <header className="flex flex-col sm:flex-row items-center justify-between gap-2 p-2 sm:p-4 border-b bg-card/80 shadow sticky top-0 z-10">
            <SidebarTrigger />
            <span className="font-medium text-sm sm:text-base text-primary">
              Welcome, {userEmail || "Admin"}!
            </span>
            <button
              className="text-xs text-muted-foreground hover:underline mt-2 sm:mt-0"
              onClick={() => setShowDebug((v) => !v)}
              aria-expanded={showDebug}
            >
              {showDebug ? "Hide Debug" : "Show Debug"}
            </button>
          </header>
          <main className="flex-1 w-full max-w-6xl mx-auto py-2 sm:py-4 relative">
            {isAdminDashboard && <DashboardHome />}
            <Outlet />
            {showDebug && (
              <div className="absolute left-0 right-0 top-full mt-2 z-50">
                <AdminDebugInfo userId={userId} userEmail={userEmail} statuses={statuses} roleNames={ROLE_NAMES} />
              </div>
            )}
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
