
import { Link, useLocation } from "react-router-dom";
import { BarChart2, MessagesSquare, Wrench, Bell, Users, Activity, FileText, Repeat } from "lucide-react";

interface AdminSidebarProps {
  role: string;
  email: string | null;
}

const nav = [
  {
    label: "Dashboard",
    icon: <BarChart2 className="mr-2" size={20} />,
    path: "/admin",
  },
  {
    label: "Chat",
    icon: <MessagesSquare className="mr-2" size={20} />,
    path: "/admin/chat",
  },
  {
    label: "Repairs",
    icon: <Wrench className="mr-2" size={20} />,
    path: "/admin/repairs",
  },
  {
    label: "Notifications",
    icon: <Bell className="mr-2" size={20} />,
    path: "/admin/notifications",
  },
  {
    label: "Team & Roles",
    icon: <Users className="mr-2" size={20} />,
    path: "/admin/team",
  },
  {
    label: "Health Monitor",
    icon: <Activity className="mr-2" size={20} />,
    path: "/admin/health",
  },
  {
    label: "Reports",
    icon: <FileText className="mr-2" size={20} />,
    path: "/admin/reports",
  },
  {
    label: "Workflow",
    icon: <Repeat className="mr-2" size={20} />,
    path: "/admin/workflow",
  },
];

export default function AdminSidebar({ role, email }: AdminSidebarProps) {
  const location = useLocation();

  return (
    <aside className="w-64 hidden md:flex flex-col min-h-screen bg-primary text-white shadow-xl">
      <div className="p-6 border-b border-border flex flex-col gap-1">
        <span className="text-xl font-bold font-orbitron flex items-center mb-1">
          Zedekiah Admin
        </span>
        <span className="text-xs text-gray-300">
          {role.charAt(0).toUpperCase() + role.slice(1).replace("_", " ")}
        </span>
        <span className="text-xs font-mono">{email}</span>
      </div>
      <nav className="flex-1 px-4 py-8 space-y-1">
        {nav.map(({ label, icon, path }) => (
          <Link
            to={path}
            key={path}
            className={`flex items-center px-4 py-2 rounded hover:bg-accent/80 transition text-white ${
              location.pathname === path ? "bg-accent text-primary" : ""
            }`}
          >
            {icon} {label}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
