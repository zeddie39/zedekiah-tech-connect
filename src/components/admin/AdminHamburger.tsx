import { SidebarTrigger } from "@/components/ui/sidebar";
import { Menu } from "lucide-react";

const AdminHamburger = () => (
  <div className="md:hidden flex items-center">
    <SidebarTrigger>
      <span className="inline-flex items-center justify-center rounded-lg p-2 hover:bg-white/[0.05] transition-all">
        <Menu size={22} className="text-gray-400" aria-label="Open Sidebar" />
      </span>
    </SidebarTrigger>
  </div>
);

export default AdminHamburger;
