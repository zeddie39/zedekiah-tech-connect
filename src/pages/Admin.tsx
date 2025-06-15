
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import AdminSidebar from "@/components/admin/AdminSidebar";
import { Card } from "@/components/ui/card";
import { Loader2 } from "lucide-react";

type Role = "super_admin" | "support_admin" | "data_analyst";

const ROLE_NAMES: Record<Role, string> = {
  super_admin: "Super Admin",
  support_admin: "Support Admin",
  data_analyst: "Data Analyst",
};

export default function AdminPanel() {
  const [loading, setLoading] = useState(true);
  const [role, setRole] = useState<Role | null>(null);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [denied, setDenied] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    let mounted = true;

    async function checkRole() {
      setLoading(true);
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) {
        navigate("/"); // redirect if not logged in
        return;
      }
      setUserEmail(session.user.email || null);

      // Fetch user role(s)
      const { data: roles, error } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", session.user.id);

      if (error || !roles || roles.length === 0) {
        setDenied(true);
        setLoading(false);
        return;
      }
      // Pick the "highest" role (for now)
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
    <div className="flex min-h-screen bg-muted">
      <AdminSidebar role={role} email={userEmail} />
      <main className="flex-1 p-8">
        <h1 className="text-3xl font-bold mb-4">Admin Panel</h1>
        <p className="mb-3">Welcome, <span className="font-semibold">{userEmail || "Admin"}</span>!</p>
        <div className="rounded-lg bg-card shadow p-8">
          <h2 className="text-xl font-semibold mb-2">Quick Preview</h2>
          <p className="mb-4">Use the sidebar to access site analytics, chat management, repair requests, notifications, reporting, workflows, team, and health monitoring.</p>
          <ul className="space-y-2">
            <li>📊 Analytics Dashboard</li>
            <li>💬 Chat Management</li>
            <li>🛠️ Repair Request Tools</li>
            <li>🔔 Real-Time Notifications</li>
            <li>🧑‍💼 Team & RBAC Management</li>
            <li>🖥️ System Health Monitor</li>
            <li>📄 Reporting</li>
            <li>⚙️ Workflow Automation</li>
          </ul>
        </div>
      </main>
    </div>
  );
}
