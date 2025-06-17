import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

export default function AdminLogout() {
  const navigate = useNavigate();
  useEffect(() => {
    async function logout() {
      await supabase.auth.signOut();
      navigate("/");
    }
    logout();
  }, [navigate]);
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-xl font-bold text-primary animate-pulse">Logging out...</div>
    </div>
  );
}
