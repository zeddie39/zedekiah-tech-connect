import { Card } from "@/components/ui/card";
import { BarChart2, MessageCircle, Wrench, Bell, Users, Activity, FileText, Repeat, Monitor } from "lucide-react";

export default function DashboardHome() {
  return (
    <div className="w-full max-w-4xl mx-auto mt-6 space-y-8">
      <Card className="p-6 bg-white/90 border border-accent rounded-2xl shadow-lg">
        <h1 className="text-3xl font-bold text-primary mb-2">Admin Panel</h1>
        <p className="text-lg text-muted-foreground mb-2">Welcome to your dashboard!</p>
        <p className="text-base text-gray-700">Use the sidebar to access site analytics, chat management, repair requests, notifications, reporting, workflows, team, and health monitoring.</p>
      </Card>
      <Card className="p-6 bg-white/90 border border-accent rounded-2xl shadow-lg">
        <h2 className="text-2xl font-semibold text-accent mb-4">Quick Preview</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="flex items-center gap-4">
            <BarChart2 className="text-primary" size={32} />
            <div>
              <div className="font-bold text-lg">Analytics Dashboard</div>
              <div className="text-gray-600 text-sm">📊 Recent sales and order trends</div>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <MessageCircle className="text-primary" size={32} />
            <div>
              <div className="font-bold text-lg">Chat Management</div>
              <div className="text-gray-600 text-sm">💬 Moderate user chats</div>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Wrench className="text-primary" size={32} />
            <div>
              <div className="font-bold text-lg">Repair Request Tools</div>
              <div className="text-gray-600 text-sm">🛠️ Manage repair requests</div>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Bell className="text-primary" size={32} />
            <div>
              <div className="font-bold text-lg">Real-Time Notifications</div>
              <div className="text-gray-600 text-sm">🔔 Stay updated instantly</div>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Users className="text-primary" size={32} />
            <div>
              <div className="font-bold text-lg">Team & RBAC Management</div>
              <div className="text-gray-600 text-sm">🧑‍💼 Manage roles & team</div>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Activity className="text-primary" size={32} />
            <div>
              <div className="font-bold text-lg">System Health Monitor</div>
              <div className="text-gray-600 text-sm">🖥️ Monitor system health</div>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <FileText className="text-primary" size={32} />
            <div>
              <div className="font-bold text-lg">Reporting</div>
              <div className="text-gray-600 text-sm">📄 View and export reports</div>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Repeat className="text-primary" size={32} />
            <div>
              <div className="font-bold text-lg">Workflow Automation</div>
              <div className="text-gray-600 text-sm">⚙️ Automate admin tasks</div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
