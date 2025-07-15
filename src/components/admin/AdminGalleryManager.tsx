import React, { useState } from "react";
import { supabase } from "@/integrations/supabase/client";

const AdminGalleryManager: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return setMessage("Please select an image.");
    setUploading(true);
    setMessage("");
    const fileExt = file.name.split(".").pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 8)}.${fileExt}`;
    const { data: storageData, error: storageError } = await supabase.storage.from("gallery").upload(fileName, file);
    if (storageError) {
      setUploading(false);
      setMessage("Upload failed: " + storageError.message);
      return;
    }
    const imageUrl = supabase.storage.from("gallery").getPublicUrl(fileName).data.publicUrl;
    // @ts-expect-error
    const { error: dbError } = await supabase.from("gallery").insert([
      { image_url: imageUrl, title, description }
    ]);
    setUploading(false);
    if (dbError) {
      setMessage("Database error: " + dbError.message);
    } else {
      setMessage("Image uploaded successfully!");
      setFile(null);
      setTitle("");
      setDescription("");
    }
  };

  return (
    <div className="max-w-lg mx-auto p-6 bg-white rounded shadow mt-8">
      <h2 className="text-2xl font-bold mb-4 text-accent">Upload Poster/Flyer</h2>
      <form onSubmit={handleUpload} className="space-y-4">
        <input type="file" accept="image/*" onChange={e => setFile(e.target.files?.[0] || null)} className="block w-full" />
        <input type="text" placeholder="Title" value={title} onChange={e => setTitle(e.target.value)} className="block w-full border rounded px-3 py-2" />
        <textarea placeholder="Description (optional)" value={description} onChange={e => setDescription(e.target.value)} className="block w-full border rounded px-3 py-2" />
        <button type="submit" disabled={uploading} className="bg-accent text-white px-4 py-2 rounded font-semibold">{uploading ? "Uploading..." : "Upload"}</button>
      </form>
      {message && <div className="mt-4 text-center text-sm text-green-700">{message}</div>}
    </div>
  );
};

export default AdminGalleryManager;
