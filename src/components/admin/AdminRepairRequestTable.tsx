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
    const { error } = await supabase
      .from("repair_requests")
      .update({ status: newStatus })
      .eq("id", id);
    if (error) {
      alert("Failed to update status: " + error.message);
    }
    setUpdating(null);
    fetchRequests();
  }

  useEffect(() => {
    fetchRequests();
  }, []);

  return (
    <div className="rounded border bg-background p-2 sm:p-4">
      <h2 className="font-bold text-base sm:text-lg mb-2 sm:mb-4 font-playfair">
        All Repair Requests
      </h2>
      {loading ? (
        <div className="text-muted-foreground">Loading repair requests...</div>
      ) : (
        <div className="w-full overflow-x-auto">
          <Table className="min-w-[700px] text-xs sm:text-sm">
            <TableHeader>
              <TableRow>
                <TableHead>Device</TableHead>
                <TableHead>Problem</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Requested</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {requests.map((req) => (
                <TableRow key={req.id}>
                  <TableCell>{req.device_type}</TableCell>
                  <TableCell className="max-w-[120px] truncate">
                    {req.problem_description}
                  </TableCell>
                  <TableCell>{req.status}</TableCell>
                  <TableCell>
                    {req.created_at
                      ? new Date(req.created_at).toLocaleString()
                      : ""}
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col gap-1 sm:flex-row sm:gap-2">
                      <Button
                        size="sm"
                        disabled={updating === req.id}
                        onClick={() => updateStatus(req.id, "completed")}
                      >
                        Mark Completed
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        disabled={updating === req.id}
                        onClick={() => updateStatus(req.id, "pending")}
                      >
                        Set Pending
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}

