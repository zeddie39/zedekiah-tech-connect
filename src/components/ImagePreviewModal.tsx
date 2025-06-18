import React from "react";

export default function ImagePreviewModal({ open, onClose, src, alt }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
      <div className="bg-white rounded-lg shadow-lg p-2 max-w-2xl w-full relative">
        <button
          className="absolute top-2 right-2 text-xl font-bold text-gray-700 hover:text-red-500"
          onClick={onClose}
        >
          &times;
        </button>
        <img src={src} alt={alt} className="max-h-[70vh] w-auto mx-auto rounded" />
      </div>
    </div>
  );
}
