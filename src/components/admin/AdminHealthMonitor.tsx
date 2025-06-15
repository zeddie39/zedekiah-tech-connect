
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, CheckCircle2, XCircle, HardDrive, Database, Cloud } from "lucide-react";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

type HealthItem = {
  key: string;
  label: string;
  icon: React.ReactNode;
  status: "loading" | "ok" | "down";
  description: string;
};

const itemsConfig = [
  {
    key: "api",
    label: "API Service",
    icon: <HardDrive className="mr-1" size={18} />,
    description: "API endpoints availability check."
  },
  {
    key: "db",
    label: "Database",
    icon: <Database className="mr-1" size={18} />,
    description: "Checks database connection and access."
  },
  {
    key: "storage",
    label: "Storage",
    icon: <Cloud className="mr-1" size={18} />,
    description: "Checks if storage services are available."
  },
];

export default function AdminHealthMonitor() {
  const [health, setHealth] = useState<Record<string, HealthItem>>({});

  useEffect(() => {
    // Simulate health checks with timeout (replace with real checks if needed)
    setHealth(() =>
      Object.fromEntries(
        itemsConfig.map((item) => [
          item.key,
          {
            ...item,
            status: "loading",
          },
        ])
      )
    );
    const timeout = setTimeout(() => {
      setHealth({
        api: { ...itemsConfig[0], status: "ok" },
        db: { ...itemsConfig[1], status: "ok" },
        storage: { ...itemsConfig[2], status: "down" }, // simulate storage down
      });
    }, 1200);
    return () => clearTimeout(timeout);
  }, []);

  return (
    <div className="max-w-2xl mx-auto">
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Loader2 className="text-primary animate-spin mr-1" size={20} />
            System Health Monitor
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="mb-2 text-muted-foreground text-sm">
            Monitor system health, status, and performance.
          </p>
          <div className="grid gap-4">
            {Object.values(health).length === 0
              ? <div className="flex items-center gap-2 text-muted-foreground">
                  <Loader2 size={18} className="animate-spin" /> Fetching service statuses...
                </div>
              : Object.values(health).map(item => (
                <div
                  key={item.key}
                  className={cn("flex items-center justify-between border rounded p-3 bg-muted/60",
                    item.status === "down" && "border-destructive bg-red-50 dark:bg-red-950/30"
                  )}
                >
                  <div className="flex items-center">
                    {item.icon}
                    <span className="font-medium">{item.label}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="hidden sm:inline text-xs text-muted-foreground mr-2">{item.description}</span>
                    {item.status === "loading" && (
                      <Badge variant="secondary" className="flex items-center gap-1">
                        <Loader2 className="animate-spin" size={13} /> Checking...
                      </Badge>
                    )}
                    {item.status === "ok" && (
                      <Badge className="bg-green-100 text-green-800 dark:bg-green-900/60 dark:text-green-200 flex items-center gap-1">
                        <CheckCircle2 size={15} /> OK
                      </Badge>
                    )}
                    {item.status === "down" && (
                      <Badge className="bg-red-100 text-red-700 dark:bg-red-900/70 dark:text-red-100 flex items-center gap-1">
                        <XCircle size={15} /> Down
                      </Badge>
                    )}
                  </div>
                </div>
              ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
