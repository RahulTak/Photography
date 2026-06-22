"use client";

import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { ImageUploader } from "@/components/admin/ImageUploader";
import { useHomeContent, useUpdateHomeContent } from "@/hooks/useHomeContent";
import { Loader2, Save, CheckCircle } from "lucide-react";

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
          <span className="text-[10px] uppercase tracking-widest text-luxury-accent font-semibold">HOMEPAGE</span>
          <h2 className="text-2xl md:text-3xl font-serif font-bold text-white">Homepage Content Manager</h2>
        </div>

        {isLoading ? (
          <div className="h-60 flex items-center justify-center">
            <Loader2 className="animate-spin text-luxury-accent" size={24} />
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
            <div className="bg-[#151515] border border-white/5 p-6 rounded-sm space-y-6 shadow-lg">
              <h3 className="font-serif text-lg font-bold text-white border-b border-white/5 pb-3">Hero Section</h3>
              
              <ImageUploader
                label="Hero Background Media Asset"
                value={heroImage}
                onChange={(url) => setValue("hero.videoPlaceholderImg", url, { shouldDirty: true })}
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {/* Hero Title */}
                <div className="flex flex-col space-y-1.5">
                  <label className="text-[10px] uppercase tracking-wider text-luxury-muted font-sans font-medium">Hero Headline</label>
                  <input
                    type="text"
                    {...register("hero.title")}
                    className="bg-luxury-bg border border-white/5 focus:border-luxury-accent text-white px-4 py-2.5 rounded-sm text-xs font-sans outline-none transition-colors"
                  />
                  {errors.hero?.title && <p className="text-[10px] text-red-500 font-sans mt-1">{errors.hero.title.message}</p>}
                </div>

                {/* Hero Subtitle */}
                <div className="flex flex-col space-y-1.5">
                  <label className="text-[10px] uppercase tracking-wider text-luxury-muted font-sans font-medium">Hero Subtitle</label>
                  <input
                    type="text"
                    {...register("hero.subtitle")}
                    className="bg-luxury-bg border border-white/5 focus:border-luxury-accent text-white px-4 py-2.5 rounded-sm text-xs font-sans outline-none transition-colors"
                  />
                  {errors.hero?.subtitle && <p className="text-[10px] text-red-500 font-sans mt-1">{errors.hero.subtitle.message}</p>}
                </div>
              </div>

              {/* Hero Slogan */}
              <div className="flex flex-col space-y-1.5">
                <label className="text-[10px] uppercase tracking-wider text-luxury-muted font-sans font-medium">Hero Description</label>
                <textarea
                  rows={3}
                  {...register("hero.description")}
                  className="bg-luxury-bg border border-white/5 focus:border-luxury-accent text-white px-4 py-2.5 rounded-sm text-xs font-sans outline-none resize-none transition-colors"
                />
                {errors.hero?.description && <p className="text-[10px] text-red-500 font-sans mt-1">{errors.hero.description.message}</p>}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {/* Hero CTA Primary */}
                <div className="flex flex-col space-y-1.5">
                  <label className="text-[10px] uppercase tracking-wider text-luxury-muted font-sans font-medium">Primary CTA Label</label>
                  <input
                    type="text"
                    {...register("hero.ctaPrimary")}
                    className="bg-luxury-bg border border-white/5 focus:border-luxury-accent text-white px-4 py-2.5 rounded-sm text-xs font-sans outline-none transition-colors"
                  />
                  {errors.hero?.ctaPrimary && <p className="text-[10px] text-red-500 font-sans mt-1">{errors.hero.ctaPrimary.message}</p>}
                </div>

                {/* Hero CTA Secondary */}
                <div className="flex flex-col space-y-1.5">
                  <label className="text-[10px] uppercase tracking-wider text-luxury-muted font-sans font-medium">Secondary CTA Label</label>
                  <input
                    type="text"
                    {...register("hero.ctaSecondary")}
                    className="bg-luxury-bg border border-white/5 focus:border-luxury-accent text-white px-4 py-2.5 rounded-sm text-xs font-sans outline-none transition-colors"
                  />
                  {errors.hero?.ctaSecondary && <p className="text-[10px] text-red-500 font-sans mt-1">{errors.hero.ctaSecondary.message}</p>}
                </div>
              </div>
            </div>

            {/* About Preview Section copy */}
            <div className="bg-[#151515] border border-white/5 p-6 rounded-sm space-y-6 shadow-lg">
              <h3 className="font-serif text-lg font-bold text-white border-b border-white/5 pb-3">About Story Preview</h3>

              <ImageUploader
                label="About Preview Side Image Portrait"
                value={aboutPortrait}
                onChange={(url) => setValue("aboutPreview.portraitImg", url, { shouldDirty: true })}
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {/* About Tag */}
                <div className="flex flex-col space-y-1.5">
                  <label className="text-[10px] uppercase tracking-wider text-luxury-muted font-sans font-medium">About Tagline</label>
                  <input
                    type="text"
                    {...register("aboutPreview.tag")}
                    className="bg-luxury-bg border border-white/5 focus:border-luxury-accent text-white px-4 py-2.5 rounded-sm text-xs font-sans outline-none transition-colors"
                  />
                  {errors.aboutPreview?.tag && <p className="text-[10px] text-red-500 font-sans mt-1">{errors.aboutPreview.tag.message}</p>}
                </div>

                {/* About Link text */}
                <div className="flex flex-col space-y-1.5">
                  <label className="text-[10px] uppercase tracking-wider text-luxury-muted font-sans font-medium">Link Button Label</label>
                  <input
                    type="text"
                    {...register("aboutPreview.ctaText")}
                    className="bg-luxury-bg border border-white/5 focus:border-luxury-accent text-white px-4 py-2.5 rounded-sm text-xs font-sans outline-none transition-colors"
                  />
                  {errors.aboutPreview?.ctaText && <p className="text-[10px] text-red-500 font-sans mt-1">{errors.aboutPreview.ctaText.message}</p>}
                </div>
              </div>

              {/* About Title */}
              <div className="flex flex-col space-y-1.5">
                <label className="text-[10px] uppercase tracking-wider text-luxury-muted font-sans font-medium">About Heading</label>
                <input
                  type="text"
                  {...register("aboutPreview.title")}
                  className="bg-luxury-bg border border-white/5 focus:border-luxury-accent text-white px-4 py-2.5 rounded-sm text-xs font-sans outline-none transition-colors"
                />
                {errors.aboutPreview?.title && <p className="text-[10px] text-red-500 font-sans mt-1">{errors.aboutPreview.title.message}</p>}
              </div>

              {/* About Description */}
              <div className="flex flex-col space-y-1.5">
                <label className="text-[10px] uppercase tracking-wider text-luxury-muted font-sans font-medium">Story Description</label>
                <textarea
                  rows={4}
                  {...register("aboutPreview.description")}
                  className="bg-luxury-bg border border-white/5 focus:border-luxury-accent text-white px-4 py-2.5 rounded-sm text-xs font-sans outline-none resize-none transition-colors"
                />
                {errors.aboutPreview?.description && <p className="text-[10px] text-red-500 font-sans mt-1">{errors.aboutPreview.description.message}</p>}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {/* Founder Name */}
                <div className="flex flex-col space-y-1.5">
                  <label className="text-[10px] uppercase tracking-wider text-luxury-muted font-sans font-medium">Founder Representative</label>
                  <input
                    type="text"
                    {...register("aboutPreview.founders")}
                    className="bg-luxury-bg border border-white/5 focus:border-luxury-accent text-white px-4 py-2.5 rounded-sm text-xs font-sans outline-none transition-colors"
                  />
                  {errors.aboutPreview?.founders && <p className="text-[10px] text-red-500 font-sans mt-1">{errors.aboutPreview.founders.message}</p>}
                </div>

                {/* Founder Title */}
                <div className="flex flex-col space-y-1.5">
                  <label className="text-[10px] uppercase tracking-wider text-luxury-muted font-sans font-medium">Founder Role</label>
                  <input
                    type="text"
                    {...register("aboutPreview.foundersTitle")}
                    className="bg-luxury-bg border border-white/5 focus:border-luxury-accent text-white px-4 py-2.5 rounded-sm text-xs font-sans outline-none transition-colors"
                  />
                  {errors.aboutPreview?.foundersTitle && <p className="text-[10px] text-red-500 font-sans mt-1">{errors.aboutPreview.foundersTitle.message}</p>}
                </div>
              </div>
            </div>

            {/* Why Choose Us copy */}
            <div className="bg-[#151515] border border-white/5 p-6 rounded-sm space-y-6 shadow-lg">
              <h3 className="font-serif text-lg font-bold text-white border-b border-white/5 pb-3">Why Choose Us</h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {/* Why Choose Tag */}
                <div className="flex flex-col space-y-1.5">
                  <label className="text-[10px] uppercase tracking-wider text-luxury-muted font-sans font-medium">Section Tagline</label>
                  <input
                    type="text"
                    {...register("whyChooseUs.tag")}
                    className="bg-luxury-bg border border-white/5 focus:border-luxury-accent text-white px-4 py-2.5 rounded-sm text-xs font-sans outline-none transition-colors"
                  />
                  {errors.whyChooseUs?.tag && <p className="text-[10px] text-red-500 font-sans mt-1">{errors.whyChooseUs.tag.message}</p>}
                </div>

                {/* Why Choose Title */}
                <div className="flex flex-col space-y-1.5">
                  <label className="text-[10px] uppercase tracking-wider text-luxury-muted font-sans font-medium">Section Heading</label>
                  <input
                    type="text"
                    {...register("whyChooseUs.title")}
                    className="bg-luxury-bg border border-white/5 focus:border-luxury-accent text-white px-4 py-2.5 rounded-sm text-xs font-sans outline-none transition-colors"
                  />
                  {errors.whyChooseUs?.title && <p className="text-[10px] text-red-500 font-sans mt-1">{errors.whyChooseUs.title.message}</p>}
                </div>
              </div>
            </div>

            {/* Submit Action */}
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
                    Save Homepage Copy
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
