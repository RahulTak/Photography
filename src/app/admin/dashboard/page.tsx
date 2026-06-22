"use client";

import React from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { StatsCard } from "@/components/admin/StatsCard";
import { useAdminDashboard } from "@/hooks/admin/useAdmin";
import {
  Calendar,
  Inbox,
  GraduationCap,
  Image as ImageIcon,
  Quote,
  Activity,
} from "lucide-react";

export default function AdminDashboardPage() {
  const { data: statsRes, isLoading } = useAdminDashboard();

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="h-[60vh] flex items-center justify-center">
          <div className="flex flex-col items-center space-y-3">
            <div className="w-8 h-8 border-2 border-luxury-accent border-t-transparent rounded-full animate-spin" />
            <span className="text-xs uppercase tracking-widest text-luxury-muted font-sans font-light">
              Assembling metrics...
            </span>
          </div>
        </div>
      </AdminLayout>
    );
  }

  const data = statsRes?.data || {
    metrics: {
      totalBookings: 0,
      totalInquiries: 0,
      totalWorkshops: 0,
      totalRegistrations: 0,
      totalGalleryImages: 0,
      totalTestimonials: 0,
    },
    recentBookings: [],
    recentInquiries: [],
    upcomingWorkshops: [],
    recentActivityLogs: [],
  };

  const metricsList = [
    { title: "Total Bookings", value: data.metrics.totalBookings, icon: Calendar, desc: "Event reservations" },
    { title: "Total Inquiries", value: data.metrics.totalInquiries, icon: Inbox, desc: "Form contacts" },
    { title: "Active Workshops", value: data.metrics.totalWorkshops, icon: GraduationCap, desc: "Cohort courses" },
    { title: "Workshop Bookings", value: data.metrics.totalRegistrations, icon: GraduationCap, desc: "Seats reserved" },
    { title: "Gallery Images", value: data.metrics.totalGalleryImages, icon: ImageIcon, desc: "Portfolio items" },
    { title: "Testimonials", value: data.metrics.totalTestimonials, icon: Quote, desc: "Client stories" },
  ];

  return (
    <AdminLayout>
      <div className="space-y-10">
        {/* Welcome Section */}
        <div className="space-y-1">
          <span className="text-[10px] uppercase tracking-widest text-luxury-accent font-semibold">OVERVIEW</span>
          <h2 className="text-2xl md:text-3xl font-serif font-bold text-white">System Metrics & Activity</h2>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {metricsList.map((m, idx) => (
            <StatsCard
              key={idx}
              title={m.title}
              value={m.value}
              icon={m.icon}
              description={m.desc}
            />
          ))}
        </div>

        {/* Tables Split Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 pt-4">
          {/* Recent Inquiries */}
          <div className="bg-[#151515] border border-white/5 p-6 rounded-sm space-y-6">
            <h4 className="font-serif text-lg font-bold text-white border-b border-white/5 pb-3">
              Recent General Inquiries
            </h4>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-sans text-luxury-muted">
                <thead>
                  <tr className="border-b border-white/5 text-[9px] uppercase tracking-wider text-white/50">
                    <th className="pb-3">Name</th>
                    <th className="pb-3">Service</th>
                    <th className="pb-3">Submitted</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {data.recentInquiries.length === 0 ? (
                    <tr>
                      <td colSpan={3} className="py-4 text-center text-luxury-muted/50">
                        No inquiries submitted yet.
                      </td>
                    </tr>
                  ) : (
                    data.recentInquiries.map((inq: any) => (
                      <tr key={inq.id} className="hover:text-white transition-colors">
                        <td className="py-3 font-medium text-white">{inq.name}</td>
                        <td className="py-3">{inq.serviceType}</td>
                        <td className="py-3 font-mono text-[10px]">
                          {new Date(inq.createdAt).toLocaleDateString()}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Recent Event Bookings */}
          <div className="bg-[#151515] border border-white/5 p-6 rounded-sm space-y-6">
            <h4 className="font-serif text-lg font-bold text-white border-b border-white/5 pb-3">
              Recent Event Bookings
            </h4>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-sans text-luxury-muted">
                <thead>
                  <tr className="border-b border-white/5 text-[9px] uppercase tracking-wider text-white/50">
                    <th className="pb-3">Couple / Name</th>
                    <th className="pb-3">Event Date</th>
                    <th className="pb-3">Type</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {data.recentBookings.length === 0 ? (
                    <tr>
                      <td colSpan={3} className="py-4 text-center text-luxury-muted/50">
                        No event bookings submitted yet.
                      </td>
                    </tr>
                  ) : (
                    data.recentBookings.map((b: any) => (
                      <tr key={b.id} className="hover:text-white transition-colors">
                        <td className="py-3 font-medium text-white">{b.name}</td>
                        <td className="py-3 font-mono text-[10px]">{b.eventDate}</td>
                        <td className="py-3">{b.eventType}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Activity Logs (System Audits) */}
        <div className="bg-[#151515] border border-white/5 p-6 rounded-sm space-y-6 pt-4">
          <div className="flex items-center gap-2 border-b border-white/5 pb-3 justify-between">
            <h4 className="font-serif text-lg font-bold text-white flex items-center gap-2">
              <Activity size={16} className="text-luxury-accent" />
              Console Audit Logs
            </h4>
            <span className="text-[9px] uppercase tracking-widest text-luxury-accent font-semibold font-sans">
              Live Audits
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-sans text-luxury-muted">
              <thead>
                <tr className="border-b border-white/5 text-[9px] uppercase tracking-wider text-white/50">
                  <th className="pb-3">Operator</th>
                  <th className="pb-3">Action</th>
                  <th className="pb-3">Details</th>
                  <th className="pb-3">IP Address</th>
                  <th className="pb-3">Timestamp</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {data.recentActivityLogs.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-4 text-center text-luxury-muted/50">
                      No console audits logged yet.
                    </td>
                  </tr>
                ) : (
                  data.recentActivityLogs.map((log: any) => (
                    <tr key={log.id} className="hover:text-white transition-colors">
                      <td className="py-3 font-medium text-white">{log.adminName}</td>
                      <td className="py-3">
                        <span className="px-2 py-0.5 rounded-sm text-[9px] font-mono font-bold bg-luxury-accent/10 border border-luxury-accent/20 text-luxury-accent">
                          {log.action}
                        </span>
                      </td>
                      <td className="py-3 font-light max-w-sm truncate" title={log.details}>
                        {log.details}
                      </td>
                      <td className="py-3 font-mono text-[10px] text-neutral-400">
                        {log.ipAddress || "Internal"}
                      </td>
                      <td className="py-3 font-mono text-[10px]">
                        {new Date(log.createdAt).toLocaleString()}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
