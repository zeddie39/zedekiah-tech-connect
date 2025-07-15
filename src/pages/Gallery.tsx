import React, { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

// Define the type as per the structure in Supabase, even if not in the generated types
type GalleryImage = {
  id: string;
  image_url: string;
  title: string;
  description: string;
  created_at: string;
};

const Gallery: React.FC = () => {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchImages = async () => {
      // Suppress TypeScript error since we know the table exists in our Supabase instance
      // @ts-expect-error
      const { data, error } = await supabase.from("gallery").select("*", { count: "exact" }).order("created_at", { ascending: false });
      if (!error) setImages(data as unknown as GalleryImage[] || []);
      setLoading(false);
    };
    fetchImages();
  }, []);

  return (
    <section className="py-16 bg-gradient-to-b from-white to-gray-50 min-h-screen">
      <div className="max-w-5xl mx-auto px-4">
        <h1 className="text-4xl font-bold text-center text-accent mb-8">Gallery</h1>
        {loading ? <div className="text-center">Loading...</div> : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {images.map(img => (
              <div key={img.id} className="bg-white rounded shadow p-2 flex flex-col items-center">
                <img src={img.image_url} alt={img.title || "Poster/Flyer"} className="w-full h-64 object-cover rounded mb-2" />
                <div className="font-semibold text-lg text-accent mb-1">{img.title}</div>
                <div className="text-gray-600 text-sm mb-1">{img.description}</div>
                <div className="text-xs text-gray-400">{new Date(img.created_at).toLocaleString()}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default Gallery;
