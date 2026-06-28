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
import { AdminInput } from "@/components/admin/ui/admin-input";
import { AdminTextarea } from "@/components/admin/ui/admin-textarea";
import { AdminSelect } from "@/components/admin/ui/admin-select";
import { AdminCheckbox } from "@/components/admin/ui/admin-checkbox";
import { AdminButton } from "@/components/admin/ui/admin-button";
import { AdminModal } from "@/components/admin/ui/admin-modal";
import { AdminCard } from "@/components/admin/ui/admin-card";

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
      queryClient.invalidateQueries({ queryKey: ["adminDashboard"] });
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
      queryClient.invalidateQueries({ queryKey: ["adminDashboard"] });
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
      queryClient.invalidateQueries({ queryKey: ["adminDashboard"] });
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
            <span className="text-[10px] uppercase tracking-widest text-accent font-semibold">COHORTS</span>
            <h2 className="text-2xl md:text-3xl font-serif font-bold text-foreground">Workshops & Residencies</h2>
          </div>
          <AdminButton
            onClick={handleCreateClick}
            className="flex items-center gap-2"
          >
            <Plus size={14} />
            Create Cohort
          </AdminButton>
        </div>

        {/* List Table */}
        {isLoading ? (
          <div className="h-60 flex items-center justify-center">
            <Loader2 className="animate-spin text-accent" size={24} />
          </div>
        ) : workshops.length === 0 ? (
          <div className="bg-card border border-border rounded-sm p-16 text-center">
            <span className="text-xs text-muted uppercase tracking-widest">
              No workshop cohorts created yet.
            </span>
          </div>
        ) : (
          <div className="bg-card border border-border rounded-sm overflow-hidden shadow-lg">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-sans text-muted">
                <thead>
                  <tr className="border-b border-border bg-secondary/50 text-[9px] uppercase tracking-wider text-muted">
                    <th className="p-4">Cohort Title</th>
                    <th className="p-4">Schedule</th>
                    <th className="p-4">Location</th>
                    <th className="p-4">Enrolment Fee</th>
                    <th className="p-4">Seats Availability</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {workshops.map((w: any) => {
                    const booked = w.seatsTotal - w.seatsAvailable;
                    return (
                      <tr key={w.id} className="hover:bg-secondary/30 hover:text-foreground transition-colors">
                        <td className="p-4 font-bold text-foreground text-sm">{w.title}</td>
                        <td className="p-4 space-y-0.5">
                          <span className="text-[10px] font-mono text-foreground block">{w.date}</span>
                          <span className="text-[9px] text-muted block">{w.time}</span>
                        </td>
                        <td className="p-4 truncate max-w-[140px]" title={w.location}>
                          {w.location}
                        </td>
                        <td className="p-4 font-semibold text-foreground">
                          ₹{w.price.toLocaleString()}
                        </td>
                        <td className="p-4 space-y-1">
                          <div className="flex justify-between items-center text-[10px]">
                            <span>{w.seatsAvailable} of {w.seatsTotal} left</span>
                            <span className="text-accent font-bold">({booked} booked)</span>
                          </div>
                          {/* Progress indicator */}
                          <div className="w-24 h-1.5 bg-secondary rounded-full overflow-hidden border border-border">
                            <div
                              className="h-full bg-accent"
                              style={{ width: `${Math.min(100, (booked / w.seatsTotal) * 100)}%` }}
                            />
                          </div>
                        </td>
                        <td className="p-4 text-right space-x-2">
                          <button
                            onClick={() => handleViewRegistries(w.id)}
                            className="px-2.5 py-1.5 bg-secondary hover:bg-accent/15 border border-border text-foreground hover:text-accent text-[9px] uppercase tracking-wider font-semibold rounded-sm transition-colors cursor-pointer inline-flex items-center gap-1"
                          >
                            <Users size={10} />
                            Bookings
                          </button>
                          <button
                            onClick={() => handleEditClick(w)}
                            className="p-1.5 hover:bg-secondary text-muted hover:text-foreground rounded-sm transition-colors cursor-pointer inline-flex border border-transparent hover:border-border"
                          >
                            <Edit2 size={12} />
                          </button>
                          <button
                            onClick={() => {
                              setDeletingId(w.id);
                              setIsDeleteOpen(true);
                            }}
                            className="p-1.5 hover:bg-secondary text-muted hover:text-red-500 rounded-sm transition-colors cursor-pointer inline-flex border border-transparent hover:border-border"
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
        <AdminModal
          isOpen={isFormOpen}
          onClose={() => setIsFormOpen(false)}
          title={editingId ? "Edit Workshop Cohort" : "Create Workshop Cohort"}
          maxWidthClass="max-w-2xl"
        >
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <ImageUploader
              label="Workshop Thumbnail Image"
              value={watchImage}
              onChange={(url) => setValue("image", url, { shouldDirty: true })}
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Title */}
              <div className="flex flex-col space-y-1.5">
                <label className="text-[10px] uppercase tracking-wider text-muted font-sans font-medium">Workshop Title</label>
                <AdminInput
                  type="text"
                  {...register("title")}
                />
                {errors.title && <p className="text-[10px] text-red-500 font-sans mt-1">{errors.title.message}</p>}
              </div>

              {/* Instructor */}
              <div className="flex flex-col space-y-1.5">
                <label className="text-[10px] uppercase tracking-wider text-muted font-sans font-medium">Instructor / Tutor</label>
                <AdminInput
                  type="text"
                  {...register("instructor")}
                />
                {errors.instructor && <p className="text-[10px] text-red-500 font-sans mt-1">{errors.instructor.message}</p>}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Short description */}
              <div className="flex flex-col space-y-1.5">
                <label className="text-[10px] uppercase tracking-wider text-muted font-sans font-medium">Syllabus Overview / Slogan</label>
                <AdminInput
                  type="text"
                  {...register("description")}
                />
                {errors.description && <p className="text-[10px] text-red-500 font-sans mt-1">{errors.description.message}</p>}
              </div>

              {/* Location */}
              <div className="flex flex-col space-y-1.5">
                <label className="text-[10px] uppercase tracking-wider text-muted font-sans font-medium">Location</label>
                <AdminInput
                  type="text"
                  {...register("location")}
                />
                {errors.location && <p className="text-[10px] text-red-500 font-sans mt-1">{errors.location.message}</p>}
              </div>
            </div>

            {/* Long description */}
            <div className="flex flex-col space-y-1.5">
              <label className="text-[10px] uppercase tracking-wider text-muted font-sans font-medium">Detailed Long Description</label>
              <AdminTextarea
                rows={4}
                {...register("longDescription")}
              />
              {errors.longDescription && <p className="text-[10px] text-red-500 font-sans mt-1">{errors.longDescription.message}</p>}
            </div>

            <div className="grid grid-cols-3 gap-4">
              {/* Date */}
              <div className="flex flex-col space-y-1.5">
                <label className="text-[10px] uppercase tracking-wider text-muted font-sans font-medium">Dates</label>
                <AdminInput
                  type="text"
                  {...register("date")}
                  placeholder="Oct 12 - 15, 2026"
                />
              </div>

              {/* Time */}
              <div className="flex flex-col space-y-1.5">
                <label className="text-[10px] uppercase tracking-wider text-muted font-sans font-medium">Timings</label>
                <AdminInput
                  type="text"
                  {...register("time")}
                  placeholder="10:00 AM - 05:00 PM"
                />
              </div>

              {/* Price */}
              <div className="flex flex-col space-y-1.5">
                <label className="text-[10px] uppercase tracking-wider text-muted font-sans font-medium">Price (INR)</label>
                <AdminInput
                  type="number"
                  {...register("price", { valueAsNumber: true })}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {/* Total Seats */}
              <div className="flex flex-col space-y-1.5">
                <label className="text-[10px] uppercase tracking-wider text-muted font-sans font-medium">Total Seats Available</label>
                <AdminInput
                  type="number"
                  {...register("seatsTotal", { valueAsNumber: true })}
                />
              </div>

              {/* Dummy helper */}
              <div className="p-3 bg-accent/5 border border-accent/10 rounded-sm flex items-center gap-2 text-accent text-[10px] font-sans">
                <AlertCircle size={14} />
                Modifying seats resets availability accordingly.
              </div>
            </div>

            {/* Syllabus Items */}
            <div className="space-y-3 pt-3 border-t border-border">
              <div className="flex justify-between items-center">
                <label className="text-[10px] uppercase tracking-wider text-foreground font-sans font-bold">Syllabus Curriculum</label>
                <button
                  type="button"
                  onClick={addSyllabusRow}
                  className="px-2 py-1 bg-accent/10 border border-accent/25 hover:bg-accent/20 text-accent text-[9px] uppercase tracking-wider rounded-sm cursor-pointer"
                >
                  + Add Step
                </button>
              </div>

              <div className="space-y-2">
                {syllabusInputs.map((input, idx) => (
                  <div key={idx} className="flex gap-2 items-center">
                    <AdminInput
                      type="text"
                      value={input}
                      onChange={(e) => handleSyllabusChange(idx, e.target.value)}
                      placeholder="e.g. Masterclass editorial composition grid"
                    />
                    <button
                      type="button"
                      onClick={() => removeSyllabusRow(idx)}
                      className="p-2.5 bg-secondary border border-border hover:border-red-500/30 text-muted hover:text-red-500 rounded-sm cursor-pointer transition-colors"
                    >
                      <X size={14} />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex gap-3 pt-4 border-t border-border">
              <AdminButton
                type="button"
                onClick={() => setIsFormOpen(false)}
                variant="secondary"
                className="flex-1"
              >
                Cancel
              </AdminButton>
              <AdminButton
                type="submit"
                disabled={createMutation.isPending || updateMutation.isPending}
                className="flex-1"
              >
                {(createMutation.isPending || updateMutation.isPending) && (
                  <Loader2 className="animate-spin mr-1.5 inline" size={12} />
                )}
                {editingId ? "Save Changes" : "Create Cohort"}
              </AdminButton>
            </div>
          </form>
        </AdminModal>

        {/* View Registries Modal */}
        <AdminModal
          isOpen={isRegistriesOpen}
          onClose={() => {
            setIsRegistriesOpen(false);
            setSelectedWorkshopId(null);
          }}
          title="Registry List"
        >
          <div className="space-y-1 mb-6">
            <span className="text-[10px] uppercase tracking-widest text-accent font-semibold flex items-center gap-1 font-sans">
              <BookOpen size={10} />
              Registry List
            </span>
            <h3 className="font-serif text-lg font-bold text-foreground">{selectedTitle}</h3>
          </div>

          <div className="flex-1 overflow-y-auto pr-1">
            {isDetailLoading ? (
              <div className="h-40 flex items-center justify-center">
                <Loader2 className="animate-spin text-accent" size={20} />
              </div>
            ) : selectedRegistries.length === 0 ? (
              <div className="py-12 text-center text-muted">
                No participants have registered for this cohort yet.
              </div>
            ) : (
              <table className="w-full text-left text-xs font-sans text-muted">
                <thead>
                  <tr className="border-b border-border text-[9px] uppercase tracking-wider text-muted pb-2">
                    <th className="pb-2">Name</th>
                    <th className="pb-2">Seats</th>
                    <th className="pb-2">Contact Details</th>
                    <th className="pb-2">Registered</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {selectedRegistries.map((r: any) => (
                    <tr key={r.id}>
                      <td className="py-3 font-semibold text-foreground">{r.name}</td>
                      <td className="py-3 font-mono font-bold text-accent">
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
        </AdminModal>

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
