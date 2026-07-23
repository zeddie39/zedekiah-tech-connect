import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import {
  BarChart2,
  MessageCircle,
  Wrench,
  Bell,
  Users,
  Activity,
  FileText,
  Repeat,
  Package,
  CheckSquare,
  ArrowUpRight,
  TrendingUp,
  ShoppingCart,
  Star,
  ChevronDown,
  Loader2,
  Box,
} from "lucide-react";

// ─── Quick Access links (unchanged) ───────────────────────────────
const QUICK_LINKS = [
  { label: "Analytics", desc: "Sales & order trends", icon: BarChart2, path: "/admin" },
  { label: "Chat", desc: "Moderate conversations", icon: MessageCircle, path: "/admin/chat" },
  { label: "Repairs", desc: "Manage requests", icon: Wrench, path: "/admin/repairs" },
  { label: "Notifications", desc: "System alerts", icon: Bell, path: "/admin/notifications" },
  { label: "Team", desc: "Roles & permissions", icon: Users, path: "/admin/team" },
  { label: "Health", desc: "System monitoring", icon: Activity, path: "/admin/health" },
  { label: "Reports", desc: "Export & analyse", icon: FileText, path: "/admin/reports" },
  { label: "Workflow", desc: "Task automation", icon: Repeat, path: "/admin/workflow" },
  { label: "Products", desc: "Manage catalogue", icon: Package, path: "/admin/products" },
];

// ─── Types ────────────────────────────────────────────────────────
interface CategoryBreakdown {
  category: string;
  count: number;
  products: { id: string; title: string; price: number }[];
}

export default function DashboardHome() {
  const navigate = useNavigate();
  const now = new Date();
  const greeting =
    now.getHours() < 12
      ? "Good morning"
      : now.getHours() < 17
      ? "Good afternoon"
      : "Good evening";

  // ── live stats ──────────────────────────────────────────────────
  const [loading, setLoading] = useState(true);
  const [userName, setUserName] = useState<string>("");
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [activeProducts, setActiveProducts] = useState(0);
  const [pendingOrders, setPendingOrders] = useState(0);
  const [avgRating, setAvgRating] = useState(0);
  const [categoryBreakdown, setCategoryBreakdown] = useState<CategoryBreakdown[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [dropdownOpen, setDropdownOpen] = useState(false);

  useEffect(() => {
    fetchUserData();
    fetchDashboardData();
  }, []);

  async function fetchUserData() {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        const user = session.user;
        const { data: profile } = await supabase
          .from("profiles")
          .select("full_name")
          .eq("id", user.id)
          .maybeSingle();

        if (profile?.full_name?.trim()) {
          setUserName(profile.full_name.trim());
          return;
        }

        const metaName = user.user_metadata?.full_name || user.user_metadata?.name;
        if (metaName?.trim()) {
          setUserName(metaName.trim());
          return;
        }

        if (user.email) {
          const emailName = user.email.split("@")[0];
          const capitalized = emailName.charAt(0).toUpperCase() + emailName.slice(1);
          setUserName(capitalized);
        }
      }
    } catch (err) {
      console.error("Error fetching user data:", err);
    }
  }

  async function fetchDashboardData() {
    setLoading(true);
    try {
      // 1. Products — count & category breakdown
      const { data: products } = await supabase
        .from("products")
        .select("id, title, price, category, status");

      const activeProds = (products || []).filter(
        (p) => !p.status || p.status === "approved"
      );
      setActiveProducts(activeProds.length);

      // Build category map
      const catMap: Record<string, CategoryBreakdown> = {};
      for (const p of activeProds) {
        const cat = p.category || "Uncategorized";
        if (!catMap[cat]) catMap[cat] = { category: cat, count: 0, products: [] };
        catMap[cat].count++;
        catMap[cat].products.push({ id: p.id, title: p.title, price: p.price });
      }
      const breakdown = Object.values(catMap).sort((a, b) => b.count - a.count);
      setCategoryBreakdown(breakdown);

      // 2. Orders — revenue & pending
      const { data: orders } = await supabase
        .from("orders")
        .select("amount, payment_status, status");

      const completedOrders = (orders || []).filter(
        (o) => o.payment_status === "completed" || o.payment_status === "paid"
      );
      const revenue = completedOrders.reduce((sum, o) => sum + (o.amount || 0), 0);
      setTotalRevenue(revenue);

      const pending = (orders || []).filter(
        (o) => o.status === "pending" || o.payment_status === "pending"
      );
      setPendingOrders(pending.length);

      // 3. Reviews — average rating
      const { data: reviews } = await supabase
        .from("product_reviews")
        .select("rating");

      if (reviews && reviews.length > 0) {
        const avg =
          reviews.reduce((sum, r) => sum + (r.rating || 0), 0) / reviews.length;
        setAvgRating(Math.round(avg * 10) / 10);
      } else {
        setAvgRating(0);
      }
    } catch (err) {
      console.error("Dashboard data error:", err);
    } finally {
      setLoading(false);
    }
  }

  // Format revenue nicely
  const formatRevenue = (val: number) => {
    if (val >= 1_000_000) return `Ksh ${(val / 1_000_000).toFixed(1)}M`;
    if (val >= 1_000) return `Ksh ${(val / 1_000).toFixed(1)}K`;
    return `Ksh ${val.toLocaleString()}`;
  };

  // Dynamic stat cards driven by real data
  const STAT_CARDS = [
    {
      label: "Total Revenue",
      value: formatRevenue(totalRevenue),
      change: completedLabel(),
      positive: totalRevenue > 0,
      icon: TrendingUp,
      color: "#22c55e",
    },
    {
      label: "Active Products",
      value: String(activeProducts),
      change: `${categoryBreakdown.length} categories`,
      positive: true,
      icon: ShoppingCart,
      color: "#f97316",
    },
    {
      label: "Pending Orders",
      value: String(pendingOrders),
      change: pendingOrders > 0 ? "Needs attention" : "All clear",
      positive: pendingOrders === 0,
      icon: CheckSquare,
      color: "#f59e0b",
    },
    {
      label: "Avg. Rating",
      value: avgRating > 0 ? String(avgRating) : "—",
      change: avgRating >= 4 ? "Great reviews!" : avgRating > 0 ? "Room to grow" : "No reviews yet",
      positive: avgRating >= 4,
      icon: Star,
      color: "#a855f7",
    },
  ];

  function completedLabel() {
    if (totalRevenue <= 0) return "No sales yet";
    return "From completed orders";
  }

  // Filtered products for the inventory dropdown
  const displayedBreakdown =
    selectedCategory === "all"
      ? categoryBreakdown
      : categoryBreakdown.filter((c) => c.category === selectedCategory);

  return (
    <div className="w-full space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Hero */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-foreground tracking-tight">
          {greeting}{userName ? `, ${userName}` : ""} 👋
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Here's what's happening with your store today.
        </p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {loading
          ? Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="rounded-2xl p-5 bg-card border border-border shadow-sm flex items-center justify-center h-32"
              >
                <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
              </div>
            ))
          : STAT_CARDS.map((stat) => {
              const Icon = stat.icon;
              return (
                <div
                  key={stat.label}
                  className="relative overflow-hidden rounded-2xl p-5 bg-card border border-border shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md group"
                >
                  {/* Subtle glow circle */}
                  <div
                    className="absolute -top-8 -right-8 w-24 h-24 rounded-full opacity-[0.06] group-hover:opacity-[0.1] transition-opacity"
                    style={{ background: stat.color }}
                  />

                  <div className="flex items-start justify-between mb-3">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center shadow-sm"
                      style={{
                        background: `${stat.color}10`,
                        border: `1px solid ${stat.color}20`,
                      }}
                    >
                      <Icon size={18} style={{ color: stat.color }} />
                    </div>
                  </div>
                  <div className="text-2xl font-bold text-foreground mb-0.5">
                    {stat.value}
                  </div>
                  <div className="text-[11px] text-muted-foreground font-medium uppercase tracking-wider">
                    {stat.label}
                  </div>
                  <div
                    className="mt-2 text-[11px] font-bold"
                    style={{ color: stat.positive ? "#16a34a" : "#d97706" }}
                  >
                    {stat.change}
                  </div>
                </div>
              );
            })}
      </div>

      {/* ─── Product Inventory Breakdown ────────────────────────── */}
      <div>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 gap-3">
          <div>
            <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
              <Box size={18} className="text-primary" />
              Product Inventory
            </h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              {activeProducts} products across {categoryBreakdown.length} categories
            </p>
          </div>

          {/* Category filter dropdown */}
          <div className="relative">
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-card border border-border text-sm font-medium text-foreground hover:border-accent/60 transition-colors shadow-sm min-w-[180px] justify-between"
            >
              {selectedCategory === "all"
                ? "All Categories"
                : selectedCategory}
              <ChevronDown
                size={14}
                className={`text-muted-foreground transition-transform ${dropdownOpen ? "rotate-180" : ""}`}
              />
            </button>
            {dropdownOpen && (
              <div className="absolute right-0 mt-1 z-50 w-full min-w-[200px] rounded-lg bg-card border border-border shadow-lg overflow-hidden animate-in fade-in slide-in-from-top-1 duration-150">
                <button
                  onClick={() => {
                    setSelectedCategory("all");
                    setDropdownOpen(false);
                  }}
                  className={`w-full text-left px-4 py-2.5 text-sm transition-colors ${
                    selectedCategory === "all"
                      ? "bg-primary/10 text-primary font-semibold"
                      : "text-foreground hover:bg-secondary"
                  }`}
                >
                  All Categories ({activeProducts})
                </button>
                {categoryBreakdown.map((cat) => (
                  <button
                    key={cat.category}
                    onClick={() => {
                      setSelectedCategory(cat.category);
                      setDropdownOpen(false);
                    }}
                    className={`w-full text-left px-4 py-2.5 text-sm transition-colors border-t border-border/50 ${
                      selectedCategory === cat.category
                        ? "bg-primary/10 text-primary font-semibold"
                        : "text-foreground hover:bg-secondary"
                    }`}
                  >
                    {cat.category}{" "}
                    <span className="text-muted-foreground">({cat.count})</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Category cards */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        ) : displayedBreakdown.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground text-sm">
            No products found.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {displayedBreakdown.map((cat) => (
              <div
                key={cat.category}
                className="rounded-xl bg-card border border-border p-4 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-bold text-foreground">{cat.category}</h3>
                  <span className="text-xs font-bold bg-primary/10 text-primary px-2.5 py-1 rounded-full">
                    {cat.count} {cat.count === 1 ? "item" : "items"}
                  </span>
                </div>
                <div className="space-y-1.5 max-h-40 overflow-y-auto pr-1">
                  {cat.products.map((p) => (
                    <div
                      key={p.id}
                      className="flex items-center justify-between text-xs py-1.5 px-2 rounded-md hover:bg-secondary/60 transition-colors cursor-pointer"
                      onClick={() => navigate(`/shop/${p.id}`)}
                    >
                      <span className="text-foreground truncate max-w-[65%]">{p.title}</span>
                      <span className="text-muted-foreground font-medium flex-shrink-0">
                        Ksh {p.price.toLocaleString()}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Quick Access Grid */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-foreground">Quick Access</h2>
          <span className="text-xs font-medium text-muted-foreground bg-secondary px-2.5 py-1 rounded-full border border-border">
            {QUICK_LINKS.length} modules
          </span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {QUICK_LINKS.map((link) => {
            const Icon = link.icon;
            return (
              <button
                key={link.path}
                onClick={() => navigate(link.path)}
                className="flex items-center gap-3.5 p-4 rounded-xl text-left bg-card border border-border shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md hover:border-accent/40 group"
              >
                <div className="w-10 h-10 rounded-xl bg-secondary border border-border flex items-center justify-center flex-shrink-0 group-hover:bg-accent group-hover:border-accent transition-all shadow-sm">
                  <Icon
                    size={18}
                    className="text-muted-foreground group-hover:text-accent-foreground transition-colors"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-bold text-foreground group-hover:text-accent transition-colors">
                    {link.label}
                  </div>
                  <div className="text-[11px] text-muted-foreground">{link.desc}</div>
                </div>
                <div className="w-6 h-6 rounded-full bg-secondary flex items-center justify-center group-hover:bg-accent/10 transition-colors">
                  <ArrowUpRight
                    size={14}
                    className="text-muted-foreground group-hover:text-accent transition-colors"
                  />
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
