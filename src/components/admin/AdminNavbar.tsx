import { ROLE_NAMES } from "@/pages/Admin";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate, useLocation } from "react-router-dom";
import { LogOut, Search, Home, Bell, ChevronRight, Menu } from "lucide-react";
import { useSidebar } from "@/components/ui/sidebar";

interface AdminNavbarProps {
  userEmail: string | null;
  role: string;
}

const PAGE_TITLES: Record<string, string> = {
  "/admin": "Dashboard",
  "/admin/gallery-manager": "Gallery Manager",
  "/admin/chat": "Chat",
  "/admin/repairs": "Repairs",
  "/admin/notifications": "Notifications",
  "/admin/team": "Team & Roles",
  "/admin/health": "Health Monitor",
  "/admin/reports": "Reports",
  "/admin/workflow": "Workflow",
  "/admin/users": "User Management",
  "/admin/products": "Product Management",
  "/admin/ProductsApproval": "Product Approvals",
};

const AdminNavbar = ({ userEmail, role }: AdminNavbarProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toggleSidebar } = useSidebar();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  const currentPage = PAGE_TITLES[location.pathname] || "Admin";

  return (
    <nav
      className="w-full h-14 bg-white border-b border-gray-200 px-4 md:px-6 flex items-center justify-between fixed top-0 left-0 right-0 z-50 shadow-sm"
    >
      {/* Left: Logo + Breadcrumb */}
      <div className="flex items-center gap-3">
        <button
          onClick={toggleSidebar}
          className="md:hidden p-2 -ml-2 rounded-lg text-gray-500 hover:text-gray-900 hover:bg-gray-100 transition-all"
        >
          <Menu size={20} />
        </button>

        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-2 hover:opacity-80 transition-opacity"
        >
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center shadow-md shadow-primary/20">
            <span className="text-primary-foreground font-black text-sm">Z</span>
          </div>
          <span className="font-bold text-sm tracking-wide text-primary hidden sm:block">
            Ztech
          </span>
        </button>

        <ChevronRight size={14} className="text-muted-foreground hidden sm:block" />
        <span className="text-sm font-medium text-accent hidden sm:block">
          {currentPage}
        </span>
      </div>

      {/* Right: User */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => navigate("/")}
          className="p-2 rounded-lg text-muted-foreground hover:text-primary hover:bg-accent/10 transition-all"
          title="Go to site"
        >
          <Home size={18} />
        </button>

        <div className="h-5 w-px bg-border mx-1" />

        {/* User chip */}
        <div className="flex items-center gap-2.5 pl-2 pr-3 py-1.5 rounded-full bg-secondary border border-border">
          <div className="w-7 h-7 rounded-full bg-accent flex items-center justify-center text-accent-foreground text-xs font-bold shadow-sm">
            {(userEmail?.[0] || "A").toUpperCase()}
          </div>
          <div className="hidden sm:flex flex-col leading-tight">
            <span className="text-[11px] text-foreground font-semibold">
              {userEmail}
            </span>
            <span className="text-[9px] text-accent font-bold uppercase tracking-wider">
              {ROLE_NAMES[role] || role}
            </span>
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="p-2 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-all ml-1"
          title="Logout"
        >
          <LogOut size={18} />
        </button>
      </div>
    </nav>
  );
};

export default AdminNavbar;
