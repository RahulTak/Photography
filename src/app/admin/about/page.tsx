"use client";

import React, { useEffect, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { ImageUploader } from "@/components/admin/ImageUploader";
import { ConfirmModal } from "@/components/admin/ConfirmModal";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import axios from "axios";
import {
  Loader2,
  Save,
  CheckCircle,
  X,
  Plus,
  Edit2,
  Trash2,
  Users,
  Award,
  ChevronUp,
  ChevronDown,
  Info,
} from "lucide-react";
import { AdminInput } from "@/components/admin/ui/admin-input";
import { AdminTextarea } from "@/components/admin/ui/admin-textarea";
import { AdminSelect } from "@/components/admin/ui/admin-select";
import { AdminCheckbox } from "@/components/admin/ui/admin-checkbox";
import { AdminButton } from "@/components/admin/ui/admin-button";
import { AdminModal } from "@/components/admin/ui/admin-modal";
import { AdminCard } from "@/components/admin/ui/admin-card";

// About page validation schema
const aboutSchema = z.object({
  hero: z.object({
    title: z.string().min(2, "Hero title is required"),
    subtitle: z.string().min(2, "Hero subtitle is required"),
    description: z.string().min(10, "Hero description is required"),
    image: z.string().min(5, "Hero image asset is required"),
  }),
  founders: z.object({
    title: z.string().min(2, "Founder name is required"),
    subtitle: z.string().min(2, "Founder subtitle is required"),
    storyParagraphs: z.array(z.string()).min(1, "Enter at least one story paragraph"),
    images: z.object({
      sujay: z.string().min(5, "Founder portrait is required"),
      shreyanka: z.string().min(5, "Secondary setup portrait is required"),
    }),
  }),
  missionVision: z.object({
    mission: z.object({
      title: z.string().min(2, "Mission title is required"),
      description: z.string().min(5, "Mission description is required"),
    }),
    vision: z.object({
      title: z.string().min(2, "Vision title is required"),
      description: z.string().min(5, "Vision description is required"),
    }),
  }),
  stats: z.array(z.object({
    value: z.string().min(1, "Stat value is required"),
    label: z.string().min(2, "Stat label is required"),
  })),
  timeline: z.array(z.object({
    year: z.string().min(4, "Year is required"),
    title: z.string().min(2, "Milestone title is required"),
    description: z.string().min(5, "Milestone description is required"),
  })),
});

type AboutFormInputs = z.infer<typeof aboutSchema>;

export default function AdminAboutPage() {
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState<"content" | "team" | "awards">("content");
  
  // Custom arrays for dynamic form controls
  const [storyInputs, setStoryInputs] = useState<string[]>([""]);
  const [timelineInputs, setTimelineInputs] = useState<{ year: string; title: string; description: string }[]>([]);
  const [statsInputs, setStatsInputs] = useState<{ value: string; label: string }[]>([]);

  // Team Management states
  const [isTeamFormOpen, setIsTeamFormOpen] = useState(false);
  const [editingTeamMember, setEditingTeamMember] = useState<any>(null);
  const [deletingTeamId, setDeletingTeamId] = useState<string | null>(null);
  const [isTeamDeleteOpen, setIsTeamDeleteOpen] = useState(false);
  const [teamForm, setTeamForm] = useState({
    name: "",
    role: "",
    bio: "",
    imageUrl: "",
    sortOrder: 0,
    active: true,
  });

  // Awards Management states
  const [isAwardFormOpen, setIsAwardFormOpen] = useState(false);
  const [editingAward, setEditingAward] = useState<any>(null);
  const [deletingAwardId, setDeletingAwardId] = useState<string | null>(null);
  const [isAwardDeleteOpen, setIsAwardDeleteOpen] = useState(false);
  const [awardForm, setAwardForm] = useState({
    title: "",
    category: "",
    year: "",
    organization: "",
    imageUrl: "",
    description: "",
    sortOrder: 0,
    active: true,
  });

  // ==========================================
  // Fetching Data Queries
  // ==========================================
  
  // Fetch About page copy
  const { data: aboutRes, isLoading: isAboutLoading } = useQuery({
    queryKey: ["adminAbout"],
    queryFn: async () => {
      const response = await axios.get("/api/about");
      return response.data;
    },
  });

  // Fetch Team members (includes active/inactive)
  const { data: teamRes, isLoading: isTeamLoading, refetch: refetchTeam } = useQuery({
    queryKey: ["adminTeam"],
    queryFn: async () => {
      const response = await axios.get("/api/team");
      return response.data;
    },
  });

  // Fetch Awards (includes active/inactive)
  const { data: awardsRes, isLoading: isAwardsLoading, refetch: refetchAwards } = useQuery({
    queryKey: ["adminAwards"],
    queryFn: async () => {
      const response = await axios.get("/api/awards");
      return response.data;
    },
  });

  const teamMembers = teamRes?.data || [];
  const awards = awardsRes?.data || [];

  // ==========================================
  // Form hooks and useEffect mapping
  // ==========================================
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors, isDirty },
  } = useForm<AboutFormInputs>({
    resolver: zodResolver(aboutSchema),
  });

  const heroImage = watch("hero.image");
  const founderImageSujay = watch("founders.images.sujay");
  const founderImageShreyanka = watch("founders.images.shreyanka");

  // Load database configs for About Content
  useEffect(() => {
    if (aboutRes?.data) {
      const data = aboutRes.data;
      setStoryInputs(data.founders?.storyParagraphs && data.founders.storyParagraphs.length > 0 ? data.founders.storyParagraphs : [""]);
      setTimelineInputs(data.timeline || []);
      setStatsInputs(data.stats || []);
      reset({
        hero: {
          title: data.hero?.title || "",
          subtitle: data.hero?.subtitle || "",
          description: data.hero?.description || "",
          image: data.hero?.image || "",
        },
        founders: {
          title: data.founders?.title || "",
          subtitle: data.founders?.subtitle || "",
          storyParagraphs: data.founders?.storyParagraphs || [],
          images: {
            sujay: data.founders?.images?.sujay || "",
            shreyanka: data.founders?.images?.shreyanka || "",
          },
        },
        missionVision: {
          mission: {
            title: data.missionVision?.mission?.title || "Our Mission",
            description: data.missionVision?.mission?.description || "",
          },
          vision: {
            title: data.missionVision?.vision?.title || "Our Vision",
            description: data.missionVision?.vision?.description || "",
          },
        },
        stats: data.stats || [],
        timeline: data.timeline || [],
      });
    }
  }, [aboutRes, reset]);

  // ==========================================
  // Mutations
  // ==========================================
  
  // 1. Update about copy mutation
  const updateMutation = useMutation({
    mutationFn: async (payload: any) => {
      const response = await axios.put("/api/about", payload);
      return response.data;
    },
    onSuccess: (res) => {
      queryClient.setQueryData(["adminAbout"], res);
      queryClient.invalidateQueries({ queryKey: ["about"] });
      queryClient.invalidateQueries({ queryKey: ["adminDashboard"] });
    },
  });

  // 2. Team Mutations
  const createTeamMutation = useMutation({
    mutationFn: async (payload: any) => {
      const response = await axios.post("/api/team", payload);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminTeam"] });
      queryClient.invalidateQueries({ queryKey: ["adminAbout"] });
      queryClient.invalidateQueries({ queryKey: ["adminDashboard"] });
      setIsTeamFormOpen(false);
      refetchTeam();
    },
  });

  const updateTeamMutation = useMutation({
    mutationFn: async (variables: { id: string; payload: any }) => {
      const response = await axios.put(`/api/team/${variables.id}`, variables.payload);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminTeam"] });
      queryClient.invalidateQueries({ queryKey: ["adminAbout"] });
      queryClient.invalidateQueries({ queryKey: ["adminDashboard"] });
      setIsTeamFormOpen(false);
      refetchTeam();
    },
  });

  const deleteTeamMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await axios.delete(`/api/team/${id}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminTeam"] });
      queryClient.invalidateQueries({ queryKey: ["adminAbout"] });
      queryClient.invalidateQueries({ queryKey: ["adminDashboard"] });
      setIsTeamDeleteOpen(false);
      setDeletingTeamId(null);
      refetchTeam();
    },
  });

  // 3. Award Mutations
  const createAwardMutation = useMutation({
    mutationFn: async (payload: any) => {
      const response = await axios.post("/api/awards", payload);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminAwards"] });
      queryClient.invalidateQueries({ queryKey: ["adminAbout"] });
      queryClient.invalidateQueries({ queryKey: ["adminDashboard"] });
      setIsAwardFormOpen(false);
      refetchAwards();
    },
  });

  const updateAwardMutation = useMutation({
    mutationFn: async (variables: { id: string; payload: any }) => {
      const response = await axios.put(`/api/awards/${variables.id}`, variables.payload);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminAwards"] });
      queryClient.invalidateQueries({ queryKey: ["adminAbout"] });
      queryClient.invalidateQueries({ queryKey: ["adminDashboard"] });
      setIsAwardFormOpen(false);
      refetchAwards();
    },
  });

  const deleteAwardMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await axios.delete(`/api/awards/${id}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminAwards"] });
      queryClient.invalidateQueries({ queryKey: ["adminAbout"] });
      queryClient.invalidateQueries({ queryKey: ["adminDashboard"] });
      setIsAwardDeleteOpen(false);
      setDeletingAwardId(null);
      refetchAwards();
    },
  });

  // ==========================================
  // Dynamic Fields Helpers
  // ==========================================
  
  // Story paragraphs
  const handleStoryChange = (index: number, val: string) => {
    const next = [...storyInputs];
    next[index] = val;
    setStoryInputs(next);
    setValue("founders.storyParagraphs", next.filter((p) => p.trim() !== ""), { shouldDirty: true });
  };
  const addStoryRow = () => setStoryInputs([...storyInputs, ""]);
  const removeStoryRow = (index: number) => {
    const next = storyInputs.filter((_, i) => i !== index);
    setStoryInputs(next.length === 0 ? [""] : next);
    setValue("founders.storyParagraphs", next.filter((p) => p.trim() !== ""), { shouldDirty: true });
  };

  // Timeline milestones
  const handleTimelineChange = (index: number, key: "year" | "title" | "description", val: string) => {
    const next = [...timelineInputs];
    next[index] = { ...next[index], [key]: val };
    setTimelineInputs(next);
    setValue("timeline", next, { shouldDirty: true });
  };
  const addTimelineRow = () => {
    const next = [...timelineInputs, { year: "", title: "", description: "" }];
    setTimelineInputs(next);
    setValue("timeline", next, { shouldDirty: true });
  };
  const removeTimelineRow = (index: number) => {
    const next = timelineInputs.filter((_, i) => i !== index);
    setTimelineInputs(next);
    setValue("timeline", next, { shouldDirty: true });
  };

  // Stats Counters
  const handleStatChange = (index: number, key: "value" | "label", val: string) => {
    const next = [...statsInputs];
    next[index] = { ...next[index], [key]: val };
    setStatsInputs(next);
    setValue("stats", next, { shouldDirty: true });
  };
  const addStatRow = () => {
    const next = [...statsInputs, { value: "", label: "" }];
    setStatsInputs(next);
    setValue("stats", next, { shouldDirty: true });
  };
  const removeStatRow = (index: number) => {
    const next = statsInputs.filter((_, i) => i !== index);
    setStatsInputs(next);
    setValue("stats", next, { shouldDirty: true });
  };

  // ==========================================
  // CRUD Actions Handles
  // ==========================================
  
  // Main Copy Save
  const onMainCopySubmit = (data: AboutFormInputs) => {
    const payload = {
      ...data,
      stats: statsInputs,
      timeline: timelineInputs,
      process: aboutRes?.data?.process || [],
    };
    updateMutation.mutate(payload);
  };

  // Team Form Handlers
  const handleCreateTeamClick = () => {
    setEditingTeamMember(null);
    setTeamForm({
      name: "",
      role: "",
      bio: "",
      imageUrl: "",
      sortOrder: teamMembers.length,
      active: true,
    });
    setIsTeamFormOpen(true);
  };
  const handleEditTeamClick = (member: any) => {
    setEditingTeamMember(member);
    setTeamForm({
      name: member.name || "",
      role: member.role || "",
      bio: member.bio || "",
      imageUrl: member.imageUrl || "",
      sortOrder: member.sortOrder !== undefined ? member.sortOrder : 0,
      active: member.active !== undefined ? member.active : true,
    });
    setIsTeamFormOpen(true);
  };
  const onTeamSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!teamForm.name || !teamForm.role || !teamForm.imageUrl) {
      alert("Name, role/designation, and profile image are required.");
      return;
    }
    if (editingTeamMember) {
      updateTeamMutation.mutate({ id: editingTeamMember.id, payload: teamForm });
    } else {
      createTeamMutation.mutate(teamForm);
    }
  };
  const handleDeleteTeamConfirm = () => {
    if (deletingTeamId) {
      deleteTeamMutation.mutate(deletingTeamId);
    }
  };

  // Awards Form Handlers
  const handleCreateAwardClick = () => {
    setEditingAward(null);
    setAwardForm({
      title: "",
      category: "",
      year: new Date().getFullYear().toString(),
      organization: "",
      imageUrl: "",
      description: "",
      sortOrder: awards.length,
      active: true,
    });
    setIsAwardFormOpen(true);
  };
  const handleEditAwardClick = (award: any) => {
    setEditingAward(award);
    setAwardForm({
      title: award.title || "",
      category: award.category || "",
      year: award.year || "",
      organization: award.organization || "",
      imageUrl: award.imageUrl || "",
      description: award.description || "",
      sortOrder: award.sortOrder !== undefined ? award.sortOrder : 0,
      active: award.active !== undefined ? award.active : true,
    });
    setIsAwardFormOpen(true);
  };
  const onAwardSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!awardForm.title || !awardForm.category || !awardForm.year || !awardForm.organization) {
      alert("Title, Category, Year, and Organization are required.");
      return;
    }
    if (editingAward) {
      updateAwardMutation.mutate({ id: editingAward.id, payload: awardForm });
    } else {
      createAwardMutation.mutate(awardForm);
    }
  };
  const handleDeleteAwardConfirm = () => {
    if (deletingAwardId) {
      deleteAwardMutation.mutate(deletingAwardId);
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="space-y-1">
            <span className="text-[10px] uppercase tracking-widest text-luxury-accent font-semibold">ABOUT</span>
            <h2 className="text-2xl md:text-3xl font-serif font-bold text-white">About Page Manager</h2>
          </div>
          {activeTab === "team" && (
            <button
              onClick={handleCreateTeamClick}
              className="px-5 py-2.5 bg-luxury-accent hover:bg-luxury-hover text-luxury-bg text-[10px] font-sans uppercase tracking-widest font-bold rounded-sm flex items-center gap-2 transition-all cursor-pointer shadow-lg animate-pulse hover:animate-none"
            >
              <Plus size={14} />
              Add Guild Member
            </button>
          )}
          {activeTab === "awards" && (
            <button
              onClick={handleCreateAwardClick}
              className="px-5 py-2.5 bg-luxury-accent hover:bg-luxury-hover text-luxury-bg text-[10px] font-sans uppercase tracking-widest font-bold rounded-sm flex items-center gap-2 transition-all cursor-pointer shadow-lg animate-pulse hover:animate-none"
            >
              <Plus size={14} />
              Add Award Entry
            </button>
          )}
        </div>

        {/* Dynamic Tab Switcher */}
        <div className="flex border-b border-white/5 space-x-8">
          <button
            onClick={() => setActiveTab("content")}
            className={`pb-4 text-xs font-sans uppercase tracking-widest font-semibold border-b-2 transition-all cursor-pointer ${
              activeTab === "content" ? "border-luxury-accent text-luxury-accent" : "border-transparent text-luxury-muted hover:text-white"
            }`}
          >
            About Content & Copy
          </button>
          <button
            onClick={() => setActiveTab("team")}
            className={`pb-4 text-xs font-sans uppercase tracking-widest font-semibold border-b-2 transition-all cursor-pointer ${
              activeTab === "team" ? "border-luxury-accent text-luxury-accent" : "border-transparent text-luxury-muted hover:text-white"
            }`}
          >
            Team Management
          </button>
          <button
            onClick={() => setActiveTab("awards")}
            className={`pb-4 text-xs font-sans uppercase tracking-widest font-semibold border-b-2 transition-all cursor-pointer ${
              activeTab === "awards" ? "border-luxury-accent text-luxury-accent" : "border-transparent text-luxury-muted hover:text-white"
            }`}
          >
            Awards & Accolades
          </button>
        </div>

        {/* ==========================================
            TAB 1: ABOUT CONTENT & COPY
            ========================================== */}
        {activeTab === "content" && (
          <>
            {isAboutLoading ? (
              <div className="h-60 flex items-center justify-center">
                <Loader2 className="animate-spin text-accent" size={24} />
              </div>
            ) : (
              <form onSubmit={handleSubmit(onMainCopySubmit)} className="space-y-8 max-w-3xl">
                {updateMutation.isSuccess && (
                  <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-sm flex items-start gap-3 text-green-400 text-xs font-sans leading-relaxed">
                    <CheckCircle size={16} className="shrink-0 mt-0.5" />
                    <div>
                      <span className="font-semibold block mb-0.5">About Page Copy Updated</span>
                      About page details saved. Revisions are live on the public website.
                    </div>
                  </div>
                )}

                {/* Hero Copy Card */}
                <AdminCard title="Hero Banner">
                  <ImageUploader
                    label="Hero Background Image"
                    value={heroImage}
                    onChange={(url) => setValue("hero.image", url, { shouldDirty: true })}
                  />
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="flex flex-col space-y-1.5">
                      <label className="text-[10px] uppercase tracking-wider text-muted font-sans font-medium">Headline</label>
                      <AdminInput
                        type="text"
                        {...register("hero.title")}
                      />
                    </div>
                    <div className="flex flex-col space-y-1.5">
                      <label className="text-[10px] uppercase tracking-wider text-muted font-sans font-medium">Subtitle</label>
                      <AdminInput
                        type="text"
                        {...register("hero.subtitle")}
                      />
                    </div>
                  </div>
                  <div className="flex flex-col space-y-1.5">
                    <label className="text-[10px] uppercase tracking-wider text-muted font-sans font-medium">Description</label>
                    <AdminTextarea
                      rows={3}
                      {...register("hero.description")}
                    />
                  </div>
                </AdminCard>

                {/* Founder Story Copy Card */}
                <AdminCard title="Founder Profile & Biography">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <ImageUploader
                      label="Founder Portrait (Jay Prakash)"
                      value={founderImageSujay}
                      onChange={(url) => setValue("founders.images.sujay", url, { shouldDirty: true })}
                    />
                    <ImageUploader
                      label="Behind the Lens Portrait"
                      value={founderImageShreyanka}
                      onChange={(url) => setValue("founders.images.shreyanka", url, { shouldDirty: true })}
                    />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="flex flex-col space-y-1.5">
                      <label className="text-[10px] uppercase tracking-wider text-muted font-sans font-medium">Founder Name</label>
                      <AdminInput
                        type="text"
                        {...register("founders.title")}
                      />
                    </div>
                    <div className="flex flex-col space-y-1.5">
                      <label className="text-[10px] uppercase tracking-wider text-muted font-sans font-medium">Biographical Role / Title</label>
                      <AdminInput
                        type="text"
                        {...register("founders.subtitle")}
                      />
                    </div>
                  </div>
                  <div className="space-y-3 pt-3 border-t border-border">
                    <div className="flex justify-between items-center">
                      <label className="text-[10px] uppercase tracking-wider text-foreground font-sans font-bold">Biographical Story Paragraphs</label>
                      <button
                        type="button"
                        onClick={addStoryRow}
                        className="px-2.5 py-1.5 bg-accent/10 border border-accent/25 hover:bg-accent/20 text-accent text-[9px] uppercase tracking-wider rounded-sm cursor-pointer"
                      >
                        + Add Paragraph
                      </button>
                    </div>
                    <div className="space-y-3">
                      {storyInputs.map((para, idx) => (
                        <div key={idx} className="flex gap-2 items-start">
                          <AdminTextarea
                            rows={3}
                            value={para}
                            onChange={(e) => handleStoryChange(idx, e.target.value)}
                            placeholder="Founder story paragraphs..."
                          />
                          <button
                            type="button"
                            onClick={() => removeStoryRow(idx)}
                            className="p-2.5 bg-secondary border border-border hover:border-red-500/30 text-muted hover:text-red-400 rounded-sm cursor-pointer"
                          >
                            <X size={14} />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </AdminCard>

                {/* Mission & Vision Copy Card */}
                <AdminCard title="Mission & Vision">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div className="flex flex-col space-y-1.5">
                        <label className="text-[10px] uppercase tracking-wider text-muted font-sans font-medium">Mission Title</label>
                        <AdminInput
                          type="text"
                          {...register("missionVision.mission.title")}
                        />
                      </div>
                      <div className="flex flex-col space-y-1.5">
                        <label className="text-[10px] uppercase tracking-wider text-muted font-sans font-medium">Mission Copy</label>
                        <AdminTextarea
                          rows={3}
                          {...register("missionVision.mission.description")}
                        />
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div className="flex flex-col space-y-1.5">
                        <label className="text-[10px] uppercase tracking-wider text-muted font-sans font-medium">Vision Title</label>
                        <AdminInput
                          type="text"
                          {...register("missionVision.vision.title")}
                        />
                      </div>
                      <div className="flex flex-col space-y-1.5">
                        <label className="text-[10px] uppercase tracking-wider text-muted font-sans font-medium">Vision Copy</label>
                        <AdminTextarea
                          rows={3}
                          {...register("missionVision.vision.description")}
                        />
                      </div>
                    </div>
                  </div>
                </AdminCard>

                {/* Journey Timeline Card */}
                <AdminCard>
                  <div className="flex justify-between items-center border-b border-border pb-3">
                    <h3 className="font-serif text-lg font-bold text-foreground">Journey Timeline</h3>
                    <button
                      type="button"
                      onClick={addTimelineRow}
                      className="px-2.5 py-1.5 bg-accent/10 border border-accent/25 hover:bg-accent/20 text-accent text-[9px] uppercase tracking-wider rounded-sm cursor-pointer"
                    >
                      + Add Milestone
                    </button>
                  </div>
                  <div className="space-y-6">
                    {timelineInputs.length === 0 ? (
                      <span className="text-[10px] uppercase tracking-widest text-muted text-center block py-4">No milestone events added yet.</span>
                    ) : (
                      timelineInputs.map((item, idx) => (
                        <div key={idx} className="p-4 bg-secondary/30 border border-border rounded-sm space-y-4 relative">
                          <button
                            type="button"
                            onClick={() => removeTimelineRow(idx)}
                            className="absolute top-4 right-4 p-1 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 rounded-sm cursor-pointer"
                            title="Remove Milestone"
                          >
                            <X size={12} />
                          </button>
                          <div className="grid grid-cols-3 gap-4">
                            <div className="flex flex-col space-y-1.5">
                              <label className="text-[9px] uppercase tracking-wider text-muted font-sans">Year</label>
                              <AdminInput
                                type="text"
                                value={item.year}
                                onChange={(e) => handleTimelineChange(idx, "year", e.target.value)}
                                placeholder="e.g. 2011"
                              />
                            </div>
                            <div className="flex flex-col col-span-2 space-y-1.5">
                              <label className="text-[9px] uppercase tracking-wider text-muted font-sans">Milestone Title</label>
                              <AdminInput
                                type="text"
                                value={item.title}
                                onChange={(e) => handleTimelineChange(idx, "title", e.target.value)}
                                placeholder="e.g. The Genesis"
                              />
                            </div>
                          </div>
                          <div className="flex flex-col space-y-1.5">
                            <label className="text-[9px] uppercase tracking-wider text-muted font-sans">Description</label>
                            <AdminTextarea
                              rows={2}
                              value={item.description}
                              onChange={(e) => handleTimelineChange(idx, "description", e.target.value)}
                              placeholder="Detail of the historical event..."
                            />
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </AdminCard>

                {/* Stats Counters Card */}
                <AdminCard>
                  <div className="flex justify-between items-center border-b border-border pb-3">
                    <h3 className="font-serif text-lg font-bold text-foreground">Impact stats</h3>
                    <button
                      type="button"
                      onClick={addStatRow}
                      className="px-2.5 py-1.5 bg-accent/10 border border-accent/25 hover:bg-accent/20 text-accent text-[9px] uppercase tracking-wider rounded-sm cursor-pointer"
                    >
                      + Add Stat
                    </button>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {statsInputs.map((item, idx) => (
                      <div key={idx} className="p-4 bg-secondary/30 border border-border rounded-sm space-y-3 relative">
                        <button
                          type="button"
                          onClick={() => removeStatRow(idx)}
                          className="absolute top-2 right-2 p-1 text-muted hover:text-red-400 cursor-pointer"
                          title="Remove Stat"
                        >
                          <X size={12} />
                        </button>
                        <div className="flex flex-col space-y-1">
                          <label className="text-[9px] uppercase tracking-wider text-muted font-sans">Metric Value</label>
                          <AdminInput
                            type="text"
                            value={item.value}
                            onChange={(e) => handleStatChange(idx, "value", e.target.value)}
                            placeholder="e.g. 15+"
                          />
                        </div>
                        <div className="flex flex-col space-y-1">
                          <label className="text-[9px] uppercase tracking-wider text-muted font-sans">Label</label>
                          <AdminInput
                            type="text"
                            value={item.label}
                            onChange={(e) => handleStatChange(idx, "label", e.target.value)}
                            placeholder="e.g. Years of Experience"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </AdminCard>

                {/* Action Bar */}
                <div className="flex justify-end">
                  <AdminButton
                    type="submit"
                    disabled={updateMutation.isPending || !isDirty}
                  >
                    {updateMutation.isPending ? (
                      <>
                        <Loader2 className="animate-spin" size={14} />
                        Updating copy...
                      </>
                    ) : (
                      <>
                        <Save size={14} />
                        Save About Copy
                      </>
                    )}
                  </AdminButton>
                </div>
              </form>
            )}
          </>
        )}

        {/* ==========================================
            TAB 2: TEAM MANAGEMENT
            ========================================== */}
        {activeTab === "team" && (
          <>
            {isTeamLoading ? (
              <div className="h-60 flex items-center justify-center">
                <Loader2 className="animate-spin text-accent" size={24} />
              </div>
            ) : teamMembers.length === 0 ? (
              <div className="bg-card border border-border rounded-sm p-16 text-center shadow-lg">
                <Users className="mx-auto text-muted mb-4" size={32} />
                <span className="text-xs text-muted uppercase tracking-widest block mb-2">No team members created yet.</span>
                <p className="text-[10px] text-neutral-500 font-sans">Click "Add Guild Member" above to set up your primary artists.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {teamMembers.map((m: any) => (
                  <div key={m.id} className="bg-card border border-border p-6 rounded-sm flex flex-col justify-between space-y-4 shadow-lg group relative">
                    {!m.active && (
                      <span className="absolute top-4 right-4 px-2 py-0.5 bg-secondary border border-border text-[9px] uppercase tracking-wider font-semibold text-muted rounded-sm">
                        Inactive
                      </span>
                    )}
                    <div className="space-y-4">
                      <div
                        className="aspect-square bg-cover bg-center border border-border rounded-sm shadow-md"
                        style={{ backgroundImage: `url('${m.imageUrl}')` }}
                      />
                      <div className="space-y-1">
                        <div className="flex items-center justify-between">
                          <h4 className="font-serif text-base font-bold text-foreground">{m.name}</h4>
                          <span className="font-mono text-[9px] text-accent/60">#{m.sortOrder}</span>
                        </div>
                        <span className="text-[9px] uppercase tracking-widest text-accent font-semibold block">{m.role}</span>
                        <p className="text-[10px] text-muted font-sans leading-normal font-light line-clamp-3 pt-2">
                          {m.bio}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-2 pt-2 border-t border-border">
                      <button
                        onClick={() => handleEditTeamClick(m)}
                        className="flex-1 py-2 bg-secondary hover:bg-accent/10 border border-border text-foreground hover:text-accent text-[9px] font-sans uppercase tracking-widest font-bold rounded-sm flex items-center justify-center gap-1 cursor-pointer transition-colors"
                      >
                        <Edit2 size={10} />
                        Edit
                      </button>
                      <button
                        onClick={() => {
                          setDeletingTeamId(m.id);
                          setIsTeamDeleteOpen(true);
                        }}
                        className="py-2 px-3 bg-red-500/10 hover:bg-red-500/20 border border-red-500/10 hover:border-red-500/35 text-red-400 rounded-sm flex items-center justify-center cursor-pointer transition-colors"
                        title="Delete team member"
                      >
                        <Trash2 size={10} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {/* ==========================================
            TAB 3: AWARDS & ACCOLADES
            ========================================== */}
        {activeTab === "awards" && (
          <>
            {isAwardsLoading ? (
              <div className="h-60 flex items-center justify-center">
                <Loader2 className="animate-spin text-accent" size={24} />
              </div>
            ) : awards.length === 0 ? (
              <div className="bg-card border border-border rounded-sm p-16 text-center shadow-lg">
                <Award className="mx-auto text-muted mb-4" size={32} />
                <span className="text-xs text-muted uppercase tracking-widest block mb-2">No award entries configured yet.</span>
                <p className="text-[10px] text-neutral-500 font-sans">Click "Add Award Entry" above to populate credentials.</p>
              </div>
            ) : (
              <div className="bg-card border border-border rounded-sm shadow-lg overflow-x-auto">
                <table className="w-full border-collapse text-left text-xs font-sans">
                  <thead>
                    <tr className="border-b border-border bg-secondary/50 text-[10px] uppercase tracking-wider text-accent">
                      <th className="p-4 font-bold">Sort</th>
                      <th className="p-4 font-bold">Year</th>
                      <th className="p-4 font-bold">Title</th>
                      <th className="p-4 font-bold">Category</th>
                      <th className="p-4 font-bold">Organization</th>
                      <th className="p-4 font-bold">Status</th>
                      <th className="p-4 font-bold text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {awards.map((a: any) => (
                      <tr key={a.id} className="hover:bg-secondary/20 transition-colors text-muted">
                        <td className="p-4 font-mono text-[10px] text-neutral-500">#{a.sortOrder}</td>
                        <td className="p-4 font-serif text-foreground font-bold">{a.year}</td>
                        <td className="p-4 font-bold text-foreground">{a.title}</td>
                        <td className="p-4">{a.category}</td>
                        <td className="p-4">{a.organization}</td>
                        <td className="p-4">
                          <span className={`px-2 py-0.5 rounded-sm text-[8px] font-mono font-bold uppercase tracking-wider border ${
                            a.active 
                              ? "bg-green-500/10 border-green-500/25 text-green-400"
                              : "bg-secondary border-border text-muted"
                          }`}>
                            {a.active ? "Active" : "Inactive"}
                          </span>
                        </td>
                        <td className="p-4 text-right">
                          <div className="inline-flex gap-2">
                            <button
                              onClick={() => handleEditAwardClick(a)}
                              className="p-1.5 bg-secondary hover:bg-accent/15 border border-border text-foreground hover:text-accent rounded-sm cursor-pointer"
                              title="Edit award"
                            >
                              <Edit2 size={10} />
                            </button>
                            <button
                              onClick={() => {
                                setDeletingAwardId(a.id);
                                setIsAwardDeleteOpen(true);
                              }}
                              className="p-1.5 bg-red-500/10 hover:bg-red-500/20 border border-red-500/10 hover:border-red-500/35 text-red-400 rounded-sm cursor-pointer"
                              title="Delete award"
                            >
                              <Trash2 size={10} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </>
        )}

        {/* ==========================================
            TEAM MEMBER MODAL
            ========================================== */}
        <AdminModal
          isOpen={isTeamFormOpen}
          onClose={() => setIsTeamFormOpen(false)}
          title={editingTeamMember ? "Edit Guild Member" : "Add Guild Member"}
          maxWidthClass="max-w-md"
        >
          <form onSubmit={onTeamSubmit} className="space-y-5">
            <ImageUploader
              label="Profile Image"
              value={teamForm.imageUrl}
              onChange={(url) => setTeamForm({ ...teamForm, imageUrl: url })}
            />

            <div className="flex flex-col space-y-1.5">
              <label className="text-[10px] uppercase tracking-wider text-muted font-sans font-medium">Name</label>
              <AdminInput
                type="text"
                value={teamForm.name}
                onChange={(e) => setTeamForm({ ...teamForm, name: e.target.value })}
                placeholder="e.g. Jay Prakash"
              />
            </div>

            <div className="flex flex-col space-y-1.5">
              <label className="text-[10px] uppercase tracking-wider text-muted font-sans font-medium">Designation / Role</label>
              <AdminInput
                type="text"
                value={teamForm.role}
                onChange={(e) => setTeamForm({ ...teamForm, role: e.target.value })}
                placeholder="e.g. Lead Storyteller / Editor"
              />
            </div>

            <div className="flex flex-col space-y-1.5">
              <label className="text-[10px] uppercase tracking-wider text-muted font-sans font-medium">Biography / Description</label>
              <AdminTextarea
                rows={4}
                value={teamForm.bio}
                onChange={(e) => setTeamForm({ ...teamForm, bio: e.target.value })}
                placeholder="Brief description about composition expertise..."
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col space-y-1.5">
                <label className="text-[10px] uppercase tracking-wider text-muted font-sans font-medium">Sort Order</label>
                <AdminInput
                  type="number"
                  value={teamForm.sortOrder}
                  onChange={(e) => setTeamForm({ ...teamForm, sortOrder: Number(e.target.value) })}
                />
              </div>
              <div className="flex flex-col space-y-1.5">
                <label className="text-[10px] uppercase tracking-wider text-muted font-sans font-medium">Status</label>
                <div className="flex items-center gap-2 pt-2">
                  <AdminCheckbox
                    id="team-active"
                    checked={teamForm.active}
                    onChange={(e) => setTeamForm({ ...teamForm, active: e.target.checked })}
                    label="Active Guild Member"
                  />
                </div>
              </div>
            </div>

            <div className="flex gap-3 pt-3">
              <AdminButton
                type="button"
                onClick={() => setIsTeamFormOpen(false)}
                variant="secondary"
                className="flex-1"
              >
                Cancel
              </AdminButton>
              <AdminButton
                type="submit"
                disabled={createTeamMutation.isPending || updateTeamMutation.isPending}
                className="flex-1"
              >
                {(createTeamMutation.isPending || updateTeamMutation.isPending) && (
                  <Loader2 className="animate-spin mr-1.5" size={12} />
                )}
                {editingTeamMember ? "Save Changes" : "Add Member"}
              </AdminButton>
            </div>
          </form>
        </AdminModal>

        {/* ==========================================
            AWARD MODAL
            ========================================== */}
        <AdminModal
          isOpen={isAwardFormOpen}
          onClose={() => setIsAwardFormOpen(false)}
          title={editingAward ? "Edit Award Entry" : "Add Award Entry"}
          maxWidthClass="max-w-md"
        >
          <form onSubmit={onAwardSubmit} className="space-y-5">
            <ImageUploader
              label="Award Trophy / Icon Image (Optional)"
              value={awardForm.imageUrl}
              onChange={(url) => setAwardForm({ ...awardForm, imageUrl: url })}
            />

            <div className="flex flex-col space-y-1.5">
              <label className="text-[10px] uppercase tracking-wider text-muted font-sans font-medium">Award Title</label>
              <AdminInput
                type="text"
                value={awardForm.title}
                onChange={(e) => setAwardForm({ ...awardForm, title: e.target.value })}
                placeholder="e.g. Top 10 Wedding Photographers"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col space-y-1.5">
                <label className="text-[10px] uppercase tracking-wider text-muted font-sans font-medium">Year</label>
                <AdminInput
                  type="text"
                  value={awardForm.year}
                  onChange={(e) => setAwardForm({ ...awardForm, year: e.target.value })}
                  placeholder="e.g. 2026"
                />
              </div>
              <div className="flex flex-col space-y-1.5">
                <label className="text-[10px] uppercase tracking-wider text-muted font-sans font-medium">Category</label>
                <AdminInput
                  type="text"
                  value={awardForm.category}
                  onChange={(e) => setAwardForm({ ...awardForm, category: e.target.value })}
                  placeholder="e.g. Fine-art Editorial"
                />
              </div>
            </div>

            <div className="flex flex-col space-y-1.5">
              <label className="text-[10px] uppercase tracking-wider text-muted font-sans font-medium">Organization</label>
              <AdminInput
                type="text"
                value={awardForm.organization}
                onChange={(e) => setAwardForm({ ...awardForm, organization: e.target.value })}
                placeholder="e.g. Better Photography"
              />
            </div>

            <div className="flex flex-col space-y-1.5">
              <label className="text-[10px] uppercase tracking-wider text-muted font-sans font-medium">Description (Optional)</label>
              <AdminTextarea
                rows={3}
                value={awardForm.description}
                onChange={(e) => setAwardForm({ ...awardForm, description: e.target.value })}
                placeholder="Details about the accolade or certificate..."
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col space-y-1.5">
                <label className="text-[10px] uppercase tracking-wider text-muted font-sans font-medium">Sort Order</label>
                <AdminInput
                  type="number"
                  value={awardForm.sortOrder}
                  onChange={(e) => setAwardForm({ ...awardForm, sortOrder: Number(e.target.value) })}
                />
              </div>
              <div className="flex flex-col space-y-1.5">
                <label className="text-[10px] uppercase tracking-wider text-muted font-sans font-medium">Status</label>
                <div className="flex items-center gap-2 pt-2">
                  <AdminCheckbox
                    id="award-active"
                    checked={awardForm.active}
                    onChange={(e) => setAwardForm({ ...awardForm, active: e.target.checked })}
                    label="Active Accolade"
                  />
                </div>
              </div>
            </div>

            <div className="flex gap-3 pt-3">
              <AdminButton
                type="button"
                onClick={() => setIsAwardFormOpen(false)}
                variant="secondary"
                className="flex-1"
              >
                Cancel
              </AdminButton>
              <AdminButton
                type="submit"
                disabled={createAwardMutation.isPending || updateAwardMutation.isPending}
                className="flex-1"
              >
                {(createAwardMutation.isPending || updateAwardMutation.isPending) && (
                  <Loader2 className="animate-spin mr-1.5" size={12} />
                )}
                {editingAward ? "Save Changes" : "Add Entry"}
              </AdminButton>
            </div>
          </form>
        </AdminModal>

        {/* Delete Team confirmation */}
        <ConfirmModal
          isOpen={isTeamDeleteOpen}
          title="Delete Team Member"
          message="Are you sure you want to delete this guild member? This will remove their record and photo from the about section."
          confirmLabel="Delete"
          isDanger={true}
          isLoading={deleteTeamMutation.isPending}
          onConfirm={handleDeleteTeamConfirm}
          onCancel={() => {
            setIsTeamDeleteOpen(false);
            setDeletingTeamId(null);
          }}
        />

        {/* Delete Award confirmation */}
        <ConfirmModal
          isOpen={isAwardDeleteOpen}
          title="Delete Award Entry"
          message="Are you sure you want to delete this accolade entry? This will remove it from the accolades log table."
          confirmLabel="Delete"
          isDanger={true}
          isLoading={deleteAwardMutation.isPending}
          onConfirm={handleDeleteAwardConfirm}
          onCancel={() => {
            setIsAwardDeleteOpen(false);
            setDeletingAwardId(null);
          }}
        />
      </div>
    </AdminLayout>
  );
}
