import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import ProfileSection from "@/components/dashboard/ProfileSection";
import RepairRequests from "@/components/dashboard/RepairRequests";
import Chat from "@/components/dashboard/Chat";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";

export default function Dashboard() {
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState<any>(null);
  const navigate = useNavigate();
  const [drawerOpen, setDrawerOpen] = useState(false);

  useEffect(() => {
    let mounted = true;
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session && mounted) navigate("/auth");
      setSession(session);
      setLoading(false);
    });
    const { data: subscription } = supabase.auth.onAuthStateChange((event, session) => {
      if (!session) navigate("/auth");
      setSession(session);
    });
    return () => {
      mounted = false;
      subscription?.subscription.unsubscribe();
    };
  }, [navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="animate-spin" size={38} />
      </div>
    );
  }

  if (!session) return null;

  // Responsive drawer menu for mobile dashboard
  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-muted">
      {/* Mobile Hamburger */}
      <div className="md:hidden flex items-center justify-between px-4 py-2 bg-primary text-white sticky top-0 z-40">
        <span className="font-bold text-lg">User Dashboard</span>
        <button
          className="rounded p-1 hover:bg-primary/30"
          onClick={() => setDrawerOpen(!drawerOpen)}
          aria-label="Open Menu"
        >
          <Menu size={28} />
        </button>
      </div>
      {/* Mobile Drawer menu */}
      {drawerOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 flex">
          <aside className="bg-primary w-[220px] h-full p-6 flex flex-col text-white animate-slide-in-right">
            <button
              className="mb-6 self-end"
              onClick={() => setDrawerOpen(false)}
              aria-label="Close Menu"
            >
              ✕
            </button>
            <nav className="space-y-3">
              <a href="#profile" className="block hover:underline" onClick={() => setDrawerOpen(false)}>Profile</a>
              <a href="#repairs" className="block hover:underline" onClick={() => setDrawerOpen(false)}>Repair Requests</a>
              <a href="#chat" className="block hover:underline" onClick={() => setDrawerOpen(false)}>Support Chat</a>
              <hr className="border-white/30 my-2" />
              <a href="/admin" className="block hover:underline" onClick={() => setDrawerOpen(false)}>Admin Panel</a>
            </nav>
            <Button
              variant="secondary"
              className="mt-6"
              onClick={async () => { await supabase.auth.signOut(); navigate("/"); }}
            >Logout</Button>
          </aside>
          <div className="flex-1" tabIndex={-1} aria-hidden onClick={() => setDrawerOpen(false)} />
        </div>
      )}

      {/* Sidebar for Desktop */}
      <aside className="hidden md:block w-56 bg-primary text-white flex-shrink-0 p-4">
        <div className="mb-6">
          <div className="font-bold text-xl">User Dashboard</div>
          <Button
            variant="secondary"
            className="mt-4"
            onClick={async () => { await supabase.auth.signOut(); navigate("/"); }}
          >
            Logout
          </Button>
        </div>
        <nav className="space-y-3">
          <a href="#profile" className="block hover:underline">Profile</a>
          <a href="#repairs" className="block hover:underline">Repair Requests</a>
          <a href="#chat" className="block hover:underline">Support Chat</a>
          <hr className="border-white/30 my-2" />
          <a href="/admin" className="block hover:underline">Admin Panel</a>
        </nav>
      </aside>
      <main className="flex-1 p-8 max-w-4xl mx-auto w-full">
        <section id="profile" className="mb-10">
          <ProfileSection userId={session.user.id} />
        </section>
        <section id="repairs" className="mb-10">
          <RepairRequests userId={session.user.id} />
        </section>
        <section id="chat">
          <Chat userId={session.user.id} email={session.user.email} />
        </section>
      </main>
    </div>
  );
}
