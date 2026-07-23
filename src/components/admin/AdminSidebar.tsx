import { NavLink, useLocation, useNavigate } from "react-router-dom";
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
import {
  BarChart2,
  MessagesSquare,
  Mail,
  Wrench,
  Bell,
  Users,
  Activity,
  FileText,
  Repeat,
  User,
  Package,
  CheckSquare,
  ImageIcon,
  LogOut,
  Home,
  Shield,
} from "lucide-react";

const OVERVIEW_ITEMS = [
  { label: "Dashboard", icon: BarChart2, path: "/admin" },
  { label: "Gallery", icon: ImageIcon, path: "/admin/gallery-manager" },
];

const SHOP_ITEMS = [
  { label: "Products", icon: Package, path: "/admin/products" },
  { label: "Approvals", icon: CheckSquare, path: "/admin/ProductsApproval" },
];

const OPERATIONS_ITEMS = [
  { label: "Chat", icon: MessagesSquare, path: "/admin/chat" },
  { label: "Messages", icon: Mail, path: "/admin/messages" },
  { label: "Repairs", icon: Wrench, path: "/admin/repairs" },
  { label: "Notifications", icon: Bell, path: "/admin/notifications" },
];

const SYSTEM_ITEMS = [
  { label: "Team & Roles", icon: Users, path: "/admin/team" },
  { label: "Users", icon: User, path: "/admin/users" },
  { label: "Health", icon: Activity, path: "/admin/health" },
  { label: "Reports", icon: FileText, path: "/admin/reports" },
  { label: "Workflow", icon: Repeat, path: "/admin/workflow" },
];

const SECTIONS = [
  { title: "Overview", items: OVERVIEW_ITEMS },
  { title: "Shop", items: SHOP_ITEMS },
  { title: "Operations", items: OPERATIONS_ITEMS },
  { title: "System", items: SYSTEM_ITEMS },
];

const ROLE_PERMISSIONS: Record<string, string[]> = {
  super_admin: [
    "/admin",
    "/admin/gallery-manager",
    "/admin/products",
    "/admin/ProductsApproval",
    "/admin/chat",
    "/admin/messages",
    "/admin/repairs",
    "/admin/notifications",
    "/admin/team",
    "/admin/users",
    "/admin/health",
    "/admin/reports",
    "/admin/workflow",
  ],
  support_admin: [
    "/admin",
    "/admin/gallery-manager",
    "/admin/products",
    "/admin/ProductsApproval",
    "/admin/chat",
    "/admin/messages",
    "/admin/repairs",
    "/admin/notifications",
    "/admin/reports",
  ],
  data_analyst: [
    "/admin",
    "/admin/health",
    "/admin/reports",
  ],
};

const AdminSidebar = ({ role = "super_admin" }: { role?: string }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const allowedPaths = ROLE_PERMISSIONS[role] || ROLE_PERMISSIONS["super_admin"];

  const filteredSections = SECTIONS.map((section) => ({
    ...section,
    items: section.items.filter((item) => allowedPaths.includes(item.path)),
  })).filter((section) => section.items.length > 0);

  return (
    <Sidebar>
      <SidebarContent
        className="min-h-screen pt-0 overflow-y-auto bg-white border-r border-gray-200"
      >
        {/* Spacer for navbar */}
        <div style={{ height: "3.5rem" }} />

        {/* Brand block */}
        <div className="px-4 pt-4 pb-5">
          <div className="flex items-center gap-2.5 mb-1">
            <div className="w-9 h-9 rounded-xl bg-accent/20 flex items-center justify-center border border-accent/30">
              <Shield size={18} className="text-accent" />
            </div>
            <div>
              <div className="text-sm font-bold text-primary tracking-tight">
                Admin Panel
              </div>
              <div className="text-[10px] text-muted-foreground font-medium">
                Ztech Electronics
              </div>
            </div>
          </div>
        </div>

        {/* Separator */}
        <div className="mx-4 mb-2 h-px bg-border" />

        {/* Grouped nav sections */}
        {filteredSections.map((section) => (
          <SidebarGroup key={section.title} className="px-3 mb-1">
            <SidebarGroupLabel className="px-2 mb-1.5">
              <span className="text-[10px] font-bold uppercase tracking-[0.12em] text-muted-foreground">
                {section.title}
              </span>
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {section.items.map(({ label, icon: Icon, path }) => {
                  const isActive = location.pathname === path;
                  return (
                    <SidebarMenuItem key={path}>
                      <SidebarMenuButton asChild isActive={isActive}>
                        <NavLink
                          to={path}
                          className={() =>
                            `flex items-center gap-2.5 px-2.5 py-2 rounded-lg transition-all duration-200 text-[13px] font-medium group ` +
                            (isActive
                              ? "bg-accent/10 text-primary shadow-sm border border-accent/20"
                              : "text-sidebar-foreground hover:text-primary hover:bg-muted/50 border border-transparent")
                          }
                        >
                          <div
                            className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all ${
                              isActive
                                ? "bg-accent text-accent-foreground shadow-sm"
                                : "bg-muted/50 group-hover:bg-accent group-hover:text-accent-foreground group-hover:shadow-sm text-muted-foreground"
                            }`}
                          >
                            <Icon size={16} />
                          </div>
                          <span>{label}</span>
                          {isActive && (
                            <div className="ml-auto w-1.5 h-1.5 rounded-full bg-accent" />
                          )}
                        </NavLink>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}

        {/* Bottom section */}
        <div className="mt-auto px-4 pb-4 pt-2">
          <div className="mb-3 h-px bg-border" />
          <button
            onClick={() => navigate("/")}
            className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-[13px] font-medium text-sidebar-foreground hover:text-primary hover:bg-muted/50 transition-all"
          >
            <div className="w-8 h-8 rounded-lg bg-muted/50 flex items-center justify-center">
              <Home size={16} />
            </div>
            <span>Back to Site</span>
          </button>
          <button
            onClick={async () => {
              const { supabase } = await import(
                "@/integrations/supabase/client"
              );
              await supabase.auth.signOut();
              navigate("/");
            }}
            className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-[13px] font-medium text-sidebar-foreground hover:text-destructive hover:bg-destructive/10 transition-all mt-1 group"
          >
            <div className="w-8 h-8 rounded-lg bg-muted/50 flex items-center justify-center text-muted-foreground group-hover:text-destructive group-hover:bg-transparent">
              <LogOut size={16} />
            </div>
            <span>Sign Out</span>
          </button>
        </div>
      </SidebarContent>
    </Sidebar>
  );
};

export default AdminSidebar;
