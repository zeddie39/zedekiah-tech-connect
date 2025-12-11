import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Link, useNavigate, useLocation } from "react-router-dom";
import ProfileSection from "@/components/dashboard/ProfileSection";
import RepairRequests from "@/components/dashboard/RepairRequests";
import Chat from "@/components/dashboard/Chat";
import { Loader2, Menu, User, Wrench, MessagesSquare, ShoppingBag, LogOut, ArrowRight, ShoppingCart, Shield, LayoutDashboard, Bell, CreditCard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { Session } from "@supabase/supabase-js";
import { toast } from "@/components/ui/use-toast";

export default function Dashboard() {
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState<Session | null>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState("overview");

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
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="animate-spin text-primary" size={38} />
      </div>
    );
  }

  if (!session) return null;

  const email = session.user.email || "User";
  // Try to get a display name, fallback to email username or "User"
  const displayName = session.user.user_metadata?.full_name || email.split('@')[0] || "Friend";

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 18) return "Good Afternoon";
    return "Good Evening";
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-background via-muted/30 to-accent/5 font-sans">
      {/* Top Navigation Bar */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-md supports-[backdrop-filter]:bg-background/60">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link to="/" className="flex items-center gap-2 group">
              <div className="relative">
                <div className="absolute inset-0 bg-primary/20 rounded-full blur-sm group-hover:bg-primary/40 transition-all" />
                <img src="/ZTech electrictronics logo.png" alt="Ztech" className="w-9 h-9 rounded-full relative z-10 border border-primary/20" />
              </div>
              <span className="font-bold text-lg tracking-tight bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent hidden sm:inline-block">
                ZTech Connect
              </span>
            </Link>
          </div>

          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" className="relative hidden md:flex" onClick={() => navigate('/orders')}>
              <Bell className="w-5 h-5 text-muted-foreground" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-background" />
            </Button>
            <div className="h-6 w-px bg-border hidden md:block" />
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium hidden md:inline-block text-muted-foreground capitalize">
                {displayName}
              </span>
              <Button
                variant="ghost"
                size="icon"
                onClick={async () => {
                  await supabase.auth.signOut();
                  toast({ title: "Logged out", description: "See you soon!" });
                  navigate("/");
                }}
                className="text-red-500 hover:text-red-600 hover:bg-red-50"
              >
                <LogOut className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-8">
        {/* Welcome Section */}
        <div className="mb-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-2">
            {getGreeting()}, <span className="text-primary bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent capitalize">{displayName}</span>
          </h1>
          <p className="text-muted-foreground">Here's what's happening with your account today.</p>
        </div>

        <Tabs defaultValue="overview" className="space-y-6" onValueChange={setActiveTab}>
          <div className="flex flex-col md:flex-row gap-6">
            {/* Sidebar Navigation */}
            <aside className="w-full md:w-64 flex-shrink-0">
              <Card className="p-2 bg-card/50 backdrop-blur-sm border-accent/20 sticky top-24">
                <TabsList className="flex flex-col h-auto w-full bg-transparent gap-1 p-0">
                  <TabsTrigger
                    value="overview"
                    className="w-full justify-start px-4 py-3 h-auto text-base font-medium data-[state=active]:bg-primary/10 data-[state=active]:text-primary transition-all rounded-md group"
                  >
                    <LayoutDashboard className="w-5 h-5 mr-3 text-muted-foreground group-data-[state=active]:text-primary" />
                    Overview
                  </TabsTrigger>
                  <TabsTrigger
                    value="repairs"
                    className="w-full justify-start px-4 py-3 h-auto text-base font-medium data-[state=active]:bg-primary/10 data-[state=active]:text-primary transition-all rounded-md group"
                  >
                    <Wrench className="w-5 h-5 mr-3 text-muted-foreground group-data-[state=active]:text-primary" />
                    Repair Requests
                  </TabsTrigger>
                  <TabsTrigger
                    value="chat"
                    className="w-full justify-start px-4 py-3 h-auto text-base font-medium data-[state=active]:bg-primary/10 data-[state=active]:text-primary transition-all rounded-md group"
                  >
                    <MessagesSquare className="w-5 h-5 mr-3 text-muted-foreground group-data-[state=active]:text-primary" />
                    Support Chat
                  </TabsTrigger>
                  <TabsTrigger
                    value="profile"
                    className="w-full justify-start px-4 py-3 h-auto text-base font-medium data-[state=active]:bg-primary/10 data-[state=active]:text-primary transition-all rounded-md group"
                  >
                    <User className="w-5 h-5 mr-3 text-muted-foreground group-data-[state=active]:text-primary" />
                    Profile Settings
                  </TabsTrigger>
                </TabsList>

                <Separator className="my-4 opacity-50" />

                <div className="px-2 space-y-1">
                  <Button variant="ghost" className="w-full justify-start font-normal text-muted-foreground hover:text-foreground" onClick={() => navigate('/shop')}>
                    <ShoppingBag className="w-4 h-4 mr-3" /> Shop
                  </Button>
                  <Button variant="ghost" className="w-full justify-start font-normal text-muted-foreground hover:text-foreground" onClick={() => navigate('/orders')}>
                    <ShoppingCart className="w-4 h-4 mr-3" /> My Orders
                  </Button>
                  <Button variant="ghost" className="w-full justify-start font-normal text-muted-foreground hover:text-foreground" onClick={() => navigate('/admin')}>
                    <Shield className="w-4 h-4 mr-3" /> Admin Panel
                  </Button>
                </div>
              </Card>
            </aside>

            {/* Main Content Area */}
            <div className="flex-1 min-w-0">
              <TabsContent value="overview" className="mt-0 space-y-6 animate-in fade-in duration-500">
                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card className="p-6 bg-gradient-to-br from-blue-500/10 to-blue-600/5 border-blue-200/50 hover:shadow-md transition-shadow cursor-pointer" onClick={() => navigate('/shop')}>
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-blue-500/20 rounded-xl text-blue-600">
                        <ShoppingBag className="w-6 h-6" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Shop items</p>
                        <h3 className="text-2xl font-bold text-foreground">Browse</h3>
                      </div>
                    </div>
                  </Card>

                  <Card className="p-6 bg-gradient-to-br from-green-500/10 to-green-600/5 border-green-200/50 hover:shadow-md transition-shadow cursor-pointer" onClick={() => navigate('/orders')}>
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-green-500/20 rounded-xl text-green-600">
                        <ShoppingCart className="w-6 h-6" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">My Orders</p>
                        <h3 className="text-2xl font-bold text-foreground">Track</h3>
                      </div>
                    </div>
                  </Card>

                  <Card className="p-6 bg-gradient-to-br from-purple-500/10 to-purple-600/5 border-purple-200/50 hover:shadow-md transition-shadow cursor-pointer" onClick={() => setActiveTab('repairs')}>
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-purple-500/20 rounded-xl text-purple-600">
                        <Wrench className="w-6 h-6" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Active Repairs</p>
                        <h3 className="text-2xl font-bold text-foreground">View</h3>
                      </div>
                    </div>
                  </Card>
                </div>

                {/* Quick Actions */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card className="p-6 border-accent/20 shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-semibold text-lg flex items-center gap-2">
                        <MessagesSquare className="w-5 h-5 text-primary" /> Recent Support
                      </h3>
                      <Button variant="ghost" size="sm" onClick={() => setActiveTab('chat')}>Open Chat <ArrowRight className="w-4 h-4 ml-1" /></Button>
                    </div>
                    <div className="text-sm text-muted-foreground bg-muted/50 p-4 rounded-lg">
                      Start a conversation with our support team for quick assistance with your devices or orders.
                    </div>
                  </Card>

                  <Card className="p-6 border-accent/20 shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-semibold text-lg flex items-center gap-2">
                        <CreditCard className="w-5 h-5 text-primary" /> Billing
                      </h3>
                      <Button variant="ghost" size="sm" onClick={() => navigate('/orders')}>All Orders <ArrowRight className="w-4 h-4 ml-1" /></Button>
                    </div>
                    <div className="text-sm text-muted-foreground bg-muted/50 p-4 rounded-lg">
                      View your payment history and download receipts for your recent purchases.
                    </div>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="repairs" className="mt-0 animate-in fade-in slide-in-from-right-4 duration-500">
                <RepairRequests userId={session.user.id} />
              </TabsContent>

              <TabsContent value="chat" className="mt-0 animate-in fade-in slide-in-from-right-4 duration-500">
                <Card className="border-accent/20 shadow-sm overflow-hidden h-[600px] flex flex-col">
                  <div className="p-4 border-b bg-muted/30 flex items-center gap-3">
                    <div className="relative">
                      <div className="absolute inset-0 bg-green-500/20 rounded-full animate-pulse" />
                      <div className="w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-background relative z-10" />
                    </div>
                    <div>
                      <h3 className="font-semibold">Support Team</h3>
                      <p className="text-xs text-muted-foreground">Typically replies instantly</p>
                    </div>
                  </div>
                  <div className="flex-1 overflow-hidden">
                    <Chat userId={session.user.id} email={session.user.email} />
                  </div>
                </Card>
              </TabsContent>

              <TabsContent value="profile" className="mt-0 animate-in fade-in slide-in-from-right-4 duration-500">
                <ProfileSection userId={session.user.id} />
              </TabsContent>
            </div>
          </div>
        </Tabs>
      </div>
    </div>
  );
}

