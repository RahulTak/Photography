"use client";

import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { useAdminSettings, useUpdateAdminSettings } from "@/hooks/admin/useAdmin";
import { Loader2, Save, CheckCircle } from "lucide-react";

// Settings validation schema
const settingsSchema = z.object({
  studioName: z.string().min(2, { message: "Studio name must be at least 2 characters." }),
  address: z.string().min(5, { message: "Address is required." }),
  telephone: z.string().min(10, { message: "Enter a valid telephone number." }),
  email: z.string().email({ message: "Enter a valid contact email." }),
  instagram: z.string().url({ message: "Must be a valid Instagram URL." }).optional().or(z.literal("")),
  youtube: z.string().url({ message: "Must be a valid YouTube URL." }).optional().or(z.literal("")),
  facebook: z.string().url({ message: "Must be a valid Facebook URL." }).optional().or(z.literal("")),
  seoTitle: z.string().min(2, { message: "SEO default title is required." }),
  seoDescription: z.string().min(10, { message: "SEO description should be at least 10 characters." }),
});

type SettingsFormInputs = z.infer<typeof settingsSchema>;

export default function AdminSettingsPage() {
  const { data: settingsRes, isLoading } = useAdminSettings();
  const updateMutation = useUpdateAdminSettings();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm<SettingsFormInputs>({
    resolver: zodResolver(settingsSchema),
    defaultValues: {
      studioName: "JP Photography",
      address: "Near Sharda Bal School, Nagaur, Raj 341001",
      telephone: "+91 98860 12345",
      email: "enquire@jpphotography.in",
      instagram: "",
      youtube: "",
      facebook: "",
      seoTitle: "JP Photography | Luxury Wedding Storyteller",
      seoDescription: "Multi-award-winning luxury fine-art photography studio based in Rajasthan.",
    },
  });

  // Reset form when settings query loads database configs
  useEffect(() => {
    if (settingsRes?.data) {
      const data = settingsRes.data;
      reset({
        studioName: data.studioName || "JP Click Studio",
        address: data.address || "Near Sharda Bal School, Nagaur, Raj 341001",
        telephone: data.telephone || "+91 98860 12345",
        email: data.email || "enquire@jpphotography.in",
        instagram: data.instagram || "https://instagram.com",
        youtube: data.youtube || "https://youtube.com",
        facebook: data.facebook || "https://facebook.com",
        seoTitle: data.seoTitle || "JP Photography | Fine Art Stories",
        seoDescription: data.seoDescription || "Luxury wedding photographers based in Rajasthan.",
      });
    }
  }, [settingsRes, reset]);

  const onSubmit = (data: SettingsFormInputs) => {
    updateMutation.mutate(data);
  };

  return (
    <AdminLayout>
      <div className="space-y-8">
        {/* Header Controls */}
        <div className="space-y-1">
          <span className="text-[10px] uppercase tracking-widest text-luxury-accent font-semibold">CONSOLE</span>
          <h2 className="text-2xl md:text-3xl font-serif font-bold text-white">System Settings</h2>
        </div>

        {isLoading ? (
          <div className="h-60 flex items-center justify-center">
            <Loader2 className="animate-spin text-luxury-accent" size={24} />
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 max-w-3xl">
            {/* Success Feedback Alert */}
            {updateMutation.isSuccess && (
              <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-sm flex items-start gap-3 text-green-400 text-xs font-sans leading-relaxed">
                <CheckCircle size={16} className="shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold block mb-0.5">Configuration Saved</span>
                  Site settings have been written to the database successfully and will reflect site-wide.
                </div>
              </div>
            )}

            {/* General Info Card */}
            <div className="bg-[#151515] border border-white/5 p-6 rounded-sm space-y-6 shadow-lg">
              <h3 className="font-serif text-lg font-bold text-white border-b border-white/5 pb-3">
                Studio Contact Information
              </h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {/* Studio Name */}
                <div className="flex flex-col space-y-1.5">
                  <label className="text-[10px] uppercase tracking-wider text-luxury-muted font-sans font-medium">Studio Name</label>
                  <input
                    type="text"
                    {...register("studioName")}
                    className="bg-luxury-bg border border-white/5 focus:border-luxury-accent text-white px-4 py-2.5 rounded-sm text-xs font-sans outline-none transition-colors"
                  />
                  {errors.studioName && (
                    <p className="text-[10px] text-red-500 font-sans mt-1">{errors.studioName.message}</p>
                  )}
                </div>

                {/* Telephone */}
                <div className="flex flex-col space-y-1.5">
                  <label className="text-[10px] uppercase tracking-wider text-luxury-muted font-sans font-medium">Studio Hotline</label>
                  <input
                    type="text"
                    {...register("telephone")}
                    className="bg-luxury-bg border border-white/5 focus:border-luxury-accent text-white px-4 py-2.5 rounded-sm text-xs font-sans outline-none transition-colors"
                  />
                  {errors.telephone && (
                    <p className="text-[10px] text-red-500 font-sans mt-1">{errors.telephone.message}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {/* Email */}
                <div className="flex flex-col space-y-1.5">
                  <label className="text-[10px] uppercase tracking-wider text-luxury-muted font-sans font-medium">Public Email</label>
                  <input
                    type="email"
                    {...register("email")}
                    className="bg-luxury-bg border border-white/5 focus:border-luxury-accent text-white px-4 py-2.5 rounded-sm text-xs font-sans outline-none transition-colors"
                  />
                  {errors.email && (
                    <p className="text-[10px] text-red-500 font-sans mt-1">{errors.email.message}</p>
                  )}
                </div>

                {/* Address */}
                <div className="flex flex-col space-y-1.5">
                  <label className="text-[10px] uppercase tracking-wider text-luxury-muted font-sans font-medium">HQ Address</label>
                  <input
                    type="text"
                    {...register("address")}
                    className="bg-luxury-bg border border-white/5 focus:border-luxury-accent text-white px-4 py-2.5 rounded-sm text-xs font-sans outline-none transition-colors"
                  />
                  {errors.address && (
                    <p className="text-[10px] text-red-500 font-sans mt-1">{errors.address.message}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Socials Config Card */}
            <div className="bg-[#151515] border border-white/5 p-6 rounded-sm space-y-6 shadow-lg">
              <h3 className="font-serif text-lg font-bold text-white border-b border-white/5 pb-3">
                Social Accounts URL
              </h3>

              <div className="space-y-4">
                {/* Instagram */}
                <div className="flex flex-col space-y-1.5">
                  <label className="text-[10px] uppercase tracking-wider text-luxury-muted font-sans font-medium">Instagram Account</label>
                  <input
                    type="text"
                    {...register("instagram")}
                    placeholder="https://instagram.com/jpphotography"
                    className="bg-luxury-bg border border-white/5 focus:border-luxury-accent text-white px-4 py-2.5 rounded-sm text-xs font-sans outline-none transition-colors"
                  />
                  {errors.instagram && (
                    <p className="text-[10px] text-red-500 font-sans mt-1">{errors.instagram.message}</p>
                  )}
                </div>

                {/* YouTube */}
                <div className="flex flex-col space-y-1.5">
                  <label className="text-[10px] uppercase tracking-wider text-luxury-muted font-sans font-medium">YouTube Channel</label>
                  <input
                    type="text"
                    {...register("youtube")}
                    placeholder="https://youtube.com/@jpphotography"
                    className="bg-luxury-bg border border-white/5 focus:border-luxury-accent text-white px-4 py-2.5 rounded-sm text-xs font-sans outline-none transition-colors"
                  />
                  {errors.youtube && (
                    <p className="text-[10px] text-red-500 font-sans mt-1">{errors.youtube.message}</p>
                  )}
                </div>

                {/* Facebook */}
                <div className="flex flex-col space-y-1.5">
                  <label className="text-[10px] uppercase tracking-wider text-luxury-muted font-sans font-medium">Facebook Page</label>
                  <input
                    type="text"
                    {...register("facebook")}
                    placeholder="https://facebook.com/jpphotography"
                    className="bg-luxury-bg border border-white/5 focus:border-luxury-accent text-white px-4 py-2.5 rounded-sm text-xs font-sans outline-none transition-colors"
                  />
                  {errors.facebook && (
                    <p className="text-[10px] text-red-500 font-sans mt-1">{errors.facebook.message}</p>
                  )}
                </div>
              </div>
            </div>

            {/* SEO Config Card */}
            <div className="bg-[#151515] border border-white/5 p-6 rounded-sm space-y-6 shadow-lg">
              <h3 className="font-serif text-lg font-bold text-white border-b border-white/5 pb-3">
                SEO Default Metadata
              </h3>

              <div className="space-y-4">
                {/* SEO Title */}
                <div className="flex flex-col space-y-1.5">
                  <label className="text-[10px] uppercase tracking-wider text-luxury-muted font-sans font-medium">SEO Page Title</label>
                  <input
                    type="text"
                    {...register("seoTitle")}
                    className="bg-luxury-bg border border-white/5 focus:border-luxury-accent text-white px-4 py-2.5 rounded-sm text-xs font-sans outline-none transition-colors"
                  />
                  {errors.seoTitle && (
                    <p className="text-[10px] text-red-500 font-sans mt-1">{errors.seoTitle.message}</p>
                  )}
                </div>

                {/* SEO Description */}
                <div className="flex flex-col space-y-1.5">
                  <label className="text-[10px] uppercase tracking-wider text-luxury-muted font-sans font-medium">SEO Meta Description</label>
                  <textarea
                    rows={4}
                    {...register("seoDescription")}
                    className="bg-luxury-bg border border-white/5 focus:border-luxury-accent text-white px-4 py-2.5 rounded-sm text-xs font-sans outline-none resize-none transition-colors"
                  />
                  {errors.seoDescription && (
                    <p className="text-[10px] text-red-500 font-sans mt-1">{errors.seoDescription.message}</p>
                  )}
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
                    Saving...
                  </>
                ) : (
                  <>
                    <Save size={14} />
                    Save Settings
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
