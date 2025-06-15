
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ChartContainer, ChartLegendContent, ChartTooltipContent } from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer } from "recharts";
import { BarChart2 } from "lucide-react";

// Demo data - replace with real data in future step
const data = [
  { month: "Jan", sales: 1000, orders: 24 },
  { month: "Feb", sales: 1780, orders: 30 },
  { month: "Mar", sales: 1350, orders: 22 },
  { month: "Apr", sales: 2200, orders: 40 },
  { month: "May", sales: 2540, orders: 44 },
  { month: "Jun", sales: 3000, orders: 51 },
];

const chartConfig = {
  sales: { label: "Sales ($)", color: "#34d399", icon: BarChart2 },
  orders: { label: "Orders", color: "#818cf8", icon: BarChart2 },
};

export default function AdminAnalyticsWidget() {
  // Calculate summary metrics from data (for demo: use last month)
  const lastMonth = data[data.length - 1];
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <BarChart2 className="text-primary" size={22} />
          Dashboard Analytics
        </CardTitle>
        <CardDescription>Recent sales and order trends</CardDescription>
        <div className="mt-4 flex flex-wrap gap-6 text-base">
          <div>
            <span className="font-semibold text-2xl mr-2">${lastMonth.sales.toLocaleString()}</span>
            <span className="text-muted-foreground">Sales (last month)</span>
          </div>
          <div>
            <span className="font-semibold text-2xl mr-2">{lastMonth.orders}</span>
            <span className="text-muted-foreground">Orders (last month)</span>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={data}>
              <XAxis dataKey="month" stroke="#888" />
              <YAxis stroke="#888" />
              <Bar dataKey="sales" fill="#34d399" radius={[4, 4, 0, 0]} />
              <Bar dataKey="orders" fill="#818cf8" radius={[4, 4, 0, 0]} />
              <ChartTooltipContent />
              <ChartLegendContent />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
