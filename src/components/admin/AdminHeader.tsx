import React, { useState } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import {
  Menu,
  LogOut,
  User,
  Shield,
  ExternalLink,
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
  const pathname = usePathname();
  const [loggingOut, setLoggingOut] = useState(false);

  const handleLogout = async () => {
    try {
      setLoggingOut(true);
      await fetch("/api/admin/auth/logout", { credentials: "include" });
      router.push("/admin/login");
      router.refresh();
      window.location.href = "/admin/login";
    } catch (err) {
      console.error("Logout failed:", err);
      window.location.href = "/admin/login";
    } finally {
      setLoggingOut(false);
    }
  };

  const navLinks = [
    { label: "Overview", href: "/admin" },
    { label: "Leads", href: "/admin/leads" },
    { label: "Projects", href: "/admin/projects" },
    { label: "Services", href: "/admin/services" },
    { label: "Our work", href: "/admin/pages" },
    { label: "Company settings", href: "/admin/leads/settings" },
  ];

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between h-14 px-4 sm:px-6 bg-[#1B3B2B] text-white border-b border-[#152e22] shadow-sm">
      {/* Left controls & Brand Nav */}
      <div className="flex items-center gap-6">
        <button
          onClick={onToggleSidebar}
          aria-label="Toggle menu"
          className="p-1.5 -ml-1.5 rounded-lg text-white/80 hover:text-white hover:bg-white/10 lg:hidden transition-colors"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Brand */}
        <Link
          href="/admin"
          className="font-bold text-sm tracking-widest text-white hover:opacity-90 transition-opacity font-mono uppercase"
        >
          FARM360
        </Link>

        {/* Desktop Quick Nav Links */}
        <nav className="hidden md:flex items-center gap-1 text-xs font-medium">
          {navLinks.map((link) => {
            const isActive =
              link.href === "/admin"
                ? pathname === "/admin"
                : pathname.startsWith(link.href);

            return (
              <Link
                key={link.label}
                href={link.href}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  isActive
                    ? "bg-white/15 text-white font-semibold"
                    : "text-white/70 hover:text-white hover:bg-white/5"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Right controls */}
      <div className="flex items-center gap-3">
        <a
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          className="hidden xl:inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-[11px] text-white/75 hover:text-white transition-colors"
        >
          <span>View Site</span>
          <ExternalLink className="w-3 h-3 opacity-60" />
        </a>

        {/* User identifier */}
        <div className="hidden sm:flex items-center gap-2 text-xs text-white/80">
          <span className="w-2 h-2 rounded-full bg-emerald-400" />
          <span className="text-[11px] font-medium">{currentUser?.email || "admin@gmail.com"}</span>
        </div>

        {/* Sign Out Button matching screenshot */}
        <button
          onClick={handleLogout}
          disabled={loggingOut}
          className="px-3.5 py-1 text-xs font-medium text-white bg-transparent border border-white/40 hover:border-white hover:bg-white/10 rounded-full transition-all disabled:opacity-50"
        >
          {loggingOut ? "Signing out..." : "Sign out"}
        </button>
      </div>
    </header>
  );
}
