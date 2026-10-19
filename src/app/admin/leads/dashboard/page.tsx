"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Sparkles,
  TrendingUp,
  DollarSign,
  Users,
  CheckCircle2,
  XCircle,
  Clock,
  Layers,
  ArrowUpRight,
  Briefcase,
  AlertCircle,
  RefreshCw,
  PieChart,
} from "lucide-react";

export default function CrmDashboardPage() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/leads/stats");
      const data = await res.json();
      if (data.success && data.data) {
        setStats(data.data);
      }
    } catch (err) {
      console.error("Failed to load CRM stats:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="p-16 text-center text-[#7C887E]">
        <RefreshCw className="w-8 h-8 animate-spin mx-auto text-[#1B3B2B] mb-3" />
        <p className="text-sm">Calculating CRM analytics and pipeline metrics...</p>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="p-12 text-center text-[#7C887E]">
        <AlertCircle className="w-10 h-10 text-rose-500 mx-auto mb-3" />
        <p className="text-sm">Failed to load CRM analytics.</p>
      </div>
    );
  }

  const stageLabels: Record<string, string> = {
    prospecting: "1. Prospecting",
    qualification: "2. Qualification",
    need_analysis: "3. Need Analysis",
    value_proposition: "4. Value Proposition",
    decision_makers: "5. Decision Makers",
    negotiation: "6. Negotiation & Payment",
    closed_won: "7. Closed Won",
    closed_lost: "Closed Lost",
  };

  return (
    <div className="space-y-6 pb-16">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-[#E6E1D8]">
        <div>
          <div className="flex items-center gap-2">
            <Link
              href="/admin/leads"
              className="text-xs font-semibold text-[#4A5D4E] hover:text-[#1B3B2B] flex items-center gap-1"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Leads Desk
            </Link>
          </div>
          <h1 className="text-2xl md:text-3xl font-serif font-bold text-[#1B3B2B] mt-1">
            CRM & Pipeline Analytics
          </h1>
          <p className="text-xs md:text-sm text-[#4A5D4E]">
            High-level visibility into revenue generation, stage velocities, and lead conversions.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/admin/leads"
            className="px-4 py-2 bg-[#1B3B2B] text-white text-xs font-semibold rounded-lg hover:bg-[#152e22] transition-colors shadow-sm"
          >
            Go to Lead Desk →
          </Link>
        </div>
      </div>

      {/* Hero KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Pipeline Value */}
        <div className="bg-white p-5 rounded-2xl border border-[#E6E1D8] shadow-sm">
          <div className="flex items-center justify-between text-xs text-[#7C887E]">
            <span className="font-semibold uppercase tracking-wider text-[10px]">Total Pipeline Value</span>
            <DollarSign className="w-4 h-4 text-[#C5A869]" />
          </div>
          <div className="text-2xl font-bold text-[#1B3B2B] mt-2 font-serif">
            ₹{(stats.totalPipelineValue || 0).toLocaleString("en-IN")}
          </div>
          <div className="text-[11px] text-[#4A5D4E] mt-1">
            Across {stats.openLeadsCount || 0} active opportunities
          </div>
        </div>

        {/* Won Revenue */}
        <div className="bg-white p-5 rounded-2xl border border-[#E6E1D8] shadow-sm">
          <div className="flex items-center justify-between text-xs text-[#7C887E]">
            <span className="font-semibold uppercase tracking-wider text-[10px]">Won Revenue</span>
            <Sparkles className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-bold text-emerald-800 mt-2 font-serif">
            ₹{(stats.wonRevenue || 0).toLocaleString("en-IN")}
          </div>
          <div className="text-[11px] text-emerald-600 mt-1">
            From {stats.closedWonCount || 0} executed projects
          </div>
        </div>

        {/* Conversion Rate */}
        <div className="bg-white p-5 rounded-2xl border border-[#E6E1D8] shadow-sm">
          <div className="flex items-center justify-between text-xs text-[#7C887E]">
            <span className="font-semibold uppercase tracking-wider text-[10px]">Conversion Rate</span>
            <TrendingUp className="w-4 h-4 text-indigo-600" />
          </div>
          <div className="text-2xl font-bold text-[#1B3B2B] mt-2 font-serif">
            {stats.conversionRate || 0}%
          </div>
          <div className="text-[11px] text-[#4A5D4E] mt-1">
            Won vs Decided deals
          </div>
        </div>

        {/* Active Projects */}
        <div className="bg-white p-5 rounded-2xl border border-[#E6E1D8] shadow-sm">
          <div className="flex items-center justify-between text-xs text-[#7C887E]">
            <span className="font-semibold uppercase tracking-wider text-[10px]">Active Field Projects</span>
            <Briefcase className="w-4 h-4 text-teal-600" />
          </div>
          <div className="text-2xl font-bold text-[#1B3B2B] mt-2 font-serif">
            {stats.activeProjectsCount || 0}
          </div>
          <div className="text-[11px] text-[#4A5D4E] mt-1">
            Currently in execution
          </div>
        </div>
      </div>

      {/* Stage Breakdown & Funnel */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Pipeline Funnel Stage Distribution */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-[#E6E1D8] p-6 shadow-sm">
          <h3 className="text-base font-serif font-bold text-[#1B3B2B] mb-4">
            Sales Pipeline Funnel Distribution
          </h3>

          <div className="space-y-3">
            {Object.entries(stats.leadsByStage || {}).map(([stageKey, count]: [string, any]) => {
              const total = stats.totalLeads || 1;
              const pct = Math.round((count / total) * 100);
              const label = stageLabels[stageKey] || stageKey;

              return (
                <div key={stageKey} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-[#1B3B2B]">{label}</span>
                    <span className="text-[#7C887E] font-mono">
                      {count} ({pct}%)
                    </span>
                  </div>
                  <div className="h-2 w-full bg-[#FAF8F5] rounded-full overflow-hidden border border-[#E6E1D8]/60">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        stageKey === "closed_won"
                          ? "bg-emerald-600"
                          : stageKey === "closed_lost"
                          ? "bg-rose-400"
                          : "bg-[#1B3B2B]"
                      }`}
                      style={{ width: `${Math.max(4, pct)}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Source Breakdown & Quick Stats */}
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-[#E6E1D8] p-6 shadow-sm">
            <h3 className="text-base font-serif font-bold text-[#1B3B2B] mb-4">
              Leads by Origin
            </h3>

            <div className="space-y-2.5">
              {Object.entries(stats.leadsBySource || {}).map(([source, count]: [string, any]) => (
                <div
                  key={source}
                  className="flex items-center justify-between p-2.5 bg-[#FAF8F5] rounded-xl border border-[#E6E1D8] text-xs"
                >
                  <span className="font-semibold text-[#1B3B2B] capitalize">
                    {source.replace(/_/g, " ")}
                  </span>
                  <span className="font-mono font-bold text-[#1B3B2B] bg-white px-2 py-0.5 rounded border border-[#DCD5C5]">
                    {count}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-[#FAF8F5] rounded-2xl border border-[#DCD5C5] p-5">
            <h4 className="text-xs font-bold text-[#8C7A5B] uppercase tracking-wider mb-2">
              Pipeline Health Insights
            </h4>
            <div className="space-y-2 text-xs text-[#4A5D4E]">
              <div className="flex justify-between">
                <span>Qualification Pending:</span>
                <span className="font-bold text-[#1B3B2B]">{stats.qualificationPending}</span>
              </div>
              <div className="flex justify-between">
                <span>Proposals Submitted:</span>
                <span className="font-bold text-[#1B3B2B]">{stats.proposalsSubmitted}</span>
              </div>
              <div className="flex justify-between">
                <span>Negotiations Ongoing:</span>
                <span className="font-bold text-[#1B3B2B]">{stats.negotiationsInProgress}</span>
              </div>
              <div className="flex justify-between">
                <span>Unassigned Leads:</span>
                <span className="font-bold text-amber-700">{stats.unassignedLeads}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
