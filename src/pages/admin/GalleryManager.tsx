import React from "react";
import AdminGalleryManager from "@/components/admin/AdminGalleryManager";

// Only render the heading once, not in both parent and child

const GalleryManagerPage: React.FC = () => (
  <div className="pt-16 sm:pt-20 pb-8 mt-0 flex flex-col items-center min-h-[calc(100vh-5rem)] bg-gradient-to-br from-white via-gray-50 to-accent/10">
    <div className="w-full max-w-2xl px-2 sm:px-0">
      <h1 className="text-2xl sm:text-3xl font-bold text-primary mb-4 text-center drop-shadow-sm tracking-wide">Gallery Manager</h1>
      <AdminGalleryManager />
    </div>
  </div>
);

export default GalleryManagerPage;
export { GalleryManagerPage };
