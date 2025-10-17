import { useEffect, useState, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { User as UserIcon, ImageUp, PencilLine, Check, X } from "lucide-react";

type Profile = {
  id: string;
  full_name: string | null;
  avatar_url: string | null;
  email: string | null;
};

export default function ProfileSection({ userId }: { userId: string }) {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [fullName, setFullName] = useState("");
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [editing, setEditing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    (async () => {
      const { data } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .single();
      if (data) {
        setProfile(data);
        setFullName(data.full_name || "");
        setAvatarUrl(data.avatar_url);
        setEditing(false);
      }
    })();
  }, [userId]);

  const updateProfile = async () => {
    setLoading(true);
    setErrorMsg(null);
    const { data, error } = await supabase
      .from("profiles")
      .update({ full_name: fullName })
      .eq("id", userId)
      .select();
    setLoading(false);
    if (!error && data && data.length > 0) {
      setProfile(data[0]);
      setFullName(data[0].full_name || "");
      setEditing(false);
    } else if (error) {
      setErrorMsg(error.message);
    }
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;
    setLoading(true);
    setErrorMsg(null);
    const filePath = `${userId}/${file.name}`;
    const { error } = await supabase.storage
      .from("avatars")
      .upload(filePath, file, { upsert: true });
    if (!error) {
      const url = supabase.storage.from("avatars").getPublicUrl(filePath).data.publicUrl;
      const { data: updated } = await supabase
        .from("profiles")
        .update({ avatar_url: url })
        .eq("id", userId)
        .select();
      setAvatarUrl(url);
      if (updated && updated.length > 0) {
        setProfile(updated[0]);
        setFullName(updated[0].full_name || "");
      }
      setFile(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
    setLoading(false);
  };

  const initial = (fullName || profile?.email || "?").trim().charAt(0).toUpperCase();

  return (
    <Card className="relative overflow-hidden border border-accent/30 rounded-2xl bg-card/90 shadow-md">
      {/* Header banner */}
      <div className="h-20 sm:h-24 w-full bg-gradient-to-r from-primary/90 via-accent/80 to-primary/80" />

      <div className="px-4 sm:px-6 md:px-8 pb-6 -mt-10">
        {/* Avatar and title row */}
        <div className="flex items-start gap-4">
          <div className="relative shrink-0">
            {avatarUrl ? (
              <img
                src={avatarUrl}
                alt="Avatar"
                className="w-20 h-20 sm:w-24 sm:h-24 rounded-full object-cover ring-2 ring-accent shadow-lg bg-background"
              />
            ) : (
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full flex items-center justify-center bg-background ring-2 ring-accent shadow-lg">
                <UserIcon className="w-10 h-10 text-muted-foreground" />
              </div>
            )}
          </div>
          <div className="flex-1 pt-2">
            <h3 className="text-lg sm:text-xl font-extrabold">Your Profile</h3>
            <p className="text-xs sm:text-sm text-muted-foreground">Manage your personal information and avatar.</p>
          </div>
        </div>

        {/* Content grid */}
        <div className="mt-5 grid grid-cols-1 md:grid-cols-[220px,1fr] gap-5">
          {/* Avatar and upload */}
          <div className="bg-muted/40 border border-accent/20 rounded-xl p-3">
            <form onSubmit={handleUpload} className="space-y-2">
              <label className="text-xs text-muted-foreground">Change avatar</label>
              <input
                type="file"
                accept="image/*"
                ref={fileInputRef}
                onChange={e => setFile(e.target.files?.[0] || null)}
                className="block w-full text-xs sm:text-sm file:mr-2 file:py-1.5 file:px-3 file:rounded-md file:border-0 file:bg-accent file:text-primary file:font-semibold hover:file:bg-accent/90 file:transition"
              />
              <p className="text-[11px] text-muted-foreground">JPG, PNG recommended. Square images look best.</p>
              <Button type="submit" size="sm" disabled={loading || !file} className="w-full">{loading ? "Uploading..." : "Upload"}</Button>
            </form>
          </div>

          {/* Profile info */}
          <div className="bg-muted/40 border border-accent/20 rounded-xl p-3">
            <div className="space-y-2">
              <label className="font-semibold text-xs sm:text-sm">Full Name</label>
              <Input
                value={fullName}
                onChange={e => setFullName(e.target.value)}
                disabled={!editing || loading}
                placeholder="Enter your full name"
              />
              <div className="flex flex-wrap gap-2 mt-2">
                {editing ? (
                  <>
                    <Button size="sm" onClick={updateProfile} disabled={loading} className="inline-flex items-center gap-1">
                      <Check className="w-4 h-4" /> Save
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => setEditing(false)} disabled={loading} className="inline-flex items-center gap-1">
                      <X className="w-4 h-4" /> Cancel
                    </Button>
                  </>
                ) : (
                  <Button size="sm" onClick={() => setEditing(true)} className="inline-flex items-center gap-1">
                    <PencilLine className="w-4 h-4" /> Edit
                  </Button>
                )}
              </div>
              {errorMsg && <div className="text-red-500 text-xs mt-2">{errorMsg}</div>}
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
