
import AdminChatManager from "@/components/admin/AdminChatManager";

export default function AdminChat() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Chat Management</h1>
      <p className="mb-4">Manage & moderate user chats here.</p>
      <AdminChatManager />
    </div>
  );
}
