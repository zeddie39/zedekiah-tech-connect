
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import AdminChatThread from "./AdminChatThread";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

type Thread = {
  id: string;
  user_id: string | null;
  created_at: string | null;
  content: string;
};

export default function AdminChatManager() {
  const [threads, setThreads] = useState<Thread[]>([]);
  const [selectedThread, setSelectedThread] = useState<Thread | null>(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchThreads();
     
  }, []);

  async function fetchThreads() {
    setLoading(true);
    const { data, error } = await supabase
      .from("messages")
      .select("*")
      .order("created_at", { ascending: false });
    setThreads(data || []);
    setLoading(false);
  }

  const filteredThreads = threads.filter((t) =>
    t.user_id?.includes(search.trim()) ||
    t.content.toLowerCase().includes(search.trim().toLowerCase())
  );

  return (
    <div className="flex gap-4 flex-col md:flex-row">
      <Card className="w-full md:w-[340px] p-3 overflow-auto shrink-0">
        <div className="font-semibold text-lg mb-3">Chat Threads</div>
        <div className="mb-2">
          <Input
            placeholder="Search by user or content..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="mb-2"
          />
        </div>
        {loading ? (
          <div className="text-muted-foreground">Loading...</div>
        ) : filteredThreads.length === 0 ? (
          <div className="text-muted-foreground text-sm">No threads found.</div>
        ) : (
          <ul>
            {filteredThreads.map((thread) => (
              <li
                key={thread.id}
                className={`p-2 rounded cursor-pointer hover:bg-accent mb-2 ${
                  selectedThread?.id === thread.id ? "bg-accent" : ""
                }`}
                onClick={() => setSelectedThread(thread)}
              >
                <div className="font-medium text-sm">
                  {thread.user_id?.slice(0, 8) || "No User"}
                </div>
                <div className="text-xs text-muted-foreground truncate">{thread.content}</div>
                <div className="text-[10px] text-gray-400">
                  {thread.created_at ? new Date(thread.created_at).toLocaleString() : ""}
                </div>
              </li>
            ))}
          </ul>
        )}
        <div className="mt-4">
          <Button
            variant="outline"
            onClick={fetchThreads}
            className="w-full"
            size="sm"
          >
            Refresh List
          </Button>
        </div>
      </Card>
      <div className="flex-1">
        {selectedThread ? (
          <AdminChatThread thread={selectedThread} onBack={() => setSelectedThread(null)} />
        ) : (
          <div className="h-full flex flex-col items-center justify-center">
            <span className="text-muted-foreground">Select a chat thread to view conversation.</span>
          </div>
        )}
      </div>
    </div>
  );
}

