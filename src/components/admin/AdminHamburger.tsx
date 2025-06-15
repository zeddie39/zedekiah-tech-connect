
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Menu } from "lucide-react";

const AdminHamburger = () => (
  <div className="md:hidden flex items-center">
    <SidebarTrigger>
      <Menu size={26} aria-label="Open Sidebar" />
    </SidebarTrigger>
  </div>
);

export default AdminHamburger;
