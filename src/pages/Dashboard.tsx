import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Link, useNavigate } from "react-router-dom";
import ProfileSection from "@/components/dashboard/ProfileSection";
import RepairRequests from "@/components/dashboard/RepairRequests";
import Chat from "@/components/dashboard/Chat";
import { Loader2, Menu, User, Wrench, MessagesSquare, ShoppingBag, LogOut, ArrowRight, ShoppingCart, Shield, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import type { Session } from "@supabase/supabase-js";

export default function Dashboard() {
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState<Session | null>(null);
  const navigate = useNavigate();
  const [drawerOpen, setDrawerOpen] = useState(false);

  useEffect(() => {
    let mounted = true;
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session && mounted) navigate("/auth");
      setSession(session);
      setLoading(false);
    });
    const { data: subscription } = supabase.auth.onAuthStateChange((_event, session) => {
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

  const email = session.user.email || "User";

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-accent/10 via-muted/30 to-background">
      {/* Top bar (mobile + desktop) */}
      <header className="sticky top-0 z-40 w-full border-b border-accent/20 bg-primary/95 backdrop-blur">
        <div className="mx-auto max-w-7xl px-3 sm:px-6 py-3 flex items-center justify-between text-white">
          <div className="flex items-center gap-3">
            <img src="/ZTech electrictronics logo.png" alt="Ztech" className="w-8 h-8 rounded-full" />
            <div className="flex flex-col leading-tight">
              <span className="font-ubuntu font-bold text-sm sm:text-base tracking-wide">User Dashboard</span>
              <span className="text-[10px] sm:text-xs text-accent/90">Welcome, {email}</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="secondary" size="sm" className="hidden md:inline-flex" onClick={() => navigate('/shop')}>
              <ShoppingBag className="w-4 h-4 mr-2" /> Shop
            </Button>
            <Button variant="secondary" size="sm" className="hidden md:inline-flex" onClick={() => navigate('/orders')}>
              <ShoppingCart className="w-4 h-4 mr-2" /> Orders
            </Button>
            <Button variant="destructive" size="sm" onClick={async () => { await supabase.auth.signOut(); navigate("/"); }}>
              <LogOut className="w-4 h-4 mr-2" /> Logout
            </Button>
            <button
              className="md:hidden rounded p-2 border border-accent/30 bg-accent/10 ml-1"
              onClick={() => setDrawerOpen(!drawerOpen)}
              aria-label="Open Menu"
            >
              <Menu size={20} />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer */}
      {drawerOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 flex">
          <aside className="bg-primary w-4/5 max-w-xs h-full p-4 flex flex-col text-white shadow-xl">
            <div className="flex items-center justify-between mb-6">
              <div className="font-bold">Menu</div>
              <button className="text-xl" onClick={() => setDrawerOpen(false)} aria-label="Close Menu">✕</button>
            </div>
            <nav className="space-y-2">
              <a href="#profile" className="flex items-center gap-2 px-2 py-2 rounded hover:bg-accent/20" onClick={() => setDrawerOpen(false)}>
                <User className="w-4 h-4" /> Profile
              </a>
              <a href="#repairs" className="flex items-center gap-2 px-2 py-2 rounded hover:bg-accent/20" onClick={() => setDrawerOpen(false)}>
                <Wrench className="w-4 h-4" /> Repair Requests
              </a>
              <a href="#chat" className="flex items-center gap-2 px-2 py-2 rounded hover:bg-accent/20" onClick={() => setDrawerOpen(false)}>
                <MessagesSquare className="w-4 h-4" /> Support Chat
              </a>
              <a href="/shop" className="flex items-center gap-2 px-2 py-2 rounded hover:bg-accent/20" onClick={() => setDrawerOpen(false)}>
                <ShoppingBag className="w-4 h-4" /> Shop
              </a>
              <a href="/orders" className="flex items-center gap-2 px-2 py-2 rounded hover:bg-accent/20" onClick={() => setDrawerOpen(false)}>
                <ShoppingCart className="w-4 h-4" /> Orders
              </a>
              <Separator className="my-2 bg-white/20" />
              <a href="/admin" className="flex items-center gap-2 px-2 py-2 rounded hover:bg-accent/20" onClick={() => setDrawerOpen(false)}>
                <Shield className="w-4 h-4" /> Admin Panel
              </a>
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

      <div className="mx-auto max-w-7xl grid grid-cols-1 md:grid-cols-[220px,1fr] gap-4 px-3 sm:px-6 py-4">
        {/* Sidebar (Desktop) */}
        <aside className="hidden md:block bg-card/80 border border-accent/20 rounded-xl p-3 h-fit sticky top-20 shadow-sm">
          <div className="px-2 py-1">
            <div className="text-xs text-muted-foreground">Navigation</div>
          </div>
          <nav className="mt-2 space-y-1">
            <a href="#profile" className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-accent/20 text-sm font-medium">
              <User className="w-4 h-4" /> Profile
            </a>
            <a href="#repairs" className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-accent/20 text-sm font-medium">
              <Wrench className="w-4 h-4" /> Repair Requests
            </a>
            <a href="#chat" className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-accent/20 text-sm font-medium">
              <MessagesSquare className="w-4 h-4" /> Support Chat
            </a>
            <Separator className="my-2" />
            <Link to="/shop" className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-accent/20 text-sm font-medium">
              <ShoppingBag className="w-4 h-4" /> Shop
            </Link>
            <Link to="/orders" className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-accent/20 text-sm font-medium">
              <ShoppingCart className="w-4 h-4" /> Orders
            </Link>
            <Separator className="my-2" />
            <Link to="/admin" className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-accent/20 text-sm font-medium">
              <Shield className="w-4 h-4" /> Admin Panel
            </Link>
          </nav>
        </aside>

        {/* Main content */}
        <main className="flex-1 space-y-4">
          {/* Hero Header + Quick Actions */}
          <Card className="bg-card/90 border border-accent/30 p-4 sm:p-6 rounded-xl shadow">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div>
                <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight">
                  Dashboard
                </h1>
                <p className="text-sm text-muted-foreground">Manage your profile, repair requests, and chat with support.</p>
              </div>
              <div className="flex gap-2 flex-wrap">
                <Button variant="outline" onClick={() => navigate('/shop')}>
                  <ShoppingBag className="w-4 h-4 mr-2" /> Go to Shop
                </Button>
                <Button variant="outline" onClick={() => navigate('/orders')}>
                  <ShoppingCart className="w-4 h-4 mr-2" /> Your Orders
                </Button>
                <Button variant="secondary" onClick={() => document.getElementById('chat')?.scrollIntoView({behavior:'smooth'})}>
                  <MessagesSquare className="w-4 h-4 mr-2" /> Open Chat
                </Button>
              </div>
            </div>
          </Card>

          {/* Quick Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <Card className="p-4 border border-accent/30 rounded-xl">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-xs text-muted-foreground">Account</div>
                  <div className="font-bold text-sm break-all">{email}</div>
                </div>
                <User className="w-6 h-6 text-accent" />
              </div>
            </Card>
            <Card className="p-4 border border-accent/30 rounded-xl">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-xs text-muted-foreground">Shop</div>
                  <div className="font-bold text-sm">Continue shopping</div>
                </div>
                <ShoppingBag className="w-6 h-6 text-accent" />
              </div>
              <div className="mt-3">
                <Button size="sm" variant="outline" onClick={() => navigate('/shop')}>
                  Go to Shop <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </Card>
            <Card className="p-4 border border-accent/30 rounded-xl">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-xs text-muted-foreground">Orders</div>
                  <div className="font-bold text-sm">View your recent orders</div>
                </div>
                <ShoppingCart className="w-6 h-6 text-accent" />
              </div>
              <div className="mt-3">
                <Button size="sm" variant="outline" onClick={() => navigate('/orders')}>
                  View Orders <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </Card>
          </div>

          {/* Sections */}
          <section id="profile" className="scroll-mt-24">
            <Card className="p-4 sm:p-6 border border-accent/30 rounded-xl shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <User className="w-5 h-5 text-accent" />
                  <h2 className="text-lg font-bold">Profile</h2>
                </div>
                <Button variant="outline" size="sm" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
                  Back to top
                </Button>
              </div>
              <ProfileSection userId={session.user.id} />
            </Card>
          </section>

          <section id="repairs" className="scroll-mt-24">
            <Card className="p-4 sm:p-6 border border-accent/30 rounded-xl shadow-sm">
              <div className="flex items-center gap-2 mb-3">
                <Wrench className="w-5 h-5 text-accent" />
                <h2 className="text-lg font-bold">Repair Requests</h2>
              </div>
              <RepairRequests userId={session.user.id} />
            </Card>
          </section>

          <section id="chat" className="scroll-mt-24 mb-6">
            <Card className="p-4 sm:p-6 border border-accent/30 rounded-xl shadow-sm">
              <div className="flex items-center gap-2 mb-3">
                <MessagesSquare className="w-5 h-5 text-accent" />
                <h2 className="text-lg font-bold">Support Chat</h2>
              </div>
              <Chat userId={session.user.id} email={session.user.email} />
            </Card>
          </section>
        </main>
      </div>
    </div>
  );
}
