
import { useEffect, useState, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function ProfileSection({ userId }: { userId: string }) {
  const [profile, setProfile] = useState<any>(null);
  const [fullName, setFullName] = useState("");
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    (async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .single();
      if (data) {
        setProfile(data);
        setFullName(data.full_name || "");
        setAvatarUrl(data.avatar_url);
      }
    })();
  }, [userId]);

  const updateProfile = async () => {
    setLoading(true);
    const { error } = await supabase
      .from("profiles")
      .update({ full_name: fullName })
      .eq("id", userId);
    setLoading(false);
    if (!error) {
      setProfile({ ...profile, full_name: fullName });
    }
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;
    setLoading(true);
    const filePath = `${userId}/${file.name}`;
    let { data, error } = await supabase.storage
      .from("avatars")
      .upload(filePath, file, { upsert: true });
    if (!error) {
      const url = supabase.storage.from("avatars").getPublicUrl(filePath).data.publicUrl;
      await supabase.from("profiles").update({ avatar_url: url }).eq("id", userId);
      setAvatarUrl(url);
      setFile(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
    setLoading(false);
  };

  return (
    <Card className="p-8 mb-4">
      <div className="flex flex-col md:flex-row items-center gap-4">
        <div className="flex flex-col items-center">
          <img
            src={avatarUrl || "/placeholder.svg"}
            alt="avatar"
            className="w-24 h-24 rounded-full object-cover bg-gray-200"
          />
          <form onSubmit={handleUpload} className="flex flex-col items-center mt-2">
            <Input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              onChange={e => setFile(e.target.files?.[0] || null)}
              className="mb-2"
              disabled={loading}
            />
            <Button type="submit" size="sm" disabled={loading || !file}>
              {loading ? "Uploading..." : "Upload Avatar"}
            </Button>
          </form>
        </div>
        <div className="flex-1">
          <label className="block font-semibold mb-2">Full Name</label>
          <Input
            value={fullName}
            onChange={e => setFullName(e.target.value)}
            className="mb-2"
            disabled={loading}
          />
          <Button onClick={updateProfile} disabled={loading}>
            Save
          </Button>
        </div>
      </div>
    </Card>
  );
}
