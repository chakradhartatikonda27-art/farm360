"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
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
} from "lucide-react";

interface AdminSidebarProps {
  isOpen: boolean;
  onClose?: () => void;
  userRole?: string;
}

const navSections = [
  {
    title: "Overview",
    items: [
      { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
    ],
  },
  {
    title: "Content & Pages",
    items: [
      { name: "Pages & Sections", href: "/admin/pages", icon: FileText },
      { name: "Services", href: "/admin/services", icon: Briefcase },
      { name: "Spaces We Serve", href: "/admin/spaces", icon: Layers },
      { name: "Business Models", href: "/admin/models", icon: Building2 },
      { name: "Transparency & Process", href: "/admin/transparency", icon: ShieldCheck },
    ],
  },
  {
    title: "Engagement & CRM",
    items: [
      { name: "Enquiries & Leads", href: "/admin/enquiries", icon: Inbox },
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

export default function AdminSidebar({ isOpen, onClose }: AdminSidebarProps) {
  const pathname = usePathname();

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

        {/* Quick link to live site */}
        <div className="p-4 border-t border-forest-light/20 bg-forest-deep/40">
          <Link
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 w-full py-2.5 px-3 rounded-lg text-xs font-semibold uppercase tracking-wider text-gold hover:text-white bg-gold/10 hover:bg-gold/20 border border-gold/30 transition-all"
          >
            <span>View Public Website</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>
        </div>
      </aside>
    </>
  );
}
