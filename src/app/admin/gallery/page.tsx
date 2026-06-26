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
import { 
  Plus, 
  Edit2, 
  Trash2, 
  SlidersHorizontal, 
  Loader2,
  X,
  ArrowUp,
  ArrowDown,
  Info
} from "lucide-react";

interface GalleryFormInputs {
  title: string;
  slug: string;
  category: string;
  location: string;
  couple: string;
  year: string;
  coverImage: string;
  imageUrl: string;
  description: string;
  featured: boolean;
  active: boolean;
  images: string[];
}

const initialFormState: GalleryFormInputs = {
  title: "",
  slug: "",
  category: "Wedding",
  location: "",
  couple: "",
  year: new Date().getFullYear().toString(),
  coverImage: "",
  imageUrl: "",
  description: "",
  featured: false,
  active: true,
  images: [],
};

export default function AdminGalleryPage() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formValues, setFormValues] = useState<GalleryFormInputs>(initialFormState);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showcaseImages, setShowcaseImages] = useState<string[]>([]);
  const [isFetchingItem, setIsFetchingItem] = useState(false);
  
  // Delete confirm modal states
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  // Queries
  const { data: categories = [] } = useGalleryCategories();
  const { data: galleryRes, isLoading, refetch } = useQuery({
    queryKey: ["adminGalleryList", selectedCategory],
    // Fetch all (active and inactive) items in admin view
    queryFn: () => galleryService.getGallery(selectedCategory === "All" ? undefined : selectedCategory, 1, 100),
  });

  // Mutations
  const createMutation = useCreateGalleryItem();
  const updateMutation = useUpdateGalleryItem();
  const deleteMutation = useDeleteGalleryItem();

  const handleEditClick = async (item: any) => {
    setEditingId(item.id);
    setIsFetchingItem(true);
    setIsFormOpen(true);
    
    // Fetch the full shoot details (including showcase images and descriptions)
    try {
      const fullItem = await galleryService.getGalleryItem(item.slug || item.id);
      const fetchedImages = (fullItem.images || []).map((img: any) => img.imageUrl);
      
      setFormValues({
        title: fullItem.title,
        slug: fullItem.slug || "",
        category: fullItem.category,
        location: fullItem.location,
        couple: fullItem.couple,
        year: fullItem.year,
        coverImage: fullItem.coverImage || fullItem.imageUrl || "",
        imageUrl: fullItem.imageUrl || "",
        description: fullItem.description || "",
        featured: fullItem.featured || false,
        active: fullItem.active !== undefined ? fullItem.active : true,
        images: fetchedImages,
      });
      setShowcaseImages(fetchedImages);
    } catch (e) {
      console.error("Failed to fetch full shoot details, loading fallback data:", e);
      setFormValues({
        title: item.title,
        slug: item.slug || "",
        category: item.category,
        location: item.location,
        couple: item.couple,
        year: item.year,
        coverImage: item.coverImage || item.imageUrl || "",
        imageUrl: item.imageUrl || "",
        description: item.description || "",
        featured: item.featured || false,
        active: item.active !== undefined ? item.active : true,
        images: [],
      });
      setShowcaseImages([]);
    } finally {
      setIsFetchingItem(false);
    }
  };

  const handleCreateClick = () => {
    setEditingId(null);
    setFormValues(initialFormState);
    setShowcaseImages([]);
    setIsFormOpen(true);
  };

  const handleTitleChange = (val: string) => {
    setFormValues((prev) => {
      const updated = { ...prev, title: val };
      // Generate slug automatically only when creating a new shoot
      if (!editingId) {
        updated.slug = val
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/(^-|-$)/g, "");
      }
      return updated;
    });
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const finalCover = formValues.coverImage || formValues.imageUrl;
    if (!finalCover) {
      alert("Please upload a cover image first.");
      return;
    }

    const payload = {
      ...formValues,
      coverImage: finalCover,
      imageUrl: finalCover, // maintain backward compatibility
      images: showcaseImages,
    };

    if (editingId) {
      updateMutation.mutate(
        { id: editingId, payload },
        {
          onSuccess: () => {
            setIsFormOpen(false);
            refetch();
          },
        }
      );
    } else {
      createMutation.mutate(payload, {
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

  // Showcase image ordering helpers
  const moveImageUp = (index: number) => {
    if (index === 0) return;
    setShowcaseImages((prev) => {
      const copy = [...prev];
      const temp = copy[index];
      copy[index] = copy[index - 1];
      copy[index - 1] = temp;
      return copy;
    });
  };

  const moveImageDown = (index: number) => {
    if (index === showcaseImages.length - 1) return;
    setShowcaseImages((prev) => {
      const copy = [...prev];
      const temp = copy[index];
      copy[index] = copy[index + 1];
      copy[index + 1] = temp;
      return copy;
    });
  };

  const removeImage = (index: number) => {
    setShowcaseImages((prev) => prev.filter((_, i) => i !== index));
  };

  const items = galleryRes?.items || [];

  return (
    <AdminLayout>
      <div className="space-y-8">
        {/* Header Controls */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="space-y-1">
            <span className="text-[10px] uppercase tracking-widest text-luxury-accent font-semibold">PORTFOLIO</span>
            <h2 className="text-2xl md:text-3xl font-serif font-bold text-white">Gallery Shoot Management</h2>
          </div>
          <button
            onClick={handleCreateClick}
            className="px-5 py-2.5 bg-luxury-accent hover:bg-luxury-hover text-luxury-bg text-[10px] font-sans uppercase tracking-widest font-bold rounded-sm flex items-center gap-2 transition-all cursor-pointer shadow-lg shadow-luxury-accent/10"
          >
            <Plus size={14} />
            Create Shoot Project
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
                    src={item.coverImage || item.imageUrl}
                    alt={item.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-102"
                  />
                  
                  {/* Badges */}
                  <div className="absolute top-3 left-3 flex flex-col gap-1.5">
                    {item.featured && (
                      <div className="bg-luxury-accent text-luxury-bg px-2.5 py-0.5 rounded-sm text-[8px] uppercase tracking-wider font-sans font-bold border border-luxury-accent shadow-md">
                        Featured
                      </div>
                    )}
                    {!item.active && (
                      <div className="bg-neutral-950 text-neutral-400 px-2.5 py-0.5 rounded-sm text-[8px] uppercase tracking-wider font-sans font-bold border border-white/5">
                        Inactive
                      </div>
                    )}
                  </div>

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
                      Edit Shoot
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
            <div className="bg-[#151515] border border-white/10 max-w-xl w-full p-8 rounded-sm shadow-2xl relative max-h-[90vh] overflow-y-auto">
              <button
                onClick={() => setIsFormOpen(false)}
                className="absolute top-5 right-5 text-white/50 hover:text-white transition-colors cursor-pointer"
              >
                <X size={20} />
              </button>

              <h3 className="font-serif text-xl font-bold text-white mb-6">
                {editingId ? "Edit Gallery Shoot Project" : "Create Gallery Shoot Project"}
              </h3>

              {isFetchingItem ? (
                <div className="h-60 flex flex-col items-center justify-center gap-3">
                  <Loader2 className="animate-spin text-luxury-accent" size={24} />
                  <span className="text-[10px] text-luxury-muted font-sans uppercase tracking-widest">Loading Shoot Data...</span>
                </div>
              ) : (
                <form onSubmit={handleFormSubmit} className="space-y-6">
                  {/* Grid fields */}
                  <div className="grid grid-cols-2 gap-4">
                    {/* Title */}
                    <div className="flex flex-col space-y-1.5 col-span-2">
                      <label className="text-[10px] uppercase tracking-wider text-luxury-muted font-sans font-medium">Shoot Title</label>
                      <input
                        type="text"
                        required
                        value={formValues.title}
                        onChange={(e) => handleTitleChange(e.target.value)}
                        className="bg-luxury-bg border border-white/5 focus:border-luxury-accent text-white px-4 py-2.5 rounded-sm text-xs font-sans outline-none transition-colors"
                        placeholder="Ethereal Palace Mandap"
                      />
                    </div>

                    {/* Slug */}
                    <div className="flex flex-col space-y-1.5 col-span-2">
                      <div className="flex justify-between items-center">
                        <label className="text-[10px] uppercase tracking-wider text-luxury-muted font-sans font-medium">URL Slug</label>
                        <span className="text-[8px] text-luxury-accent/80 font-sans uppercase">Dynamic Page: /gallery/[slug]</span>
                      </div>
                      <input
                        type="text"
                        required
                        value={formValues.slug}
                        onChange={(e) => setFormValues({ ...formValues, slug: e.target.value })}
                        className="bg-luxury-bg border border-white/5 focus:border-luxury-accent text-white px-4 py-2.5 rounded-sm text-xs font-sans outline-none transition-colors font-mono"
                        placeholder="ethereal-palace-mandap"
                      />
                    </div>
                  </div>

                  {/* Cover Image Uploader */}
                  <ImageUploader
                    label="Cover Image (High Resolution Banner)"
                    value={formValues.coverImage || formValues.imageUrl}
                    onChange={(url) => setFormValues({ ...formValues, coverImage: url, imageUrl: url })}
                  />

                  {/* Description Textarea */}
                  <div className="flex flex-col space-y-1.5">
                    <label className="text-[10px] uppercase tracking-wider text-luxury-muted font-sans font-medium">Shoot Story / Description</label>
                    <textarea
                      value={formValues.description}
                      onChange={(e) => setFormValues({ ...formValues, description: e.target.value })}
                      className="bg-luxury-bg border border-white/5 focus:border-luxury-accent text-white px-4 py-2.5 rounded-sm text-xs font-sans outline-none transition-colors min-h-[90px] resize-y"
                      placeholder="An elegant description documenting the details, atmosphere, and aesthetic of the shoot..."
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

                  {/* Status and Featured toggles */}
                  <div className="grid grid-cols-2 gap-4 bg-luxury-bg/50 p-4 border border-white/5 rounded-sm">
                    <label className="flex items-center gap-3 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={formValues.featured}
                        onChange={(e) => setFormValues({ ...formValues, featured: e.target.checked })}
                        className="w-4 h-4 rounded border-white/10 bg-luxury-bg text-luxury-accent focus:ring-luxury-accent accent-luxury-accent cursor-pointer"
                      />
                      <div className="flex flex-col">
                        <span className="text-xs font-sans font-bold text-white uppercase tracking-wider">Featured</span>
                        <span className="text-[9px] text-luxury-muted font-sans">Highlight on landing page</span>
                      </div>
                    </label>

                    <label className="flex items-center gap-3 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={formValues.active}
                        onChange={(e) => setFormValues({ ...formValues, active: e.target.checked })}
                        className="w-4 h-4 rounded border-white/10 bg-luxury-bg text-luxury-accent focus:ring-luxury-accent accent-luxury-accent cursor-pointer"
                      />
                      <div className="flex flex-col">
                        <span className="text-xs font-sans font-bold text-white uppercase tracking-wider">Active</span>
                        <span className="text-[9px] text-luxury-muted font-sans">Visible in public gallery</span>
                      </div>
                    </label>
                  </div>

                  {/* Showcase Images list and reordering */}
                  <div className="space-y-3 border-t border-white/5 pt-4">
                    <div className="flex justify-between items-center">
                      <label className="text-[10px] uppercase tracking-wider text-luxury-muted font-sans font-medium">Showcase Gallery Images ({showcaseImages.length})</label>
                      <span className="text-[8px] text-luxury-muted font-sans uppercase">Order determines masonry sequence</span>
                    </div>

                    {/* Single ImageUploader for appending to the showcase images */}
                    <div className="bg-luxury-bg/30 p-4 border border-dashed border-white/5 rounded-sm">
                      <ImageUploader
                        label="Upload Showcase Image"
                        value=""
                        onChange={(url) => {
                          if (url) {
                            setShowcaseImages((prev) => [...prev, url]);
                          }
                        }}
                      />
                      <div className="flex items-center gap-1.5 mt-2 text-white/40 text-[9px] font-sans">
                        <Info size={10} className="text-luxury-accent" />
                        <span>Upload files to automatically append them to the shoot. Reorder using controls below.</span>
                      </div>
                    </div>

                    {/* Showcase Image List */}
                    {showcaseImages.length > 0 && (
                      <div className="space-y-2 max-h-[220px] overflow-y-auto border border-white/5 rounded-sm p-3 bg-luxury-bg/25">
                        {showcaseImages.map((imgUrl, idx) => (
                          <div key={idx} className="flex items-center gap-3 bg-luxury-bg/80 p-2 border border-white/5 rounded-sm">
                            <img src={imgUrl} className="w-12 h-12 object-cover rounded-sm border border-white/10" alt="Showcase Thumbnail" />
                            <div className="flex-1 min-w-0">
                              <p className="text-[9px] text-luxury-muted truncate">{imgUrl}</p>
                              <p className="text-[8px] text-luxury-accent font-bold uppercase tracking-wider">Image #{idx + 1}</p>
                            </div>
                            <div className="flex items-center gap-1 shrink-0">
                              <button
                                type="button"
                                onClick={() => moveImageUp(idx)}
                                disabled={idx === 0}
                                className="p-1 hover:bg-white/5 rounded text-white/50 hover:text-white disabled:opacity-20 cursor-pointer disabled:cursor-not-allowed"
                                title="Move Up"
                              >
                                <ArrowUp size={12} />
                              </button>
                              <button
                                type="button"
                                onClick={() => moveImageDown(idx)}
                                disabled={idx === showcaseImages.length - 1}
                                className="p-1 hover:bg-white/5 rounded text-white/50 hover:text-white disabled:opacity-20 cursor-pointer disabled:cursor-not-allowed"
                                title="Move Down"
                              >
                                <ArrowDown size={12} />
                              </button>
                              <button
                                type="button"
                                onClick={() => removeImage(idx)}
                                className="p-1.5 hover:bg-red-500/10 hover:text-red-400 text-white/50 rounded cursor-pointer transition-colors"
                                title="Remove"
                              >
                                <Trash2 size={12} />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Form Submission buttons */}
                  <div className="flex gap-3 pt-3 border-t border-white/5">
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
                      {editingId ? "Save Changes" : "Create Shoot"}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        <ConfirmModal
          isOpen={isDeleteOpen}
          title="Delete Shoot Project"
          message="Are you sure you want to delete this shoot project? This action will remove the project cover and all showcase images from the public website gallery."
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
