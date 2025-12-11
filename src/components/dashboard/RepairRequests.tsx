import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type RepairRequest = {
  id: string;
  created_at: string;
  device_type: string;
  problem_description: string;
  status: string;
  user_id: string;
};

export default function RepairRequests({ userId }: { userId: string }) {
  const [requests, setRequests] = useState<RepairRequest[]>([]);
  const [deviceType, setDeviceType] = useState("");
  const [problem, setProblem] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (userId) fetchRequests();
    // Poll every 10 seconds for updates
    const interval = setInterval(() => {
      if (userId) fetchRequests();
    }, 10000);
    return () => clearInterval(interval);
    // eslint-disable-next-line
  }, [userId]);

  async function fetchRequests() {
    const { data } = await supabase
      .from("repair_requests")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });
    setRequests(data || []);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    const { error } = await supabase.from("repair_requests").insert([
      {
        user_id: userId,
        device_type: deviceType,
        problem_description: problem,
        status: "pending",
      },
    ]);
    if (!error) {
      setDeviceType("");
      setProblem("");
      fetchRequests();
    }
    setSubmitting(false);
  }

  return (
    <Card className="border border-accent/20 rounded-2xl bg-card/40 backdrop-blur-md shadow-lg overflow-hidden">
      <div className="px-6 py-6 border-b border-accent/20 bg-gradient-to-r from-primary/5 to-transparent">
        <h2 className="font-bold text-xl tracking-tight flex items-center gap-2">
          Repair Requests
        </h2>
        <p className="text-sm text-muted-foreground mt-1">Submit description of your device issue.</p>
      </div>

      <div className="p-6">
        <form
          onSubmit={handleSubmit}
          className="flex flex-col md:flex-row gap-3 mb-8"
        >
          <div className="flex-1">
            <Input
              placeholder="Device Type (e.g. iPhone 13, HP Laptop)"
              value={deviceType}
              onChange={(e) => setDeviceType(e.target.value)}
              disabled={submitting}
              className="bg-background/50 backdrop-blur"
            />
          </div>
          <div className="flex-[2]">
            <Input
              placeholder="Briefly describe the issue..."
              value={problem}
              onChange={(e) => setProblem(e.target.value)}
              disabled={submitting}
              className="bg-background/50 backdrop-blur"
            />
          </div>
          <Button
            type="submit"
            disabled={submitting}
            className="md:w-32 bg-accent text-primary hover:bg-accent/90"
          >
            {submitting ? "..." : "Submit"}
          </Button>
        </form>

        <div className="rounded-xl border border-accent/20 overflow-hidden bg-background/40">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-muted/50 text-xs uppercase text-muted-foreground">
                <tr>
                  <th className="px-4 py-3 font-medium">Device</th>
                  <th className="px-4 py-3 font-medium">Issue</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                  <th className="px-4 py-3 font-medium text-right">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {requests.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-4 py-8 text-center text-muted-foreground">
                      <div className="flex flex-col items-center gap-2">
                        <span className="p-3 bg-muted rounded-full">🔧</span>
                        <span>No repair requests submitted yet.</span>
                      </div>
                    </td>
                  </tr>
                ) : (
                  requests.map((req) => (
                    <tr key={req.id} className="hover:bg-accent/5 transition-colors">
                      <td className="px-4 py-3 font-medium text-foreground">{req.device_type}</td>
                      <td className="px-4 py-3 text-muted-foreground max-w-[200px] truncate" title={req.problem_description}>
                        {req.problem_description}
                      </td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold ${req.status === 'completed' ? 'bg-green-500/10 text-green-500' :
                            req.status === 'in_progress' ? 'bg-blue-500/10 text-blue-500' :
                              'bg-yellow-500/10 text-yellow-500'
                          }`}>
                          {req.status.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right text-xs text-muted-foreground whitespace-nowrap">
                        {new Date(req.created_at).toLocaleDateString()}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </Card>
  );
}
