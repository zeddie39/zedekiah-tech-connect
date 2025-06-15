import { Outlet, NavLink, useLocation } from "react-router-dom";
import {
  SidebarProvider,
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarTrigger,
  SidebarInset,
} from "@/components/ui/sidebar";
import { BarChart2, MessagesSquare, Wrench, Bell, Users, Activity, FileText, Repeat } from "lucide-react";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

type Role = "super_admin" | "support_admin" | "data_analyst";

const ADMIN_ITEMS = [
  {
    label: "Dashboard",
    icon: BarChart2,
    path: "/admin",
  },
  {
    label: "Chat",
    icon: MessagesSquare,
    path: "/admin/chat",
  },
  {
    label: "Repairs",
    icon: Wrench,
    path: "/admin/repairs",
  },
  {
    label: "Notifications",
    icon: Bell,
    path: "/admin/notifications",
  },
  {
    label: "Team & Roles",
    icon: Users,
    path: "/admin/team",
  },
  {
    label: "Health Monitor",
    icon: Activity,
    path: "/admin/health",
  },
  {
    label: "Reports",
    icon: FileText,
    path: "/admin/reports",
  },
  {
    label: "Workflow",
    icon: Repeat,
    path: "/admin/workflow",
  },
];

const ROLE_NAMES: Record<Role, string> = {
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
      <div className="min-h-screen flex flex-col items-center justify-center">
        <Loader2 className="animate-spin mb-4" size={42} />
        <p className="text-lg text-muted-foreground">Checking admin access...</p>
      </div>
    );
  }

  if (denied || !role) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <Card className="p-8 text-center max-w-xl">
          <h2 className="text-2xl font-bold mb-2">Access Denied</h2>
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

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-muted">
        <Sidebar>
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel>
                <div className="mb-2">
                  <div className="text-xl font-bold font-orbitron">Zedekiah Admin</div>
                </div>
                <div className="mb-1">
                  <span className="text-xs text-gray-400 block">{ROLE_NAMES[role]}</span>
                </div>
                <div>
                  <span className="text-xs text-muted-foreground block">{userEmail}</span>
                </div>
              </SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {ADMIN_ITEMS.map(({ label, icon: Icon, path }) => (
                    <SidebarMenuItem key={path}>
                      <SidebarMenuButton asChild isActive={location.pathname === path}>
                        <NavLink
                          to={path}
                          className={({ isActive }) =>
                            "flex items-center gap-2 px-2 py-2 rounded transition " +
                            (isActive
                              ? "bg-accent text-primary font-semibold"
                              : "hover:bg-accent/80 text-sidebar-foreground")
                          }
                        >
                          <Icon size={20} className="mr-1" />
                          <span>{label}</span>
                        </NavLink>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
        </Sidebar>
        <SidebarInset className="flex-1 flex flex-col">
          <header className="flex items-center justify-between p-4 border-b bg-card/80 shadow-sm sticky top-0 z-10">
            <SidebarTrigger />
            <span className="font-medium">Welcome, {userEmail || "Admin"}!</span>
            <button
              className="text-xs text-muted-foreground hover:underline"
              onClick={() => setShowDebug((v) => !v)}
              aria-expanded={showDebug}
            >
              {showDebug ? "Hide Debug" : "Show Debug"}
            </button>
          </header>
          {showDebug && (
            <div className="bg-card/70 p-3 border-b">
              <div className="text-xs">
                <span className="font-semibold">Email:</span> {userEmail || "(none)"}
              </div>
              <div className="text-xs">
                <span className="font-semibold">User ID:</span> {userId || "(none)"}
              </div>
              <div className="text-xs">
                <span className="font-semibold">Roles:</span>{" "}
                {statuses.roles.length === 0 ? (
                  <span className="text-red-500">No roles assigned</span>
                ) : (
                  statuses.roles.map((r) => (
                    <span key={r} className="inline-block mr-2 px-2 py-0.5 bg-gray-200 rounded">
                      {ROLE_NAMES[r as Role] || r}
                    </span>
                  ))
                )}
              </div>
            </div>
          )}
          <main className="flex-1 p-8">
            <Outlet />
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
