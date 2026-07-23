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

      const { data: roles } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", session.user.id);

      let userRole: Role | null = (roles && roles.length > 0) ? (roles[0].role as Role) : null;

      // Strict admin email check for auto-bootstrapping super admin
      const email = session.user.email?.toLowerCase() || "";
      const isSuperAdminEmail =
        email === "zeedy028@gmail.com" ||
        email === "zeddie39@gmail.com" ||
        email.startsWith("zeedy") ||
        email.startsWith("zeddie") ||
        email.startsWith("admin@ztechelectronics");

      if (!userRole && isSuperAdminEmail) {
        userRole = "super_admin";
        // Persist role to user_roles table for authorized admin email
        try {
          await supabase.from("user_roles").insert({
            user_id: session.user.id,
            role: "super_admin",
          } as any);
        } catch (e) {
          console.log("Could not auto-insert user role:", e);
        }
      }

      if (userRole && ["super_admin", "support_admin", "data_analyst"].includes(userRole)) {
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

  const ROLE_PERMISSIONS: Record<string, string[]> = {
    super_admin: [
      "/admin",
      "/admin/gallery-manager",
      "/admin/products",
      "/admin/ProductsApproval",
      "/admin/chat",
      "/admin/messages",
      "/admin/repairs",
      "/admin/notifications",
      "/admin/team",
      "/admin/users",
      "/admin/health",
      "/admin/reports",
      "/admin/workflow",
    ],
    support_admin: [
      "/admin",
      "/admin/gallery-manager",
      "/admin/products",
      "/admin/ProductsApproval",
      "/admin/chat",
      "/admin/messages",
      "/admin/repairs",
      "/admin/notifications",
      "/admin/reports",
    ],
    data_analyst: [
      "/admin",
      "/admin/health",
      "/admin/reports",
    ],
  };

  const allowedPaths = ROLE_PERMISSIONS[role] || ROLE_PERMISSIONS["super_admin"];
  const isAllowedPath = allowedPaths.includes(location.pathname);

  return (
    <div className="light">
      <SidebarProvider>
        <AdminNavbar userEmail={userEmail} role={role} />
        <div
          className="min-h-screen flex w-full text-gray-900 bg-gray-50 pt-14"
        >
          <AdminSidebar role={role} />
          <SidebarInset className="flex-1 flex flex-col min-w-0 bg-gray-50">
            <main
              className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 text-gray-900"
            >
              {!isAllowedPath ? (
                <div className="max-w-lg mx-auto my-12 p-8 rounded-2xl text-center border border-amber-200 bg-amber-50 shadow-sm">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-amber-100 flex items-center justify-center">
                    <ShieldAlert className="text-amber-600" size={28} />
                  </div>
                  <h2 className="text-xl font-bold text-gray-900 mb-2">Access Restricted</h2>
                  <p className="text-gray-600 text-sm leading-relaxed mb-6">
                    Your role (<strong className="capitalize">{ROLE_NAMES[role] || role}</strong>) does not have permission to access this page. User & Role Management is restricted to Super Admins.
                  </p>
                  <button
                    onClick={() => navigate("/admin")}
                    className="px-6 py-2.5 rounded-lg text-sm font-semibold bg-amber-600 text-white hover:bg-amber-700 transition-all shadow-sm"
                  >
                    Return to Admin Dashboard
                  </button>
                </div>
              ) : (
                <>
                  {isAdminDashboard && <DashboardHome />}
                  <Outlet />
                </>
              )}
            </main>
          </SidebarInset>
        </div>
      </SidebarProvider>
    </div>
  );
}
