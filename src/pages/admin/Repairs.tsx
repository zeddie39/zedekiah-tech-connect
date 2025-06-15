
import AdminRepairRequestTable from "@/components/admin/AdminRepairRequestTable";

export default function AdminRepairs() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Repair Request Tools</h1>
      <p className="mb-4">View, manage, and respond to repair requests from users.</p>
      <AdminRepairRequestTable />
    </div>
  );
}
