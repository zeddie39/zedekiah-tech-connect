import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import AdminLayout from "./pages/Admin";
import AdminChat from "./pages/admin/Chat";
import AdminRepairs from "./pages/admin/Repairs";
import AdminNotifications from "./pages/admin/Notifications";
import AdminTeam from "./pages/admin/Team";
import AdminHealth from "./pages/admin/Health";
import AdminReports from "./pages/admin/Reports";
import AdminWorkflow from "./pages/admin/Workflow";
import AuthPage from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import AdminUsers from "./pages/admin/Users";
import Shop from "./pages/Shop";
import ShopNew from "./pages/ShopNew";
import { CartProvider } from "@/components/CartContext";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <CartProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/auth" element={<AuthPage />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/shop" element={<Shop />} />
            <Route path="/shop/new" element={<ShopNew />} />
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={
                <div>
                  <h1 className="text-3xl font-bold mb-4">Admin Panel</h1>
                  <p className="mb-3">Welcome to your dashboard!</p>
                  <div className="rounded-lg bg-card shadow p-8">
                    <h2 className="text-xl font-semibold mb-2">Quick Preview</h2>
                    <p className="mb-4">Use the sidebar to access site analytics, chat management, repair requests, notifications, reporting, workflows, team, and health monitoring.</p>
                    <ul className="space-y-2">
                      <li>📊 Analytics Dashboard</li>
                      <li>💬 Chat Management</li>
                      <li>🛠️ Repair Request Tools</li>
                      <li>🔔 Real-Time Notifications</li>
                      <li>🧑‍💼 Team & RBAC Management</li>
                      <li>🖥️ System Health Monitor</li>
                      <li>📄 Reporting</li>
                      <li>⚙️ Workflow Automation</li>
                    </ul>
                  </div>
                </div>
              } />
              <Route path="chat" element={<AdminChat />} />
              <Route path="repairs" element={<AdminRepairs />} />
              <Route path="notifications" element={<AdminNotifications />} />
              <Route path="team" element={<AdminTeam />} />
              <Route path="health" element={<AdminHealth />} />
              <Route path="reports" element={<AdminReports />} />
              <Route path="workflow" element={<AdminWorkflow />} />
              <Route path="users" element={<AdminUsers />} />
            </Route>
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </CartProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
