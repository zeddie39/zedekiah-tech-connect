import { useNavigate } from "react-router-dom";
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
} from "lucide-react";

const STAT_CARDS = [
  {
    label: "Total Revenue",
    value: "Ksh 245K",
    change: "+12.5%",
    positive: true,
    icon: TrendingUp,
    color: "#22c55e",
  },
  {
    label: "Active Products",
    value: "89",
    change: "+3 this week",
    positive: true,
    icon: ShoppingCart,
    color: "#f97316", // orange-500
  },
  {
    label: "Pending Approvals",
    value: "7",
    change: "Needs review",
    positive: false,
    icon: CheckSquare,
    color: "#f59e0b",
  },
  {
    label: "Avg. Rating",
    value: "4.6",
    change: "+0.2 this month",
    positive: true,
    icon: Star,
    color: "#a855f7",
  },
];

const QUICK_LINKS = [
  {
    label: "Analytics",
    desc: "Sales & order trends",
    icon: BarChart2,
    path: "/admin",
  },
  {
    label: "Chat",
    desc: "Moderate conversations",
    icon: MessageCircle,
    path: "/admin/chat",
  },
  {
    label: "Repairs",
    desc: "Manage requests",
    icon: Wrench,
    path: "/admin/repairs",
  },
  {
    label: "Notifications",
    desc: "System alerts",
    icon: Bell,
    path: "/admin/notifications",
  },
  {
    label: "Team",
    desc: "Roles & permissions",
    icon: Users,
    path: "/admin/team",
  },
  {
    label: "Health",
    desc: "System monitoring",
    icon: Activity,
    path: "/admin/health",
  },
  {
    label: "Reports",
    desc: "Export & analyse",
    icon: FileText,
    path: "/admin/reports",
  },
  {
    label: "Workflow",
    desc: "Task automation",
    icon: Repeat,
    path: "/admin/workflow",
  },
  {
    label: "Products",
    desc: "Manage catalogue",
    icon: Package,
    path: "/admin/products",
  },
];

export default function DashboardHome() {
  const navigate = useNavigate();
  const now = new Date();
  const greeting =
    now.getHours() < 12
      ? "Good morning"
      : now.getHours() < 17
      ? "Good afternoon"
      : "Good evening";

  return (
    <div className="w-full space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Hero */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-foreground tracking-tight">
          {greeting} 👋
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Here's what's happening with your store today.
        </p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {STAT_CARDS.map((stat) => {
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
