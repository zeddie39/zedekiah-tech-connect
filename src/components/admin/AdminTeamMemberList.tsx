import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, User } from "lucide-react";
import { Loader2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import type { Json } from "@/integrations/supabase/types";

type TeamMember = {
  id: string;
  name: string;
  role: string | null;
  bio?: string | null;
  avatar_url?: string | null;
  expertise?: string[] | null;
  socials?: Json | null;
  email?: string | null;
  user_roles?: Array<{ role: string }>;
};

export default function AdminTeamMemberList() {
  const [loading, setLoading] = useState(true);
  const [team, setTeam] = useState<TeamMember[]>([]);

  useEffect(() => {
    fetchTeam();
  }, []);

  async function fetchTeam() {
    setLoading(true);

    const { data: members, error } = await supabase
      .from("team_members")
      .select(
        "id, name, role, bio, avatar_url, expertise, socials"
      )
      .order("created_at", { ascending: true });

    if (error) {
      toast({
        variant: "destructive",
        title: "Failed to fetch team",
        description: error.message,
      });
      setLoading(false);
      return;
    }

    // Try to get each member's roles from user_roles & their email (if a matching profile exists)
    const memberIds = (members ?? []).map((m) => m.id);

    const rolesMap: Record<string, Array<{ role: string }>> = {};
    const emailMap: Record<string, string> = {};

    if (memberIds.length > 0) {
      const { data: userRoles } = await supabase
        .from("user_roles")
        .select("user_id, role")
        .in("user_id", memberIds);

      if (userRoles)
        userRoles.forEach((r: { user_id: string; role: string }) => {
          if (!rolesMap[r.user_id]) rolesMap[r.user_id] = [];
          rolesMap[r.user_id].push({ role: r.role });
        });

      const { data: profiles } = await supabase
        .from("profiles")
        .select("id, email")
        .in("id", memberIds);

      if (profiles)
        profiles.forEach((p: { id: string; email: string }) => {
          emailMap[p.id] = p.email;
        });
    }

    setTeam(
      (members ?? []).map((m) => ({
        ...m,
        user_roles: rolesMap[m.id] || [],
        email: emailMap[m.id] || null,
      }))
    );
    setLoading(false);
  }

  return (
    <div className="max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold mb-2 flex items-center gap-2 font-playfair">
        <Users size={22} /> Team Members & Roles
      </h2>
      <Card className="mb-6 p-4">
        <div className="text-muted-foreground text-sm">
          Manage all your staff, their roles and RBAC assignments from here.
        </div>
      </Card>
      {loading ? (
        <div className="p-8 flex justify-center items-center">
          <Loader2 className="animate-spin mr-2" />
          <span>Loading team members...</span>
        </div>
      ) : team.length === 0 ? (
        <div className="p-8 text-center text-muted-foreground">
          No team members found.
        </div>
      ) : (
        <div className="space-y-4">
          {team.map((member) => (
            <Card key={member.id} className="p-5 flex gap-4 items-start">
              {member.avatar_url ? (
                <img
                  src={member.avatar_url}
                  alt={member.name}
                  className="w-16 h-16 rounded-full object-cover border"
                />
              ) : (
                <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center">
                  <User size={36} className="text-primary" />
                </div>
              )}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-lg">{member.name}</span>
                  {member.role && (
                    <Badge variant="secondary">{member.role}</Badge>
                  )}
                  {member.user_roles && member.user_roles.length > 0 && (
                    <span className="ml-2 flex flex-wrap gap-2">
                      {member.user_roles.map((ur, i) => (
                        <Badge
                          key={i}
                          className="bg-blue-50 text-blue-800 dark:bg-blue-900/40 dark:text-blue-200"
                        >
                          {ur.role}
                        </Badge>
                      ))}
                    </span>
                  )}
                </div>
                <div className="text-muted-foreground text-sm">
                  {member.email || <span className="italic text-xs">No email</span>}
                </div>
                <div className="text-gray-600 mb-1 text-sm">{member.bio}</div>
                {member.expertise && member.expertise.length > 0 && (
                  <div className="mt-1 flex flex-wrap gap-2">
                    {member.expertise.map((ex, i) => (
                      <Badge
                        key={i}
                        className="bg-green-50 text-green-800 dark:bg-green-900/40 dark:text-green-200"
                      >
                        {ex}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
