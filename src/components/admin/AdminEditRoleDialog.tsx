
import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

// list of possible roles, could be fetched from enum if you want to expand
const ROLES = [
  "super_admin",
  "support_admin",
  "data_analyst",
];

export default function AdminEditRoleDialog({
  user,
  onClose,
  onRoleUpdated
}: {
  user: { id: string, email: string | null, user_roles?: { role: string }[] };
  onClose: () => void,
  onRoleUpdated: () => void,
}) {
  const [selectedRole, setSelectedRole] = useState<string>("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (user.user_roles && user.user_roles.length > 0) {
      setSelectedRole(user.user_roles[0].role);
    } else {
      setSelectedRole("");
    }
  }, [user]);

  // Handle saving role
  async function handleSave() {
    setSaving(true);
    // Remove all previous roles for user
    let { error: delError } = await supabase
      .from("user_roles")
      .delete()
      .eq("user_id", user.id);

    if (delError) {
      toast({ title: "Failed to remove previous roles", description: delError.message, variant: "destructive" });
      setSaving(false);
      return;
    }
    // Add new role (if any)
    if (selectedRole) {
      let { error: insError } = await supabase.from("user_roles").insert([{ user_id: user.id, role: selectedRole }]);
      if (insError) {
        toast({ title: "Failed to add role", description: insError.message, variant: "destructive" });
        setSaving(false);
        return;
      }
    }
    toast({ title: "Role updated", description: `Role for ${user.email} set to ${selectedRole}` });
    setSaving(false);
    onRoleUpdated();
    onClose();
  }

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Role</DialogTitle>
        </DialogHeader>
        <div className="mb-4">
          <div className="text-sm mb-2">User: <span className="font-mono">{user.email}</span></div>
          <select
            className="w-full p-2 border rounded"
            value={selectedRole}
            onChange={e => setSelectedRole(e.target.value)}
          >
            <option value="">No Role</option>
            {ROLES.map(r => (
              <option value={r} key={r}>{r}</option>
            ))}
          </select>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={saving}>Cancel</Button>
          <Button onClick={handleSave} disabled={saving || selectedRole === (user.user_roles?.[0]?.role ?? "")}>
            {saving ? "Saving…" : "Save"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
