
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";

type RepairRequest = {
  id: string;
  user_id: string | null;
  device_type: string | null;
  problem_description: string | null;
  status: string | null;
  created_at: string | null;
};

export default function AdminRepairRequestTable() {
  const [requests, setRequests] = useState<RepairRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);

  async function fetchRequests() {
    setLoading(true);
    const { data, error } = await supabase
      .from("repair_requests")
      .select("*")
      .order("created_at", { ascending: false });
    setRequests(data || []);
    setLoading(false);
  }

  async function updateStatus(id: string, newStatus: string) {
    setUpdating(id);
    await supabase
      .from("repair_requests")
      .update({ status: newStatus })
      .eq("id", id);
    setUpdating(null);
    fetchRequests();
  }

  useEffect(() => {
    fetchRequests();
  }, []);

  return (
    <div className="rounded border bg-background p-4">
      <h2 className="font-bold text-lg mb-4">All Repair Requests</h2>
      {loading ? (
        <div className="text-muted-foreground">Loading repair requests...</div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Device</TableHead>
              <TableHead>Problem</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>User ID</TableHead>
              <TableHead>Submitted</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {requests.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6}>
                  <span className="text-muted-foreground">No repair requests.</span>
                </TableCell>
              </TableRow>
            ) : (
              requests.map((rq) => (
                <TableRow key={rq.id}>
                  <TableCell>{rq.device_type || "-"}</TableCell>
                  <TableCell>{rq.problem_description || "-"}</TableCell>
                  <TableCell>
                    <span
                      className={
                        rq.status === "completed"
                          ? "text-green-600 font-semibold"
                          : rq.status === "pending"
                          ? "text-yellow-600 font-semibold"
                          : "text-gray-600"
                      }
                    >
                      {rq.status}
                    </span>
                  </TableCell>
                  <TableCell className="truncate max-w-[140px]">{rq.user_id?.slice(0,6) + "..." || "-"}</TableCell>
                  <TableCell>
                    {rq.created_at
                      ? new Date(rq.created_at).toLocaleString()
                      : "-"}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      {rq.status !== "completed" && (
                        <Button
                          variant="outline"
                          size="sm"
                          disabled={updating === rq.id}
                          onClick={() => updateStatus(rq.id, "completed")}
                        >
                          Mark Completed
                        </Button>
                      )}
                      {rq.status !== "pending" && (
                        <Button
                          variant="secondary"
                          size="sm"
                          disabled={updating === rq.id}
                          onClick={() => updateStatus(rq.id, "pending")}
                        >
                          Mark Pending
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      )}
    </div>
  );
}

