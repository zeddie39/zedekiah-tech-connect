import { SidebarTrigger } from "@/components/ui/sidebar";
import { Menu } from "lucide-react";

const AdminHamburger = () => (
  <div className="md:hidden flex items-center">
    <SidebarTrigger>
      <span className="inline-flex items-center justify-center bg-white/90 rounded-full shadow p-2">
        <Menu size={32} color="#1e293b" aria-label="Open Sidebar" />
      </span>
    </SidebarTrigger>
  </div>
);

export default AdminHamburger;
