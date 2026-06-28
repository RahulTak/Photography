"use client";

import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { AdminLayout } from "@/components/admin/AdminLayout";
import axios from "axios";
import { SlidersHorizontal, Loader2, Check, MailOpen, Mail, Trash2 } from "lucide-react";
import { AdminTable, AdminThead, AdminTbody, AdminTr, AdminTh, AdminTd } from "@/components/admin/ui/admin-table";
import { StatusBadge } from "@/components/admin/ui/status-badge";

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
          <span className="text-[10px] uppercase tracking-widest text-accent font-semibold">MESSAGES</span>
          <h2 className="text-2xl md:text-3xl font-serif font-bold text-foreground">General Inquiries</h2>
        </div>

        {/* Filter Controls */}
        <div className="bg-card border border-border p-4 rounded-sm flex items-center gap-4">
          <SlidersHorizontal size={14} className="text-accent shrink-0 mr-2" />
          <button
            onClick={() => setSelectedStatus("All")}
            className={`px-3 py-1.5 rounded-sm text-[9px] font-sans uppercase tracking-wider font-semibold border transition-all cursor-pointer ${
              selectedStatus === "All"
                ? "bg-accent/10 border-accent text-accent"
                : "border-border text-muted hover:text-foreground"
            }`}
          >
            All Messages
          </button>
          <button
            onClick={() => setSelectedStatus("Unread")}
            className={`px-3 py-1.5 rounded-sm text-[9px] font-sans uppercase tracking-wider font-semibold border transition-all cursor-pointer ${
              selectedStatus === "Unread"
                ? "bg-accent/10 border-accent text-accent"
                : "border-border text-muted hover:text-foreground"
            }`}
          >
            Unread
          </button>
          <button
            onClick={() => setSelectedStatus("Read")}
            className={`px-3 py-1.5 rounded-sm text-[9px] font-sans uppercase tracking-wider font-semibold border transition-all cursor-pointer ${
              selectedStatus === "Read"
                ? "bg-accent/10 border-accent text-accent"
                : "border-border text-muted hover:text-foreground"
            }`}
          >
            Read
          </button>
        </div>

        {/* Inquiries List */}
        {isLoading ? (
          <div className="h-60 flex items-center justify-center">
            <Loader2 className="animate-spin text-accent" size={24} />
          </div>
        ) : filteredInquiries.length === 0 ? (
          <div className="bg-card border border-border rounded-sm p-16 text-center">
            <span className="text-xs text-muted uppercase tracking-widest">
              No inquiries found matching this message status.
            </span>
          </div>
        ) : (
          <AdminTable>
            <AdminThead>
              <AdminTr isHeader={true}>
                <AdminTh>Client Contact</AdminTh>
                <AdminTh>Service Type</AdminTh>
                <AdminTh>Event Date</AdminTh>
                <AdminTh>Message Body</AdminTh>
                <AdminTh>Submitted</AdminTh>
                <AdminTh className="text-right">Actions</AdminTh>
              </AdminTr>
            </AdminThead>
            <AdminTbody>
              {filteredInquiries.map((inq: any) => {
                const isUnread = inq.status === "unread";
                return (
                  <AdminTr
                    key={inq.id}
                    className={isUnread ? "text-foreground font-medium" : "text-muted"}
                  >
                    <AdminTd className="space-y-0.5">
                      <span className={`block ${isUnread ? "text-foreground font-bold" : "text-foreground/80"}`}>
                        {inq.name}
                      </span>
                      <span className="text-[10px] text-muted block">{inq.email}</span>
                      <span className="text-[10px] text-muted block">{inq.phone}</span>
                    </AdminTd>
                    <AdminTd>
                      <span className="px-2.5 py-0.5 rounded-sm text-[9px] font-bold uppercase tracking-wider bg-secondary border border-border text-foreground/80">
                        {inq.serviceType}
                      </span>
                    </AdminTd>
                    <AdminTd className="font-mono text-[10px]">{inq.date || "Not set"}</AdminTd>
                    <AdminTd className="font-light max-w-sm truncate" title={inq.message}>
                      {inq.message}
                    </AdminTd>
                    <AdminTd className="font-mono text-[10px]">
                      {new Date(inq.createdAt).toLocaleString()}
                    </AdminTd>
                    <AdminTd className="text-right">
                      <button
                        onClick={() => toggleReadStatus(inq.id, inq.status)}
                        className={`p-2 rounded-sm border transition-all cursor-pointer inline-flex items-center justify-center ${
                          isUnread
                            ? "bg-accent/15 border-accent/30 text-accent hover:bg-accent/25"
                            : "bg-secondary border-border text-muted hover:text-foreground hover:bg-secondary/85"
                        }`}
                        title={isUnread ? "Mark as Read" : "Mark as Unread"}
                      >
                        {isUnread ? <Mail size={14} /> : <MailOpen size={14} />}
                      </button>
                    </AdminTd>
                  </AdminTr>
                );
              })}
            </AdminTbody>
          </AdminTable>
        )}
      </div>
    </AdminLayout>
  );
}
