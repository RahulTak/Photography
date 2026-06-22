"use client";

import React, { useEffect, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { ImageUploader } from "@/components/admin/ImageUploader";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import axios from "axios";
import { Loader2, Save, CheckCircle, X, Plus } from "lucide-react";

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
});

type AboutFormInputs = z.infer<typeof aboutSchema>;

export default function AdminAboutPage() {
  const queryClient = useQueryClient();
  const [storyInputs, setStoryInputs] = useState<string[]>([""]);

  // Fetch current about copy
  const { data: aboutRes, isLoading } = useQuery({
    queryKey: ["adminAbout"],
    queryFn: async () => {
      const response = await axios.get("/api/about");
      return response.data;
    },
  });

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

  // Load database configs
  useEffect(() => {
    if (aboutRes?.data) {
      const data = aboutRes.data;
      setStoryInputs(data.founders?.storyParagraphs && data.founders.storyParagraphs.length > 0 ? data.founders.storyParagraphs : [""]);
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
      });
    }
  }, [aboutRes, reset]);

  // Update about copy mutation
  const updateMutation = useMutation({
    mutationFn: async (payload: any) => {
      const response = await axios.put("/api/about", payload);
      return response.data;
    },
    onSuccess: (res) => {
      queryClient.setQueryData(["adminAbout"], res);
      queryClient.invalidateQueries({ queryKey: ["about"] });
    },
  });

  const handleStoryChange = (index: number, val: string) => {
    const next = [...storyInputs];
    next[index] = val;
    setStoryInputs(next);
    setValue("founders.storyParagraphs", next.filter((p) => p.trim() !== ""));
  };

  const addStoryRow = () => {
    setStoryInputs([...storyInputs, ""]);
  };

  const removeStoryRow = (index: number) => {
    const next = storyInputs.filter((_, i) => i !== index);
    setStoryInputs(next.length === 0 ? [""] : next);
    setValue("founders.storyParagraphs", next.filter((p) => p.trim() !== ""));
  };

  const onSubmit = (data: AboutFormInputs) => {
    // Retain timeline and process unchanged since they are configured in DB but not editable in this simple form
    const payload = {
      ...data,
      timeline: aboutRes?.data?.timeline || [],
      process: aboutRes?.data?.process || [],
    };
    updateMutation.mutate(payload);
  };

  return (
    <AdminLayout>
      <div className="space-y-8">
        <div className="space-y-1">
          <span className="text-[10px] uppercase tracking-widest text-luxury-accent font-semibold">ABOUT</span>
          <h2 className="text-2xl md:text-3xl font-serif font-bold text-white">About Page Manager</h2>
        </div>

        {isLoading ? (
          <div className="h-60 flex items-center justify-center">
            <Loader2 className="animate-spin text-luxury-accent" size={24} />
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 max-w-3xl">
            {/* Success feedback Alert */}
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
            <div className="bg-[#151515] border border-white/5 p-6 rounded-sm space-y-6 shadow-lg">
              <h3 className="font-serif text-lg font-bold text-white border-b border-white/5 pb-3">Hero Banner</h3>
              
              <ImageUploader
                label="Hero Background Image"
                value={heroImage}
                onChange={(url) => setValue("hero.image", url, { shouldDirty: true })}
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {/* Hero Title */}
                <div className="flex flex-col space-y-1.5">
                  <label className="text-[10px] uppercase tracking-wider text-luxury-muted font-sans font-medium">Headline</label>
                  <input
                    type="text"
                    {...register("hero.title")}
                    className="bg-luxury-bg border border-white/5 focus:border-luxury-accent text-white px-4 py-2.5 rounded-sm text-xs font-sans outline-none"
                  />
                </div>

                {/* Hero Subtitle */}
                <div className="flex flex-col space-y-1.5">
                  <label className="text-[10px] uppercase tracking-wider text-luxury-muted font-sans font-medium">Subtitle</label>
                  <input
                    type="text"
                    {...register("hero.subtitle")}
                    className="bg-luxury-bg border border-white/5 focus:border-luxury-accent text-white px-4 py-2.5 rounded-sm text-xs font-sans outline-none"
                  />
                </div>
              </div>

              {/* Hero Slogan */}
              <div className="flex flex-col space-y-1.5">
                <label className="text-[10px] uppercase tracking-wider text-luxury-muted font-sans font-medium">Description</label>
                <textarea
                  rows={3}
                  {...register("hero.description")}
                  className="bg-luxury-bg border border-white/5 focus:border-luxury-accent text-white px-4 py-2.5 rounded-sm text-xs font-sans outline-none resize-none"
                />
              </div>
            </div>

            {/* Founder Story Copy Card */}
            <div className="bg-[#151515] border border-white/5 p-6 rounded-sm space-y-6 shadow-lg">
              <h3 className="font-serif text-lg font-bold text-white border-b border-white/5 pb-3">Founder Profile & Biography</h3>
              
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
                {/* Founder Name */}
                <div className="flex flex-col space-y-1.5">
                  <label className="text-[10px] uppercase tracking-wider text-luxury-muted font-sans font-medium">Founder Name</label>
                  <input
                    type="text"
                    {...register("founders.title")}
                    className="bg-luxury-bg border border-white/5 focus:border-luxury-accent text-white px-4 py-2.5 rounded-sm text-xs font-sans outline-none"
                  />
                </div>

                {/* Founder Subtitle */}
                <div className="flex flex-col space-y-1.5">
                  <label className="text-[10px] uppercase tracking-wider text-luxury-muted font-sans font-medium">Biographical Role / Title</label>
                  <input
                    type="text"
                    {...register("founders.subtitle")}
                    className="bg-luxury-bg border border-white/5 focus:border-luxury-accent text-white px-4 py-2.5 rounded-sm text-xs font-sans outline-none"
                  />
                </div>
              </div>

              {/* Biography Story Paragraphs */}
              <div className="space-y-3 pt-3 border-t border-white/5">
                <div className="flex justify-between items-center">
                  <label className="text-[10px] uppercase tracking-wider text-white font-sans font-bold">Biographical Story Paragraphs</label>
                  <button
                    type="button"
                    onClick={addStoryRow}
                    className="px-2.5 py-1.5 bg-luxury-accent/10 border border-luxury-accent/25 hover:bg-luxury-accent/20 text-luxury-accent text-[9px] uppercase tracking-wider rounded-sm cursor-pointer"
                  >
                    + Add Paragraph
                  </button>
                </div>

                <div className="space-y-3">
                  {storyInputs.map((para, idx) => (
                    <div key={idx} className="flex gap-2 items-start">
                      <textarea
                        rows={3}
                        value={para}
                        onChange={(e) => handleStoryChange(idx, e.target.value)}
                        className="flex-1 bg-luxury-bg border border-white/5 focus:border-luxury-accent text-white px-4 py-2 rounded-sm text-xs font-sans outline-none resize-none"
                        placeholder="Founder story paragraphs..."
                      />
                      <button
                        type="button"
                        onClick={() => removeStoryRow(idx)}
                        className="p-2.5 bg-neutral-900 border border-white/5 hover:border-red-500/30 text-luxury-muted hover:text-red-400 rounded-sm cursor-pointer"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Mission & Vision Copy Card */}
            <div className="bg-[#151515] border border-white/5 p-6 rounded-sm space-y-6 shadow-lg">
              <h3 className="font-serif text-lg font-bold text-white border-b border-white/5 pb-3">Mission & Vision</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Mission */}
                <div className="space-y-4">
                  <div className="flex flex-col space-y-1.5">
                    <label className="text-[10px] uppercase tracking-wider text-luxury-muted font-sans font-medium">Mission Title</label>
                    <input
                      type="text"
                      {...register("missionVision.mission.title")}
                      className="bg-luxury-bg border border-white/5 focus:border-luxury-accent text-white px-4 py-2.5 rounded-sm text-xs font-sans outline-none"
                    />
                  </div>
                  <div className="flex flex-col space-y-1.5">
                    <label className="text-[10px] uppercase tracking-wider text-luxury-muted font-sans font-medium">Mission Copy</label>
                    <textarea
                      rows={3}
                      {...register("missionVision.mission.description")}
                      className="bg-luxury-bg border border-white/5 focus:border-luxury-accent text-white px-4 py-2.5 rounded-sm text-xs font-sans outline-none resize-none"
                    />
                  </div>
                </div>

                {/* Vision */}
                <div className="space-y-4">
                  <div className="flex flex-col space-y-1.5">
                    <label className="text-[10px] uppercase tracking-wider text-luxury-muted font-sans font-medium">Vision Title</label>
                    <input
                      type="text"
                      {...register("missionVision.vision.title")}
                      className="bg-luxury-bg border border-white/5 focus:border-luxury-accent text-white px-4 py-2.5 rounded-sm text-xs font-sans outline-none"
                    />
                  </div>
                  <div className="flex flex-col space-y-1.5">
                    <label className="text-[10px] uppercase tracking-wider text-luxury-muted font-sans font-medium">Vision Copy</label>
                    <textarea
                      rows={3}
                      {...register("missionVision.vision.description")}
                      className="bg-luxury-bg border border-white/5 focus:border-luxury-accent text-white px-4 py-2.5 rounded-sm text-xs font-sans outline-none resize-none"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Action Bar */}
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={updateMutation.isPending || !isDirty}
                className="px-8 py-3.5 bg-luxury-accent hover:bg-luxury-hover disabled:bg-neutral-800 disabled:text-neutral-500 text-luxury-bg text-xs font-sans uppercase tracking-widest font-bold rounded-sm transition-all duration-300 flex items-center gap-2 cursor-pointer shadow-lg"
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
              </button>
            </div>
          </form>
        )}
      </div>
    </AdminLayout>
  );
}
