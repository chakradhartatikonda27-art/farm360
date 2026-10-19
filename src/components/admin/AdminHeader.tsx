"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Menu,
  LogOut,
  User,
  Shield,
  ExternalLink,
  Bell,
  RefreshCw,
} from "lucide-react";

interface AdminHeaderProps {
  onToggleSidebar: () => void;
  currentUser?: {
    id: string;
    name: string;
    email: string;
    role: string;
  } | null;
}

export default function AdminHeader({
  onToggleSidebar,
  currentUser,
}: AdminHeaderProps) {
  const router = useRouter();
  const [loggingOut, setLoggingOut] = useState(false);

  const handleLogout = async () => {
    try {
      setLoggingOut(true);
      await fetch("/api/admin/auth/logout", { credentials: "include" });
      router.push("/admin/login");
      router.refresh();
    } catch (err) {
      console.error("Logout failed:", err);
    } finally {
      setLoggingOut(false);
    }
  };

  const getRoleBadge = (role?: string) => {
    switch (role) {
      case "SUPER_ADMIN":
        return "bg-gold/20 text-gold-dark border-gold/40";
      case "CONTENT_EDITOR":
        return "bg-emerald-100 text-emerald-800 border-emerald-300";
      case "ENQUIRY_MANAGER":
        return "bg-sky-100 text-sky-800 border-sky-300";
      case "MEDIA_MANAGER":
        return "bg-purple-100 text-purple-800 border-purple-300";
      default:
        return "bg-stone-100 text-stone-700 border-stone-300";
    }
  };

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between h-16 px-4 sm:px-6 bg-ivory-surface border-b border-cream-border/70 backdrop-blur-md">
      {/* Left controls */}
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleSidebar}
          aria-label="Toggle menu"
          className="p-2 -ml-2 rounded-lg text-charcoal-muted hover:text-charcoal hover:bg-cream/50 lg:hidden transition-colors"
        >
          <Menu className="w-5 h-5" />
        </button>
        <div className="hidden sm:flex items-center gap-2 text-xs font-medium text-charcoal-muted">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>System Online</span>
          <span className="text-cream-border">•</span>
          <span className="text-charcoal-subtle">FarmCare360 Enterprise CMS</span>
        </div>
      </div>

      {/* Right controls */}
      <div className="flex items-center gap-3">
        {/* Quick view site */}
        <a
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          className="hidden md:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-forest bg-forest/5 hover:bg-forest/10 border border-forest/20 transition-all"
        >
          <span>Live Site</span>
          <ExternalLink className="w-3.5 h-3.5 text-forest/70" />
        </a>

        {/* User profile dropdown / pill */}
        <div className="flex items-center gap-3 pl-3 border-l border-cream-border">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-forest text-gold flex items-center justify-center font-bold text-xs ring-2 ring-gold/30">
              {currentUser?.name ? currentUser.name.charAt(0).toUpperCase() : "A"}
            </div>
            <div className="hidden lg:block text-left">
              <div className="text-xs font-bold text-charcoal leading-tight">
                {currentUser?.name || "Administrator"}
              </div>
              <div className="flex items-center gap-1 mt-0.5">
                <span
                  className={`text-[9px] uppercase tracking-wider font-semibold px-1.5 py-0.2 rounded border ${getRoleBadge(
                    currentUser?.role
                  )}`}
                >
                  {currentUser?.role?.replace("_", " ") || "SUPER ADMIN"}
                </span>
              </div>
            </div>
          </div>

          {/* Logout button */}
          <button
            onClick={handleLogout}
            disabled={loggingOut}
            title="Log out"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 transition-all disabled:opacity-50"
          >
            {loggingOut ? (
              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <LogOut className="w-3.5 h-3.5" />
            )}
            <span className="font-semibold text-xs">Logout</span>
          </button>
        </div>
      </div>
    </header>
  );
}
