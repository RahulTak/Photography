"use client";

import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { AdminLayout } from "@/components/admin/AdminLayout";
import axios from "axios";
import { SlidersHorizontal, Loader2, Check, MailOpen, Mail, Trash2 } from "lucide-react";

export default function AdminInquiriesPage() {
  const queryClient = useQueryClient();
  const [selectedStatus, setSelectedStatus] = useState("All");

  // Fetch inquiries list
  const { data: inquiriesRes, isLoading } = useQuery({
    queryKey: ["adminInquiries"],
    queryFn: async () => {
      const response = await axios.get("/api/contact");
      return response.data;
    },
  });

  // Inquiry read status mutation
  const updateStatusMutation = useMutation({
    mutationFn: async (variables: { id: string; status: string }) => {
      const response = await axios.put(`/api/contact/${variables.id}`, { status: variables.status });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminInquiries"] });
      queryClient.invalidateQueries({ queryKey: ["adminDashboard"] });
    },
  });

  const inquiries = inquiriesRes?.data || [];

  // Filter list
  const filteredInquiries = inquiries.filter((inq: any) => {
    if (selectedStatus === "All") return true;
    return inq.status === selectedStatus.toLowerCase();
  });

  const toggleReadStatus = (id: string, currentStatus: string) => {
    const newStatus = currentStatus === "read" ? "unread" : "read";
    updateStatusMutation.mutate({ id, status: newStatus });
  };

  return (
    <AdminLayout>
      <div className="space-y-8">
        <div className="space-y-1">
          <span className="text-[10px] uppercase tracking-widest text-luxury-accent font-semibold">MESSAGES</span>
          <h2 className="text-2xl md:text-3xl font-serif font-bold text-white">General Inquiries</h2>
        </div>

        {/* Filter Controls */}
        <div className="bg-[#151515] border border-white/5 p-4 rounded-sm flex items-center gap-4">
          <SlidersHorizontal size={14} className="text-luxury-accent shrink-0 mr-2" />
          <button
            onClick={() => setSelectedStatus("All")}
            className={`px-3 py-1.5 rounded-sm text-[9px] font-sans uppercase tracking-wider font-semibold border transition-all cursor-pointer ${
              selectedStatus === "All"
                ? "bg-luxury-accent/10 border-luxury-accent text-luxury-accent"
                : "border-white/5 text-luxury-muted hover:text-white"
            }`}
          >
            All Messages
          </button>
          <button
            onClick={() => setSelectedStatus("Unread")}
            className={`px-3 py-1.5 rounded-sm text-[9px] font-sans uppercase tracking-wider font-semibold border transition-all cursor-pointer ${
              selectedStatus === "Unread"
                ? "bg-luxury-accent/10 border-luxury-accent text-luxury-accent"
                : "border-white/5 text-luxury-muted hover:text-white"
            }`}
          >
            Unread
          </button>
          <button
            onClick={() => setSelectedStatus("Read")}
            className={`px-3 py-1.5 rounded-sm text-[9px] font-sans uppercase tracking-wider font-semibold border transition-all cursor-pointer ${
              selectedStatus === "Read"
                ? "bg-luxury-accent/10 border-luxury-accent text-luxury-accent"
                : "border-white/5 text-luxury-muted hover:text-white"
            }`}
          >
            Read
          </button>
        </div>

        {/* Inquiries List */}
        {isLoading ? (
          <div className="h-60 flex items-center justify-center">
            <Loader2 className="animate-spin text-luxury-accent" size={24} />
          </div>
        ) : filteredInquiries.length === 0 ? (
          <div className="bg-[#151515] border border-white/5 rounded-sm p-16 text-center">
            <span className="text-xs text-luxury-muted uppercase tracking-widest">
              No inquiries found matching this message status.
            </span>
          </div>
        ) : (
          <div className="bg-[#151515] border border-white/5 rounded-sm overflow-hidden shadow-lg">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-sans text-luxury-muted">
                <thead>
                  <tr className="border-b border-white/5 bg-[#0F0F0F] text-[9px] uppercase tracking-wider text-white/50">
                    <th className="p-4">Client Contact</th>
                    <th className="p-4">Service Type</th>
                    <th className="p-4">Event Date</th>
                    <th className="p-4">Message Body</th>
                    <th className="p-4">Submitted</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {filteredInquiries.map((inq: any) => {
                    const isUnread = inq.status === "unread";
                    return (
                      <tr
                        key={inq.id}
                        className={`hover:bg-white/[0.01] transition-colors ${
                          isUnread ? "text-white font-medium" : "text-luxury-muted"
                        }`}
                      >
                        <td className="p-4 space-y-0.5">
                          <span className={`block ${isUnread ? "text-white font-bold" : "text-neutral-300"}`}>
                            {inq.name}
                          </span>
                          <span className="text-[10px] text-neutral-400 block">{inq.email}</span>
                          <span className="text-[10px] text-neutral-400 block">{inq.phone}</span>
                        </td>
                        <td className="p-4">
                          <span className="px-2.5 py-0.5 rounded-sm text-[9px] font-bold uppercase tracking-wider bg-white/5 border border-white/5 text-white/80">
                            {inq.serviceType}
                          </span>
                        </td>
                        <td className="p-4 font-mono text-[10px]">{inq.date || "Not set"}</td>
                        <td className="p-4 font-light max-w-sm truncate" title={inq.message}>
                          {inq.message}
                        </td>
                        <td className="p-4 font-mono text-[10px]">
                          {new Date(inq.createdAt).toLocaleString()}
                        </td>
                        <td className="p-4 text-right">
                          <button
                            onClick={() => toggleReadStatus(inq.id, inq.status)}
                            className={`p-2 rounded-sm border transition-all cursor-pointer inline-flex items-center justify-center ${
                              isUnread
                                ? "bg-luxury-accent/15 border-luxury-accent/30 text-luxury-accent hover:bg-luxury-accent/25"
                                : "bg-neutral-800 border-white/5 text-neutral-400 hover:text-white"
                            }`}
                            title={isUnread ? "Mark as Read" : "Mark as Unread"}
                          >
                            {isUnread ? <Mail size={14} /> : <MailOpen size={14} />}
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
      </div>
    </AdminLayout>
  );
}
