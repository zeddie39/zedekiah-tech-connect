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
    <Card className="p-4 sm:p-6 md:p-8 mb-4 max-w-full w-full md:w-2/3 lg:w-1/2 mx-auto">
      <h2 className="font-bold text-lg sm:text-xl md:text-2xl mb-2 font-playfair text-center">
        Repair Requests
      </h2>
      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-2 sm:gap-3 mb-4 sm:mb-6"
      >
        <Input
          placeholder="Device Type (e.g. Laptop, Phone)"
          value={deviceType}
          onChange={(e) => setDeviceType(e.target.value)}
          disabled={submitting}
          className="text-xs sm:text-base"
        />
        <Input
          placeholder="Describe the problem"
          value={problem}
          onChange={(e) => setProblem(e.target.value)}
          disabled={submitting}
          className="text-xs sm:text-base"
        />
        <Button
          type="submit"
          size="sm"
          disabled={submitting}
          className="w-full sm:w-auto"
        >
          {submitting ? "Submitting..." : "Submit Request"}
        </Button>
      </form>
      <div className="overflow-x-auto">
        <table className="min-w-full text-xs sm:text-sm">
          <thead>
            <tr className="bg-accent text-white">
              <th className="px-2 py-1">Device</th>
              <th className="px-2 py-1">Problem</th>
              <th className="px-2 py-1">Status</th>
              <th className="px-2 py-1">Requested</th>
            </tr>
          </thead>
          <tbody>
            {requests.length === 0 ? (
              <tr>
                <td colSpan={4} className="text-center py-2 text-gray-500">
                  No repair requests yet.
                </td>
              </tr>
            ) : (
              requests.map((req) => (
                <tr key={req.id} className="border-b last:border-0">
                  <td className="px-2 py-1 whitespace-nowrap">
                    {req.device_type}
                  </td>
                  <td className="px-2 py-1 whitespace-pre-line max-w-[180px] sm:max-w-[240px] md:max-w-[320px] truncate">
                    {req.problem_description}
                  </td>
                  <td className="px-2 py-1 whitespace-nowrap">{req.status}</td>
                  <td className="px-2 py-1 whitespace-nowrap">
                    {new Date(req.created_at).toLocaleString()}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
