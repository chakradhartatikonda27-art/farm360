"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  FileText,
  Briefcase,
  Layers,
  Building2,
  ShieldCheck,
  Image as ImageIcon,
  MessageSquareQuote,
  HelpCircle,
  Inbox,
  Menu,
  Settings,
  Users,
  ExternalLink,
  ChevronRight,
  Sparkles,
  LogOut,
  RefreshCw,
} from "lucide-react";

interface AdminSidebarProps {
  isOpen: boolean;
  onClose?: () => void;
  userRole?: string;
  currentUser?: {
    id?: string;
    name?: string;
    email?: string;
    role?: string;
  } | null;
}

const navSections = [
  {
    title: "Overview",
    items: [
      { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
    ],
  },
  {
    title: "Sales & CRM",
    items: [
      { name: "Lead Desk", href: "/admin/leads", icon: Inbox },
      { name: "CRM Analytics", href: "/admin/leads/dashboard", icon: Sparkles },
      { name: "Projects", href: "/admin/projects", icon: Briefcase },
      { name: "CRM Settings", href: "/admin/leads/settings", icon: Settings },
    ],
  },
  {
    title: "Content & Pages",
    items: [
      { name: "Pages & Sections", href: "/admin/pages", icon: FileText },
      { name: "Services", href: "/admin/services", icon: Layers },
      { name: "Spaces We Serve", href: "/admin/spaces", icon: Building2 },
      { name: "Business Models", href: "/admin/models", icon: ShieldCheck },
      { name: "Transparency & Process", href: "/admin/transparency", icon: ShieldCheck },
    ],
  },
  {
    title: "Engagement & Assets",
    items: [
      { name: "Website Enquiries", href: "/admin/enquiries", icon: Inbox },
      { name: "Testimonials", href: "/admin/testimonials", icon: MessageSquareQuote },
      { name: "FAQ Library", href: "/admin/faqs", icon: HelpCircle },
      { name: "Media Assets", href: "/admin/media", icon: ImageIcon },
    ],
  },
  {
    title: "Site Configuration",
    items: [
      { name: "Menus & Navigation", href: "/admin/navigation", icon: Menu },
      { name: "Global Settings", href: "/admin/settings", icon: Settings },
      { name: "Admin Users", href: "/admin/users", icon: Users },
    ],
  },
];

export default function AdminSidebar({ isOpen, onClose, currentUser }: AdminSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [loggingOut, setLoggingOut] = useState(false);

  const handleLogout = async () => {
    try {
      setLoggingOut(true);
      await fetch("/api/admin/auth/logout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });
      router.push("/admin/login");
      router.refresh();
      window.location.href = "/admin/login";
    } catch {
      window.location.href = "/admin/login";
    } finally {
      setLoggingOut(false);
    }
  };

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden transition-opacity"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* Sidebar container */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex flex-col w-72 bg-forest-dark border-r border-forest-light/20 text-ivory transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:w-64 shrink-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Brand header */}
        <div className="flex items-center justify-between h-18 px-6 border-b border-forest-light/20 bg-forest-deep/60">
          <Link href="/admin" className="flex items-center gap-3 group">
            <div className="w-9 h-9 rounded-lg bg-gold/20 border border-gold/40 flex items-center justify-center text-gold group-hover:scale-105 transition-transform">
              <Sparkles className="w-5 h-5 text-gold" />
            </div>
            <div>
              <span className="font-serif text-lg font-bold tracking-wide text-ivory block leading-tight">
                FarmCare<span className="text-gold">360</span>
              </span>
              <span className="text-[10px] tracking-widest uppercase text-sage font-medium block">
                CMS Control Center
              </span>
            </div>
          </Link>
        </div>

        {/* Navigation list */}
        <div className="flex-1 overflow-y-auto px-4 py-5 space-y-6 scrollbar-thin scrollbar-thumb-forest-light/30">
          {navSections.map((section) => (
            <div key={section.title}>
              <h3 className="px-3 mb-2 text-[10px] font-bold uppercase tracking-wider text-sage/70">
                {section.title}
              </h3>
              <nav className="space-y-1">
                {section.items.map((item) => {
                  const isActive =
                    item.href === "/admin"
                      ? pathname === "/admin"
                      : pathname.startsWith(item.href);
                  const Icon = item.icon;

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={onClose}
                      className={`flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-all group ${
                        isActive
                          ? "bg-gold text-forest-deep font-semibold shadow-md shadow-gold/20"
                          : "text-ivory/80 hover:text-white hover:bg-forest-light/30"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <Icon
                          className={`w-4 h-4 transition-colors ${
                            isActive
                              ? "text-forest-deep"
                              : "text-sage group-hover:text-gold"
                          }`}
                        />
                        <span>{item.name}</span>
                      </div>
                      {isActive && (
                        <ChevronRight className="w-4 h-4 text-forest-deep" />
                      )}
                    </Link>
                  );
                })}
              </nav>
            </div>
          ))}
        </div>

        {/* User profile & actions footer */}
        <div className="p-4 border-t border-forest-light/20 bg-forest-deep/60 space-y-3">
          {/* User info */}
          <div className="flex items-center gap-3 px-1">
            <div className="w-9 h-9 rounded-full bg-gold/20 border border-gold/40 text-gold flex items-center justify-center font-bold text-sm shrink-0">
              {currentUser?.name ? currentUser.name.charAt(0).toUpperCase() : "A"}
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-xs font-semibold text-ivory truncate">
                {currentUser?.name || "Administrator"}
              </div>
              <div className="text-[10px] text-sage truncate">
                {currentUser?.email || "admin@farmcare360.com"}
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div className="grid grid-cols-2 gap-2 pt-1">
            <Link
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-lg text-xs font-semibold text-gold hover:text-white bg-gold/10 hover:bg-gold/20 border border-gold/30 transition-all text-center"
              title="View Public Website"
            >
              <ExternalLink className="w-3.5 h-3.5 shrink-0" />
              <span className="truncate">Live Site</span>
            </Link>

            <button
              onClick={handleLogout}
              disabled={loggingOut}
              className="flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-lg text-xs font-semibold text-rose-300 hover:text-white bg-rose-950/60 hover:bg-rose-900/80 border border-rose-800/50 transition-all text-center disabled:opacity-50"
              title="Sign Out"
            >
              {loggingOut ? (
                <RefreshCw className="w-3.5 h-3.5 animate-spin shrink-0" />
              ) : (
                <LogOut className="w-3.5 h-3.5 shrink-0" />
              )}
              <span>Logout</span>
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
