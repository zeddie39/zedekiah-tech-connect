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
    <Card className="relative overflow-hidden border border-accent/20 rounded-2xl bg-card/40 backdrop-blur-md shadow-lg">
      {/* Header banner */}
      <div className="h-32 w-full bg-gradient-to-r from-primary/95 to-primary/80 relative">
        <div className="absolute inset-0 bg-[url('/grid-pattern.png')] opacity-10"></div>
      </div>

      <div className="px-8 pb-8 -mt-12">
        <div className="flex flex-col md:flex-row items-start gap-6">
          {/* Avatar Section */}
          <div className="flex flex-col items-center">
            <div className="relative group">
              {avatarUrl ? (
                <img
                  src={avatarUrl}
                  alt="Avatar"
                  className="w-24 h-24 rounded-full object-cover ring-4 ring-background shadow-xl"
                />
              ) : (
                <div className="w-24 h-24 rounded-full flex items-center justify-center bg-background ring-4 ring-background shadow-xl text-muted-foreground">
                  <UserIcon className="w-10 h-10" />
                </div>
              )}

              {/* Upload Overlay */}
              <div className="absolute inset-0 rounded-full bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                <ImageUp className="w-8 h-8 text-white" />
              </div>
            </div>
          </div>

          {/* Info Section */}
          <div className="flex-1 pt-12 md:pt-14 space-y-6 w-full">
            <div>
              <h2 className="text-2xl font-bold">{fullName || profile?.email?.split('@')[0]}</h2>
              <p className="text-muted-foreground text-sm">{profile?.email}</p>
            </div>

            <div className="bg-background/40 p-6 rounded-xl border border-accent/10 space-y-4">
              <h3 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground">Personal Details</h3>

              <div className="grid gap-2">
                <label className="text-sm font-medium">Display Name</label>
                <div className="flex gap-2">
                  <Input
                    value={fullName}
                    onChange={e => setFullName(e.target.value)}
                    disabled={!editing || loading}
                    className="bg-background/50"
                  />
                  {editing ? (
                    <>
                      <Button size="sm" onClick={updateProfile} disabled={loading} className="gap-2 bg-accent text-primary hover:bg-accent/90">
                        <Check className="w-4 h-4" /> Save
                      </Button>
                      <Button size="sm" variant="ghost" onClick={() => setEditing(false)} disabled={loading}>
                        <X className="w-4 h-4" />
                      </Button>
                    </>
                  ) : (
                    <Button size="sm" variant="outline" onClick={() => setEditing(true)} className="gap-2">
                      <PencilLine className="w-4 h-4" /> Edit
                    </Button>
                  )}
                </div>
              </div>

              <div className="pt-4 border-t border-dashed">
                <form onSubmit={handleUpload} className="flex items-center gap-4">
                  <div className="flex-1">
                    <input
                      type="file"
                      accept="image/*"
                      ref={fileInputRef}
                      title="Upload Profile Photo"
                      aria-label="Upload Profile Photo"
                      onChange={e => {
                        setFile(e.target.files?.[0] || null);
                        if (e.target.files?.[0]) handleUpload({ preventDefault: () => { } } as any); // Auto upload on select
                      }}
                      className="hidden"
                    />
                    <Button type="button" variant="secondary" size="sm" className="w-full" onClick={() => fileInputRef.current?.click()}>
                      Change Profile Photo
                    </Button>
                  </div>
                  <div className="text-xs text-muted-foreground flex-1">
                    Supported: JPG, PNG. Max 2MB.
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
