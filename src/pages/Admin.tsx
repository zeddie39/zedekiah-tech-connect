import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, ShieldAlert } from "lucide-react";
import AdminNavbar from "@/components/admin/AdminNavbar";
import AdminSidebar from "@/components/admin/AdminSidebar";
import DashboardHome from "./admin/DashboardHome";

type Role = "super_admin" | "support_admin" | "data_analyst";

export const ROLE_NAMES: Record<string, string> = {
  super_admin: "Super Admin",
  support_admin: "Support Admin",
  data_analyst: "Data Analyst",
};

export default function AdminLayout() {
  const [loading, setLoading] = useState(true);
  const [role, setRole] = useState<Role | null>(null);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [denied, setDenied] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    let mounted = true;

    async function checkRole() {
      setLoading(true);
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session?.user) {
        navigate("/");
        return;
      }
      setUserEmail(session.user.email || null);

      const { data: roles, error } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", session.user.id);

      if (error || !roles || roles.length === 0) {
        setDenied(true);
        setLoading(false);
        return;
      }

      const userRole = roles[0].role as Role;
      if (
        ["super_admin", "support_admin", "data_analyst"].includes(userRole)
      ) {
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

  /* ── Loading ── */
  if (loading) {
    return (
      <div
        className="min-h-screen flex flex-col items-center justify-center bg-gray-50"
      >
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 rounded-full border-2 border-orange-500/30 border-t-orange-500 animate-spin" />
          <p className="text-gray-500 text-sm animate-pulse">
            Verifying admin access...
          </p>
        </div>
      </div>
    );
  }

  /* ── Denied ── */
  if (denied || !role) {
    return (
      <div
        className="min-h-screen flex flex-col items-center justify-center bg-gray-50"
      >
        <div className="max-w-md w-full mx-4 p-8 rounded-2xl text-center border border-red-200 bg-red-50">
          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-red-100 flex items-center justify-center">
            <ShieldAlert className="text-red-500" size={28} />
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Access Denied</h2>
          <p className="text-gray-600 text-sm leading-relaxed">
            This admin panel is restricted to authorized staff. If you believe
            this is a mistake, contact the site administrator.
          </p>
          <button
            onClick={() => navigate("/")}
            className="mt-6 px-6 py-2.5 rounded-lg text-sm font-semibold bg-white border border-gray-200 text-gray-700 hover:text-gray-900 hover:bg-gray-50 transition-all shadow-sm"
          >
            Return to Homepage
          </button>
        </div>
      </div>
    );
  }

  /* ── Main Layout ── */
  const isAdminDashboard = location.pathname === "/admin";

  return (
    <div className="light">
      <SidebarProvider>
        <AdminNavbar userEmail={userEmail} role={role} />
        <div
          className="min-h-screen flex w-full text-gray-900 bg-gray-50 pt-14"
        >
          <AdminSidebar />
          <SidebarInset className="flex-1 flex flex-col min-w-0 bg-gray-50">
            <main
              className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 text-gray-900"
            >
              {isAdminDashboard && <DashboardHome />}
              <Outlet />
            </main>
          </SidebarInset>
        </div>
      </SidebarProvider>
    </div>
  );
}
