"use client";

import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { ImageUploader } from "@/components/admin/ImageUploader";
import { useHomeContent, useUpdateHomeContent } from "@/hooks/useHomeContent";
import { Loader2, Save, CheckCircle } from "lucide-react";
import { AdminInput } from "@/components/admin/ui/admin-input";
import { AdminTextarea } from "@/components/admin/ui/admin-textarea";
import { AdminButton } from "@/components/admin/ui/admin-button";
import { AdminCard } from "@/components/admin/ui/admin-card";

// Homepage validation schema
const homeContentSchema = z.object({
  hero: z.object({
    title: z.string().min(2, { message: "Hero title is required." }),
    subtitle: z.string().min(2, { message: "Hero subtitle is required." }),
    description: z.string().min(10, { message: "Hero description must be at least 10 characters." }),
    ctaPrimary: z.string().min(2, { message: "Primary button CTA label is required." }),
    ctaSecondary: z.string().min(2, { message: "Secondary button CTA label is required." }),
    videoPlaceholderImg: z.string().min(5, { message: "Hero background image asset is required." }),
  }),
  aboutPreview: z.object({
    tag: z.string().min(2, { message: "About preview tag label is required." }),
    title: z.string().min(2, { message: "About preview heading is required." }),
    description: z.string().min(10, { message: "About preview story description is required." }),
    founders: z.string().min(2, { message: "Founder name is required." }),
    foundersTitle: z.string().min(2, { message: "Founder role title is required." }),
    portraitImg: z.string().min(5, { message: "Founder portrait image asset is required." }),
    ctaText: z.string().min(2, { message: "About link text label is required." }),
  }),
  whyChooseUs: z.object({
    tag: z.string().min(2, { message: "Why choose tag label is required." }),
    title: z.string().min(2, { message: "Why choose heading is required." }),
  }),
});

type HomeContentInputs = z.infer<typeof homeContentSchema>;

export default function AdminHomePage() {
  const { data: homeContentRes, isLoading } = useHomeContent();
  const updateMutation = useUpdateHomeContent();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors, isDirty },
  } = useForm<HomeContentInputs>({
    resolver: zodResolver(homeContentSchema),
  });

  const heroImage = watch("hero.videoPlaceholderImg");
  const aboutPortrait = watch("aboutPreview.portraitImg");

  // Load database configs
  useEffect(() => {
    if (homeContentRes) {
      reset({
        hero: {
          title: homeContentRes.hero?.title || "",
          subtitle: homeContentRes.hero?.subtitle || "",
          description: homeContentRes.hero?.description || "",
          ctaPrimary: homeContentRes.hero?.ctaPrimary || "View Portfolio",
          ctaSecondary: homeContentRes.hero?.ctaSecondary || "Book Consultation",
          videoPlaceholderImg: homeContentRes.hero?.videoPlaceholderImg || "",
        },
        aboutPreview: {
          tag: homeContentRes.aboutPreview?.tag || "THE SPARK",
          title: homeContentRes.aboutPreview?.title || "",
          description: homeContentRes.aboutPreview?.description || "",
          founders: homeContentRes.aboutPreview?.founders || "Jay Prakash",
          foundersTitle: homeContentRes.aboutPreview?.foundersTitle || "Lead Storyteller",
          portraitImg: homeContentRes.aboutPreview?.portraitImg || "",
          ctaText: homeContentRes.aboutPreview?.ctaText || "Discover Our Story",
        },
        whyChooseUs: {
          tag: homeContentRes.whyChooseUs?.tag || "OUR CRAFT",
          title: homeContentRes.whyChooseUs?.title || "",
        },
      });
    }
  }, [homeContentRes, reset]);

  const onSubmit = (data: HomeContentInputs) => {
    // Retain features and stats unchanged since they are configured in DB but not editable in this simple form
    const payload = {
      ...data,
      whyChooseUs: {
        ...data.whyChooseUs,
        features: homeContentRes?.whyChooseUs?.features || [],
      },
      stats: homeContentRes?.stats || [],
    };
    updateMutation.mutate(payload);
  };

  return (
    <AdminLayout>
      <div className="space-y-8">
        <div className="space-y-1">
          <span className="text-[10px] uppercase tracking-widest text-accent font-semibold">HOMEPAGE</span>
          <h2 className="text-2xl md:text-3xl font-serif font-bold text-foreground">Homepage Content Manager</h2>
        </div>

        {isLoading ? (
          <div className="h-60 flex items-center justify-center">
            <Loader2 className="animate-spin text-accent" size={24} />
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 max-w-3xl">
            {/* Success feedback alert */}
            {updateMutation.isSuccess && (
              <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-sm flex items-start gap-3 text-green-400 text-xs font-sans leading-relaxed">
                <svg className="shrink-0 mt-0.5 w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                  <path d="m22 4-10 10.01-3-3" />
                </svg>
                <div>
                  <span className="font-semibold block mb-0.5">Homepage Updated</span>
                  Homepage details saved. Reload the homepage to see revisions live.
                </div>
              </div>
            )}

            {/* Hero Section copy */}
            <AdminCard title="Hero Section">
              <ImageUploader
                label="Hero Background Media Asset"
                value={heroImage}
                onChange={(url) => setValue("hero.videoPlaceholderImg", url, { shouldDirty: true })}
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {/* Hero Title */}
                <div className="flex flex-col space-y-1.5">
                  <label className="text-[10px] uppercase tracking-wider text-muted font-sans font-medium">Hero Headline</label>
                  <AdminInput
                    type="text"
                    {...register("hero.title")}
                  />
                  {errors.hero?.title && <p className="text-[10px] text-red-500 font-sans mt-1">{errors.hero.title.message}</p>}
                </div>

                {/* Hero Subtitle */}
                <div className="flex flex-col space-y-1.5">
                  <label className="text-[10px] uppercase tracking-wider text-muted font-sans font-medium">Hero Subtitle</label>
                  <AdminInput
                    type="text"
                    {...register("hero.subtitle")}
                  />
                  {errors.hero?.subtitle && <p className="text-[10px] text-red-500 font-sans mt-1">{errors.hero.subtitle.message}</p>}
                </div>
              </div>

              {/* Hero Slogan */}
              <div className="flex flex-col space-y-1.5">
                <label className="text-[10px] uppercase tracking-wider text-muted font-sans font-medium">Hero Description</label>
                <AdminTextarea
                  rows={3}
                  {...register("hero.description")}
                />
                {errors.hero?.description && <p className="text-[10px] text-red-500 font-sans mt-1">{errors.hero.description.message}</p>}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {/* Hero CTA Primary */}
                <div className="flex flex-col space-y-1.5">
                  <label className="text-[10px] uppercase tracking-wider text-muted font-sans font-medium">Primary CTA Label</label>
                  <AdminInput
                    type="text"
                    {...register("hero.ctaPrimary")}
                  />
                  {errors.hero?.ctaPrimary && <p className="text-[10px] text-red-500 font-sans mt-1">{errors.hero.ctaPrimary.message}</p>}
                </div>

                {/* Hero CTA Secondary */}
                <div className="flex flex-col space-y-1.5">
                  <label className="text-[10px] uppercase tracking-wider text-muted font-sans font-medium">Secondary CTA Label</label>
                  <AdminInput
                    type="text"
                    {...register("hero.ctaSecondary")}
                  />
                  {errors.hero?.ctaSecondary && <p className="text-[10px] text-red-500 font-sans mt-1">{errors.hero.ctaSecondary.message}</p>}
                </div>
              </div>
            </AdminCard>

            {/* About Preview Section copy */}
            <AdminCard title="About Story Preview">
              <ImageUploader
                label="About Preview Side Image Portrait"
                value={aboutPortrait}
                onChange={(url) => setValue("aboutPreview.portraitImg", url, { shouldDirty: true })}
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {/* About Tag */}
                <div className="flex flex-col space-y-1.5">
                  <label className="text-[10px] uppercase tracking-wider text-muted font-sans font-medium">About Tagline</label>
                  <AdminInput
                    type="text"
                    {...register("aboutPreview.tag")}
                  />
                  {errors.aboutPreview?.tag && <p className="text-[10px] text-red-500 font-sans mt-1">{errors.aboutPreview.tag.message}</p>}
                </div>

                {/* About Link text */}
                <div className="flex flex-col space-y-1.5">
                  <label className="text-[10px] uppercase tracking-wider text-muted font-sans font-medium">Link Button Label</label>
                  <AdminInput
                    type="text"
                    {...register("aboutPreview.ctaText")}
                  />
                  {errors.aboutPreview?.ctaText && <p className="text-[10px] text-red-500 font-sans mt-1">{errors.aboutPreview.ctaText.message}</p>}
                </div>
              </div>

              {/* About Title */}
              <div className="flex flex-col space-y-1.5">
                <label className="text-[10px] uppercase tracking-wider text-muted font-sans font-medium">About Heading</label>
                <AdminInput
                  type="text"
                  {...register("aboutPreview.title")}
                />
                {errors.aboutPreview?.title && <p className="text-[10px] text-red-500 font-sans mt-1">{errors.aboutPreview.title.message}</p>}
              </div>

              {/* About Description */}
              <div className="flex flex-col space-y-1.5">
                <label className="text-[10px] uppercase tracking-wider text-muted font-sans font-medium">Story Description</label>
                <AdminTextarea
                  rows={4}
                  {...register("aboutPreview.description")}
                />
                {errors.aboutPreview?.description && <p className="text-[10px] text-red-500 font-sans mt-1">{errors.aboutPreview.description.message}</p>}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {/* Founder Name */}
                <div className="flex flex-col space-y-1.5">
                  <label className="text-[10px] uppercase tracking-wider text-muted font-sans font-medium">Founder Representative</label>
                  <AdminInput
                    type="text"
                    {...register("aboutPreview.founders")}
                  />
                  {errors.aboutPreview?.founders && <p className="text-[10px] text-red-500 font-sans mt-1">{errors.aboutPreview.founders.message}</p>}
                </div>

                {/* Founder Title */}
                <div className="flex flex-col space-y-1.5">
                  <label className="text-[10px] uppercase tracking-wider text-muted font-sans font-medium">Founder Role</label>
                  <AdminInput
                    type="text"
                    {...register("aboutPreview.foundersTitle")}
                  />
                  {errors.aboutPreview?.foundersTitle && <p className="text-[10px] text-red-500 font-sans mt-1">{errors.aboutPreview.foundersTitle.message}</p>}
                </div>
              </div>
            </AdminCard>

            {/* Why Choose Us copy */}
            <AdminCard title="Why Choose Us">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {/* Why Choose Tag */}
                <div className="flex flex-col space-y-1.5">
                  <label className="text-[10px] uppercase tracking-wider text-muted font-sans font-medium">Section Tagline</label>
                  <AdminInput
                    type="text"
                    {...register("whyChooseUs.tag")}
                  />
                  {errors.whyChooseUs?.tag && <p className="text-[10px] text-red-500 font-sans mt-1">{errors.whyChooseUs.tag.message}</p>}
                </div>

                {/* Why Choose Title */}
                <div className="flex flex-col space-y-1.5">
                  <label className="text-[10px] uppercase tracking-wider text-muted font-sans font-medium">Section Heading</label>
                  <AdminInput
                    type="text"
                    {...register("whyChooseUs.title")}
                  />
                  {errors.whyChooseUs?.title && <p className="text-[10px] text-red-500 font-sans mt-1">{errors.whyChooseUs.title.message}</p>}
                </div>
              </div>
            </AdminCard>

            {/* Submit Action */}
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
                    Save Homepage Copy
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
