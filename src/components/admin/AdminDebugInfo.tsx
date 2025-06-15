
interface AdminDebugInfoProps {
  userEmail: string | null;
  userId: string | null;
  statuses: { roles: string[] };
  roleNames: Record<string, string>;
}

const AdminDebugInfo = ({
  userEmail,
  userId,
  statuses,
  roleNames
}: AdminDebugInfoProps) => (
  <div className="bg-card/90 p-4 border-b border-accent/30">
    <div className="text-xs">
      <span className="font-semibold">Email:</span> {userEmail || "(none)"}
    </div>
    <div className="text-xs">
      <span className="font-semibold">User ID:</span> {userId || "(none)"}
    </div>
    <div className="text-xs">
      <span className="font-semibold">Roles:</span>{" "}
      {statuses.roles.length === 0 ? (
        <span className="text-red-500">No roles assigned</span>
      ) : (
        statuses.roles.map((r) => (
          <span key={r} className="inline-block mr-2 px-2 py-0.5 bg-accent/20 rounded text-accent-foreground">
            {roleNames[r] || r}
          </span>
        ))
      )}
    </div>
  </div>
);

export default AdminDebugInfo;
