
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Repeat } from "lucide-react";

export default function AdminWorkflow() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4 flex items-center gap-2">
        <Repeat className="text-primary" size={26} /> Workflow Automation
      </h1>
      <p className="mb-6 text-muted-foreground">
        Automate system processes and repetitive admin actions here.
      </p>
      <div className="grid grid-cols-1 gap-6 max-w-xl">
        <Card>
          <CardHeader className="flex flex-row items-center gap-3 pb-2">
            <Repeat size={24} className="text-primary" />
            <div>
              <CardTitle className="text-lg">Repair Request Automation</CardTitle>
              <CardDescription>Auto-assigns repair requests to on-duty staff.</CardDescription>
            </div>
          </CardHeader>
          <CardContent className="pt-0 text-sm text-muted-foreground">
            Status: <span className="text-yellow-600 font-semibold ml-1">Coming Soon</span>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Notifications Routing</CardTitle>
            <CardDescription>Auto-routes system alerts to admins by role.</CardDescription>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            Status: <span className="text-yellow-600 font-semibold ml-1">Coming Soon</span>
          </CardContent>
        </Card>
      </div>
      <div className="mt-10 text-center text-muted-foreground italic">
        Workflow triggers and automations will be configurable here soon!
      </div>
    </div>
  );
}
