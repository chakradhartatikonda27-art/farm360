"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Lock,
  Mail,
  Eye,
  EyeOff,
  AlertCircle,
  Loader2,
  Shield,
  Sparkles,
  ArrowRight,
} from "lucide-react";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch("/api/admin/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setError(data.error || "Invalid email or password.");
        setLoading(false);
        return;
      }

      // Successful login -> Redirect to admin dashboard
      router.push("/admin");
      router.refresh();
    } catch (err: any) {
      setError("Network or server error occurred. Please try again.");
      setLoading(false);
    }
  };

  const fillDemoCredentials = () => {
    setEmail("admin@farmcare360.com");
    setPassword("FarmCare360@Admin!");
    setError(null);
  };

  return (
    <div className="w-full max-w-md">
      {/* Brand Card */}
      <div className="bg-forest-dark/90 border border-forest-light/30 rounded-2xl p-8 sm:p-10 shadow-2xl backdrop-blur-xl text-ivory">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gold/15 border border-gold/40 text-gold mb-4 shadow-lg shadow-gold/10">
            <Sparkles className="w-7 h-7 text-gold" />
          </div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold tracking-tight text-ivory">
            FarmCare<span className="text-gold">360</span>
          </h1>
          <p className="text-xs uppercase tracking-widest text-sage mt-1.5 font-medium">
            CMS Admin Control Panel
          </p>
          <p className="text-xs text-ivory/60 mt-2">
            Secure sign in to manage website pages, services, media & CRM.
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-6 p-3.5 rounded-xl bg-rose-950/80 border border-rose-500/50 text-rose-200 text-xs flex items-start gap-2.5 animate-shake">
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
            <div className="flex-1">{error}</div>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-ivory/80 mb-1.5 uppercase tracking-wider">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-3 w-4 h-4 text-sage/70" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@farmcare360.com"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-forest-deep/80 border border-forest-light/40 text-ivory placeholder-ivory/30 text-sm focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-ivory/80 mb-1.5 uppercase tracking-wider">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-3 w-4 h-4 text-sage/70" />
              <input
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-forest-deep/80 border border-forest-light/40 text-ivory placeholder-ivory/30 text-sm focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-3 text-sage/70 hover:text-gold transition-colors"
                aria-label="Toggle password visibility"
              >
                {showPassword ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 py-3 px-4 rounded-xl font-semibold text-sm bg-gold hover:bg-gold-hover text-forest-deep transition-all shadow-md hover:shadow-gold-glow flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-forest-deep" />
                <span>Authenticating...</span>
              </>
            ) : (
              <>
                <span>Sign In to Admin</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Demo Credentials Helper */}
        <div className="mt-8 pt-6 border-t border-forest-light/20 text-center">
          <p className="text-[11px] text-ivory/50 mb-2">
            Default Root Administrator Login
          </p>
          <button
            type="button"
            onClick={fillDemoCredentials}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono bg-forest-light/30 hover:bg-forest-light/50 border border-forest-light/50 text-gold transition-colors"
          >
            <Shield className="w-3.5 h-3.5 text-gold" />
            <span>Fill admin@farmcare360.com</span>
          </button>
        </div>
      </div>

      <p className="text-center text-xs text-ivory/40 mt-6">
        &copy; {new Date().getFullYear()} FarmCare360. All rights reserved.
      </p>
    </div>
  );
}
