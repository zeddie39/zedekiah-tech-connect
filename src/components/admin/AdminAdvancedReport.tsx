
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { ChartContainer, ChartLegendContent, ChartTooltipContent } from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer } from "recharts";
import { ChartBar, ChartPie, ChartLine } from "lucide-react";

const demoData = [
  { month: "Jan", repairs: 9, sessions: 2 },
  { month: "Feb", repairs: 13, sessions: 3 },
  { month: "Mar", repairs: 21, sessions: 4 },
  { month: "Apr", repairs: 14, sessions: 5 },
  { month: "May", repairs: 26, sessions: 7 },
  { month: "Jun", repairs: 19, sessions: 9 },
];

const chartConfig = {
  repairs: { label: "Repairs", icon: ChartBar, color: "#ff9800" },
  sessions: { label: "Active Sessions", icon: ChartPie, color: "#160e2e" },
}

const AdminAdvancedReport = () => (
  <Card>
    <CardHeader>
      <CardTitle className="text-lg flex items-center gap-2">
        <ChartLine className="text-primary" size={22} />
        Advanced Analytics
      </CardTitle>
      <CardDescription>Monthly repairs & sessions (Demo)</CardDescription>
    </CardHeader>
    <CardContent>
      <ChartContainer config={chartConfig}>
        <ResponsiveContainer width="100%" height={260}>
          <BarChart data={demoData}>
            <XAxis dataKey="month" stroke="#888" />
            <YAxis stroke="#888" />
            <Bar dataKey="repairs" fill="#ff9800" radius={[4, 4, 0, 0]} />
            <Bar dataKey="sessions" fill="#160e2e" radius={[4, 4, 0, 0]} />
            <ChartTooltipContent />
            <ChartLegendContent />
          </BarChart>
        </ResponsiveContainer>
      </ChartContainer>
      <div className="mt-6 text-xs text-center text-muted-foreground">
        More breakdowns (devices, time-to-repair, user activity) coming soon.
      </div>
    </CardContent>
  </Card>
);

export default AdminAdvancedReport;
