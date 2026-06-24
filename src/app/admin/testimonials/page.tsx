"use client";

import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { ImageUploader } from "@/components/admin/ImageUploader";
import { ConfirmModal } from "@/components/admin/ConfirmModal";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import axios from "axios";
import { Plus, Edit2, Trash2, Loader2, X, Quote, CheckCircle } from "lucide-react";

// Testimonial validation schema
const testimonialSchema = z.object({
  quote: z.string().min(10, "Quote must be at least 10 characters"),
  author: z.string().min(2, "Author name is required"),
  role: z.string().min(2, "Role details are required (e.g. Venue/Location)"),
  avatar: z.string().min(5, "Client avatar image asset is required"),
});

type TestimonialFormInputs = z.infer<typeof testimonialSchema>;

export default function AdminTestimonialsPage() {
  const queryClient = useQueryClient();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Delete modal states
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  // React Hook Form
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<TestimonialFormInputs>({
    resolver: zodResolver(testimonialSchema),
  });

  const watchAvatar = watch("avatar");

  // Fetch all testimonials
  const { data: testimonialsRes, isLoading, refetch } = useQuery({
    queryKey: ["adminTestimonials"],
    queryFn: async () => {
      const response = await axios.get("/api/testimonials");
      return response.data;
    },
  });

  const testimonials = testimonialsRes?.data || [];

  // Mutations
  const createMutation = useMutation({
    mutationFn: async (payload: TestimonialFormInputs) => {
      const response = await axios.post("/api/testimonials", payload);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminTestimonials"] });
      queryClient.invalidateQueries({ queryKey: ["testimonials"] });
      queryClient.invalidateQueries({ queryKey: ["adminDashboard"] });
      setIsFormOpen(false);
      refetch();
    },
  });

  const updateMutation = useMutation({
    mutationFn: async (variables: { id: string; payload: TestimonialFormInputs }) => {
      const response = await axios.put(`/api/testimonials/${variables.id}`, variables.payload);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminTestimonials"] });
      queryClient.invalidateQueries({ queryKey: ["testimonials"] });
      queryClient.invalidateQueries({ queryKey: ["adminDashboard"] });
      setIsFormOpen(false);
      refetch();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await axios.delete(`/api/testimonials/${id}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminTestimonials"] });
      queryClient.invalidateQueries({ queryKey: ["testimonials"] });
      queryClient.invalidateQueries({ queryKey: ["adminDashboard"] });
      setIsDeleteOpen(false);
      setDeletingId(null);
      refetch();
    },
  });

  const handleCreateClick = () => {
    setEditingId(null);
    reset({
      quote: "",
      author: "",
      role: "",
      avatar: "",
    });
    setIsFormOpen(true);
  };

  const handleEditClick = (t: any) => {
    setEditingId(t.id);
    reset({
      quote: t.quote,
      author: t.author,
      role: t.role,
      avatar: t.avatar,
    });
    setIsFormOpen(true);
  };

  const onSubmit = (data: TestimonialFormInputs) => {
    if (editingId) {
      updateMutation.mutate({ id: editingId, payload: data });
    } else {
      createMutation.mutate(data);
    }
  };

  const handleDeleteConfirm = () => {
    if (deletingId) {
      deleteMutation.mutate(deletingId);
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-8">
        {/* Header Controls */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="space-y-1">
            <span className="text-[10px] uppercase tracking-widest text-luxury-accent font-semibold">REVIEWS</span>
            <h2 className="text-2xl md:text-3xl font-serif font-bold text-white">Client Testimonials</h2>
          </div>
          <button
            onClick={handleCreateClick}
            className="px-5 py-2.5 bg-luxury-accent hover:bg-luxury-hover text-luxury-bg text-[10px] font-sans uppercase tracking-widest font-bold rounded-sm flex items-center gap-2 transition-all cursor-pointer shadow-lg"
          >
            <Plus size={14} />
            Add Review
          </button>
        </div>

        {/* List Table */}
        {isLoading ? (
          <div className="h-60 flex items-center justify-center">
            <Loader2 className="animate-spin text-luxury-accent" size={24} />
          </div>
        ) : testimonials.length === 0 ? (
          <div className="bg-[#151515] border border-white/5 rounded-sm p-16 text-center">
            <span className="text-xs text-luxury-muted uppercase tracking-widest">
              No client reviews created yet.
            </span>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {testimonials.map((t: any) => (
              <div key={t.id} className="bg-[#151515] border border-white/5 p-6 rounded-sm flex flex-col justify-between space-y-6 relative group shadow-lg">
                <Quote className="absolute top-6 right-6 text-white/5 group-hover:text-luxury-accent/5 transition-colors" size={40} />

                <div className="space-y-4">
                  <p className="text-xs italic font-serif leading-relaxed text-neutral-300">
                    "{t.quote}"
                  </p>

                  <div className="flex items-center gap-3">
                    <img
                      src={t.avatar}
                      alt={t.author}
                      className="w-10 h-10 rounded-full object-cover border border-white/10"
                    />
                    <div>
                      <span className="text-xs font-bold text-white block">{t.author}</span>
                      <span className="text-[10px] text-luxury-muted font-sans font-light block">{t.role}</span>
                    </div>
                  </div>
                </div>

                <div className="flex gap-2 pt-4 border-t border-white/5">
                  <button
                    onClick={() => handleEditClick(t)}
                    className="flex-1 py-2 bg-white/5 hover:bg-luxury-accent/15 border border-white/5 hover:border-luxury-accent/30 text-white hover:text-luxury-accent text-[9px] font-sans uppercase tracking-widest font-bold rounded-sm flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                  >
                    <Edit2 size={10} />
                    Edit
                  </button>
                  <button
                    onClick={() => {
                      setDeletingId(t.id);
                      setIsDeleteOpen(true);
                    }}
                    className="flex-1 py-2 bg-white/5 hover:bg-red-500/10 border border-white/5 hover:border-red-500/30 text-white hover:text-red-400 text-[9px] font-sans uppercase tracking-widest font-bold rounded-sm flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                  >
                    <Trash2 size={10} />
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Create/Edit Modal */}
        {isFormOpen && (
          <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-6">
            <div className="bg-[#151515] border border-white/10 max-w-md w-full p-8 rounded-sm shadow-2xl relative max-h-[85vh] overflow-y-auto">
              <button
                onClick={() => setIsFormOpen(false)}
                className="absolute top-5 right-5 text-white/50 hover:text-white transition-colors cursor-pointer"
              >
                <X size={20} />
              </button>

              <h3 className="font-serif text-xl font-bold text-white mb-6">
                {editingId ? "Edit Review" : "Add Review"}
              </h3>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                {/* Client Avatar */}
                <ImageUploader
                  label="Client Profile Avatar"
                  value={watchAvatar}
                  onChange={(url) => setValue("avatar", url, { shouldDirty: true })}
                />

                {/* Author Name */}
                <div className="flex flex-col space-y-1.5">
                  <label className="text-[10px] uppercase tracking-wider text-luxury-muted font-sans font-medium">Couple Names</label>
                  <input
                    type="text"
                    {...register("author")}
                    className="bg-luxury-bg border border-white/5 focus:border-luxury-accent text-white px-4 py-2.5 rounded-sm text-xs font-sans outline-none"
                    placeholder="Diya & Kedar"
                  />
                  {errors.author && <p className="text-[10px] text-red-500 font-sans mt-1">{errors.author.message}</p>}
                </div>

                {/* Role Details */}
                <div className="flex flex-col space-y-1.5">
                  <label className="text-[10px] uppercase tracking-wider text-luxury-muted font-sans font-medium">Event context / Venue</label>
                  <input
                    type="text"
                    {...register("role")}
                    className="bg-luxury-bg border border-white/5 focus:border-luxury-accent text-white px-4 py-2.5 rounded-sm text-xs font-sans outline-none"
                    placeholder="Rambagh Palace, Jaipur"
                  />
                  {errors.role && <p className="text-[10px] text-red-500 font-sans mt-1">{errors.role.message}</p>}
                </div>

                {/* Quote Text */}
                <div className="flex flex-col space-y-1.5">
                  <label className="text-[10px] uppercase tracking-wider text-luxury-muted font-sans font-medium">Quote Text</label>
                  <textarea
                    rows={4}
                    {...register("quote")}
                    className="bg-luxury-bg border border-white/5 focus:border-luxury-accent text-white px-4 py-2.5 rounded-sm text-xs font-sans outline-none resize-none"
                    placeholder="The team's composition and editorial grading was absolutely spectacular..."
                  />
                  {errors.quote && <p className="text-[10px] text-red-500 font-sans mt-1">{errors.quote.message}</p>}
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
                    className="flex-1 py-3 bg-luxury-accent hover:bg-luxury-hover text-luxury-bg text-[10px] font-sans uppercase tracking-widest font-bold rounded-sm transition-all cursor-pointer flex items-center justify-center gap-2"
                  >
                    {(createMutation.isPending || updateMutation.isPending) && (
                      <Loader2 className="animate-spin" size={12} />
                    )}
                    {editingId ? "Save Review" : "Create Review"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        <ConfirmModal
          isOpen={isDeleteOpen}
          title="Delete Testimonial"
          message="Are you sure you want to delete this client review? This will immediately remove it from the homepage carousel."
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
