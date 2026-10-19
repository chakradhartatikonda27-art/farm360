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
  DollarSign,
  UserCheck,
  Check,
  ArrowRight,
  ChevronRight,
  Phone,
  FileSpreadsheet,
  Building,
  Activity,
  Award,
  Flame,
} from "lucide-react";
import AdminCard from "@/components/admin/AdminCard";
import AdminButton from "@/components/admin/AdminButton";
import { DashboardStats, SalesStage } from "@/lib/cms/types";

const STAGE_ORDER: { key: SalesStage; name: string; step: number; color: string; border: string; bg: string }[] = [
  { key: "prospecting", name: "Prospecting", step: 1, color: "text-blue-800", border: "border-blue-200", bg: "bg-blue-50/70" },
  { key: "qualification", name: "Qualification", step: 2, color: "text-amber-800", border: "border-amber-200", bg: "bg-amber-50/70" },
  { key: "need_analysis", name: "Need Analysis", step: 3, color: "text-purple-800", border: "border-purple-200", bg: "bg-purple-50/70" },
  { key: "value_proposition", name: "Value Prop", step: 4, color: "text-indigo-800", border: "border-indigo-200", bg: "bg-indigo-50/70" },
  { key: "decision_makers", name: "Decision Makers", step: 5, color: "text-orange-800", border: "border-orange-200", bg: "bg-orange-50/70" },
  { key: "negotiation", name: "Negotiation", step: 6, color: "text-teal-800", border: "border-teal-200", bg: "bg-teal-50/70" },
  { key: "closed_won", name: "Closed Won", step: 7, color: "text-emerald-800", border: "border-emerald-300", bg: "bg-emerald-50" },
  { key: "closed_lost", name: "Closed Lost", step: 8, color: "text-rose-800", border: "border-rose-200", bg: "bg-rose-50/70" },
];

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/stats");
      const json = await res.json();
      const data = json.data || json;
      if (data && (data.totalPages !== undefined || data.pages !== undefined || data.crm !== undefined)) {
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

  const crm = stats?.crm || {
    totalLeads: 0,
    openLeadsCount: 0,
    closedWonCount: 0,
    closedLostCount: 0,
    quotedRevenue: 0,
    agreedDealValue: 0,
    verifiedMoneyReceived: 0,
    verifiedPaymentsCount: 0,
    totalPipelineValue: 0,
    wonRevenue: 0,
    conversionRate: 0,
    leadsByStage: {},
    leadsBySource: {},
    newLeadsToday: 0,
    unassignedLeads: 0,
    qualificationPending: 0,
    proposalsSubmitted: 0,
    negotiationsInProgress: 0,
    activeProjectsCount: 0,
    totalProjectsCount: 0,
    recentLeadActivity: [],
    recentLeads: [],
  };

  return (
    <div className="space-y-8 pb-16">
      {/* Top Banner */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 bg-gradient-to-r from-forest-deep via-forest to-forest-light text-ivory p-6 sm:p-8 rounded-2xl shadow-elevated border border-forest-light/20">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold/20 text-gold text-xs font-semibold mb-2.5 border border-gold/30">
            <Shield className="w-3.5 h-3.5" />
            <span>FarmCare360 Live Admin Console • Database-Backed</span>
          </div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold tracking-tight">
            Executive Command & Operations
          </h1>
          <p className="text-xs sm:text-sm text-ivory/80 mt-1 max-w-2xl leading-relaxed">
            Real-time control tower for lead qualification, commercial proposals, client projects, and verified banking cash flow.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <Link href="/admin/leads">
            <AdminButton variant="gold" size="sm" icon={<Inbox className="w-4 h-4" />}>
              Lead Desk & CRM
            </AdminButton>
          </Link>
          <Link href="/admin/projects">
            <AdminButton variant="outline" size="sm" className="bg-forest-deep/60 border-forest-light/40 text-ivory hover:bg-forest-deep hover:text-white" icon={<Briefcase className="w-4 h-4" />}>
              Project Register
            </AdminButton>
          </Link>
          <Link href="/admin/services">
            <AdminButton variant="outline" size="sm" className="bg-forest-deep/60 border-forest-light/40 text-ivory hover:bg-forest-deep hover:text-white" icon={<Layers className="w-4 h-4" />}>
              Services CMS
            </AdminButton>
          </Link>
          <button
            onClick={fetchStats}
            title="Refresh database statistics"
            className="p-2.5 rounded-lg bg-forest-deep/50 hover:bg-forest-deep text-ivory/80 hover:text-white border border-forest-light/30 transition-all flex items-center gap-1.5 text-xs font-medium"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
            <span>Sync</span>
          </button>
        </div>
      </div>

      {/* SECTION 1: Commercial Revenue Clarity Ribbon */}
      <div className="space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
          <div>
            <div className="text-[10px] font-bold text-forest tracking-wider uppercase">
              FINANCIAL INTEGRITY & AUDIT TRAIL
            </div>
            <h2 className="text-lg font-serif font-bold text-charcoal">
              Revenue Distinction
            </h2>
          </div>
          <div className="text-[11px] text-charcoal-muted flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Strict separation: Quoted vs Agreed vs Verified Money</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* 1. Quoted Revenue */}
          <div className="bg-white rounded-2xl border border-cream-border p-5 shadow-soft hover:border-gold/50 transition-all relative overflow-hidden group">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[11px] font-bold text-charcoal-muted uppercase tracking-wider">
                1. Quoted Revenue
              </span>
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">
                Stage 4 Proposals
              </span>
            </div>
            <div className="text-2xl sm:text-3xl font-serif font-bold text-charcoal">
              ₹{(crm.quotedRevenue || 0).toLocaleString("en-IN")}
            </div>
            <p className="text-xs text-charcoal-subtle mt-1.5 leading-snug">
              Total commercial quotation value presented to prospects across active proposal pipelines.
            </p>
            <div className="mt-4 pt-3 border-t border-cream-border/60 flex items-center justify-between text-[11px] text-charcoal-muted">
              <span>Proposals in play: <strong>{crm.proposalsSubmitted}</strong></span>
              <Link href="/admin/leads?stage=value_proposition" className="text-forest font-semibold hover:text-gold flex items-center gap-0.5">
                Inspect <ChevronRight className="w-3 h-3" />
              </Link>
            </div>
          </div>

          {/* 2. Agreed Deal Value */}
          <div className="bg-white rounded-2xl border border-cream-border p-5 shadow-soft hover:border-gold/50 transition-all relative overflow-hidden group">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[11px] font-bold text-charcoal-muted uppercase tracking-wider">
                2. Agreed Deal Value
              </span>
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200">
                Negotiated / Signed
              </span>
            </div>
            <div className="text-2xl sm:text-3xl font-serif font-bold text-forest">
              ₹{(crm.agreedDealValue || 0).toLocaleString("en-IN")}
            </div>
            <p className="text-xs text-charcoal-subtle mt-1.5 leading-snug">
              Total legally agreed contract value finalized in negotiation or sealed in Closed Won contracts.
            </p>
            <div className="mt-4 pt-3 border-t border-cream-border/60 flex items-center justify-between text-[11px] text-charcoal-muted">
              <span>Negotiations: <strong>{crm.negotiationsInProgress}</strong> • Won: <strong>{crm.closedWonCount}</strong></span>
              <Link href="/admin/leads?stage=negotiation" className="text-forest font-semibold hover:text-gold flex items-center gap-0.5">
                Inspect <ChevronRight className="w-3 h-3" />
              </Link>
            </div>
          </div>

          {/* 3. Verified Money Received */}
          <div className="bg-gradient-to-br from-emerald-50/70 via-white to-white rounded-2xl border border-emerald-300 p-5 shadow-soft hover:shadow-md transition-all relative overflow-hidden group">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[11px] font-bold text-emerald-800 uppercase tracking-wider flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                3. Verified Money Received
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-600 text-white">
                Cash in Hand
              </span>
            </div>
            <div className="text-2xl sm:text-3xl font-serif font-bold text-emerald-900">
              ₹{(crm.verifiedMoneyReceived || 0).toLocaleString("en-IN")}
            </div>
            <p className="text-xs text-charcoal-subtle mt-1.5 leading-snug">
              Actual authenticated advance and milestone payments credited into company accounts.
            </p>
            <div className="mt-4 pt-3 border-t border-emerald-100 flex items-center justify-between text-[11px] text-charcoal-muted">
              <span>Verified receipts: <strong className="text-emerald-800">{crm.verifiedPaymentsCount} transactions</strong></span>
              <Link href="/admin/projects" className="text-emerald-800 font-semibold hover:underline flex items-center gap-0.5">
                View projects <ChevronRight className="w-3 h-3" />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 2: Core Operational CRM Metrics (6 Grid) */}
      <div className="space-y-3">
        <div className="text-[10px] font-bold text-forest tracking-wider uppercase">
          OPERATIONAL SNAPSHOT
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
          {/* Total Leads */}
          <Link
            href="/admin/leads"
            className="group bg-white rounded-xl border border-cream-border p-4 shadow-soft hover:shadow-md hover:border-gold/60 transition-all flex flex-col justify-between"
          >
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-charcoal-muted">
                Total Leads
              </span>
              <div className="w-7 h-7 rounded-lg bg-forest/5 group-hover:bg-gold/20 flex items-center justify-center transition-colors">
                <Inbox className="w-4 h-4 text-forest group-hover:text-gold transition-colors" />
              </div>
            </div>
            <div className="mt-2">
              <div className="text-2xl font-serif font-bold text-forest group-hover:text-forest-dark transition-colors">
                {crm.totalLeads}
              </div>
              <div className="text-[11px] text-charcoal-subtle flex items-center gap-1 mt-0.5">
                <span>{crm.newLeadsToday} new today</span>
                <ArrowUpRight className="w-3 h-3 text-gold opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            </div>
          </Link>

          {/* Open Leads */}
          <Link
            href="/admin/leads?status=open"
            className="group bg-white rounded-xl border border-cream-border p-4 shadow-soft hover:shadow-md hover:border-gold/60 transition-all flex flex-col justify-between"
          >
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-charcoal-muted">
                Open Leads
              </span>
              <div className="w-7 h-7 rounded-lg bg-blue-50 group-hover:bg-blue-100 flex items-center justify-center transition-colors">
                <Clock className="w-4 h-4 text-blue-700" />
              </div>
            </div>
            <div className="mt-2">
              <div className="text-2xl font-serif font-bold text-blue-900">
                {crm.openLeadsCount}
              </div>
              <div className="text-[11px] text-charcoal-subtle flex items-center gap-1 mt-0.5">
                <span>Active pipeline</span>
                <ArrowUpRight className="w-3 h-3 text-gold opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            </div>
          </Link>

          {/* Closed Won */}
          <Link
            href="/admin/leads?stage=closed_won"
            className="group bg-white rounded-xl border border-cream-border p-4 shadow-soft hover:shadow-md hover:border-emerald-400 transition-all flex flex-col justify-between"
          >
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-emerald-800">
                Closed Won
              </span>
              <div className="w-7 h-7 rounded-lg bg-emerald-50 group-hover:bg-emerald-100 flex items-center justify-center transition-colors">
                <Award className="w-4 h-4 text-emerald-700" />
              </div>
            </div>
            <div className="mt-2">
              <div className="text-2xl font-serif font-bold text-emerald-800">
                {crm.closedWonCount}
              </div>
              <div className="text-[11px] text-emerald-700 flex items-center gap-1 mt-0.5">
                <span>{crm.conversionRate}% win rate</span>
                <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            </div>
          </Link>

          {/* Closed Lost */}
          <Link
            href="/admin/leads?stage=closed_lost"
            className="group bg-white rounded-xl border border-cream-border p-4 shadow-soft hover:shadow-md hover:border-rose-300 transition-all flex flex-col justify-between"
          >
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-rose-800">
                Closed Lost
              </span>
              <div className="w-7 h-7 rounded-lg bg-rose-50 group-hover:bg-rose-100 flex items-center justify-center transition-colors">
                <AlertCircle className="w-4 h-4 text-rose-600" />
              </div>
            </div>
            <div className="mt-2">
              <div className="text-2xl font-serif font-bold text-rose-800">
                {crm.closedLostCount}
              </div>
              <div className="text-[11px] text-charcoal-subtle flex items-center gap-1 mt-0.5">
                <span>Loss audit records</span>
                <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            </div>
          </Link>

          {/* Total Verified Payments */}
          <div className="bg-white rounded-xl border border-cream-border p-4 shadow-soft flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-charcoal-muted">
                Verified Payments
              </span>
              <div className="w-7 h-7 rounded-lg bg-emerald-50 flex items-center justify-center">
                <DollarSign className="w-4 h-4 text-emerald-700" />
              </div>
            </div>
            <div className="mt-2">
              <div className="text-2xl font-serif font-bold text-emerald-800">
                {crm.verifiedPaymentsCount}
              </div>
              <div className="text-[11px] text-charcoal-subtle mt-0.5">
                Bank-confirmed receipts
              </div>
            </div>
          </div>

          {/* Active Projects */}
          <Link
            href="/admin/projects"
            className="group bg-white rounded-xl border border-cream-border p-4 shadow-soft hover:shadow-md hover:border-gold/60 transition-all flex flex-col justify-between"
          >
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-charcoal-muted">
                Active Projects
              </span>
              <div className="w-7 h-7 rounded-lg bg-forest/5 group-hover:bg-gold/20 flex items-center justify-center transition-colors">
                <Briefcase className="w-4 h-4 text-forest group-hover:text-gold transition-colors" />
              </div>
            </div>
            <div className="mt-2">
              <div className="text-2xl font-serif font-bold text-forest group-hover:text-forest-dark transition-colors">
                {crm.activeProjectsCount}
              </div>
              <div className="text-[11px] text-charcoal-subtle flex items-center gap-1 mt-0.5">
                <span>Field execution underway</span>
                <ArrowUpRight className="w-3 h-3 text-gold opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            </div>
          </Link>
        </div>
      </div>

      {/* SECTION 3: 8-Stage Visual Sales Funnel */}
      <div className="space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
          <div>
            <div className="text-[10px] font-bold text-forest tracking-wider uppercase">
              WORKFLOW FUNNEL
            </div>
            <h2 className="text-lg font-serif font-bold text-charcoal">
              Leads by Sales Stage
            </h2>
          </div>
          <div className="text-xs text-charcoal-subtle">
            Click any stage to filter leads in the Lead Desk
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2.5">
          {STAGE_ORDER.map((stage) => {
            const count = crm.leadsByStage?.[stage.key] || 0;
            return (
              <Link
                key={stage.key}
                href={`/admin/leads?stage=${stage.key}`}
                className={`p-3.5 rounded-xl border ${stage.border} ${stage.bg} hover:shadow-sm hover:scale-[1.02] transition-all flex flex-col justify-between group`}
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-wider opacity-60">
                      Step {stage.step}
                    </span>
                    <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity text-charcoal-muted" />
                  </div>
                  <div className={`text-xs font-bold mt-1 ${stage.color} truncate`}>
                    {stage.name}
                  </div>
                </div>
                <div className="mt-3">
                  <div className="text-xl font-serif font-bold text-charcoal">
                    {count}
                  </div>
                  <div className="text-[10px] text-charcoal-subtle">
                    {count === 1 ? "1 lead" : `${count} leads`}
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      {/* SECTION 4: Recent Lead Activity Stream ("The Paper Trail") & Recent Enquiries */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (2 cols): Real-Time Lead Activity Stream */}
        <AdminCard
          title="Recent Lead Activity — The Paper Trail"
          subtitle="Real-time timeline of consultations, qualification steps, proposals, and stage conversions"
          actions={
            <Link href="/admin/leads">
              <AdminButton variant="outline" size="sm">
                Open Lead Desk
              </AdminButton>
            </Link>
          }
          className="lg:col-span-2"
        >
          {loading ? (
            <div className="py-12 text-center text-charcoal-muted text-xs">
              <RefreshCw className="w-5 h-5 animate-spin mx-auto text-forest mb-2" />
              <span>Loading real-time activity stream...</span>
            </div>
          ) : !crm.recentLeadActivity || crm.recentLeadActivity.length === 0 ? (
            <div className="py-12 text-center text-charcoal-muted text-xs">
              <Activity className="w-8 h-8 mx-auto text-charcoal-subtle/50 mb-2" />
              <p className="font-semibold text-charcoal">No CRM activity logged yet</p>
              <p className="text-charcoal-subtle mt-0.5">
                New website enquiries, notes, qualification transitions, and proposal submissions will stream here automatically.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-cream-border/60">
              {crm.recentLeadActivity.map((act) => {
                const badgeColor =
                  act.type === "lead_created"
                    ? "bg-blue-100 text-blue-800 border-blue-200"
                    : act.type === "stage_changed"
                    ? "bg-amber-100 text-amber-800 border-amber-200"
                    : act.type === "proposal_sent"
                    ? "bg-indigo-100 text-indigo-800 border-indigo-200"
                    : act.type === "payment_recorded"
                    ? "bg-emerald-100 text-emerald-800 border-emerald-300"
                    : act.type === "converted_to_project"
                    ? "bg-emerald-600 text-white border-emerald-700"
                    : act.type === "closed_lost"
                    ? "bg-rose-100 text-rose-800 border-rose-200"
                    : "bg-stone-100 text-stone-700 border-stone-200";

                const dateStr = new Date(act.timestamp).toLocaleDateString("en-IN", {
                  day: "2-digit",
                  month: "short",
                });
                const timeStr = new Date(act.timestamp).toLocaleTimeString("en-IN", {
                  hour: "2-digit",
                  minute: "2-digit",
                });

                return (
                  <div key={act.id} className="py-3.5 flex items-start justify-between gap-4 hover:bg-ivory-surface/40 transition-colors rounded-lg px-2">
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 rounded-full bg-gold mt-1.5 shrink-0" />
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border ${badgeColor}`}>
                            {act.type.replace(/_/g, " ")}
                          </span>
                          <Link
                            href={`/admin/leads/${act.leadId}`}
                            className="font-mono text-xs font-semibold text-forest hover:text-gold hover:underline"
                          >
                            {act.leadReferenceId}
                          </Link>
                          <span className="text-xs text-charcoal font-medium">
                            • {act.customerName}
                          </span>
                        </div>

                        <div className="text-xs font-semibold text-charcoal mt-1">
                          {act.title}
                        </div>
                        {act.description && (
                          <div className="text-[11px] text-charcoal-muted mt-0.5 line-clamp-2">
                            {act.description}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <div className="text-[11px] font-medium text-charcoal-subtle">
                        {dateStr}
                      </div>
                      <div className="text-[10px] text-charcoal-subtle/70">
                        {timeStr}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </AdminCard>

        {/* Right Column (1 col): CMS Quick Launch & Website Summary */}
        <div className="space-y-6">
          <AdminCard
            title="Content & CMS Hub"
            subtitle="Quick shortcuts for website content"
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
                      15+ Agricultural Services
                    </div>
                    <div className="text-[11px] text-charcoal-muted">
                      {stats ? `${stats.activeServices} active / ${stats.totalServices} total` : "Manage catalog"}
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
                      Homepage Layout & Hero
                    </div>
                    <div className="text-[11px] text-charcoal-muted">
                      Hero headlines & section ordering
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
                      7-Step Landowner Workflow
                    </div>
                    <div className="text-[11px] text-charcoal-muted">
                      Customer principles & policies
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
                      {stats ? `${stats.mediaAssetsCount} imagery assets` : "Photo vault"}
                    </div>
                  </div>
                </div>
                <ArrowUpRight className="w-4 h-4 text-charcoal-subtle group-hover:text-gold transition-colors" />
              </Link>
            </div>
          </AdminCard>

          {/* Website Enquiries Shortcut */}
          <AdminCard
            title="Web Inquiries & Contact"
            subtitle="Raw submissions from public contact forms"
            actions={
              <Link href="/admin/enquiries" className="text-xs text-forest font-semibold hover:underline">
                View all ({stats?.totalEnquiries || 0})
              </Link>
            }
          >
            {loading ? (
              <div className="py-4 text-center text-charcoal-muted text-xs">Loading...</div>
            ) : !stats?.recentEnquiries || stats.recentEnquiries.length === 0 ? (
              <div className="py-6 text-center text-charcoal-muted text-xs">
                No raw contact submissions yet.
              </div>
            ) : (
              <div className="space-y-2">
                {stats.recentEnquiries.slice(0, 3).map((enq) => (
                  <div key={enq.id} className="p-2.5 rounded-lg bg-ivory-surface/60 border border-cream-border/60 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-charcoal">{enq.name}</span>
                      <span className="text-[10px] text-charcoal-subtle">{new Date(enq.createdAt).toLocaleDateString()}</span>
                    </div>
                    <div className="text-[11px] text-forest font-medium mt-0.5">
                      {enq.serviceInterest || "General Inquiry"}
                    </div>
                    <div className="text-[11px] text-charcoal-subtle mt-0.5 truncate">
                      {enq.phone || enq.email}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </AdminCard>
        </div>
      </div>
    </div>
  );
}
