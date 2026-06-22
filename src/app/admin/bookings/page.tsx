"use client";

import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { ConfirmModal } from "@/components/admin/ConfirmModal";
import axios from "axios";
import { SlidersHorizontal, Loader2, CalendarRange, Clock, CheckCircle, Ban, Hourglass } from "lucide-react";

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
          <span className="text-[10px] uppercase tracking-widest text-luxury-accent font-semibold">RESERVATIONS</span>
          <h2 className="text-2xl md:text-3xl font-serif font-bold text-white">Event Bookings Log</h2>
        </div>

        {/* Filter Controls */}
        <div className="bg-[#151515] border border-white/5 p-4 rounded-sm flex flex-col md:flex-row items-stretch md:items-center gap-4 justify-between">
          <div className="flex items-center gap-2 overflow-x-auto py-1">
            <SlidersHorizontal size={14} className="text-luxury-accent shrink-0 mr-2" />
            <button
              onClick={() => setSelectedStatus("All")}
              className={`px-3 py-1.5 rounded-sm text-[9px] font-sans uppercase tracking-wider font-semibold border transition-all cursor-pointer ${
                selectedStatus === "All"
                  ? "bg-luxury-accent/10 border-luxury-accent text-luxury-accent"
                  : "border-white/5 text-luxury-muted hover:text-white"
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
                    ? "bg-luxury-accent/10 border-luxury-accent text-luxury-accent"
                    : "border-white/5 text-luxury-muted hover:text-white"
                }`}
              >
                {status}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <label className="text-[10px] uppercase tracking-wider text-luxury-muted font-sans font-medium whitespace-nowrap">
              Event Type:
            </label>
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="bg-luxury-bg border border-white/5 text-white px-3 py-1.5 rounded-sm text-[10px] font-sans outline-none cursor-pointer"
            >
              <option value="All">All Types</option>
              {eventTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Bookings Table */}
        {isLoading ? (
          <div className="h-60 flex items-center justify-center">
            <Loader2 className="animate-spin text-luxury-accent" size={24} />
          </div>
        ) : filteredBookings.length === 0 ? (
          <div className="bg-[#151515] border border-white/5 rounded-sm p-16 text-center">
            <span className="text-xs text-luxury-muted uppercase tracking-widest">
              No event bookings match these filter options.
            </span>
          </div>
        ) : (
          <div className="bg-[#151515] border border-white/5 rounded-sm overflow-hidden shadow-lg">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-sans text-luxury-muted">
                <thead>
                  <tr className="border-b border-white/5 bg-[#0F0F0F] text-[9px] uppercase tracking-wider text-white/50">
                    <th className="p-4">Customer Details</th>
                    <th className="p-4">Event Date</th>
                    <th className="p-4">Event Type</th>
                    <th className="p-4">Client Message</th>
                    <th className="p-4">Status</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {filteredBookings.map((b: any) => (
                    <tr key={b.id} className="hover:bg-white/[0.01] hover:text-white transition-colors">
                      <td className="p-4 space-y-0.5">
                        <span className="font-bold text-white block text-sm">{b.name}</span>
                        <span className="text-[10px] text-neutral-400 block">{b.email}</span>
                        <span className="text-[10px] text-neutral-400 block">{b.phone}</span>
                      </td>
                      <td className="p-4 font-mono text-[10px] font-semibold text-white/90">
                        {b.eventDate}
                      </td>
                      <td className="p-4">
                        <span className="px-2.5 py-0.5 rounded-sm text-[9px] font-bold uppercase tracking-wider bg-white/5 border border-white/5 text-white/85">
                          {b.eventType}
                        </span>
                      </td>
                      <td className="p-4 font-light max-w-xs truncate" title={b.message}>
                        {b.message}
                      </td>
                      <td className="p-4">
                        <div className={`px-2.5 py-1 rounded-sm text-[9px] font-bold uppercase tracking-wider flex items-center gap-1.5 w-fit ${getStatusBadge(b.status)}`}>
                          {getStatusIcon(b.status)}
                          {b.status || "pending"}
                        </div>
                      </td>
                      <td className="p-4 text-right">
                        <select
                          value={b.status || "pending"}
                          onChange={(e) => handleStatusChange(b.id, e.target.value)}
                          className="bg-luxury-bg border border-white/10 hover:border-luxury-accent text-white px-2 py-1 rounded-sm text-[10px] font-sans outline-none cursor-pointer transition-colors"
                        >
                          <option value="pending">Set Pending</option>
                          <option value="confirmed">Set Confirmed</option>
                          <option value="completed">Set Completed</option>
                          <option value="cancelled">Set Cancelled</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
