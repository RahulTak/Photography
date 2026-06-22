"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useAdminLogin } from "@/hooks/admin/useAdmin";
import { KeyRound, Mail, Loader2, ShieldAlert } from "lucide-react";

export default function AdminLoginPage() {
  const router = useRouter();
  const loginMutation = useAdminLogin();
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    loginMutation.mutate(
      { email, password },
      {
        onSuccess: (res) => {
          if (res.success) {
            router.push("/admin/dashboard");
            router.refresh();
          } else {
            setErrorMsg(res.message || "Invalid credentials.");
          }
        },
        onError: (err: any) => {
          setErrorMsg(err.response?.data?.message || "An unexpected error occurred.");
        },
      }
    );
  };

  return (
    <div className="min-h-screen bg-[#0B0B0B] text-white flex items-center justify-center p-6 relative overflow-hidden font-sans">
      {/* Background Cinematic Lighting */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-luxury-accent/5 rounded-full blur-[120px] -z-10" />

      <div className="max-w-md w-full bg-[#151515] border border-white/5 rounded-sm p-8 shadow-2xl relative">
        {/* Monogram Brand Header */}
        <div className="text-center space-y-3 mb-8">
          <div className="w-12 h-12 rounded-sm bg-luxury-accent/10 border border-luxury-accent/30 flex items-center justify-center text-luxury-accent mx-auto">
            <KeyRound size={22} />
          </div>
          <div>
            <h1 className="font-serif font-bold text-2xl tracking-wide uppercase">JP PHOTOGRAPHY</h1>
            <span className="text-[10px] uppercase tracking-widest text-luxury-accent font-semibold block mt-0.5">
              Secure Administration Console
            </span>
          </div>
        </div>

        {/* Error Alert */}
        {errorMsg && (
          <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-sm flex items-start gap-3 text-red-400 text-xs font-sans leading-relaxed mb-6">
            <ShieldAlert size={16} className="shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold block mb-0.5">Authorization Failed</span>
              {errorMsg}
            </div>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Email input */}
          <div className="flex flex-col space-y-1.5">
            <label htmlFor="email" className="text-[10px] uppercase tracking-wider text-luxury-muted font-sans font-medium">
              Console ID / Email
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-luxury-muted" size={14} />
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-luxury-bg border border-white/5 focus:border-luxury-accent text-white pl-10 pr-4 py-3 rounded-sm text-xs font-sans outline-none transition-colors"
                placeholder="admin@jpphotography.in"
              />
            </div>
          </div>

          {/* Password input */}
          <div className="flex flex-col space-y-1.5">
            <label htmlFor="password" className="text-[10px] uppercase tracking-wider text-luxury-muted font-sans font-medium">
              Console Password
            </label>
            <div className="relative">
              <KeyRound className="absolute left-3.5 top-1/2 -translate-y-1/2 text-luxury-muted" size={14} />
              <input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-luxury-bg border border-white/5 focus:border-luxury-accent text-white pl-10 pr-4 py-3 rounded-sm text-xs font-sans outline-none transition-colors"
                placeholder="••••••••••••"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loginMutation.isPending}
            className="w-full py-3.5 bg-luxury-accent hover:bg-luxury-hover disabled:bg-neutral-800 disabled:text-neutral-500 text-luxury-bg text-xs font-sans uppercase tracking-widest font-bold rounded-sm transition-all duration-300 shadow-lg shadow-luxury-accent/15 cursor-pointer mt-2 flex items-center justify-center gap-2"
          >
            {loginMutation.isPending ? (
              <>
                <Loader2 className="animate-spin" size={14} />
                Authorizing Access...
              </>
            ) : (
              "Confirm Console Identity"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
