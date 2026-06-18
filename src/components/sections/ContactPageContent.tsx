"use client";

import React, { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { z } from "zod";
import { apiService } from "@/services/api-client";
import { CONTACT_CONTENT } from "@/constants/contact";
import { PageWrapper } from "@/components/layouts/PageWrapper";
import { MapPin, Phone, Mail, Clock, Check, Send } from "lucide-react";

// Zod validation schema for contact inputs
const contactSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  email: z.string().email({ message: "Please enter a valid email address." }),
  phone: z.string().min(10, { message: "Please enter a valid 10-digit phone number." }),
  serviceType: z.string().min(1, { message: "Please select a service type." }),
  date: z.string().optional(),
  message: z.string().min(10, { message: "Message must be at least 10 characters." }),
});

type ContactFormInputs = z.infer<typeof contactSchema>;

export function ContactPageContent() {
  const { hero, info, socials, mapPlaceholder } = CONTACT_CONTENT;

  // Form States
  const [formValues, setFormValues] = useState<ContactFormInputs>({
    name: "",
    email: "",
    phone: "",
    serviceType: "",
    date: "",
    message: "",
  });
  const [formErrors, setFormErrors] = useState<Partial<Record<keyof ContactFormInputs, string>>>({});

  // Query Mutation for Contact Submission
  const contactMutation = useMutation({
    mutationFn: apiService.submitContact,
    onSuccess: () => {
      // Clear form inputs
      setFormValues({
        name: "",
        email: "",
        phone: "",
        serviceType: "",
        date: "",
        message: "",
      });
      setFormErrors({});
    },
  });

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validate using Zod
    const validationResult = contactSchema.safeParse(formValues);
    if (!validationResult.success) {
      const errors: Partial<Record<keyof ContactFormInputs, string>> = {};
      validationResult.error.issues.forEach((err) => {
        if (err.path[0]) {
          errors[err.path[0] as keyof ContactFormInputs] = err.message;
        }
      });
      setFormErrors(errors);
      return;
    }

    setFormErrors({});
    contactMutation.mutate(formValues);
  };

  return (
    <PageWrapper>
      {/* Hero */}
      <section className="relative py-20 bg-luxury-sec border-b border-luxury-border/30 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-luxury-accent/5 to-transparent -z-10 animate-pulse" />
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <nav className="text-[10px] uppercase tracking-widest text-luxury-muted mb-4 font-sans" style={{ letterSpacing: "0.2em" }}>
            <span className="hover:text-white transition-colors duration-300">Home</span>
            <span className="mx-2">/</span>
            <span className="text-luxury-accent">Contact</span>
          </nav>
          <h1 className="text-4xl md:text-6xl font-serif text-white font-bold tracking-wide">
            Connect With Us
          </h1>
          <p className="text-sm text-luxury-muted font-sans font-light max-w-2xl mt-2 leading-relaxed">
            {hero.description}
          </p>
        </div>
      </section>

      {/* Main Grid: Form on left, Address & Map on right */}
      <section className="py-24 bg-luxury-bg">
        <div className="max-w-7xl mx-auto px-6 md:px-12 grid grid-cols-1 lg:grid-cols-2 gap-16">
          
          {/* Left Column: Form Card */}
          <div className="bg-luxury-sec border border-luxury-border/80 p-8 md:p-10 rounded-sm shadow-xl">
            {contactMutation.isSuccess ? (
              /* Success message block */
              <div className="text-center py-16 space-y-4">
                <div className="w-16 h-16 rounded-full bg-luxury-accent/10 border border-luxury-accent text-luxury-accent flex items-center justify-center mx-auto">
                  <Check size={28} />
                </div>
                <h3 className="font-serif text-2xl font-bold text-white">Inquiry Received</h3>
                <p className="text-xs text-luxury-muted font-sans leading-relaxed max-w-sm mx-auto">
                  {contactMutation.data.message}
                </p>
                <div className="pt-6">
                  <button
                    onClick={() => contactMutation.reset()}
                    className="px-8 py-3 bg-luxury-accent hover:bg-luxury-hover text-luxury-bg text-xs font-sans uppercase tracking-widest font-bold rounded-sm transition-all duration-300"
                  >
                    Send Another Inquiry
                  </button>
                </div>
              </div>
            ) : (
              /* Contact Form */
              <form onSubmit={handleFormSubmit} className="space-y-6">
                <h2 className="font-serif text-2xl font-bold text-white mb-6">Enquiry Details</h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {/* Name */}
                  <div className="flex flex-col space-y-1.5">
                    <label htmlFor="name" className="text-[10px] uppercase tracking-wider text-luxury-muted font-sans font-semibold">Name</label>
                    <input
                      id="name"
                      type="text"
                      required
                      value={formValues.name}
                      onChange={(e) => setFormValues({ ...formValues, name: e.target.value })}
                      className="bg-luxury-bg border border-luxury-border focus:border-luxury-accent text-white px-4 py-3 rounded-sm text-xs font-sans outline-none transition-colors"
                      placeholder="Vikram Malhotra"
                    />
                    {formErrors.name && (
                      <p className="text-[9px] text-red-500 font-sans">{formErrors.name}</p>
                    )}
                  </div>

                  {/* Email */}
                  <div className="flex flex-col space-y-1.5">
                    <label htmlFor="email" className="text-[10px] uppercase tracking-wider text-luxury-muted font-sans font-semibold">Email</label>
                    <input
                      id="email"
                      type="email"
                      required
                      value={formValues.email}
                      onChange={(e) => setFormValues({ ...formValues, email: e.target.value })}
                      className="bg-luxury-bg border border-luxury-border focus:border-luxury-accent text-white px-4 py-3 rounded-sm text-xs font-sans outline-none transition-colors"
                      placeholder="vikram@malhotra.com"
                    />
                    {formErrors.email && (
                      <p className="text-[9px] text-red-500 font-sans">{formErrors.email}</p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {/* Phone */}
                  <div className="flex flex-col space-y-1.5">
                    <label htmlFor="phone" className="text-[10px] uppercase tracking-wider text-luxury-muted font-sans font-semibold">Phone</label>
                    <input
                      id="phone"
                      type="tel"
                      required
                      value={formValues.phone}
                      onChange={(e) => setFormValues({ ...formValues, phone: e.target.value })}
                      className="bg-luxury-bg border border-luxury-border focus:border-luxury-accent text-white px-4 py-3 rounded-sm text-xs font-sans outline-none transition-colors"
                      placeholder="+91 99000 99000"
                    />
                    {formErrors.phone && (
                      <p className="text-[9px] text-red-500 font-sans">{formErrors.phone}</p>
                    )}
                  </div>

                  {/* Service Type Dropdown */}
                  <div className="flex flex-col space-y-1.5">
                    <label htmlFor="serviceType" className="text-[10px] uppercase tracking-wider text-luxury-muted font-sans font-semibold">Shoot Category</label>
                    <select
                      id="serviceType"
                      required
                      value={formValues.serviceType}
                      onChange={(e) => setFormValues({ ...formValues, serviceType: e.target.value })}
                      className="bg-luxury-bg border border-luxury-border focus:border-luxury-accent text-white px-4 py-3 rounded-sm text-xs font-sans outline-none transition-colors"
                    >
                      <option value="">Select a service</option>
                      <option value="Wedding">Wedding Film & Photo</option>
                      <option value="Pre-wedding">Pre-wedding Cinematic</option>
                      <option value="Cinematic">Cinematic Short Only</option>
                      <option value="Traditional">Traditional Ceremony</option>
                      <option value="Destination">Destination Masterpieces</option>
                    </select>
                    {formErrors.serviceType && (
                      <p className="text-[9px] text-red-500 font-sans">{formErrors.serviceType}</p>
                    )}
                  </div>
                </div>

                {/* Event Date (Optional) */}
                <div className="flex flex-col space-y-1.5">
                  <label htmlFor="date" className="text-[10px] uppercase tracking-wider text-luxury-muted font-sans font-semibold">Date of Event (Optional)</label>
                  <input
                    id="date"
                    type="date"
                    value={formValues.date}
                    onChange={(e) => setFormValues({ ...formValues, date: e.target.value })}
                    className="bg-luxury-bg border border-luxury-border focus:border-luxury-accent text-white px-4 py-3 rounded-sm text-xs font-sans outline-none transition-colors"
                  />
                </div>

                {/* Message */}
                <div className="flex flex-col space-y-1.5">
                  <label htmlFor="message" className="text-[10px] uppercase tracking-wider text-luxury-muted font-sans font-semibold">Tell Us Your Vision</label>
                  <textarea
                    id="message"
                    required
                    rows={5}
                    value={formValues.message}
                    onChange={(e) => setFormValues({ ...formValues, message: e.target.value })}
                    className="bg-luxury-bg border border-luxury-border focus:border-luxury-accent text-white px-4 py-3 rounded-sm text-xs font-sans outline-none transition-colors resize-none"
                    placeholder="Describe your venues, style expectations, and custom wishes..."
                  />
                  {formErrors.message && (
                    <p className="text-[9px] text-red-500 font-sans">{formErrors.message}</p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={contactMutation.isPending}
                  className="px-10 py-4 bg-luxury-accent hover:bg-luxury-hover text-luxury-bg text-xs font-sans uppercase tracking-widest font-bold rounded-sm transition-all duration-300 w-full flex items-center justify-center gap-2 disabled:opacity-40"
                  style={{ letterSpacing: "0.15em" }}
                >
                  {contactMutation.isPending ? (
                    "Transmitting Details..."
                  ) : (
                    <>
                      Transmit Enquiry
                      <Send size={12} />
                    </>
                  )}
                </button>
              </form>
            )}
          </div>

          {/* Right Column: Address Details & Map Embed */}
          <div className="flex flex-col space-y-10">
            {/* Info Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
              <div className="p-6 bg-luxury-sec border border-luxury-border/60 rounded-sm flex gap-4">
                <MapPin className="text-luxury-accent flex-shrink-0" size={18} />
                <div className="space-y-1 font-sans">
                  <span className="text-[9px] uppercase tracking-widest text-luxury-accent font-semibold block">HQ Studio</span>
                  <p className="text-xs text-luxury-muted leading-relaxed font-light">{info.address}</p>
                </div>
              </div>

              <div className="p-6 bg-luxury-sec border border-luxury-border/60 rounded-sm flex gap-4">
                <Phone className="text-luxury-accent flex-shrink-0" size={18} />
                <div className="space-y-1 font-sans">
                  <span className="text-[9px] uppercase tracking-widest text-luxury-accent font-semibold block">Telephone</span>
                  <p className="text-xs text-luxury-muted font-light">{info.phone}</p>
                </div>
              </div>

              <div className="p-6 bg-luxury-sec border border-luxury-border/60 rounded-sm flex gap-4">
                <Mail className="text-luxury-accent flex-shrink-0" size={18} />
                <div className="space-y-1 font-sans">
                  <span className="text-[9px] uppercase tracking-widest text-luxury-accent font-semibold block">Email</span>
                  <p className="text-xs text-luxury-muted font-light">{info.email}</p>
                </div>
              </div>

              <div className="p-6 bg-luxury-sec border border-luxury-border/60 rounded-sm flex gap-4">
                <Clock className="text-luxury-accent flex-shrink-0" size={18} />
                <div className="space-y-1 font-sans">
                  <span className="text-[9px] uppercase tracking-widest text-luxury-accent font-semibold block">Lounge Hours</span>
                  <p className="text-xs text-luxury-muted leading-relaxed font-light">{info.hours.split("(")[0]}</p>
                </div>
              </div>
            </div>

            {/* Google Maps IFrame Placeholder */}
            <div className="border border-luxury-border/60 rounded-sm overflow-hidden aspect-[16/10] relative shadow-lg">
              <iframe
                title="JP Photography Map Locator"
                src={mapPlaceholder.embedUrl}
                width="100%"
                height="100%"
                style={{ border: 0, filter: "invert(90%) hue-rotate(180deg) grayscale(100%) contrast(90%)" }} // Luxury dark-map hack
                allowFullScreen={false}
                loading="lazy"
              />
            </div>

            {/* Social Grid */}
            <div className="flex items-center space-x-8 pt-4 border-t border-luxury-border/40 font-sans">
              <span className="text-[9px] uppercase tracking-widest text-luxury-accent font-semibold">
                Follow the Sparks
              </span>
              <div className="flex space-x-6 text-xs text-luxury-muted">
                {socials.slice(0, 3).map((social) => (
                  <a
                    key={social.name}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-white transition-colors flex items-center gap-1.5"
                  >
                    <span>{social.name}</span>
                  </a>
                ))}
              </div>
            </div>

          </div>

        </div>
      </section>
    </PageWrapper>
  );
}
export default ContactPageContent;
