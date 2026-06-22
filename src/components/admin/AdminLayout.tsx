"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  Image as ImageIcon,
  GraduationCap,
  Calendar,
  Inbox,
  Quote,
  Home as HomeIcon,
  User,
  Award,
  Settings as SettingsIcon,
  LogOut,
  Menu,
  X,
  ShieldCheck,
} from "lucide-react";
import { useAdminLogout, useAdminMe } from "@/hooks/admin/useAdmin";

interface AdminLayoutProps {
  children: React.ReactNode;
}

export function AdminLayout({ children }: AdminLayoutProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  const { data: meRes, isLoading } = useAdminMe();
  const logoutMutation = useAdminLogout();

  const handleLogout = () => {
    logoutMutation.mutate(undefined, {
      onSuccess: () => {
        router.push("/admin/login");
      },
    });
  };

  const navItems = [
    { label: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
    { label: "Gallery", href: "/admin/gallery", icon: ImageIcon },
    { label: "Workshops", href: "/admin/workshops", icon: GraduationCap },
    { label: "Bookings", href: "/admin/bookings", icon: Calendar },
    { label: "Inquiries", href: "/admin/inquiries", icon: Inbox },
    { label: "Testimonials", href: "/admin/testimonials", icon: Quote },
    { label: "Homepage Copy", href: "/admin/home", icon: HomeIcon },
    { label: "About Page", href: "/admin/about", icon: User },
    { label: "Settings", href: "/admin/settings", icon: SettingsIcon },
  ];

  const adminName = meRes?.data?.user?.name || "Administrator";
  const activeItem = navItems.find((item) => pathname === item.href) || { label: "Admin Console" };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0B0B0B] flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-10 h-10 border-2 border-luxury-accent border-t-transparent rounded-full animate-spin" />
          <span className="text-xs uppercase tracking-widest text-luxury-muted font-sans font-light">
            Authenticating Console...
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0B0B0B] text-white font-sans flex">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex flex-col w-64 border-r border-white/5 bg-[#0F0F0F] shrink-0">
        {/* Brand Monogram */}
        <div className="h-20 flex items-center px-6 border-b border-white/5 gap-3">
          <div className="w-8 h-8 rounded-sm bg-luxury-accent/10 border border-luxury-accent/30 flex items-center justify-center text-luxury-accent">
            <ShieldCheck size={18} />
          </div>
          <div>
            <span className="font-serif font-bold text-sm tracking-wide block">JP PHOTOGRAPHY</span>
            <span className="text-[9px] uppercase tracking-widest text-luxury-accent block font-medium">ADMIN DASHBOARD</span>
          </div>
        </div>

        {/* Sidebar Nav Links */}
        <nav className="flex-1 py-6 px-4 space-y-1.5 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3.5 px-4 py-3 rounded-sm text-xs font-medium tracking-wide uppercase transition-all duration-200 ${
                  isActive
                    ? "bg-luxury-accent/10 text-luxury-accent border-l-2 border-luxury-accent font-semibold"
                    : "text-luxury-muted hover:text-white hover:bg-white/5"
                }`}
              >
                <Icon size={16} className={isActive ? "text-luxury-accent" : "text-luxury-muted"} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Admin Footer Profiler */}
        <div className="p-4 border-t border-white/5 bg-[#0A0A0A] flex items-center justify-between">
          <div className="flex items-center gap-2.5 truncate">
            <div className="w-8 h-8 rounded-full bg-neutral-800 flex items-center justify-center text-xs font-semibold text-luxury-accent border border-white/5">
              {adminName[0].toUpperCase()}
            </div>
            <div className="truncate">
              <span className="text-xs font-bold text-white block truncate">{adminName}</span>
              <span className="text-[9px] text-luxury-muted uppercase tracking-wider block">Role: Owner</span>
            </div>
          </div>
          <button
            onClick={handleLogout}
            disabled={logoutMutation.isPending}
            className="p-2 hover:bg-red-500/10 hover:text-red-400 text-luxury-muted rounded-sm transition-colors cursor-pointer"
            title="Log Out Console"
          >
            <LogOut size={16} />
          </button>
        </div>
      </aside>

      {/* Mobile Sidebar overlay */}
      <AnimatePresence>
        {isSidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsSidebarOpen(false)}
              className="fixed inset-0 bg-black z-40 lg:hidden"
            />
            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", bounce: 0.15 }}
              className="fixed inset-y-0 left-0 w-64 bg-[#0F0F0F] border-r border-white/5 z-50 flex flex-col lg:hidden"
            >
              <div className="h-20 flex items-center justify-between px-6 border-b border-white/5">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-sm bg-luxury-accent/10 border border-luxury-accent/30 flex items-center justify-center text-luxury-accent">
                    <ShieldCheck size={18} />
                  </div>
                  <div>
                    <span className="font-serif font-bold text-sm tracking-wide">JP PHOTOGRAPHY</span>
                    <span className="text-[9px] uppercase tracking-widest text-luxury-accent block font-medium">ADMIN</span>
                  </div>
                </div>
                <button onClick={() => setIsSidebarOpen(false)} className="text-white/70 hover:text-white">
                  <X size={20} />
                </button>
              </div>
              <nav className="flex-1 py-6 px-4 space-y-1.5 overflow-y-auto">
                {navItems.map((item) => {
                  const isActive = pathname === item.href;
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setIsSidebarOpen(false)}
                      className={`flex items-center gap-3.5 px-4 py-3 rounded-sm text-xs font-medium tracking-wide uppercase transition-all duration-200 ${
                        isActive
                          ? "bg-luxury-accent/10 text-luxury-accent border-l-2 border-luxury-accent font-semibold"
                          : "text-luxury-muted hover:text-white hover:bg-white/5"
                      }`}
                    >
                      <Icon size={16} />
                      <span>{item.label}</span>
                    </Link>
                  );
                })}
              </nav>
              <div className="p-4 border-t border-white/5 bg-[#0A0A0A] flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-neutral-800 flex items-center justify-center text-xs font-semibold text-luxury-accent border border-white/5">
                    {adminName[0].toUpperCase()}
                  </div>
                  <div>
                    <span className="text-xs font-bold text-white block">{adminName}</span>
                    <span className="text-[9px] text-luxury-muted uppercase tracking-wider block">Owner</span>
                  </div>
                </div>
                <button
                  onClick={handleLogout}
                  className="p-2 hover:bg-red-500/10 hover:text-red-400 text-luxury-muted rounded-sm transition-colors cursor-pointer"
                >
                  <LogOut size={16} />
                </button>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main Panel Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto h-screen bg-[#0B0B0B]">
        {/* Topbar Header */}
        <header className="h-20 bg-[#0F0F0F] border-b border-white/5 px-6 flex items-center justify-between lg:justify-end shrink-0">
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="lg:hidden p-2 text-luxury-muted hover:text-white bg-white/5 rounded-sm"
          >
            <Menu size={18} />
          </button>
          
          <div className="flex items-center gap-6">
            {/* Breadcrumb Indicators */}
            <div className="hidden md:flex items-center gap-2 text-[10px] uppercase tracking-widest text-luxury-muted">
              <span>Admin</span>
              <span>/</span>
              <span className="text-luxury-accent font-semibold">{activeItem.label}</span>
            </div>
            
            <div className="h-4 w-[1px] bg-white/10 hidden md:block" />

            <span className="text-[10px] uppercase tracking-widest text-luxury-muted font-mono font-light">
              {new Date().toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })}
            </span>
          </div>
        </header>

        {/* Dynamic Route Pages */}
        <main className="flex-1 p-6 md:p-10 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
export default AdminLayout;
