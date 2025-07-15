import { NavLink, useLocation } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";
import { BarChart2, MessagesSquare, Wrench, Bell, Users, Activity, FileText, Repeat, User } from "lucide-react";

const ADMIN_ITEMS = [
  {
    label: "Gallery Manager",
    icon: FileText,
    path: "/admin/gallery-manager",
  },
  {
    label: "Dashboard",
    icon: BarChart2,
    path: "/admin",
  },
  {
    label: "Chat",
    icon: MessagesSquare,
    path: "/admin/chat",
  },
  {
    label: "Repairs",
    icon: Wrench,
    path: "/admin/repairs",
  },
  {
    label: "Notifications",
    icon: Bell,
    path: "/admin/notifications",
  },
  {
    label: "Team & Roles",
    icon: Users,
    path: "/admin/team",
  },
  {
    label: "Health Monitor",
    icon: Activity,
    path: "/admin/health",
  },
  {
    label: "Reports",
    icon: FileText,
    path: "/admin/reports",
  },
  {
    label: "Workflow",
    icon: Repeat,
    path: "/admin/workflow",
  },
  {
    label: "User Management",
    icon: User,
    path: "/admin/users",
  },
  {
    label: "Logout",
    icon: User,
    path: "/admin/logout",
  },
  {
    label: "Product Approvals",
    icon: FileText,
    path: "/admin/ProductsApproval",
  },
];

const AdminSidebar = () => {
  const location = useLocation();

  return (
    <Sidebar>
      <SidebarContent className="bg-sidebar rounded-r-xl border-r border-sidebar-border shadow-lg min-h-screen mt-2 pt-0">
        <div style={{ height: '4.5rem' }} /> {/* Spacer to push content below nav */}
        <SidebarGroup>
          <SidebarGroupLabel>
            {/* Title removed as requested */}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            {/* Back to Home link for Gallery */}
            {location.pathname === "/admin/gallery-manager" && (
              <div className="mb-3 px-3">
                <NavLink
                  to="/"
                  className="inline-flex items-center gap-2 text-accent font-ubuntu font-semibold hover:underline hover:text-primary transition-colors text-sm bg-accent/10 px-3 py-1 rounded mb-2"
                >
                  <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" className="inline-block mr-1"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7"/></svg>
                  Back to Home
                </NavLink>
              </div>
            )}
            <SidebarMenu>
              {ADMIN_ITEMS.map(({ label, icon: Icon, path }) => (
                <SidebarMenuItem key={path}>
                  <SidebarMenuButton asChild isActive={location.pathname === path}>
                    <NavLink
                      to={path}
                      className={({ isActive }) =>
                        "flex items-center gap-2 px-3 py-2 rounded-md transition-all font-semibold " +
                        (isActive
                          ? "bg-accent text-primary shadow ring-2 ring-accent"
                          : "hover:bg-accent/40 hover:text-primary text-sidebar-foreground")
                      }
                    >
                      <Icon size={20} className="mr-1" />
                      <span>{label}</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
};

export default AdminSidebar;
