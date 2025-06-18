import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { BarChart2, FileText } from "lucide-react";
import AdminAdvancedReport from "@/components/admin/AdminAdvancedReport";

export default function AdminReports() {
  return (
    <div className="pt-24 sm:pt-28">
      <h1 className="text-2xl font-bold mb-4 flex items-center gap-2">
        <FileText className="text-primary" size={26} /> Reporting & Analytics
      </h1>
      <p className="mb-6 text-muted-foreground">
        Review analytics and system reports for better decision making.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center gap-3 pb-2">
            <BarChart2 size={24} className="text-primary" />
            <div>
              <CardTitle className="text-lg">Analytics Summary</CardTitle>
              <CardDescription>Key admin site stats</CardDescription>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="flex flex-col gap-3">
              <div className="flex justify-between text-sm">
                <span>Users</span>
                <span className="font-semibold">132</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Active Sessions</span>
                <span className="font-semibold">11</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Repairs This Month</span>
                <span className="font-semibold">27</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Messages Resolved</span>
                <span className="font-semibold">58</span>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">System Reports</CardTitle>
            <CardDescription>Export and generate detailed reports</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="mb-3 text-muted-foreground text-sm">
              Download recent admin activity, repairs, and notification logs.
            </div>
            <button className="px-4 py-2 rounded bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition">
              Export Reports
            </button>
          </CardContent>
        </Card>
      </div>
      <div className="mt-8">
        <AdminAdvancedReport />
      </div>
      <div className="mt-10 text-center text-muted-foreground italic">More advanced reports coming soon...</div>
    </div>
  );
}
