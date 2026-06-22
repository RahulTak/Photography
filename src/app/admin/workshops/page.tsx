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
import { Plus, Edit2, Trash2, Users, Loader2, Calendar, MapPin, X, BookOpen, AlertCircle } from "lucide-react";

// Zod workshop validation schema
const workshopSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  longDescription: z.string().min(20, "Long description must be at least 20 characters"),
  date: z.string().min(1, "Date is required"),
  time: z.string().min(1, "Time is required"),
  price: z.number().min(0, "Price must be a positive number"),
  seatsTotal: z.number().min(1, "Seats must be at least 1"),
  instructor: z.string().min(2, "Instructor name is required"),
  location: z.string().min(2, "Location is required"),
  image: z.string().min(5, "Image asset is required"),
  syllabus: z.array(z.string()).min(1, "Enter at least one syllabus item"),
});

type WorkshopFormInputs = z.infer<typeof workshopSchema>;

export default function AdminWorkshopsPage() {
  const queryClient = useQueryClient();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  // Test registries view states
  const [selectedWorkshopId, setSelectedWorkshopId] = useState<string | null>(null);
  const [isRegistriesOpen, setIsRegistriesOpen] = useState(false);

  // Delete modal states
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  // Dynamic syllabus state helper
  const [syllabusInputs, setSyllabusInputs] = useState<string[]>([""]);

  // React Hook Form
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<WorkshopFormInputs>({
    resolver: zodResolver(workshopSchema),
    defaultValues: {
      title: "",
      description: "",
      longDescription: "",
      date: "",
      time: "",
      price: 0,
      seatsTotal: 10,
      instructor: "Jay Prakash",
      location: "",
      image: "",
      syllabus: [],
    },
  });

  const watchImage = watch("image");

  // Fetch all workshops
  const { data: workshopsRes, isLoading, refetch } = useQuery({
    queryKey: ["adminWorkshops"],
    queryFn: async () => {
      const response = await axios.get("/api/workshops");
      return response.data;
    },
  });

  // Fetch registrations details for selected workshop
  const { data: detailRes, isLoading: isDetailLoading } = useQuery({
    queryKey: ["workshopDetail", selectedWorkshopId],
    queryFn: async () => {
      const response = await axios.get(`/api/workshops/${selectedWorkshopId}`);
      return response.data;
    },
    enabled: !!selectedWorkshopId,
  });

  // Mutations
  const createMutation = useMutation({
    mutationFn: async (payload: WorkshopFormInputs) => {
      const response = await axios.post("/api/workshops", payload);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminWorkshops"] });
      setIsFormOpen(false);
    },
  });

  const updateMutation = useMutation({
    mutationFn: async (variables: { id: string; payload: WorkshopFormInputs }) => {
      const response = await axios.put(`/api/workshops/${variables.id}`, variables.payload);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminWorkshops"] });
      setIsFormOpen(false);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await axios.delete(`/api/workshops/${id}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminWorkshops"] });
      setIsDeleteOpen(false);
      setDeletingId(null);
    },
  });

  const handleCreateClick = () => {
    setEditingId(null);
    setSyllabusInputs([""]);
    reset({
      title: "",
      description: "",
      longDescription: "",
      date: "",
      time: "",
      price: 0,
      seatsTotal: 10,
      instructor: "Jay Prakash",
      location: "",
      image: "",
      syllabus: [],
    });
    setIsFormOpen(true);
  };

  const handleEditClick = (w: any) => {
    setEditingId(w.id);
    setSyllabusInputs(w.syllabus && w.syllabus.length > 0 ? w.syllabus : [""]);
    reset({
      title: w.title,
      description: w.description,
      longDescription: w.longDescription,
      date: w.date,
      time: w.time,
      price: w.price,
      seatsTotal: w.seatsTotal,
      instructor: w.instructor,
      location: w.location,
      image: w.image,
      syllabus: w.syllabus || [],
    });
    setIsFormOpen(true);
  };

  const handleViewRegistries = (id: string) => {
    setSelectedWorkshopId(id);
    setIsRegistriesOpen(true);
  };

  const handleSyllabusChange = (index: number, val: string) => {
    const next = [...syllabusInputs];
    next[index] = val;
    setSyllabusInputs(next);
    setValue("syllabus", next.filter((item) => item.trim() !== ""));
  };

  const addSyllabusRow = () => {
    setSyllabusInputs([...syllabusInputs, ""]);
  };

  const removeSyllabusRow = (index: number) => {
    const next = syllabusInputs.filter((_, i) => i !== index);
    setSyllabusInputs(next.length === 0 ? [""] : next);
    setValue("syllabus", next.filter((item) => item.trim() !== ""));
  };

  const onSubmit = (data: WorkshopFormInputs) => {
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

  const workshops = workshopsRes?.data || [];
  const selectedRegistries = detailRes?.data?.registrations || [];
  const selectedTitle = detailRes?.data?.title || "Workshop";

  return (
    <AdminLayout>
      <div className="space-y-8">
        {/* Header Controls */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="space-y-1">
            <span className="text-[10px] uppercase tracking-widest text-luxury-accent font-semibold">COHORTS</span>
            <h2 className="text-2xl md:text-3xl font-serif font-bold text-white">Workshops & Residencies</h2>
          </div>
          <button
            onClick={handleCreateClick}
            className="px-5 py-2.5 bg-luxury-accent hover:bg-luxury-hover text-luxury-bg text-[10px] font-sans uppercase tracking-widest font-bold rounded-sm flex items-center gap-2 transition-all cursor-pointer shadow-lg"
          >
            <Plus size={14} />
            Create Cohort
          </button>
        </div>

        {/* List Table */}
        {isLoading ? (
          <div className="h-60 flex items-center justify-center">
            <Loader2 className="animate-spin text-luxury-accent" size={24} />
          </div>
        ) : workshops.length === 0 ? (
          <div className="bg-[#151515] border border-white/5 rounded-sm p-16 text-center">
            <span className="text-xs text-luxury-muted uppercase tracking-widest">
              No workshop cohorts created yet.
            </span>
          </div>
        ) : (
          <div className="bg-[#151515] border border-white/5 rounded-sm overflow-hidden shadow-lg">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-sans text-luxury-muted">
                <thead>
                  <tr className="border-b border-white/5 bg-[#0F0F0F] text-[9px] uppercase tracking-wider text-white/50">
                    <th className="p-4">Cohort Title</th>
                    <th className="p-4">Schedule</th>
                    <th className="p-4">Location</th>
                    <th className="p-4">Enrolment Fee</th>
                    <th className="p-4">Seats Availability</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {workshops.map((w: any) => {
                    const booked = w.seatsTotal - w.seatsAvailable;
                    return (
                      <tr key={w.id} className="hover:bg-white/[0.01] hover:text-white transition-colors">
                        <td className="p-4 font-bold text-white text-sm">{w.title}</td>
                        <td className="p-4 space-y-0.5">
                          <span className="text-[10px] font-mono text-white block">{w.date}</span>
                          <span className="text-[9px] text-neutral-400 block">{w.time}</span>
                        </td>
                        <td className="p-4 truncate max-w-[140px]" title={w.location}>
                          {w.location}
                        </td>
                        <td className="p-4 font-semibold text-white">
                          ₹{w.price.toLocaleString()}
                        </td>
                        <td className="p-4 space-y-1">
                          <div className="flex justify-between items-center text-[10px]">
                            <span>{w.seatsAvailable} of {w.seatsTotal} left</span>
                            <span className="text-luxury-accent font-bold">({booked} booked)</span>
                          </div>
                          {/* Progress indicator */}
                          <div className="w-24 h-1.5 bg-neutral-800 rounded-full overflow-hidden border border-white/5">
                            <div
                              className="h-full bg-luxury-accent"
                              style={{ width: `${Math.min(100, (booked / w.seatsTotal) * 100)}%` }}
                            />
                          </div>
                        </td>
                        <td className="p-4 text-right space-x-2">
                          <button
                            onClick={() => handleViewRegistries(w.id)}
                            className="px-2.5 py-1.5 bg-white/5 hover:bg-luxury-accent/15 border border-white/5 hover:border-luxury-accent/30 text-white hover:text-luxury-accent text-[9px] uppercase tracking-wider font-semibold rounded-sm transition-colors cursor-pointer inline-flex items-center gap-1"
                          >
                            <Users size={10} />
                            Bookings
                          </button>
                          <button
                            onClick={() => handleEditClick(w)}
                            className="p-1.5 hover:bg-white/5 text-luxury-muted hover:text-white rounded-sm transition-colors cursor-pointer inline-flex"
                          >
                            <Edit2 size={12} />
                          </button>
                          <button
                            onClick={() => {
                              setDeletingId(w.id);
                              setIsDeleteOpen(true);
                            }}
                            className="p-1.5 hover:bg-red-500/10 text-luxury-muted hover:text-red-400 rounded-sm transition-colors cursor-pointer inline-flex"
                          >
                            <Trash2 size={12} />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Create/Edit Modal */}
        {isFormOpen && (
          <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-6">
            <div className="bg-[#151515] border border-white/10 max-w-2xl w-full p-8 rounded-sm shadow-2xl relative max-h-[85vh] overflow-y-auto">
              <button
                onClick={() => setIsFormOpen(false)}
                className="absolute top-5 right-5 text-white/50 hover:text-white transition-colors cursor-pointer"
              >
                <X size={20} />
              </button>

              <h3 className="font-serif text-xl font-bold text-white mb-6">
                {editingId ? "Edit Workshop Cohort" : "Create Workshop Cohort"}
              </h3>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <ImageUploader
                  label="Workshop Thumbnail Image"
                  value={watchImage}
                  onChange={(url) => setValue("image", url, { shouldDirty: true })}
                />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Title */}
                  <div className="flex flex-col space-y-1.5">
                    <label className="text-[10px] uppercase tracking-wider text-luxury-muted font-sans font-medium">Workshop Title</label>
                    <input
                      type="text"
                      {...register("title")}
                      className="bg-luxury-bg border border-white/5 focus:border-luxury-accent text-white px-4 py-2.5 rounded-sm text-xs font-sans outline-none"
                    />
                    {errors.title && <p className="text-[10px] text-red-500 font-sans mt-1">{errors.title.message}</p>}
                  </div>

                  {/* Instructor */}
                  <div className="flex flex-col space-y-1.5">
                    <label className="text-[10px] uppercase tracking-wider text-luxury-muted font-sans font-medium">Instructor / Tutor</label>
                    <input
                      type="text"
                      {...register("instructor")}
                      className="bg-luxury-bg border border-white/5 focus:border-luxury-accent text-white px-4 py-2.5 rounded-sm text-xs font-sans outline-none"
                    />
                    {errors.instructor && <p className="text-[10px] text-red-500 font-sans mt-1">{errors.instructor.message}</p>}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Short description */}
                  <div className="flex flex-col space-y-1.5">
                    <label className="text-[10px] uppercase tracking-wider text-luxury-muted font-sans font-medium">Syllabus Overview / Slogan</label>
                    <input
                      type="text"
                      {...register("description")}
                      className="bg-luxury-bg border border-white/5 focus:border-luxury-accent text-white px-4 py-2.5 rounded-sm text-xs font-sans outline-none"
                    />
                    {errors.description && <p className="text-[10px] text-red-500 font-sans mt-1">{errors.description.message}</p>}
                  </div>

                  {/* Location */}
                  <div className="flex flex-col space-y-1.5">
                    <label className="text-[10px] uppercase tracking-wider text-luxury-muted font-sans font-medium">Location</label>
                    <input
                      type="text"
                      {...register("location")}
                      className="bg-luxury-bg border border-white/5 focus:border-luxury-accent text-white px-4 py-2.5 rounded-sm text-xs font-sans outline-none"
                    />
                    {errors.location && <p className="text-[10px] text-red-500 font-sans mt-1">{errors.location.message}</p>}
                  </div>
                </div>

                {/* Long description */}
                <div className="flex flex-col space-y-1.5">
                  <label className="text-[10px] uppercase tracking-wider text-luxury-muted font-sans font-medium">Detailed Long Description</label>
                  <textarea
                    rows={4}
                    {...register("longDescription")}
                    className="bg-luxury-bg border border-white/5 focus:border-luxury-accent text-white px-4 py-2.5 rounded-sm text-xs font-sans outline-none resize-none"
                  />
                  {errors.longDescription && <p className="text-[10px] text-red-500 font-sans mt-1">{errors.longDescription.message}</p>}
                </div>

                <div className="grid grid-cols-3 gap-4">
                  {/* Date */}
                  <div className="flex flex-col space-y-1.5">
                    <label className="text-[10px] uppercase tracking-wider text-luxury-muted font-sans font-medium">Dates</label>
                    <input
                      type="text"
                      {...register("date")}
                      className="bg-luxury-bg border border-white/5 focus:border-luxury-accent text-white px-3 py-2 rounded-sm text-xs font-sans outline-none"
                      placeholder="Oct 12 - 15, 2026"
                    />
                  </div>

                  {/* Time */}
                  <div className="flex flex-col space-y-1.5">
                    <label className="text-[10px] uppercase tracking-wider text-luxury-muted font-sans font-medium">Timings</label>
                    <input
                      type="text"
                      {...register("time")}
                      className="bg-luxury-bg border border-white/5 focus:border-luxury-accent text-white px-3 py-2 rounded-sm text-xs font-sans outline-none"
                      placeholder="10:00 AM - 05:00 PM"
                    />
                  </div>

                  {/* Price */}
                  <div className="flex flex-col space-y-1.5">
                    <label className="text-[10px] uppercase tracking-wider text-luxury-muted font-sans font-medium">Price (INR)</label>
                    <input
                      type="number"
                      {...register("price", { valueAsNumber: true })}
                      className="bg-luxury-bg border border-white/5 focus:border-luxury-accent text-white px-3 py-2 rounded-sm text-xs font-sans outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {/* Total Seats */}
                  <div className="flex flex-col space-y-1.5">
                    <label className="text-[10px] uppercase tracking-wider text-luxury-muted font-sans font-medium">Total Seats Available</label>
                    <input
                      type="number"
                      {...register("seatsTotal", { valueAsNumber: true })}
                      className="bg-luxury-bg border border-white/5 focus:border-luxury-accent text-white px-4 py-2.5 rounded-sm text-xs font-sans outline-none"
                    />
                  </div>

                  {/* Dummy helper */}
                  <div className="p-3 bg-luxury-accent/5 border border-luxury-accent/10 rounded-sm flex items-center gap-2 text-luxury-accent text-[10px] font-sans">
                    <AlertCircle size={14} />
                    Modifying seats resets availability accordingly.
                  </div>
                </div>

                {/* Syllabus Items */}
                <div className="space-y-3 pt-3 border-t border-white/5">
                  <div className="flex justify-between items-center">
                    <label className="text-[10px] uppercase tracking-wider text-white font-sans font-bold">Syllabus Curriculum</label>
                    <button
                      type="button"
                      onClick={addSyllabusRow}
                      className="px-2 py-1 bg-luxury-accent/10 border border-luxury-accent/25 hover:bg-luxury-accent/20 text-luxury-accent text-[9px] uppercase tracking-wider rounded-sm cursor-pointer"
                    >
                      + Add Step
                    </button>
                  </div>

                  <div className="space-y-2">
                    {syllabusInputs.map((input, idx) => (
                      <div key={idx} className="flex gap-2 items-center">
                        <input
                          type="text"
                          value={input}
                          onChange={(e) => handleSyllabusChange(idx, e.target.value)}
                          className="flex-1 bg-luxury-bg border border-white/5 focus:border-luxury-accent text-white px-4 py-2.5 rounded-sm text-xs font-sans outline-none"
                          placeholder="e.g. Masterclass editorial composition grid"
                        />
                        <button
                          type="button"
                          onClick={() => removeSyllabusRow(idx)}
                          className="p-2.5 bg-neutral-900 border border-white/5 hover:border-red-500/30 text-luxury-muted hover:text-red-400 rounded-sm cursor-pointer transition-colors"
                        >
                          <X size={14} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex gap-3 pt-4 border-t border-white/5">
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
                      <Loader2 className="animate-spin animate" size={12} />
                    )}
                    {editingId ? "Save Changes" : "Create Cohort"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* View Registries Modal */}
        {isRegistriesOpen && (
          <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-6">
            <div className="bg-[#151515] border border-white/10 max-w-xl w-full p-8 rounded-sm shadow-2xl relative max-h-[80vh] flex flex-col">
              <button
                onClick={() => {
                  setIsRegistriesOpen(false);
                  setSelectedWorkshopId(null);
                }}
                className="absolute top-5 right-5 text-white/50 hover:text-white transition-colors cursor-pointer"
              >
                <X size={20} />
              </button>

              <div className="space-y-1 mb-6">
                <span className="text-[10px] uppercase tracking-widest text-luxury-accent font-semibold flex items-center gap-1 font-sans">
                  <BookOpen size={10} />
                  Registry List
                </span>
                <h3 className="font-serif text-lg font-bold text-white">{selectedTitle}</h3>
              </div>

              <div className="flex-1 overflow-y-auto pr-1">
                {isDetailLoading ? (
                  <div className="h-40 flex items-center justify-center">
                    <Loader2 className="animate-spin text-luxury-accent" size={20} />
                  </div>
                ) : selectedRegistries.length === 0 ? (
                  <div className="py-12 text-center text-luxury-muted">
                    No participants have registered for this cohort yet.
                  </div>
                ) : (
                  <table className="w-full text-left text-xs font-sans text-luxury-muted">
                    <thead>
                      <tr className="border-b border-white/5 text-[9px] uppercase tracking-wider text-white/50 pb-2">
                        <th className="pb-2">Name</th>
                        <th className="pb-2">Seats</th>
                        <th className="pb-2">Contact Details</th>
                        <th className="pb-2">Registered</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {selectedRegistries.map((r: any) => (
                        <tr key={r.id}>
                          <td className="py-3 font-semibold text-white">{r.name}</td>
                          <td className="py-3 font-mono font-bold text-luxury-accent">
                            {r.seats} seat(s)
                          </td>
                          <td className="py-3 space-y-0.5 font-light">
                            <span className="block">{r.email}</span>
                            <span className="block">{r.phone}</span>
                          </td>
                          <td className="py-3 font-mono text-[10px]">
                            {new Date(r.createdAt).toLocaleDateString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        <ConfirmModal
          isOpen={isDeleteOpen}
          title="Delete Workshop Cohort"
          message="Are you sure you want to delete this workshop? This will remove the cohort details and syllabus from the workshops page."
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
