// Don't forget to install react-zoom-pan-pinch: npm install react-zoom-pan-pinch
import React, { useEffect, useState } from "react";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import { supabase } from "@/integrations/supabase/client";

// Define the type as per the structure in Supabase, even if not in the generated types
type GalleryImage = {
  id: string;
  image_url: string;
  title: string;
  description: string;
  created_at: string;
  category?: string;
  tags?: string[];
  approved?: boolean;
  uploader?: string;
};

const Gallery: React.FC = () => {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalImg, setModalImg] = useState<GalleryImage | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  useEffect(() => {
    const fetchImages = async () => {
      // @ts-expect-error
      const { data, error } = await supabase.from("gallery").select("*", { count: "exact" }).order("created_at", { ascending: false });
      if (!error) setImages(data as unknown as GalleryImage[] || []);
      setLoading(false);
    };
    fetchImages();
  }, []);

  // Expanded types for filtering
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
  // Filter images by selected type (case-insensitive, fallback to capitalized)
  const filteredImages = selectedCategory
    ? images.filter(img => (img.category || '').toLowerCase() === selectedCategory.toLowerCase())
    : images;

  return (
    <section className="py-16 bg-gradient-to-b from-white to-gray-50 min-h-screen">
      <div className="max-w-5xl mx-auto px-4">
        <h1 className="text-4xl font-bold text-center text-accent mb-8">Gallery</h1>
        {/* Type Filter */}
        <div className="mb-6 flex flex-wrap gap-2 justify-center">
          <button
            className={`px-4 py-1 rounded-full border font-medium ${!selectedCategory ? 'bg-accent text-white' : 'bg-white text-accent border-accent'}`}
            onClick={() => setSelectedCategory(null)}
          >All</button>
          {types.map(type => (
            <button
              key={type}
              className={`px-4 py-1 rounded-full border font-medium ${selectedCategory === type ? 'bg-accent text-white' : 'bg-white text-accent border-accent'}`}
              onClick={() => setSelectedCategory(type)}
            >{type}</button>
          ))}
        </div>


        {/* Gallery Grid */}
        {loading ? <div className="text-center">Loading...</div> : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {filteredImages.map(img => (
              <div key={img.id} className="bg-white rounded shadow p-2 flex flex-col items-center">
                <img
                  src={img.image_url}
                  alt={img.title || "Poster/Flyer"}
                  className="w-full h-64 object-cover rounded mb-2 cursor-zoom-in transition-transform hover:scale-105"
                  onClick={() => setModalImg(img)}
                />
                <div className="font-semibold text-lg text-accent mb-1">{img.title}</div>
                <div className="text-gray-600 text-sm mb-1">{img.description}</div>
                <div className="text-xs text-gray-400 mb-1">{img.category ? img.category.charAt(0).toUpperCase() + img.category.slice(1).toLowerCase() : ''}</div>
                <div className="flex gap-2 mt-1">
                  <button className="text-accent hover:underline text-sm" onClick={() => window.open(img.image_url, '_blank')}>View</button>
                  <a className="text-accent hover:underline text-sm" href={img.image_url} download target="_blank" rel="noopener noreferrer">Download</a>
                  <button className="text-accent hover:underline text-sm" onClick={() => navigator.share ? navigator.share({ url: img.image_url, title: img.title, text: img.description }) : alert('Sharing not supported')}>Share</button>
                </div>
                <div className="text-xs text-gray-400">{new Date(img.created_at).toLocaleString()}</div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal for full image view with zoom/pan */}
      {modalImg && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80" onClick={() => setModalImg(null)}>
          <div className="relative max-w-3xl w-full max-h-[90vh] bg-white rounded shadow-lg p-4 flex flex-col items-center" onClick={e => e.stopPropagation()}>
            <button
              className="absolute top-2 right-2 text-gray-700 bg-gray-200 rounded-full p-1 hover:bg-accent hover:text-white transition"
              onClick={() => setModalImg(null)}
              aria-label="Close"
            >
              &times;
            </button>
            <TransformWrapper wheel={{ step: 0.5 }} doubleClick={{ step: 1.5 }} zoomAnimation={{ animationTime: 150 }}>
              <TransformComponent>
                <img
                  src={modalImg.image_url}
                  alt={modalImg.title || "Poster/Flyer"}
                  className="max-h-[70vh] w-auto object-contain rounded"
                  draggable={false}
                />
              </TransformComponent>
            </TransformWrapper>
            <div className="mt-4 text-center">
              <div className="font-semibold text-lg text-accent mb-1">{modalImg.title}</div>
              <div className="text-gray-600 text-sm mb-1">{modalImg.description}</div>
              <div className="text-xs text-gray-400">{new Date(modalImg.created_at).toLocaleString()}</div>
            </div>
            <div className="mt-2 text-xs text-gray-500">Scroll or pinch to zoom. Drag to pan.</div>
          </div>
        </div>
      )}
    </section>
  );
};

export default Gallery;
