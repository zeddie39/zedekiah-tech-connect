
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from "@/components/ui/table";
import { Loader2 } from "lucide-react";

type UserProfile = {
  id: string;
  email: string | null;
  full_name: string | null;
  avatar_url: string | null;
};

export default function AdminUserList() {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfiles = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("profiles")
        .select("id, email, full_name, avatar_url");

      if (!error && data) setUsers(data as UserProfile[]);
      setLoading(false);
    };
    fetchProfiles();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-8">
        <Loader2 className="animate-spin" size={36} />
      </div>
    );
  }

  return (
    <div className="overflow-auto rounded-md bg-card shadow">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>User ID</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Avatar</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user) => (
            <TableRow key={user.id}>
              <TableCell className="font-mono text-xs">{user.id}</TableCell>
              <TableCell>{user.email || <span className="text-muted-foreground">No email</span>}</TableCell>
              <TableCell>{user.full_name || <span className="text-muted-foreground">No name</span>}</TableCell>
              <TableCell>
                {user.avatar_url ? (
                  <img src={user.avatar_url} alt="avatar" className="h-10 w-10 rounded-full" />
                ) : (
                  <span className="text-muted-foreground">-</span>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {users.length === 0 && (
        <p className="p-4 text-muted-foreground text-center">No users found.</p>
      )}
    </div>
  );
}
