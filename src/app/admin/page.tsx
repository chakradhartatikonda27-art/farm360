"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  FileText,
  Briefcase,
  Layers,
  Image as ImageIcon,
  MessageSquareQuote,
  Inbox,
  ArrowUpRight,
  TrendingUp,
  Clock,
  CheckCircle2,
  AlertCircle,
  Plus,
  RefreshCw,
  ExternalLink,
  Shield,
  Eye,
} from "lucide-react";
import AdminCard from "@/components/admin/AdminCard";
import AdminButton from "@/components/admin/AdminButton";
import { DashboardStats } from "@/lib/cms/types";

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/stats");
      const json = await res.json();
      const data = json.data || json;
      if (data && (data.totalPages !== undefined || data.pages !== undefined)) {
        setStats(data);
      }
    } catch (err) {
      console.error("Failed to fetch dashboard stats:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const metricCards = stats
    ? [
        {
          title: "Website Pages",
          value: `${stats.publishedPages} / ${stats.totalPages}`,
          sublabel: "Published Pages",
          icon: FileText,
          href: "/admin/pages",
          color: "forest",
        },
        {
          title: "Agricultural Services",
          value: `${stats.activeServices} / ${stats.totalServices}`,
          sublabel: "Active Services",
          icon: Briefcase,
          href: "/admin/services",
          color: "gold",
        },
        {
          title: "Spaces We Serve",
          value: `${stats.spacesCount}`,
          sublabel: "Core Land Types",
          icon: Layers,
          href: "/admin/spaces",
          color: "forest",
        },
        {
          title: "Media Library",
          value: `${stats.mediaAssetsCount}`,
          sublabel: "Images & Documents",
          icon: ImageIcon,
          href: "/admin/media",
          color: "gold",
        },
        {
          title: "Testimonials",
          value: `${stats.approvedTestimonials} / ${stats.totalTestimonials}`,
          sublabel: "Approved Reviews",
          icon: MessageSquareQuote,
          href: "/admin/testimonials",
          color: "forest",
        },
        {
          title: "New Enquiries",
          value: `${stats.newEnquiries}`,
          sublabel: stats.totalEnquiries === 1 ? "1 Total Enquiry" : `${stats.totalEnquiries} Total Enquiries`,
          icon: Inbox,
          href: "/admin/enquiries",
          color: stats.newEnquiries > 0 ? "rose" : "forest",
        },
      ]
    : [];

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gradient-to-r from-forest-deep via-forest to-forest-light text-ivory p-6 sm:p-8 rounded-2xl shadow-elevated border border-forest-light/20">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold/20 text-gold text-xs font-semibold mb-2 border border-gold/30">
            <Shield className="w-3.5 h-3.5" />
            <span>FarmCare360 Live Admin Console</span>
          </div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold tracking-tight">
            Welcome to the Command Center
          </h1>
          <p className="text-sm text-ivory/80 mt-1 max-w-xl">
            Manage all 15+ agricultural services, space categories, business models,
            transparency reports, media assets, and incoming landowner enquiries.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <Link href="/admin/leads">
            <AdminButton variant="gold" size="sm" icon={<Inbox className="w-4 h-4" />}>
              Lead Desk & CRM
            </AdminButton>
          </Link>
          <Link href="/admin/services">
            <AdminButton variant="outline" size="sm" className="bg-forest-deep/60 border-forest-light/40 text-ivory hover:bg-forest-deep hover:text-white" icon={<Briefcase className="w-4 h-4" />}>
              Services
            </AdminButton>
          </Link>
          <Link href="/admin/media">
            <AdminButton variant="outline" size="sm" className="bg-forest-deep/60 border-forest-light/40 text-ivory hover:bg-forest-deep hover:text-white" icon={<ImageIcon className="w-4 h-4" />}>
              Media Library
            </AdminButton>
          </Link>
          <button
            onClick={fetchStats}
            title="Refresh statistics"
            className="p-2 rounded-lg bg-forest-deep/50 hover:bg-forest-deep text-ivory/80 hover:text-white border border-forest-light/30 transition-all"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          </button>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
        {loading
          ? Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="h-28 rounded-xl bg-white border border-cream-border animate-pulse p-4"
              />
            ))
          : metricCards.map((m) => {
              const Icon = m.icon;
              return (
                <Link
                  key={m.title}
                  href={m.href}
                  className="group bg-white rounded-xl border border-cream-border p-4 shadow-soft hover:shadow-md hover:border-gold/60 transition-all flex flex-col justify-between"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-semibold uppercase tracking-wider text-charcoal-muted">
                      {m.title}
                    </span>
                    <div className="w-7 h-7 rounded-lg bg-forest/5 group-hover:bg-gold/20 flex items-center justify-center transition-colors">
                      <Icon className="w-4 h-4 text-forest group-hover:text-gold transition-colors" />
                    </div>
                  </div>
                  <div className="mt-2">
                    <div className="text-xl sm:text-2xl font-bold text-forest group-hover:text-forest-dark transition-colors">
                      {m.value}
                    </div>
                    <div className="text-[11px] text-charcoal-subtle flex items-center gap-1 mt-0.5">
                      <span>{m.sublabel}</span>
                      <ArrowUpRight className="w-3 h-3 text-gold opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                  </div>
                </Link>
              );
            })}
      </div>

      {/* Middle Grid: Quick Actions + Recent Enquiries */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Quick Launch Panel */}
        <AdminCard
          title="Quick Content Actions"
          subtitle="Frequently performed CMS management tasks"
          className="lg:col-span-1"
        >
          <div className="space-y-2.5">
            <Link
              href="/admin/services"
              className="flex items-center justify-between p-3 rounded-lg border border-cream-border hover:border-gold bg-ivory-surface/50 hover:bg-gold/5 transition-all group"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-forest/10 flex items-center justify-center text-forest group-hover:scale-105 transition-transform">
                  <Briefcase className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-forest">
                    Manage 15+ Services
                  </div>
                  <div className="text-[11px] text-charcoal-muted">
                    Update features, images & pricing
                  </div>
                </div>
              </div>
              <ArrowUpRight className="w-4 h-4 text-charcoal-subtle group-hover:text-gold transition-colors" />
            </Link>

            <Link
              href="/admin/pages/home"
              className="flex items-center justify-between p-3 rounded-lg border border-cream-border hover:border-gold bg-ivory-surface/50 hover:bg-gold/5 transition-all group"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-gold/15 flex items-center justify-center text-gold-dark group-hover:scale-105 transition-transform">
                  <FileText className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-forest">
                    Customize Homepage
                  </div>
                  <div className="text-[11px] text-charcoal-muted">
                    Hero headlines, banners & section order
                  </div>
                </div>
              </div>
              <ArrowUpRight className="w-4 h-4 text-charcoal-subtle group-hover:text-gold transition-colors" />
            </Link>

            <Link
              href="/admin/transparency"
              className="flex items-center justify-between p-3 rounded-lg border border-cream-border hover:border-gold bg-ivory-surface/50 hover:bg-gold/5 transition-all group"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-forest/10 flex items-center justify-center text-forest group-hover:scale-105 transition-transform">
                  <Shield className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-forest">
                    7-Step Workflow & Policies
                  </div>
                  <div className="text-[11px] text-charcoal-muted">
                    Edit landowner approval steps & principles
                  </div>
                </div>
              </div>
              <ArrowUpRight className="w-4 h-4 text-charcoal-subtle group-hover:text-gold transition-colors" />
            </Link>

            <Link
              href="/admin/media"
              className="flex items-center justify-between p-3 rounded-lg border border-cream-border hover:border-gold bg-ivory-surface/50 hover:bg-gold/5 transition-all group"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-forest/10 flex items-center justify-center text-forest group-hover:scale-105 transition-transform">
                  <ImageIcon className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-forest">
                    Central Media Vault
                  </div>
                  <div className="text-[11px] text-charcoal-muted">
                    Upload & organize site imagery
                  </div>
                </div>
              </div>
              <ArrowUpRight className="w-4 h-4 text-charcoal-subtle group-hover:text-gold transition-colors" />
            </Link>
          </div>
        </AdminCard>

        {/* Recent Enquiries / CRM Preview */}
        <AdminCard
          title="Recent Landowner Enquiries"
          subtitle="Incoming website consultation requests"
          actions={
            <div className="flex items-center gap-2">
              <Link href="/admin/leads">
                <AdminButton variant="outline" size="sm">
                  Lead Desk
                </AdminButton>
              </Link>
              <Link href="/admin/enquiries">
                <AdminButton variant="secondary" size="sm">
                  View All Enquiries
                </AdminButton>
              </Link>
            </div>
          }
          className="lg:col-span-2"
        >
          {loading ? (
            <div className="py-8 text-center text-charcoal-muted text-sm">
              Loading recent enquiries...
            </div>
          ) : !stats?.recentEnquiries || stats.recentEnquiries.length === 0 ? (
            <div className="py-8 text-center text-charcoal-muted text-sm">
              No enquiries submitted yet.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-cream-border text-charcoal-muted uppercase tracking-wider text-[10px]">
                    <th className="py-2.5 px-3">Name</th>
                    <th className="py-2.5 px-3">Service Interest</th>
                    <th className="py-2.5 px-3">Land Size</th>
                    <th className="py-2.5 px-3">Status</th>
                    <th className="py-2.5 px-3">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-cream-border/60">
                  {stats.recentEnquiries.map((enq) => {
                    const statusColors: Record<string, string> = {
                      new: "bg-emerald-100 text-emerald-800 border-emerald-300",
                      in_progress: "bg-amber-100 text-amber-800 border-amber-300",
                      contacted: "bg-sky-100 text-sky-800 border-sky-300",
                      resolved: "bg-stone-100 text-stone-700 border-stone-300",
                      spam: "bg-rose-100 text-rose-800 border-rose-300",
                    };
                    const statusClass = statusColors[enq.status] || "bg-stone-100 text-stone-700";

                    return (
                      <tr key={enq.id} className="hover:bg-ivory-surface/60 transition-colors">
                        <td className="py-3 px-3">
                          <div className="font-semibold text-charcoal">
                            {enq.name}
                          </div>
                          <div className="text-[11px] text-charcoal-subtle">
                            {enq.phone || enq.email}
                          </div>
                        </td>
                        <td className="py-3 px-3 text-forest font-medium">
                          {enq.serviceInterest || "General Inquiry"}
                        </td>
                        <td className="py-3 px-3 text-charcoal-muted">
                          {enq.landSize || "Not specified"}
                        </td>
                        <td className="py-3 px-3">
                          <span
                            className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider border ${statusClass}`}
                          >
                            {enq.status.replace("_", " ")}
                          </span>
                        </td>
                        <td className="py-3 px-3 text-charcoal-subtle">
                          {new Date(enq.createdAt).toLocaleDateString()}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </AdminCard>
      </div>

      {/* Bottom Grid: Recent Audit Log */}
      <AdminCard
        title="System Activity & Audit Trail"
        subtitle="Recent administrative changes, logins, and publishing updates"
        actions={
          <span className="text-xs text-charcoal-subtle">
            Logged automatically for security & transparency
          </span>
        }
      >
        {loading ? (
          <div className="py-6 text-center text-charcoal-muted text-xs">
            Loading activity logs...
          </div>
        ) : !stats?.recentActivity || stats.recentActivity.length === 0 ? (
          <div className="py-6 text-center text-charcoal-muted text-xs">
            No system activity recorded yet.
          </div>
        ) : (
          <div className="space-y-2">
            {stats.recentActivity.map((log) => (
              <div
                key={log.id}
                className="flex items-center justify-between p-3 rounded-lg bg-ivory-surface/40 border border-cream-border/60 text-xs"
              >
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-gold" />
                  <div>
                    <span className="font-semibold text-charcoal">
                      {log.action}
                    </span>{" "}
                    <span className="text-charcoal-muted">
                      on <span className="font-mono text-forest">{log.entityType}</span>
                    </span>
                    {log.details && (
                      <span className="text-charcoal-subtle ml-1">
                        ({JSON.stringify(log.details).slice(0, 50)})
                      </span>
                    )}
                  </div>
                </div>
                <div className="text-[11px] text-charcoal-subtle shrink-0">
                  {new Date(log.timestamp).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
      </AdminCard>
    </div>
  );
}
