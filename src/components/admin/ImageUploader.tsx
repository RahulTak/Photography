"use client";

import React, { useState, useRef } from "react";
import { Upload, X, ImageIcon, Loader2 } from "lucide-react";
import axios from "axios";

interface ImageUploaderProps {
  value: string;
  onChange: (url: string) => void;
  label?: string;
}

export function ImageUploader({ value, onChange, label }: ImageUploaderProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUpload = async (file: File) => {
    setIsUploading(true);
    setError(null);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await axios.post("/api/gallery/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.data && response.data.success && response.data.data.url) {
        onChange(response.data.data.url);
      } else {
        setError("Upload failed. Invalid server response.");
      }
    } catch (err: any) {
      console.error(err);
      const msg = err.response?.data?.message || "Failed to upload image.";
      setError(msg);
    } finally {
      setIsUploading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleUpload(file);
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const handleRemove = () => {
    onChange("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) handleUpload(file);
  };

  return (
    <div className="space-y-2">
      {label && (
        <span className="text-[10px] uppercase tracking-wider text-luxury-muted font-sans font-medium block">
          {label}
        </span>
      )}

      {value ? (
        // Preview Container
        <div className="relative aspect-video max-w-md bg-neutral-900 border border-white/5 rounded-sm overflow-hidden group">
          <img
            src={value}
            alt="Upload Preview"
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <button
              type="button"
              onClick={handleRemove}
              className="p-2 bg-red-500 hover:bg-red-600 text-white rounded-full transition-colors cursor-pointer shadow-lg"
              title="Remove image"
            >
              <X size={16} />
            </button>
          </div>
        </div>
      ) : (
        // Upload Boundary Box
        <div
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          onClick={triggerFileInput}
          className="border border-dashed border-white/15 hover:border-luxury-accent/50 bg-[#151515] p-8 rounded-sm text-center flex flex-col items-center justify-center gap-3 cursor-pointer transition-colors max-w-md min-h-[160px]"
        >
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/jpeg,image/png,image/webp,image/jpg"
            className="hidden"
          />

          {isUploading ? (
            <div className="flex flex-col items-center space-y-2 text-luxury-accent">
              <Loader2 className="animate-spin" size={24} />
              <span className="text-[10px] uppercase tracking-wider font-sans font-semibold">
                Compressing & Uploading...
              </span>
            </div>
          ) : (
            <>
              <div className="w-10 h-10 rounded-full bg-luxury-accent/5 border border-luxury-accent/20 flex items-center justify-center text-luxury-accent">
                <Upload size={18} />
              </div>
              <div>
                <span className="text-xs font-semibold text-white block">Upload Image Asset</span>
                <span className="text-[9px] text-luxury-muted uppercase tracking-wider block mt-1">
                  Drag & drop or click to browse (WebP/JPG/PNG max 10MB)
                </span>
              </div>
            </>
          )}
        </div>
      )}

      {error && (
        <p className="text-[10px] text-red-500 font-sans tracking-wide font-medium mt-1">
          {error}
        </p>
      )}
    </div>
  );
}
export default ImageUploader;
