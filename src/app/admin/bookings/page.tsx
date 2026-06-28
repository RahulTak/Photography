"use client";

import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { ConfirmModal } from "@/components/admin/ConfirmModal";
import axios from "axios";
import { SlidersHorizontal, Loader2, CalendarRange, Clock, CheckCircle, Ban, Hourglass } from "lucide-react";
import { AdminSelect } from "@/components/admin/ui/admin-select";
import { AdminTable, AdminThead, AdminTbody, AdminTr, AdminTh, AdminTd } from "@/components/admin/ui/admin-table";
import { StatusBadge } from "@/components/admin/ui/status-badge";

export default function AdminBookingsPage() {
  const queryClient = useQueryClient();
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [selectedType, setSelectedType] = useState("All");

  // Booking status update mutation
  const updateStatusMutation = useMutation({
    mutationFn: async (variables: { id: string; status: string }) => {
      const response = await axios.put(`/api/bookings/${variables.id}`, { status: variables.status });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminBookings"] });
      queryClient.invalidateQueries({ queryKey: ["adminDashboard"] });
    },
  });

  // Fetch bookings list
  const { data: bookingsRes, isLoading } = useQuery({
    queryKey: ["adminBookings"],
    queryFn: async () => {
      const response = await axios.get("/api/bookings");
      return response.data;
    },
  });

  const bookings = bookingsRes?.data || [];

  // Filter bookings
  const filteredBookings = bookings.filter((b: any) => {
    const matchesStatus = selectedStatus === "All" || b.status === selectedStatus.toLowerCase();
    const matchesType = selectedType === "All" || b.eventType.toLowerCase() === selectedType.toLowerCase();
    return matchesStatus && matchesType;
  });

  const handleStatusChange = (id: string, newStatus: string) => {
    updateStatusMutation.mutate({ id, status: newStatus });
  };

  const getStatusBadge = (status: string) => {
    const norm = (status || "pending").toLowerCase();
    switch (norm) {
      case "confirmed":
        return "bg-green-500/10 border border-green-500/20 text-green-400";
      case "completed":
        return "bg-blue-500/10 border border-blue-500/20 text-blue-400";
      case "cancelled":
        return "bg-red-500/10 border border-red-500/20 text-red-400";
      default:
        return "bg-yellow-500/10 border border-yellow-500/20 text-yellow-400";
    }
  };

  const getStatusIcon = (status: string) => {
    const norm = (status || "pending").toLowerCase();
    switch (norm) {
      case "confirmed":
        return <CheckCircle size={12} className="text-green-400" />;
      case "completed":
        return <CheckCircle size={12} className="text-blue-400" />;
      case "cancelled":
        return <Ban size={12} className="text-red-400" />;
      default:
        return <Hourglass size={12} className="text-yellow-400" />;
    }
  };

  // Find unique event types
  const eventTypesSet = new Set<string>();
  bookings.forEach((b: any) => {
    if (b.eventType) eventTypesSet.add(b.eventType);
  });
  const eventTypes = Array.from(eventTypesSet);

  return (
    <AdminLayout>
      <div className="space-y-8">
        <div className="space-y-1">
          <span className="text-[10px] uppercase tracking-widest text-accent font-semibold">RESERVATIONS</span>
          <h2 className="text-2xl md:text-3xl font-serif font-bold text-foreground">Event Bookings Log</h2>
        </div>

        {/* Filter Controls */}
        <div className="bg-card border border-border p-4 rounded-sm flex flex-col md:flex-row items-stretch md:items-center gap-4 justify-between">
          <div className="flex items-center gap-2 overflow-x-auto py-1">
            <SlidersHorizontal size={14} className="text-accent shrink-0 mr-2" />
            <button
              onClick={() => setSelectedStatus("All")}
              className={`px-3 py-1.5 rounded-sm text-[9px] font-sans uppercase tracking-wider font-semibold border transition-all cursor-pointer ${
                selectedStatus === "All"
                  ? "bg-accent/10 border-accent text-accent"
                  : "border-border text-muted hover:text-foreground"
              }`}
            >
              All Status
            </button>
            {["Pending", "Confirmed", "Completed", "Cancelled"].map((status) => (
              <button
                key={status}
                onClick={() => setSelectedStatus(status)}
                className={`px-3 py-1.5 rounded-sm text-[9px] font-sans uppercase tracking-wider font-semibold border transition-all cursor-pointer ${
                  selectedStatus === status
                    ? "bg-accent/10 border-accent text-accent"
                    : "border-border text-muted hover:text-foreground"
                }`}
              >
                {status}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <label className="text-[10px] uppercase tracking-wider text-muted font-sans font-medium whitespace-nowrap">
              Event Type:
            </label>
            <AdminSelect
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="py-1.5 text-[10px] w-auto"
            >
              <option value="All">All Types</option>
              {eventTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </AdminSelect>
          </div>
        </div>

        {/* Bookings Table */}
        {isLoading ? (
          <div className="h-60 flex items-center justify-center">
            <Loader2 className="animate-spin text-accent" size={24} />
          </div>
        ) : filteredBookings.length === 0 ? (
          <div className="bg-card border border-border rounded-sm p-16 text-center">
            <span className="text-xs text-muted uppercase tracking-widest">
              No event bookings match these filter options.
            </span>
          </div>
        ) : (
          <AdminTable>
            <AdminThead>
              <AdminTr isHeader={true}>
                <AdminTh>Customer Details</AdminTh>
                <AdminTh>Event Date</AdminTh>
                <AdminTh>Event Type</AdminTh>
                <AdminTh>Client Message</AdminTh>
                <AdminTh>Status</AdminTh>
                <AdminTh className="text-right">Actions</AdminTh>
              </AdminTr>
            </AdminThead>
            <AdminTbody>
              {filteredBookings.map((b: any) => (
                <AdminTr key={b.id}>
                  <AdminTd className="space-y-0.5">
                    <span className="font-bold text-foreground block text-sm">{b.name}</span>
                    <span className="text-[10px] text-muted block">{b.email}</span>
                    <span className="text-[10px] text-muted block">{b.phone}</span>
                  </AdminTd>
                  <AdminTd className="font-mono text-[10px] font-semibold text-foreground/90">
                    {b.eventDate}
                  </AdminTd>
                  <AdminTd>
                    <span className="px-2.5 py-0.5 rounded-sm text-[9px] font-bold uppercase tracking-wider bg-secondary border border-border text-foreground/80">
                      {b.eventType}
                    </span>
                  </AdminTd>
                  <AdminTd className="font-light max-w-xs truncate" title={b.message}>
                    {b.message}
                  </AdminTd>
                  <AdminTd>
                    <StatusBadge status={b.status || "pending"} />
                  </AdminTd>
                  <AdminTd className="text-right">
                    <AdminSelect
                      value={b.status || "pending"}
                      onChange={(e) => handleStatusChange(b.id, e.target.value)}
                      className="py-1 px-2 text-[10px] w-auto inline-block"
                    >
                      <option value="pending">Set Pending</option>
                      <option value="confirmed">Set Confirmed</option>
                      <option value="completed">Set Completed</option>
                      <option value="cancelled">Set Cancelled</option>
                    </AdminSelect>
                  </AdminTd>
                </AdminTr>
              ))}
            </AdminTbody>
          </AdminTable>
        )}
      </div>
    </AdminLayout>
  );
}
