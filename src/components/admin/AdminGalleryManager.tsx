import React, { useState } from "react";
import { supabase } from "@/integrations/supabase/client";

const AdminGalleryManager: React.FC = () => {
  const [step, setStep] = useState<null | string>(null); // null = choose type, else type
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");

  const types = [
    "Posters",
    "Flyers",
    "Blogs",
    "Repairs",
    "Events",
    "Products",
    "Services",
    "Team",
    "Testimonials"
  ];

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
      { image_url: imageUrl, title, description, category: step }
    ]);
    setUploading(false);
    if (dbError) {
      setMessage("Database error: " + dbError.message);
    } else {
      setMessage("Image uploaded successfully!");
      setFile(null);
      setTitle("");
      setDescription("");
      setStep(null);
    }
  };

  return (
    <div className="max-w-lg mx-auto p-6 bg-white rounded shadow mt-8">
      <h2 className="text-2xl font-bold mb-4 text-accent">Upload to Gallery</h2>
      {!step ? (
        <div>
          <div className="mb-4 text-lg font-semibold">What do you want to upload?</div>
          <div className="flex flex-wrap gap-3">
            {types.map(type => (
              <button
                key={type}
                className="bg-accent text-white px-4 py-2 rounded font-semibold hover:bg-accent-dark"
                onClick={() => setStep(type)}
              >{type}</button>
            ))}
          </div>
        </div>
      ) : (
        <form onSubmit={handleUpload} className="space-y-4">
          <div className="mb-2 text-accent font-bold">Type: {step} <button type="button" className="ml-2 text-xs text-gray-500 underline" onClick={() => setStep(null)}>Change</button></div>
          <input type="file" accept="image/*" onChange={e => setFile(e.target.files?.[0] || null)} className="block w-full" />
          <input type="text" placeholder="Title" value={title} onChange={e => setTitle(e.target.value)} className="block w-full border rounded px-3 py-2" />
          <textarea placeholder="Description (optional)" value={description} onChange={e => setDescription(e.target.value)} className="block w-full border rounded px-3 py-2" />
          <button type="submit" disabled={uploading} className="bg-accent text-white px-4 py-2 rounded font-semibold">{uploading ? "Uploading..." : "Upload"}</button>
        </form>
      )}
      {message && <div className="mt-4 text-center text-sm text-green-700">{message}</div>}
    </div>
  );
};

export default AdminGalleryManager;
