"use client";

import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { ImageUploader } from "@/components/admin/ImageUploader";
import { ConfirmModal } from "@/components/admin/ConfirmModal";
import galleryService from "@/services/gallery/gallery.service";
import {
  useCreateGalleryItem,
  useUpdateGalleryItem,
  useDeleteGalleryItem,
} from "@/hooks/admin/useAdminGallery";
import { useGalleryCategories } from "@/hooks/useGallery";
import { Plus, Edit2, Trash2, SlidersHorizontal, Loader2 } from "lucide-react";

interface GalleryFormInputs {
  title: string;
  category: string;
  location: string;
  couple: string;
  year: string;
  imageUrl: string;
}

const initialFormState: GalleryFormInputs = {
  title: "",
  category: "Wedding",
  location: "",
  couple: "",
  year: new Date().getFullYear().toString(),
  imageUrl: "",
};

export default function AdminGalleryPage() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formValues, setFormValues] = useState<GalleryFormInputs>(initialFormState);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  // Delete confirm modal states
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  // Queries
  const { data: categories = [] } = useGalleryCategories();
  const { data: galleryRes, isLoading, refetch } = useQuery({
    queryKey: ["adminGalleryList", selectedCategory],
    queryFn: () => galleryService.getGallery(selectedCategory === "All" ? undefined : selectedCategory, 1, 100),
  });

  // Mutations
  const createMutation = useCreateGalleryItem();
  const updateMutation = useUpdateGalleryItem();
  const deleteMutation = useDeleteGalleryItem();

  const handleEditClick = (item: any) => {
    setEditingId(item.id);
    setFormValues({
      title: item.title,
      category: item.category,
      location: item.location,
      couple: item.couple,
      year: item.year,
      imageUrl: item.imageUrl,
    });
    setIsFormOpen(true);
  };

  const handleCreateClick = () => {
    setEditingId(null);
    setFormValues(initialFormState);
    setIsFormOpen(true);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formValues.imageUrl) {
      alert("Please upload an image asset first.");
      return;
    }

    if (editingId) {
      updateMutation.mutate(
        { id: editingId, payload: formValues },
        {
          onSuccess: () => {
            setIsFormOpen(false);
            refetch();
          },
        }
      );
    } else {
      createMutation.mutate(formValues, {
        onSuccess: () => {
          setIsFormOpen(false);
          refetch();
        },
      });
    }
  };

  const handleDeleteConfirm = () => {
    if (deletingId) {
      deleteMutation.mutate(deletingId, {
        onSuccess: () => {
          setIsDeleteOpen(false);
          setDeletingId(null);
          refetch();
        },
      });
    }
  };

  const items = galleryRes?.items || [];

  return (
    <AdminLayout>
      <div className="space-y-8">
        {/* Header Controls */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="space-y-1">
            <span className="text-[10px] uppercase tracking-widest text-luxury-accent font-semibold">PORTFOLIO</span>
            <h2 className="text-2xl md:text-3xl font-serif font-bold text-white">Gallery Management</h2>
          </div>
          <button
            onClick={handleCreateClick}
            className="px-5 py-2.5 bg-luxury-accent hover:bg-luxury-hover text-luxury-bg text-[10px] font-sans uppercase tracking-widest font-bold rounded-sm flex items-center gap-2 transition-all cursor-pointer shadow-lg shadow-luxury-accent/10"
          >
            <Plus size={14} />
            Add Image
          </button>
        </div>

        {/* Filter Controls */}
        <div className="bg-[#151515] border border-white/5 p-4 rounded-sm flex items-center gap-4">
          <SlidersHorizontal size={14} className="text-luxury-accent shrink-0" />
          <div className="flex items-center gap-2 overflow-x-auto py-1">
            <button
              onClick={() => setSelectedCategory("All")}
              className={`px-3 py-1.5 rounded-sm text-[9px] font-sans uppercase tracking-wider font-semibold border transition-all cursor-pointer ${
                selectedCategory === "All"
                  ? "bg-luxury-accent/10 border-luxury-accent text-luxury-accent"
                  : "border-white/5 text-luxury-muted hover:text-white"
              }`}
            >
              All Categories
            </button>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-sm text-[9px] font-sans uppercase tracking-wider font-semibold border transition-all cursor-pointer ${
                  selectedCategory === cat
                    ? "bg-luxury-accent/10 border-luxury-accent text-luxury-accent"
                    : "border-white/5 text-luxury-muted hover:text-white"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* List Grid */}
        {isLoading ? (
          <div className="h-60 flex items-center justify-center">
            <Loader2 className="animate-spin text-luxury-accent" size={24} />
          </div>
        ) : items.length === 0 ? (
          <div className="bg-[#151515] border border-white/5 rounded-sm p-16 text-center">
            <span className="text-xs text-luxury-muted uppercase tracking-widest">
              No gallery items found for this category.
            </span>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {items.map((item: any) => (
              <div key={item.id} className="bg-[#151515] border border-white/5 rounded-sm overflow-hidden flex flex-col justify-between group shadow-lg">
                <div className="aspect-[4/3] relative overflow-hidden bg-neutral-900 border-b border-white/5">
                  <img
                    src={item.imageUrl}
                    alt={item.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-102"
                  />
                  <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-sm px-2.5 py-1 rounded-sm text-[8px] uppercase tracking-wider font-sans font-bold border border-white/10 text-luxury-accent">
                    {item.category}
                  </div>
                </div>

                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-1">
                    <span className="text-[9px] uppercase tracking-widest font-mono text-luxury-muted">
                      {item.couple} • {item.year}
                    </span>
                    <h3 className="font-serif font-bold text-white text-base leading-snug">{item.title}</h3>
                    <p className="text-[10px] text-luxury-muted font-sans font-light truncate">{item.location}</p>
                  </div>

                  <div className="flex gap-2 pt-2 border-t border-white/5">
                    <button
                      onClick={() => handleEditClick(item)}
                      className="flex-1 py-2 bg-white/5 hover:bg-luxury-accent/15 border border-white/5 hover:border-luxury-accent/30 text-white hover:text-luxury-accent text-[9px] font-sans uppercase tracking-widest font-bold rounded-sm flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                    >
                      <Edit2 size={10} />
                      Edit
                    </button>
                    <button
                      onClick={() => {
                        setDeletingId(item.id);
                        setIsDeleteOpen(true);
                      }}
                      className="flex-1 py-2 bg-white/5 hover:bg-red-500/10 border border-white/5 hover:border-red-500/30 text-white hover:text-red-400 text-[9px] font-sans uppercase tracking-widest font-bold rounded-sm flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                    >
                      <Trash2 size={10} />
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Add/Edit Modal */}
        {isFormOpen && (
          <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-6">
            <div className="bg-[#151515] border border-white/10 max-w-lg w-full p-8 rounded-sm shadow-2xl relative max-h-[85vh] overflow-y-auto">
              <button
                onClick={() => setIsFormOpen(false)}
                className="absolute top-5 right-5 text-white/50 hover:text-white transition-colors cursor-pointer"
              >
                <X size={20} />
              </button>

              <h3 className="font-serif text-xl font-bold text-white mb-6">
                {editingId ? "Edit Gallery Item" : "Add Gallery Item"}
              </h3>

              <form onSubmit={handleFormSubmit} className="space-y-5">
                {/* Image Uploader */}
                <ImageUploader
                  label="Couple Image Asset"
                  value={formValues.imageUrl}
                  onChange={(url) => setFormValues({ ...formValues, imageUrl: url })}
                />

                {/* Title */}
                <div className="flex flex-col space-y-1.5">
                  <label className="text-[10px] uppercase tracking-wider text-luxury-muted font-sans font-medium">Title</label>
                  <input
                    type="text"
                    required
                    value={formValues.title}
                    onChange={(e) => setFormValues({ ...formValues, title: e.target.value })}
                    className="bg-luxury-bg border border-white/5 focus:border-luxury-accent text-white px-4 py-2.5 rounded-sm text-xs font-sans outline-none transition-colors"
                    placeholder="Ethereal Mandap Rituals"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {/* Category Selection */}
                  <div className="flex flex-col space-y-1.5">
                    <label className="text-[10px] uppercase tracking-wider text-luxury-muted font-sans font-medium">Category</label>
                    <select
                      value={formValues.category}
                      onChange={(e) => setFormValues({ ...formValues, category: e.target.value })}
                      className="bg-luxury-bg border border-white/5 focus:border-luxury-accent text-white px-4 py-2.5 rounded-sm text-xs font-sans outline-none transition-colors"
                    >
                      <option value="Wedding">Wedding</option>
                      <option value="Pre-wedding">Pre-wedding</option>
                      <option value="Cinematic">Cinematic</option>
                      <option value="Traditional">Traditional</option>
                      <option value="Destination">Destination</option>
                    </select>
                  </div>

                  {/* Year */}
                  <div className="flex flex-col space-y-1.5">
                    <label className="text-[10px] uppercase tracking-wider text-luxury-muted font-sans font-medium">Year</label>
                    <input
                      type="text"
                      required
                      value={formValues.year}
                      onChange={(e) => setFormValues({ ...formValues, year: e.target.value })}
                      className="bg-luxury-bg border border-white/5 focus:border-luxury-accent text-white px-4 py-2.5 rounded-sm text-xs font-sans outline-none transition-colors"
                      placeholder="2026"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {/* Couple Name */}
                  <div className="flex flex-col space-y-1.5">
                    <label className="text-[10px] uppercase tracking-wider text-luxury-muted font-sans font-medium">Couple / Client</label>
                    <input
                      type="text"
                      required
                      value={formValues.couple}
                      onChange={(e) => setFormValues({ ...formValues, couple: e.target.value })}
                      className="bg-luxury-bg border border-white/5 focus:border-luxury-accent text-white px-4 py-2.5 rounded-sm text-xs font-sans outline-none transition-colors"
                      placeholder="Aishwarya & Vikram"
                    />
                  </div>

                  {/* Location */}
                  <div className="flex flex-col space-y-1.5">
                    <label className="text-[10px] uppercase tracking-wider text-luxury-muted font-sans font-medium">Location</label>
                    <input
                      type="text"
                      required
                      value={formValues.location}
                      onChange={(e) => setFormValues({ ...formValues, location: e.target.value })}
                      className="bg-luxury-bg border border-white/5 focus:border-luxury-accent text-white px-4 py-2.5 rounded-sm text-xs font-sans outline-none transition-colors"
                      placeholder="Umaid Bhawan, Jodhpur"
                    />
                  </div>
                </div>

                <div className="flex gap-3 pt-3">
                  <button
                    type="button"
                    onClick={() => setIsFormOpen(false)}
                    className="flex-1 py-3 border border-white/10 hover:bg-white/5 text-white text-[10px] font-sans uppercase tracking-widest font-bold rounded-sm transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={createMutation.isPending || updateMutation.isPending}
                    className="flex-1 py-3 bg-luxury-accent hover:bg-luxury-hover text-luxury-bg text-[10px] font-sans uppercase tracking-widest font-bold rounded-sm transition-all duration-300 cursor-pointer flex items-center justify-center gap-2"
                  >
                    {(createMutation.isPending || updateMutation.isPending) && (
                      <Loader2 className="animate-spin" size={12} />
                    )}
                    {editingId ? "Save Changes" : "Create Item"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        <ConfirmModal
          isOpen={isDeleteOpen}
          title="Delete Portfolio Image"
          message="Are you sure you want to delete this portfolio photo? This action will remove it from the public website gallery."
          confirmLabel="Delete"
          isDanger={true}
          isLoading={deleteMutation.isPending}
          onConfirm={handleDeleteConfirm}
          onCancel={() => {
            setIsDeleteOpen(false);
            setDeletingId(null);
          }}
        />
      </div>
    </AdminLayout>
  );
}

// Simple helper icon
function X({ size, className }: { size: number; className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M18 6 6 18" />
      <path d="m6 6 12 12" />
    </svg>
  );
}
