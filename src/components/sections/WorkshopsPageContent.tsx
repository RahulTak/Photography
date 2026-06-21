"use client";

import React, { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { z } from "zod";
import { useWorkshops, useRegisterWorkshop } from "@/hooks/useWorkshops";
import { useUIStore } from "@/store/useUIStore";
import { WORKSHOPS_CONTENT } from "@/constants/workshops";
import { PageWrapper } from "@/components/layouts/PageWrapper";
import {
  Calendar,
  Users,
  MapPin,
  Clock,
  Check,
  ChevronDown,
  Info,
  X,
  CreditCard,
} from "lucide-react";


// Zod Booking Schema
const bookingSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  email: z.string().email({ message: "Please enter a valid email address." }),
  phone: z.string().min(10, { message: "Please enter a valid 10-digit phone number." }),
  seats: z.number().min(1).max(4),
});

type BookingFormInputs = z.infer<typeof bookingSchema>;

export function WorkshopsPageContent() {
  const searchParams = useSearchParams();
  const {
    activeWorkshopId,
    setActiveWorkshopId,
    bookingWorkshopId,
    setBookingWorkshopId,
  } = useUIStore();

  // Booking Form States
  const [formValues, setFormValues] = useState<BookingFormInputs>({
    name: "",
    email: "",
    phone: "",
    seats: 1,
  });
  const [formErrors, setFormErrors] = useState<Partial<Record<keyof BookingFormInputs, string>>>({});
  const [activeFaqIndex, setActiveFaqIndex] = useState<number | null>(null);

  // Sync selected workshop from query params if page accessed via /workshops?select=w1
  useEffect(() => {
    const selectParam = searchParams.get("select");
    if (selectParam) {
      const match = WORKSHOPS_CONTENT.upcoming.find((w) => w.id === selectParam);
      if (match) setActiveWorkshopId(match.id);
    }
  }, [searchParams, setActiveWorkshopId]);

  // Fetch workshops via React Query
  const { data: workshops = [], isLoading } = useWorkshops();

  // Booking seat mutation via React Query
  const bookingMutation = useRegisterWorkshop();

  const activeWorkshop = workshops.find((w) => w.id === activeWorkshopId);
  const bookingWorkshop = workshops.find((w) => w.id === bookingWorkshopId);

  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bookingWorkshopId) return;

    // Validate with Zod
    const validationResult = bookingSchema.safeParse(formValues);
    if (!validationResult.success) {
      const errors: Partial<Record<keyof BookingFormInputs, string>> = {};
      validationResult.error.issues.forEach((err) => {
        if (err.path[0]) {
          errors[err.path[0] as keyof BookingFormInputs] = err.message;
        }
      });
      setFormErrors(errors);
      return;
    }

    setFormErrors({});
    bookingMutation.mutate({
      ...formValues,
      workshopId: bookingWorkshopId,
    }, {
      onSuccess: () => {
        setFormValues({ name: "", email: "", phone: "", seats: 1 });
        setFormErrors({});
      }
    });
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
            <span className="text-luxury-accent">Workshops</span>
          </nav>
          <h1 className="text-4xl md:text-6xl font-serif text-white font-bold tracking-wide">
            Masterclasses & Residencies
          </h1>
          <p className="text-sm text-luxury-muted font-sans font-light max-w-2xl mt-2 leading-relaxed">
            {WORKSHOPS_CONTENT.hero.description}
          </p>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-24 bg-luxury-bg">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="text-center mb-16 space-y-2">
            <span className="text-xs uppercase tracking-widest text-luxury-accent font-semibold" style={{ letterSpacing: "0.15em" }}>
              THE SYLLABUS CORE
            </span>
            <h2 className="text-3xl md:text-5xl font-serif text-white">What You Will Master</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {WORKSHOPS_CONTENT.benefits.map((benefit, idx) => (
              <div key={idx} className="flex gap-4 p-8 bg-luxury-sec border border-luxury-border/50 rounded-sm">
                <div className="w-8 h-8 rounded-sm bg-luxury-accent/10 flex items-center justify-center flex-shrink-0 border border-luxury-accent/30 text-luxury-accent">
                  <Check size={16} />
                </div>
                <div>
                  <h3 className="font-serif text-lg text-white font-bold mb-2">{benefit.title}</h3>
                  <p className="text-xs text-luxury-muted font-sans leading-relaxed">{benefit.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Upcoming Workshops Grid */}
      <section className="py-24 bg-luxury-sec border-t border-b border-luxury-border/30">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="text-center mb-16 space-y-2">
            <span className="text-xs uppercase tracking-widest text-luxury-accent font-semibold" style={{ letterSpacing: "0.15em" }}>
              ACTIVE RESIDENCIES
            </span>
            <h2 className="text-3xl md:text-5xl font-serif text-white">Upcoming Cohorts</h2>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-luxury-bg h-96 animate-pulse border border-luxury-border/40 rounded-sm" />
              <div className="bg-luxury-bg h-96 animate-pulse border border-luxury-border/40 rounded-sm" />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {workshops.map((w) => (
                <div key={w.id} className="bg-luxury-bg border border-luxury-border/80 rounded-sm flex flex-col justify-between p-8 relative overflow-hidden group">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-luxury-accent/5 rounded-full blur-2xl -z-10 group-hover:bg-luxury-accent/10 transition-colors" />

                  <div className="space-y-6">
                    <div className="flex justify-between items-start">
                      <span className="text-[9px] uppercase tracking-widest bg-luxury-accent/15 border border-luxury-accent/30 text-luxury-accent px-3 py-1 rounded-sm">
                        seats remaining: {w.seatsAvailable}
                      </span>
                    </div>

                    <h3 className="font-serif text-2xl font-bold text-white leading-snug">{w.title}</h3>
                    <p className="text-xs text-luxury-muted font-sans leading-relaxed">{w.description}</p>

                    <div className="flex flex-col space-y-3 pt-4 border-t border-luxury-border/30">
                      <div className="flex items-center gap-3 text-xs text-luxury-muted font-sans">
                        <Calendar size={14} className="text-luxury-accent" />
                        <span>{w.date}</span>
                      </div>
                      <div className="flex items-center gap-3 text-xs text-luxury-muted font-sans">
                        <Clock size={14} className="text-luxury-accent" />
                        <span>{w.time}</span>
                      </div>
                      <div className="flex items-center gap-3 text-xs text-luxury-muted font-sans">
                        <MapPin size={14} className="text-luxury-accent" />
                        <span className="truncate">{w.location}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between pt-8 gap-4 border-t border-luxury-border/30 mt-8">
                    <div className="flex flex-col">
                      <span className="text-[9px] uppercase tracking-widest text-luxury-muted font-sans">Enrolment Fee</span>
                      <span className="font-serif text-xl font-bold text-white">₹{w.price.toLocaleString()}</span>
                    </div>

                    <div className="flex gap-3">
                      <button
                        onClick={() => setActiveWorkshopId(w.id)}
                        className="px-4 py-2 border border-luxury-border/60 hover:border-luxury-accent text-white text-[10px] font-sans uppercase tracking-widest font-semibold rounded-sm transition-all duration-300 flex items-center justify-center"
                      >
                        Details
                      </button>
                      <button
                        onClick={() => setBookingWorkshopId(w.id)}
                        disabled={w.seatsAvailable <= 0}
                        className="px-6 py-2 bg-luxury-accent hover:bg-luxury-hover disabled:bg-neutral-800 disabled:text-neutral-500 text-luxury-bg text-[10px] font-sans uppercase tracking-widest font-bold rounded-sm transition-all duration-300 flex items-center justify-center"
                      >
                        {w.seatsAvailable <= 0 ? "Sold Out" : "Book Seat"}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Pricing packages */}
      <section className="py-24 bg-luxury-bg">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="text-center mb-16 space-y-2">
            <span className="text-xs uppercase tracking-widest text-luxury-accent font-semibold" style={{ letterSpacing: "0.15em" }}>
              TIER INVESTMENT
            </span>
            <h2 className="text-3xl md:text-5xl font-serif text-white">Select Your Track</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {WORKSHOPS_CONTENT.pricing.map((tier, idx) => (
              <div
                key={idx}
                className={`flex flex-col justify-between p-8 rounded-sm border ${
                  tier.isPopular
                    ? "bg-luxury-sec border-luxury-accent shadow-xl relative"
                    : "bg-luxury-sec/60 border-luxury-border/60"
                }`}
              >
                {tier.isPopular && (
                  <span className="absolute -top-3 right-6 bg-luxury-accent text-luxury-bg text-[9px] uppercase tracking-widest font-bold px-3 py-1 rounded-sm">
                    Recommended
                  </span>
                )}

                <div className="space-y-6">
                  <div className="space-y-1">
                    <h3 className="font-serif text-xl font-bold text-white">{tier.name}</h3>
                    <p className="text-xs text-luxury-muted font-sans font-light leading-normal">{tier.description}</p>
                  </div>

                  <div className="flex items-baseline gap-1 pt-2">
                    <span className="font-serif text-3xl font-bold text-white">₹{tier.price.toLocaleString()}</span>
                    <span className="text-xs text-luxury-muted font-sans">/ {tier.period}</span>
                  </div>

                  <ul className="space-y-4 pt-6 border-t border-luxury-border/40 text-xs text-luxury-muted font-sans">
                    {tier.features.map((feature, fIdx) => (
                      <li key={fIdx} className="flex items-center gap-2">
                        <Check size={12} className="text-luxury-accent flex-shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="pt-8">
                  <button
                    onClick={() => {
                      const match = workshops[idx] || workshops[0];
                      if (match) setBookingWorkshopId(match.id);
                    }}
                    className={`w-full py-3.5 text-xs font-sans font-bold uppercase tracking-widest rounded-sm transition-all duration-300 ${
                      tier.isPopular
                        ? "bg-luxury-accent hover:bg-luxury-hover text-luxury-bg"
                        : "bg-transparent border border-white/20 hover:border-luxury-accent text-white"
                    }`}
                  >
                    Select Plan
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-24 bg-luxury-sec border-t border-luxury-border/30">
        <div className="max-w-3xl mx-auto px-6">
          <div className="text-center mb-16 space-y-2">
            <span className="text-xs uppercase tracking-widest text-luxury-accent font-semibold" style={{ letterSpacing: "0.15em" }}>
              ENQUIRIES
            </span>
            <h2 className="text-3xl md:text-4xl font-serif text-white">Frequently Asked Questions</h2>
          </div>

          <div className="space-y-4">
            {WORKSHOPS_CONTENT.faqs.map((faq, idx) => {
              const isOpen = activeFaqIndex === idx;
              return (
                <div
                  key={idx}
                  className="border border-luxury-border/60 px-6 py-4 rounded-sm bg-luxury-bg/50 transition-all duration-300"
                >
                  <button
                    onClick={() => setActiveFaqIndex(isOpen ? null : idx)}
                    className="w-full flex items-center justify-between text-left font-serif text-sm font-bold text-white hover:text-luxury-accent transition-colors py-1 focus:outline-none"
                  >
                    <span>{faq.question}</span>
                    <ChevronDown
                      size={16}
                      className={`text-luxury-accent transition-transform duration-300 ${
                        isOpen ? "transform rotate-180" : ""
                      }`}
                    />
                  </button>
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                        className="overflow-hidden"
                      >
                        <p className="text-xs text-luxury-muted font-sans leading-relaxed pt-4 border-t border-luxury-border/40 mt-3">
                          {faq.answer}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Workshop Details Dialog */}
      <AnimatePresence>
        {activeWorkshopId && activeWorkshop && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center p-6"
          >
            <motion.div
              initial={{ scale: 0.95, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 15 }}
              className="bg-luxury-sec border border-luxury-border/80 max-w-2xl w-full p-8 rounded-sm shadow-2xl relative max-h-[85vh] overflow-y-auto"
            >
              <button
                onClick={() => setActiveWorkshopId(null)}
                className="absolute top-5 right-5 text-white/50 hover:text-white transition-colors"
                aria-label="Close details"
              >
                <X size={20} />
              </button>

              <div className="space-y-6">
                <span className="text-[9px] uppercase tracking-widest text-luxury-accent font-sans">Workshop Details</span>
                <h2 className="font-serif text-2xl md:text-3xl font-bold text-white">{activeWorkshop.title}</h2>
                
                <p className="text-xs text-luxury-muted font-sans leading-relaxed">
                  {activeWorkshop.longDescription}
                </p>

                <div className="space-y-3 pt-4 border-t border-luxury-border/40">
                  <h4 className="text-xs uppercase tracking-widest text-white/80 font-bold font-sans">Syllabus Overview</h4>
                  <ul className="space-y-2 text-xs text-luxury-muted font-sans">
                    {activeWorkshop.syllabus.map((s: string, idx: number) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="text-luxury-accent font-bold mt-0.5">•</span>
                        <span>{s}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between pt-6 border-t border-luxury-border/40 gap-4">
                  <div className="flex flex-col">
                    <span className="text-[9px] uppercase tracking-widest text-luxury-muted font-sans font-semibold">Tutor</span>
                    <span className="text-xs text-white/90 font-serif font-bold">{activeWorkshop.instructor}</span>
                  </div>
                  <button
                    onClick={() => {
                      setBookingWorkshopId(activeWorkshop.id);
                      setActiveWorkshopId(null);
                    }}
                    className="px-8 py-3 bg-luxury-accent hover:bg-luxury-hover text-luxury-bg text-xs font-sans uppercase tracking-widest font-bold rounded-sm transition-all duration-300"
                  >
                    Proceed to Booking
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Booking Form Dialog */}
      <AnimatePresence>
        {bookingWorkshopId && bookingWorkshop && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center p-6"
          >
            <motion.div
              initial={{ scale: 0.95, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 15 }}
              className="bg-luxury-sec border border-luxury-border/80 max-w-md w-full p-8 rounded-sm shadow-2xl relative"
            >
              <button
                onClick={() => {
                  setBookingWorkshopId(null);
                  bookingMutation.reset();
                }}
                className="absolute top-5 right-5 text-white/50 hover:text-white transition-colors"
                aria-label="Close registration"
              >
                <X size={20} />
              </button>

              <div className="space-y-6">
                <div className="space-y-1">
                  <span className="text-[9px] uppercase tracking-widest text-luxury-accent font-sans">SECURE REGISTRATION</span>
                  <h2 className="font-serif text-xl font-bold text-white">{bookingWorkshop.title}</h2>
                  <p className="text-[10px] text-luxury-muted font-sans">Date: {bookingWorkshop.date}</p>
                </div>

                {bookingMutation.isSuccess ? (
                  /* Success Feedback */
                  <div className="text-center py-6 space-y-4">
                    <div className="w-12 h-12 rounded-full bg-luxury-accent/10 border border-luxury-accent text-luxury-accent flex items-center justify-center mx-auto">
                      <Check size={24} />
                    </div>
                    <h3 className="font-serif text-lg font-bold text-white">Seat Confirmed</h3>
                    <p className="text-xs text-luxury-muted font-sans leading-relaxed">
                      {bookingMutation.data.message}
                    </p>
                    <div className="p-3 bg-luxury-bg border border-luxury-border rounded-sm text-center">
                      <span className="text-[9px] text-luxury-muted uppercase tracking-widest block">Booking ID</span>
                      <span className="font-mono text-sm text-white font-bold">{bookingMutation.data.bookingId}</span>
                    </div>
                    <button
                      onClick={() => {
                        setBookingWorkshopId(null);
                        bookingMutation.reset();
                      }}
                      className="px-6 py-2.5 bg-luxury-accent hover:bg-luxury-hover text-luxury-bg text-xs font-sans uppercase tracking-widest font-bold rounded-sm transition-all duration-300 w-full"
                    >
                      Done
                    </button>
                  </div>
                ) : (
                  /* Booking Form */
                  <form onSubmit={handleBookingSubmit} className="space-y-4">
                    {/* Name */}
                    <div className="flex flex-col space-y-1.5">
                      <label htmlFor="name" className="text-[10px] uppercase tracking-wider text-luxury-muted font-sans">Full Name</label>
                      <input
                        id="name"
                        type="text"
                        required
                        value={formValues.name}
                        onChange={(e) => setFormValues({ ...formValues, name: e.target.value })}
                        className="bg-luxury-bg border border-luxury-border/80 focus:border-luxury-accent text-white px-4 py-2.5 rounded-sm text-xs font-sans outline-none transition-colors"
                        placeholder="Vikram Rathore"
                      />
                      {formErrors.name && (
                        <p className="text-[9px] text-red-500 font-sans">{formErrors.name}</p>
                      )}
                    </div>

                    {/* Email */}
                    <div className="flex flex-col space-y-1.5">
                      <label htmlFor="email" className="text-[10px] uppercase tracking-wider text-luxury-muted font-sans">Email Address</label>
                      <input
                        id="email"
                        type="email"
                        required
                        value={formValues.email}
                        onChange={(e) => setFormValues({ ...formValues, email: e.target.value })}
                        className="bg-luxury-bg border border-luxury-border/80 focus:border-luxury-accent text-white px-4 py-2.5 rounded-sm text-xs font-sans outline-none transition-colors"
                        placeholder="vikram@rathore.in"
                      />
                      {formErrors.email && (
                        <p className="text-[9px] text-red-500 font-sans">{formErrors.email}</p>
                      )}
                    </div>

                    {/* Phone */}
                    <div className="flex flex-col space-y-1.5">
                      <label htmlFor="phone" className="text-[10px] uppercase tracking-wider text-luxury-muted font-sans">Phone Number</label>
                      <input
                        id="phone"
                        type="tel"
                        required
                        value={formValues.phone}
                        onChange={(e) => setFormValues({ ...formValues, phone: e.target.value })}
                        className="bg-luxury-bg border border-luxury-border/80 focus:border-luxury-accent text-white px-4 py-2.5 rounded-sm text-xs font-sans outline-none transition-colors"
                        placeholder="+91 9886012345"
                      />
                      {formErrors.phone && (
                        <p className="text-[9px] text-red-500 font-sans">{formErrors.phone}</p>
                      )}
                    </div>

                    {/* Seats selector */}
                    <div className="flex flex-col space-y-1.5">
                      <label htmlFor="seats" className="text-[10px] uppercase tracking-wider text-luxury-muted font-sans">Number of Seats (Max 4)</label>
                      <select
                        id="seats"
                        value={formValues.seats}
                        onChange={(e) => setFormValues({ ...formValues, seats: parseInt(e.target.value) })}
                        className="bg-luxury-bg border border-luxury-border/80 focus:border-luxury-accent text-white px-4 py-2.5 rounded-sm text-xs font-sans outline-none transition-colors"
                      >
                        <option value="1">1 Seat (₹{(bookingWorkshop.price * 1).toLocaleString()})</option>
                        <option value="2">2 Seats (₹{(bookingWorkshop.price * 2).toLocaleString()})</option>
                        <option value="3">3 Seats (₹{(bookingWorkshop.price * 3).toLocaleString()})</option>
                        <option value="4">4 Seats (₹{(bookingWorkshop.price * 4).toLocaleString()})</option>
                      </select>
                    </div>

                    {/* Payment Alert Placeholder */}
                    <div className="p-4 bg-luxury-accent/5 border border-luxury-accent/20 rounded-sm flex gap-3 text-luxury-muted leading-relaxed font-sans text-[10px] my-2">
                      <CreditCard size={16} className="text-luxury-accent flex-shrink-0 mt-0.5" />
                      <div>
                        <span className="font-semibold text-white block mb-0.5">Payment Demo Mode</span>
                        This is an active booking mock transaction. No financial credentials are required. Clicking register completes the reservation.
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={bookingMutation.isPending}
                      className="px-10 py-3.5 bg-luxury-accent hover:bg-luxury-hover text-luxury-bg text-xs font-sans uppercase tracking-widest font-bold rounded-sm transition-all duration-300 w-full disabled:opacity-40"
                    >
                      {bookingMutation.isPending ? "Completing transaction..." : "Confirm Booking"}
                    </button>
                  </form>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </PageWrapper>
  );
}
export default WorkshopsPageContent;
