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
      <SidebarContent className="bg-sidebar rounded-r-xl border-r border-sidebar-border shadow-lg min-h-screen mt-2 md:mt-4">
        <SidebarGroup>
          <SidebarGroupLabel>
            <div className="mb-4 mt-4 pl-2 flex flex-col gap-1">
              <div className="text-2xl font-extrabold font-orbitron text-primary tracking-tight">
                Ztech Electronics Ltd Admin
              </div>
            </div>
          </SidebarGroupLabel>
          <SidebarGroupContent>
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
