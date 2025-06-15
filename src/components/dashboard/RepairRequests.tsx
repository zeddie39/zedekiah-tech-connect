
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function RepairRequests({ userId }: { userId: string }) {
  const [requests, setRequests] = useState<any[]>([]);
  const [deviceType, setDeviceType] = useState("");
  const [problem, setProblem] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (userId) fetchRequests();
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
    <Card className="p-8 mb-4">
      <h2 className="font-bold text-xl mb-2">Repair Requests</h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-3 mb-6">
        <Input
          placeholder="Device Type (e.g. Laptop, Phone)"
          value={deviceType}
          onChange={e => setDeviceType(e.target.value)}
          disabled={submitting}
        />
        <Input
          placeholder="Describe the problem"
          value={problem}
          onChange={e => setProblem(e.target.value)}
          disabled={submitting}
        />
        <Button type="submit" disabled={submitting || !deviceType || !problem}>
          {submitting ? "Submitting..." : "Submit Request"}
        </Button>
      </form>
      <div>
        <h3 className="font-semibold mb-2">Your Requests</h3>
        <ul className="space-y-2">
          {requests.length === 0 ? (
            <li className="text-gray-500 text-sm">No repair requests yet.</li>
          ) : (
            requests.map(rq => (
              <li key={rq.id} className="border rounded p-3 bg-muted">
                <div>
                  <span className="font-semibold">Device:</span> {rq.device_type}
                </div>
                <div>
                  <span className="font-semibold">Problem:</span> {rq.problem_description}
                </div>
                <div>
                  <span className="font-semibold">Status:</span>{" "}
                  <span
                    className={
                      rq.status === "completed"
                        ? "text-green-600"
                        : rq.status === "pending"
                        ? "text-yellow-600"
                        : "text-gray-600"
                    }
                  >
                    {rq.status}
                  </span>
                </div>
                <div className="text-xs text-gray-500">
                  Submitted: {new Date(rq.created_at).toLocaleString()}
                </div>
              </li>
            ))
          )}
        </ul>
      </div>
    </Card>
  );
}
