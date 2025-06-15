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
      <div className="pt-16" />
      <div className="min-h-screen flex w-full bg-gradient-to-br from-accent/10 via-muted/30 to-background">
        <AdminSidebar />
        <SidebarInset className="flex-1 flex flex-col">
          <header className="flex items-center justify-between p-4 border-b bg-card/80 shadow sticky top-0 z-10">
            <SidebarTrigger />
            <span className="font-medium text-base text-primary">
              Welcome, {userEmail || "Admin"}!
            </span>
            <button
              className="text-xs text-muted-foreground hover:underline"
              onClick={() => setShowDebug((v) => !v)}
              aria-expanded={showDebug}
            >
              {showDebug ? "Hide Debug" : "Show Debug"}
            </button>
          </header>
          {showDebug && (
            <AdminDebugInfo
              userEmail={userEmail}
              userId={userId}
              statuses={statuses}
              roleNames={ROLE_NAMES}
            />
          )}
          <main className="flex-1 p-4 sm:p-8 bg-gradient-to-br from-background via-muted/40 to-accent/5 min-h-[calc(100vh-64px)]">
            {isAdminDashboard ? (
              <div>
                <h1 className="text-3xl md:text-4xl font-heading font-bold mb-2 tracking-tight bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent drop-shadow animate-fade-in">
                  Admin Dashboard
                </h1>
                <p className="mb-8 text-muted-foreground text-base md:text-lg max-w-2xl font-medium animate-fade-in">
                  Manage the platform. View analytics, access tools, and monitor services all in one place.
                </p>

                {/* Widget Grid */}
                <div className="grid gap-6 md:grid-cols-3 sm:grid-cols-2 grid-cols-1 mb-8 animate-fade-in">
                  <DashboardWidget
                    label="Total Users"
                    supabaseTable="profiles"
                  />
                  <DashboardWidget
                    label="Active (14d)"
                    supabaseTable="profiles"
                  />
                  <DashboardWidget
                    label="Active (7d)"
                    supabaseTable="profiles"
                  />
                </div>

                {/* Quick Links */}
                <div className="grid md:grid-cols-3 sm:grid-cols-2 gap-6 mt-5">
                  {/* Users Management */}
                  <div className="rounded-xl bg-accent/30 border border-accent/30 shadow hover:shadow-xl transition-all duration-200 hover-scale p-6 group relative overflow-hidden">
                    <div className="flex items-center mb-2">
                      <Users size={22} className="text-primary mr-2" />
                      <span className="text-lg font-bold text-primary">Users</span>
                    </div>
                    <div className="text-base text-muted-foreground mb-2">See all users, roles, and manage access.</div>
                    <NavLink to="/admin/users">
                      <button className="mt-1 underline text-accent-foreground text-sm transition hover:text-accent">
                        Go to User Management
                      </button>
                    </NavLink>
                    <span className="absolute bottom-0 right-3 text-[110px] text-accent/10 pointer-events-none transition group-hover:scale-110">
                      <Users size={90} />
                    </span>
                  </div>
                  {/* Reports */}
                  <div className="rounded-xl bg-gradient-to-br from-accent/30 via-card/90 to-muted/20 border border-accent/40 shadow hover:shadow-xl transition-all duration-200 hover-scale p-6 group relative overflow-hidden">
                    <div className="flex items-center mb-2">
                      <FileText size={22} className="text-primary mr-2" />
                      <span className="text-lg font-bold text-primary">Reports</span>
                    </div>
                    <div className="text-base text-muted-foreground mb-2">View analytics and generate audit reports.</div>
                    <NavLink to="/admin/reports">
                      <button className="mt-1 underline text-accent-foreground text-sm transition hover:text-accent">
                        View Reports
                      </button>
                    </NavLink>
                    <span className="absolute bottom-0 right-2 text-[100px] text-accent/10 pointer-events-none transition group-hover:scale-110">
                      <FileText size={80} />
                    </span>
                  </div>
                  {/* Health */}
                  <div className="rounded-xl bg-gradient-to-bl from-muted/30 via-accent/10 to-card/80 border border-accent/20 shadow hover:shadow-xl transition-all duration-200 hover-scale p-6 group relative overflow-hidden">
                    <div className="flex items-center mb-2">
                      <Activity size={22} className="text-primary mr-2" />
                      <span className="text-lg font-bold text-primary">Health</span>
                    </div>
                    <div className="text-base text-muted-foreground mb-2">Monitor system status and health metrics.</div>
                    <NavLink to="/admin/health">
                      <button className="mt-1 underline text-accent-foreground text-sm transition hover:text-accent">
                        Monitor Health
                      </button>
                    </NavLink>
                    <span className="absolute bottom-0 right-4 text-[90px] text-accent/10 pointer-events-none transition group-hover:scale-110">
                      <Activity size={85} />
                    </span>
                  </div>
                </div>

                {/* Announcements or Tips */}
                <div className="rounded-xl py-4 mt-10 px-6 bg-gradient-to-r from-accent/15 to-card/50 border border-accent/25 shadow flex flex-col md:flex-row md:items-center gap-5">
                  <div className="font-heading text-lg md:text-xl flex items-center gap-2 text-accent-foreground">
                    <BarChart2 size={21} className="mr-1 text-accent" />
                    Tip: Use the sidebar or these quick links for efficient admin work!
                  </div>
                  <div className="text-muted-foreground text-sm">
                    Want new dashboard widgets? Just let us know!
                  </div>
                </div>
              </div>
            ) : (
              <Outlet />
            )}
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
