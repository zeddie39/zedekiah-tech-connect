import AdminHamburger from "./AdminHamburger";
import { ROLE_NAMES } from "@/pages/Admin";
import { Card } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";

interface AdminNavbarProps {
  userEmail: string | null;
  role: string;
}

const AdminNavbar = ({ userEmail, role }: AdminNavbarProps) => {
  const navigate = useNavigate();
  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/"); // Redirect to home after logout
  };

  return (
    <nav className="w-full bg-primary text-white px-4 md:px-6 py-3 flex items-center justify-between shadow fixed top-0 left-0 right-0 z-30">
      <div className="flex items-center gap-2">
        <AdminHamburger />
        <span className="font-orbitron font-bold text-xl tracking-wider ml-2">Ztech Electronics Ltd</span>
        <span className="text-accent text-xs font-semibold ml-2 hidden sm:inline-block">Admin Panel</span>
      </div>
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 p-1 rounded-md bg-accent/10 border border-accent/10">
          <div className="w-8 h-8 rounded-full bg-muted/50 flex items-center justify-center text-primary text-base font-medium mr-1">
            <span className="font-bold">{(userEmail?.[0] || "A").toUpperCase()}</span>
          </div>
          <div className="flex flex-col items-start leading-tight">
            <span className="text-xs text-white font-semibold">{userEmail}</span>
            <span className="text-[10px] text-white/60 leading-none">{ROLE_NAMES[role]}</span>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="ml-2 px-3 py-1 rounded bg-accent text-white font-semibold hover:bg-accent/80 transition"
        >
          Logout
        </button>
      </div>
    </nav>
  );
};

export default AdminNavbar;
