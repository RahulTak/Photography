"use client";

import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { useAdminSettings, useUpdateAdminSettings } from "@/hooks/admin/useAdmin";
import { Loader2, Save, CheckCircle } from "lucide-react";
import { AdminInput } from "@/components/admin/ui/admin-input";
import { AdminTextarea } from "@/components/admin/ui/admin-textarea";
import { AdminButton } from "@/components/admin/ui/admin-button";
import { AdminCard } from "@/components/admin/ui/admin-card";

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
      studioName: "JP Click Studio",
      address: "Near Sharda Bal School, Nagaur, Raj 341001",
      telephone: "+91 88245 95859",
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
        telephone: data.telephone || "+91 88245 95859",
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
          <span className="text-[10px] uppercase tracking-widest text-accent font-semibold">CONSOLE</span>
          <h2 className="text-2xl md:text-3xl font-serif font-bold text-foreground">System Settings</h2>
        </div>

        {isLoading ? (
          <div className="h-60 flex items-center justify-center">
            <Loader2 className="animate-spin text-accent" size={24} />
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
            <AdminCard title="Studio Contact Information">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {/* Studio Name */}
                <div className="flex flex-col space-y-1.5">
                  <label className="text-[10px] uppercase tracking-wider text-muted font-sans font-medium">Studio Name</label>
                  <AdminInput
                    type="text"
                    {...register("studioName")}
                  />
                  {errors.studioName && (
                    <p className="text-[10px] text-red-500 font-sans mt-1">{errors.studioName.message}</p>
                  )}
                </div>

                {/* Telephone */}
                <div className="flex flex-col space-y-1.5">
                  <label className="text-[10px] uppercase tracking-wider text-muted font-sans font-medium">Studio Hotline</label>
                  <AdminInput
                    type="text"
                    {...register("telephone")}
                  />
                  {errors.telephone && (
                    <p className="text-[10px] text-red-500 font-sans mt-1">{errors.telephone.message}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {/* Email */}
                <div className="flex flex-col space-y-1.5">
                  <label className="text-[10px] uppercase tracking-wider text-muted font-sans font-medium">Public Email</label>
                  <AdminInput
                    type="email"
                    {...register("email")}
                  />
                  {errors.email && (
                    <p className="text-[10px] text-red-500 font-sans mt-1">{errors.email.message}</p>
                  )}
                </div>

                {/* Address */}
                <div className="flex flex-col space-y-1.5">
                  <label className="text-[10px] uppercase tracking-wider text-muted font-sans font-medium">HQ Address</label>
                  <AdminInput
                    type="text"
                    {...register("address")}
                  />
                  {errors.address && (
                    <p className="text-[10px] text-red-500 font-sans mt-1">{errors.address.message}</p>
                  )}
                </div>
              </div>
            </AdminCard>

            {/* Socials Config Card */}
            <AdminCard title="Social Accounts URL">
              <div className="space-y-4">
                {/* Instagram */}
                <div className="flex flex-col space-y-1.5">
                  <label className="text-[10px] uppercase tracking-wider text-muted font-sans font-medium">Instagram Account</label>
                  <AdminInput
                    type="text"
                    {...register("instagram")}
                    placeholder="https://instagram.com/jpphotography"
                  />
                  {errors.instagram && (
                    <p className="text-[10px] text-red-500 font-sans mt-1">{errors.instagram.message}</p>
                  )}
                </div>

                {/* YouTube */}
                <div className="flex flex-col space-y-1.5">
                  <label className="text-[10px] uppercase tracking-wider text-muted font-sans font-medium">YouTube Channel</label>
                  <AdminInput
                    type="text"
                    {...register("youtube")}
                    placeholder="https://youtube.com/@jpphotography"
                  />
                  {errors.youtube && (
                    <p className="text-[10px] text-red-500 font-sans mt-1">{errors.youtube.message}</p>
                  )}
                </div>

                {/* Facebook */}
                <div className="flex flex-col space-y-1.5">
                  <label className="text-[10px] uppercase tracking-wider text-muted font-sans font-medium">Facebook Page</label>
                  <AdminInput
                    type="text"
                    {...register("facebook")}
                    placeholder="https://facebook.com/jpphotography"
                  />
                  {errors.facebook && (
                    <p className="text-[10px] text-red-500 font-sans mt-1">{errors.facebook.message}</p>
                  )}
                </div>
              </div>
            </AdminCard>

            {/* SEO Config Card */}
            <AdminCard title="SEO Default Metadata">
              <div className="space-y-4">
                {/* SEO Title */}
                <div className="flex flex-col space-y-1.5">
                  <label className="text-[10px] uppercase tracking-wider text-muted font-sans font-medium">SEO Page Title</label>
                  <AdminInput
                    type="text"
                    {...register("seoTitle")}
                  />
                  {errors.seoTitle && (
                    <p className="text-[10px] text-red-500 font-sans mt-1">{errors.seoTitle.message}</p>
                  )}
                </div>

                {/* SEO Description */}
                <div className="flex flex-col space-y-1.5">
                  <label className="text-[10px] uppercase tracking-wider text-muted font-sans font-medium">SEO Meta Description</label>
                  <AdminTextarea
                    rows={4}
                    {...register("seoDescription")}
                  />
                  {errors.seoDescription && (
                    <p className="text-[10px] text-red-500 font-sans mt-1">{errors.seoDescription.message}</p>
                  )}
                </div>
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
                    Saving...
                  </>
                ) : (
                  <>
                    <Save size={14} />
                    Save Settings
                  </>
                )}
              </AdminButton>
            </div>
          </form>
        )}
      </div>
    </AdminLayout>
  );
}
