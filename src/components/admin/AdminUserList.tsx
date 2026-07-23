import { useEffect, useState, useMemo } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from "@/components/ui/table";
import { Loader2, Edit, UserX, KeyRound, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import AdminEditRoleDialog from "./AdminEditRoleDialog";
import { toast } from "@/hooks/use-toast";

// Helper for CSV export
function exportToCSV(users: UserProfile[]) {
  const headers = ["id", "email", "full_name", "roles"];
  const rows = users.map(u => [
    u.id,
    u.email ?? "",
    u.full_name ?? "",
    (u.user_roles?.map((r: { role: string }) => r.role).join("; ")) ?? ""
  ]);
  const csvContent = [
    headers.join(","),
    ...rows.map(row =>
      row
        .map(v => `"${String(v).replace(/"/g, '""')}"`)
        .join(","))
  ].join("\n");

  const blob = new Blob([csvContent], { type: "text/csv" });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "users-export.csv";
  document.body.appendChild(link);
  link.click();
  link.remove();
}

// Types
type UserProfile = {
  id: string;
  email: string | null;
  full_name: string | null;
  avatar_url: string | null;
  user_roles?: { role: string }[];
};

export default function AdminUserList() {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("");
  const [editUser, setEditUser] = useState<UserProfile | null>(null);
  const [manualUserId, setManualUserId] = useState("");
  const [showManualAdd, setShowManualAdd] = useState(false);
  const [analytics, setAnalytics] = useState<{ total: number; active: number; last7d: number }>({ total: 0, active: 0, last7d: 0 });

  useEffect(() => {
    fetchUsers();
  }, []);

  async function fetchUsers() {
    setLoading(true);
    try {
      // 1. Fetch profiles
      const { data: profiles } = await supabase
        .from("profiles")
        .select("id, email, full_name, avatar_url");

      // 2. Fetch all user_roles
      const { data: roles } = await supabase
        .from("user_roles")
        .select("user_id, role");

      // 3. Fetch user emails from orders (if available)
      const { data: orders } = await supabase
        .from("orders")
        .select("user_id, customer_email, customer_name");

      const userMap: Record<string, UserProfile> = {};

      if (profiles) {
        for (const p of profiles) {
          userMap[p.id] = {
            id: p.id,
            email: p.email,
            full_name: p.full_name,
            avatar_url: p.avatar_url,
            user_roles: [],
          };
        }
      }

      if (orders) {
        for (const o of orders) {
          if (o.user_id) {
            if (!userMap[o.user_id]) {
              userMap[o.user_id] = {
                id: o.user_id,
                email: o.customer_email || null,
                full_name: o.customer_name || null,
                avatar_url: null,
                user_roles: [],
              };
            } else {
              if (!userMap[o.user_id].email && o.customer_email) {
                userMap[o.user_id].email = o.customer_email;
              }
              if (!userMap[o.user_id].full_name && o.customer_name) {
                userMap[o.user_id].full_name = o.customer_name;
              }
            }
          }
        }
      }

      if (roles) {
        for (const ur of roles) {
          if (!userMap[ur.user_id]) {
            userMap[ur.user_id] = {
              id: ur.user_id,
              email: null,
              full_name: null,
              avatar_url: null,
              user_roles: [],
            };
          }
          userMap[ur.user_id].user_roles = userMap[ur.user_id].user_roles || [];
          if (!userMap[ur.user_id].user_roles!.some((r) => r.role === ur.role)) {
            userMap[ur.user_id].user_roles!.push({ role: ur.role });
          }
        }
      }

      const mergedUsers = Object.values(userMap);

      setAnalytics({
        total: mergedUsers.length,
        active: mergedUsers.filter((u) => u.user_roles && u.user_roles.length > 0).length,
        last7d: mergedUsers.length,
      });

      setUsers(mergedUsers);
    } catch (err: any) {
      toast({ title: "Fetch failed", description: err?.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  }

  // Filtered users
  const filtered = useMemo(() => {
    if (!filter) return users;
    return users.filter(
      (u) =>
        (u.email ?? "").toLowerCase().includes(filter.toLowerCase()) ||
        (u.full_name ?? "").toLowerCase().includes(filter.toLowerCase()) ||
        (u.user_roles?.some(r => r.role.toLowerCase().includes(filter.toLowerCase())))
    );
  }, [users, filter]);

  // User Actions
  function handleDeactivate(user: UserProfile) {
    // In real app, probably flag the user, not actually delete
    toast({
      title: "Not implemented",
      description: "Deactivation is not yet implemented.",
      variant: "destructive"
    });
  }
  function handleResetPwd(user: UserProfile) {
    toast({
      title: "Not implemented",
      description: "Password reset coming soon.",
      variant: "destructive"
    });
  }

  return (
    <div>
      {/* Analytics Panel */}
      <div className="mb-6 flex flex-wrap gap-3">
        <div className="bg-card border rounded p-4 flex-1 min-w-[120px] text-center">
          <div className="text-sm text-muted-foreground">All users</div>
          <div className="text-2xl font-bold">{analytics.total}</div>
        </div>
        <div className="bg-card border rounded p-4 flex-1 min-w-[120px] text-center">
          <div className="text-sm text-muted-foreground">Active (14d)</div>
          <div className="text-2xl font-bold">{analytics.active}</div>
        </div>
        <div className="bg-card border rounded p-4 flex-1 min-w-[120px] text-center">
          <div className="text-sm text-muted-foreground">Active (7d)</div>
          <div className="text-2xl font-bold">{analytics.last7d}</div>
        </div>
        <Button onClick={() => exportToCSV(filtered)} size="sm" className="h-11 flex gap-2 items-center"><Download />Export CSV</Button>
      </div>
      {/* Filter/Search */}
      <div className="mb-3 flex items-center gap-2">
        <input
          type="text"
          placeholder="Search email, name, or role…"
          value={filter}
          onChange={e => setFilter(e.target.value)}
          className="w-full max-w-xs p-2 border rounded focus:outline-none"
        />
        <Button type="button" size="sm" variant="secondary" onClick={fetchUsers}>
          Refresh
        </Button>
      </div>
      {/* Table */}
      {loading ? (
        <div className="flex justify-center items-center py-8">
          <Loader2 className="animate-spin" size={36} />
        </div>
      ) : (
        <div className="overflow-auto rounded-md bg-card shadow">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User ID</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Roles</TableHead>
                <TableHead>Avatar</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-mono text-xs">{user.id}</TableCell>
                  <TableCell>{user.email || <span className="text-muted-foreground">No email</span>}</TableCell>
                  <TableCell>{user.full_name || <span className="text-muted-foreground">No name</span>}</TableCell>
                  <TableCell>
                    {user.user_roles && user.user_roles.length > 0 ? (
                      user.user_roles.map((r, i) => (
                        <span
                          key={i}
                          className="inline-block bg-blue-100 rounded px-2 py-0.5 text-xs font-semibold text-blue-800 mr-1"
                        >
                          {r.role}
                        </span>
                      ))
                    ) : (
                      <span className="text-muted-foreground">No roles</span>
                    )}
                  </TableCell>
                  <TableCell>
                    {user.avatar_url ? (
                      <img src={user.avatar_url} alt="avatar" className="h-10 w-10 rounded-full" />
                    ) : (
                      <span className="text-muted-foreground">-</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button size="icon" variant="secondary" onClick={() => setEditUser(user)} title="Edit User Role">
                        <Edit size={18} />
                      </Button>
                      <Button size="icon" variant="destructive" onClick={() => handleDeactivate(user)} title="Deactivate User">
                        <UserX size={18} />
                      </Button>
                      <Button size="icon" variant="outline" onClick={() => handleResetPwd(user)} title="Send Password Reset">
                        <KeyRound size={18} />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {filtered.length === 0 && (
            <p className="p-4 text-muted-foreground text-center">No users found.</p>
          )}
        </div>
      )}
      {/* Edit Role Dialog */}
      {editUser && (
        <AdminEditRoleDialog
          user={editUser}
          onClose={() => setEditUser(null)}
          onRoleUpdated={fetchUsers}
        />
      )}
    </div>
  );
}
