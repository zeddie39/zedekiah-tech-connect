import { useEffect, useState, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

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
      const { data, error } = await supabase
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
    const filePath = `${userId}/${file.name}`;
    const { data, error } = await supabase.storage
      .from("avatars")
      .upload(filePath, file, { upsert: true });
    if (!error) {
      const url = supabase.storage.from("avatars").getPublicUrl(filePath).data.publicUrl;
      const { data: updated, error: updateError } = await supabase.from("profiles").update({ avatar_url: url }).eq("id", userId).select();
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

  return (
    <Card className="p-4 sm:p-6 md:p-8 mb-4 max-w-full w-full md:w-2/3 lg:w-1/2 mx-auto">
      <h2 className="font-bold text-lg sm:text-xl md:text-2xl mb-2 font-playfair text-center">Profile</h2>
      <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-8">
        {/* Avatar */}
        <div className="flex flex-col items-center gap-2 w-full sm:w-auto">
          {avatarUrl ? (
            <img src={avatarUrl} alt="Avatar" className="w-20 h-20 sm:w-24 sm:h-24 rounded-full object-cover border-2 border-accent" />
          ) : (
            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gray-200 flex items-center justify-center text-3xl text-gray-400 border-2 border-accent">
              ?
            </div>
          )}
          <form onSubmit={handleUpload} className="flex flex-col items-center gap-2 w-full">
            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              onChange={e => setFile(e.target.files?.[0] || null)}
              className="block w-full text-xs sm:text-sm file:mr-2 file:py-1 file:px-2 file:rounded file:border-0 file:text-xs file:bg-accent file:text-white"
            />
            <Button type="submit" size="sm" disabled={loading || !file} className="w-full sm:w-auto">Upload</Button>
          </form>
        </div>
        {/* Profile Info */}
        <div className="flex-1 w-full">
          <div className="flex flex-col gap-2">
            <label className="font-semibold text-xs sm:text-sm">Full Name</label>
            <Input
              value={fullName}
              onChange={e => setFullName(e.target.value)}
              disabled={!editing || loading}
              className="text-xs sm:text-base"
            />
            <div className="flex gap-2 mt-2">
              {editing ? (
                <>
                  <Button size="sm" onClick={updateProfile} disabled={loading}>Save</Button>
                  <Button size="sm" variant="outline" onClick={() => setEditing(false)} disabled={loading}>Cancel</Button>
                </>
              ) : (
                <Button size="sm" onClick={() => setEditing(true)}>Edit</Button>
              )}
            </div>
            {errorMsg && <div className="text-red-500 text-xs mt-2">{errorMsg}</div>}
          </div>
        </div>
      </div>
    </Card>
  );
}
