"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import {
  Inbox,
  Search,
  Filter,
  Download,
  Plus,
  ArrowUpRight,
  Sparkles,
  Phone,
  Mail,
  MapPin,
  CheckCircle2,
  Clock,
  XCircle,
  AlertCircle,
  RefreshCw,
  Building,
  User,
  DollarSign,
  Briefcase,
  X,
} from "lucide-react";
import { LeadItem, SalesStage, LeadStatus, LeadSource, LeadPriority } from "@/lib/cms/types";

const STAGE_LABELS: Record<SalesStage, { name: string; step: number; color: string }> = {
  prospecting: { name: "Prospecting", step: 1, color: "bg-blue-50 text-blue-700 border-blue-200" },
  qualification: { name: "Qualification", step: 2, color: "bg-amber-50 text-amber-700 border-amber-200" },
  need_analysis: { name: "Need Analysis", step: 3, color: "bg-purple-50 text-purple-700 border-purple-200" },
  value_proposition: { name: "Value Proposition", step: 4, color: "bg-indigo-50 text-indigo-700 border-indigo-200" },
  decision_makers: { name: "Decision Makers", step: 5, color: "bg-orange-50 text-orange-700 border-orange-200" },
  negotiation: { name: "Negotiation & Payment", step: 6, color: "bg-teal-50 text-teal-700 border-teal-200" },
  closed_won: { name: "Closed Won", step: 7, color: "bg-emerald-50 text-emerald-800 border-emerald-300" },
  closed_lost: { name: "Closed Lost", step: 0, color: "bg-rose-50 text-rose-700 border-rose-200" },
};

export default function LeadsDeskPage() {
  const [leads, setLeads] = useState<LeadItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [stageFilter, setStageFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [sourceFilter, setSourceFilter] = useState<string>("all");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  // New Lead Form State
  const [newLead, setNewLead] = useState({
    name: "",
    phone: "",
    email: "",
    location: "",
    source: "website" as LeadSource,
    serviceCategory: "Home & Terrace Gardening",
    message: "",
    initialRequirements: "",
    estimatedDealValue: "",
    priority: "medium" as LeadPriority,
    assignedExecutive: "Suresh Varma",
  });

  const fetchLeads = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (search) params.set("search", search);
      if (stageFilter !== "all") params.set("stage", stageFilter);
      if (statusFilter !== "all") params.set("status", statusFilter);
      if (sourceFilter !== "all") params.set("source", sourceFilter);

      const res = await fetch(`/api/admin/leads?${params.toString()}`);
      const data = await res.json();
      if (data.success && Array.isArray(data.data)) {
        setLeads(data.data);
      }
    } catch (err) {
      console.error("Failed to load leads:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeads();
  }, [stageFilter, statusFilter, sourceFilter]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchLeads();
  };

  const handleResetFilters = () => {
    setSearch("");
    setStageFilter("all");
    setStatusFilter("all");
    setSourceFilter("all");
  };

  const handleCreateLead = async (e: React.FormEvent, allowDuplicate = false) => {
    e.preventDefault();
    setFormError(null);
    setSubmitting(true);

    try {
      const res = await fetch("/api/admin/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...newLead,
          allowDuplicate,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        if (res.status === 409 && data.isDuplicate) {
          if (confirm(`${data.message}\n\nDo you still want to register this enquiry as a separate record?`)) {
            return handleCreateLead(e, true);
          }
        }
        throw new Error(data.error || data.message || "Failed to create lead");
      }

      setIsModalOpen(false);
      setNewLead({
        name: "",
        phone: "",
        email: "",
        location: "",
        source: "website",
        serviceCategory: "Home & Terrace Gardening",
        message: "",
        initialRequirements: "",
        estimatedDealValue: "",
        priority: "medium",
        assignedExecutive: "Suresh Varma",
      });
      fetchLeads();
    } catch (err: any) {
      setFormError(err.message || "Could not register lead");
    } finally {
      setSubmitting(false);
    }
  };

  const stats = useMemo(() => {
    const total = leads.length;
    const open = leads.filter((l) => l.status === "open").length;
    const won = leads.filter((l) => l.status === "closed_won" || l.currentStage === "closed_won").length;
    const lost = leads.filter((l) => l.status === "closed_lost" || l.currentStage === "closed_lost").length;
    const pipelineVal = leads
      .filter((l) => l.status === "open")
      .reduce((sum, l) => sum + (l.estimatedDealValue || 0), 0);

    return { total, open, won, lost, pipelineVal };
  }, [leads]);

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-[#E6E1D8]">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl md:text-3xl font-serif text-[#1B3B2B] font-bold">
              Lead desk
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#1B3B2B]/10 text-[#1B3B2B] border border-[#1B3B2B]/20">
              {stats.total} total leads
            </span>
          </div>
          <p className="text-xs md:text-sm text-[#4A5D4E] mt-1">
            Incoming customer enquiries, qualification journey, and sales pipeline.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Link
            href="/api/admin/leads?format=csv"
            target="_blank"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium text-[#1B3B2B] bg-white border border-[#DCD5C5] rounded-lg hover:bg-[#F3EFE6] transition-colors shadow-sm"
          >
            <Download className="w-3.5 h-3.5 text-[#8C7A5B]" />
            Export CSV
          </Link>

          <Link
            href="/admin/leads/dashboard"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium text-[#1B3B2B] bg-white border border-[#DCD5C5] rounded-lg hover:bg-[#F3EFE6] transition-colors shadow-sm"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#C5A869]" />
            CRM Analytics
          </Link>

          <button
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-[#1B3B2B] hover:bg-[#152e22] rounded-lg shadow-sm transition-all"
          >
            <Plus className="w-4 h-4" />
            + New Lead
          </button>
        </div>
      </div>

      {/* Quick Stats Ribbon */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="bg-white p-3.5 rounded-xl border border-[#E6E1D8] shadow-sm">
          <div className="text-[11px] font-medium text-[#7C887E] uppercase tracking-wider">Active Pipeline</div>
          <div className="text-xl font-bold text-[#1B3B2B] mt-1">{stats.open}</div>
          <div className="text-[11px] text-[#4A5D4E] mt-0.5">In qualification & proposal</div>
        </div>
        <div className="bg-white p-3.5 rounded-xl border border-[#E6E1D8] shadow-sm">
          <div className="text-[11px] font-medium text-[#7C887E] uppercase tracking-wider">Pipeline Value</div>
          <div className="text-xl font-bold text-[#1B3B2B] mt-1">
            ₹{stats.pipelineVal.toLocaleString("en-IN")}
          </div>
          <div className="text-[11px] text-[#4A5D4E] mt-0.5">Estimated open deals</div>
        </div>
        <div className="bg-white p-3.5 rounded-xl border border-[#E6E1D8] shadow-sm">
          <div className="text-[11px] font-medium text-[#7C887E] uppercase tracking-wider">Closed Won</div>
          <div className="text-xl font-bold text-emerald-700 mt-1">{stats.won}</div>
          <div className="text-[11px] text-emerald-600 mt-0.5">Converted to projects</div>
        </div>
        <div className="bg-white p-3.5 rounded-xl border border-[#E6E1D8] shadow-sm">
          <div className="text-[11px] font-medium text-[#7C887E] uppercase tracking-wider">Closed Lost</div>
          <div className="text-xl font-bold text-slate-600 mt-1">{stats.lost}</div>
          <div className="text-[11px] text-slate-500 mt-0.5">Unqualified or lost</div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-[#E6E1D8] shadow-sm">
        <form onSubmit={handleSearchSubmit} className="flex flex-col lg:flex-row items-stretch lg:items-center gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-[#8C7A5B] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by name, phone, email, location..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs md:text-sm bg-[#FAF8F5] border border-[#DCD5C5] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#1B3B2B] text-[#1B3B2B]"
            />
          </div>

          <div className="grid grid-cols-3 gap-2">
            <select
              value={stageFilter}
              onChange={(e) => setStageFilter(e.target.value)}
              aria-label="Filter by stage"
              className="px-3 py-2 text-xs bg-[#FAF8F5] border border-[#DCD5C5] rounded-lg text-[#1B3B2B] focus:outline-none focus:ring-1 focus:ring-[#1B3B2B]"
            >
              <option value="all">Every stage</option>
              <option value="prospecting">1 · Prospecting</option>
              <option value="qualification">2 · Qualification</option>
              <option value="need_analysis">3 · Need Analysis</option>
              <option value="value_proposition">4 · Value Proposition</option>
              <option value="decision_makers">5 · Decision Makers</option>
              <option value="negotiation">6 · Negotiation & Payment</option>
              <option value="closed_won">7 · Closed Won</option>
              <option value="closed_lost">Closed Lost</option>
            </select>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              aria-label="Filter by status"
              className="px-3 py-2 text-xs bg-[#FAF8F5] border border-[#DCD5C5] rounded-lg text-[#1B3B2B] focus:outline-none focus:ring-1 focus:ring-[#1B3B2B]"
            >
              <option value="all">Every status</option>
              <option value="open">Open</option>
              <option value="closed_won">Closed Won</option>
              <option value="closed_lost">Closed Lost</option>
              <option value="disqualified">Disqualified</option>
            </select>

            <select
              value={sourceFilter}
              onChange={(e) => setSourceFilter(e.target.value)}
              aria-label="Filter by source"
              className="px-3 py-2 text-xs bg-[#FAF8F5] border border-[#DCD5C5] rounded-lg text-[#1B3B2B] focus:outline-none focus:ring-1 focus:ring-[#1B3B2B]"
            >
              <option value="all">Every source</option>
              <option value="website">Web Enquiry</option>
              <option value="phone">Phone</option>
              <option value="referral">Referral</option>
              <option value="campaign">Campaign</option>
              <option value="manual">Manual Entry</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="submit"
              className="px-4 py-2 bg-[#1B3B2B] text-white text-xs font-medium rounded-lg hover:bg-[#152e22] transition-colors whitespace-nowrap"
            >
              Apply filters →
            </button>
            <button
              type="button"
              onClick={handleResetFilters}
              className="px-3 py-2 bg-[#F3EFE6] text-[#4A5D4E] text-xs font-medium rounded-lg hover:bg-[#EBE5D8] transition-colors"
            >
              Reset
            </button>
          </div>
        </form>
      </div>

      {/* Leads Table */}
      <div className="bg-white rounded-xl border border-[#E6E1D8] shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-[#7C887E]">
            <RefreshCw className="w-6 h-6 animate-spin mx-auto text-[#1B3B2B] mb-2" />
            <p className="text-xs">Loading leads desk...</p>
          </div>
        ) : leads.length === 0 ? (
          <div className="p-12 text-center text-[#7C887E]">
            <Inbox className="w-10 h-10 mx-auto text-[#B5A48B] mb-3 opacity-60" />
            <h3 className="text-base font-semibold text-[#1B3B2B]">No leads found</h3>
            <p className="text-xs text-[#7C887E] mt-1 max-w-sm mx-auto">
              There are no customer enquiries matching your current search or filter criteria.
            </p>
            <button
              onClick={() => setIsModalOpen(true)}
              className="mt-4 inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium text-white bg-[#1B3B2B] rounded-lg hover:bg-[#152e22]"
            >
              <Plus className="w-3.5 h-3.5" />
              Register New Lead
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#FAF8F5] text-[#7C887E] uppercase text-[10px] tracking-wider font-semibold border-b border-[#E6E1D8]">
                <tr>
                  <th className="py-3 px-4">Enquiry</th>
                  <th className="py-3 px-4">Customer</th>
                  <th className="py-3 px-4">Service & Location</th>
                  <th className="py-3 px-4">Stage</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Received</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E6E1D8]">
                {leads.map((lead) => {
                  const stageInfo = STAGE_LABELS[lead.currentStage] || {
                    name: lead.currentStage,
                    step: 0,
                    color: "bg-gray-100 text-gray-700 border-gray-200",
                  };

                  return (
                    <tr
                      key={lead.id}
                      className="hover:bg-[#FAF8F5]/80 transition-colors group cursor-pointer"
                      onClick={() => (window.location.href = `/admin/leads/${lead.id}`)}
                    >
                      {/* ENQUIRY */}
                      <td className="py-3.5 px-4 font-mono">
                        <div className="font-bold text-[#1B3B2B] text-xs flex items-center gap-2">
                          {lead.referenceId}
                        </div>
                        <div className="flex items-center gap-1.5 mt-0.5">
                          <span className="text-[10px] font-sans px-1.5 py-0.2 rounded bg-[#FAF8F5] text-[#7C887E] border border-[#E6E1D8] uppercase">
                            {lead.source}
                          </span>
                          {lead.priority === "high" || lead.priority === "critical" ? (
                            <span className="text-[10px] font-sans px-1.5 py-0.2 rounded bg-amber-50 text-amber-700 border border-amber-200 uppercase font-semibold">
                              {lead.priority}
                            </span>
                          ) : null}
                        </div>
                      </td>

                      {/* CUSTOMER */}
                      <td className="py-3.5 px-4">
                        <div className="font-semibold text-[#1B3B2B] text-xs">
                          {lead.name}
                        </div>
                        <div className="text-[11px] text-[#4A5D4E] flex items-center gap-2 mt-0.5">
                          <span>{lead.phone}</span>
                          {lead.location && (
                            <>
                              <span>•</span>
                              <span>{lead.location}</span>
                            </>
                          )}
                        </div>
                      </td>

                      {/* SERVICE & LOCATION */}
                      <td className="py-3.5 px-4">
                        <div className="text-[#1B3B2B] font-medium line-clamp-1">
                          {lead.serviceCategory || "Agricultural Planning"}
                        </div>
                        <div className="text-[11px] text-[#7C887E] mt-0.5">
                          {lead.estimatedDealValue
                            ? `Est. ₹${lead.estimatedDealValue.toLocaleString("en-IN")}`
                            : lead.location || "Location pending"}
                        </div>
                      </td>

                      {/* STAGE */}
                      <td className="py-3.5 px-4">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium border ${stageInfo.color}`}
                        >
                          {stageInfo.step > 0 && (
                            <span className="w-3.5 h-3.5 rounded-full bg-current/15 flex items-center justify-center text-[9px] font-bold">
                              {stageInfo.step}
                            </span>
                          )}
                          {stageInfo.name}
                        </span>
                      </td>

                      {/* STATUS */}
                      <td className="py-3.5 px-4">
                        {lead.status === "closed_won" ? (
                          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                            Closed Won
                          </span>
                        ) : lead.status === "closed_lost" ? (
                          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-rose-700 bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
                            <XCircle className="w-3 h-3 text-rose-500" />
                            Closed Lost
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#1B3B2B] bg-[#1B3B2B]/5 px-2 py-0.5 rounded border border-[#1B3B2B]/10">
                            <Clock className="w-3 h-3 text-[#1B3B2B]" />
                            Open
                          </span>
                        )}
                      </td>

                      {/* RECEIVED */}
                      <td className="py-3.5 px-4 text-[#7C887E] whitespace-nowrap text-[11px]">
                        {new Date(lead.createdAt).toLocaleDateString("en-IN", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        })}
                      </td>

                      {/* ACTION */}
                      <td className="py-3.5 px-4 text-right">
                        <Link
                          href={`/admin/leads/${lead.id}`}
                          onClick={(e) => e.stopPropagation()}
                          className="inline-flex items-center justify-center w-7 h-7 rounded-lg text-[#1B3B2B] bg-[#FAF8F5] border border-[#DCD5C5] hover:bg-[#1B3B2B] hover:text-white transition-all shadow-sm"
                          title="Open Lead Journey"
                        >
                          <ArrowUpRight className="w-3.5 h-3.5" />
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* New Lead Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-2xl border border-[#DCD5C5] shadow-xl w-full max-w-xl overflow-hidden">
            <div className="px-6 py-4 bg-[#FAF8F5] border-b border-[#E6E1D8] flex items-center justify-between">
              <div>
                <h3 className="text-lg font-serif font-bold text-[#1B3B2B]">
                  Register New Customer Lead
                </h3>
                <p className="text-xs text-[#7C887E]">
                  Create an enquiry record and start the 7-step qualification pipeline.
                </p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="w-8 h-8 rounded-full flex items-center justify-center text-[#7C887E] hover:bg-[#EBE5D8] transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {formError && (
              <div className="mx-6 mt-4 p-3 bg-rose-50 border border-rose-200 rounded-lg flex items-center gap-2 text-xs text-rose-700">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{formError}</span>
              </div>
            )}

            <form onSubmit={(e) => handleCreateLead(e, false)} className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#1B3B2B] mb-1">
                    Customer Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={newLead.name}
                    onChange={(e) => setNewLead({ ...newLead, name: e.target.value })}
                    placeholder="e.g. Ramesh Kumar"
                    className="w-full px-3 py-2 text-xs bg-[#FAF8F5] border border-[#DCD5C5] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#1B3B2B]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#1B3B2B] mb-1">
                    Phone Number (WhatsApp) *
                  </label>
                  <input
                    type="tel"
                    required
                    value={newLead.phone}
                    onChange={(e) => setNewLead({ ...newLead, phone: e.target.value })}
                    placeholder="e.g. 9876543210"
                    className="w-full px-3 py-2 text-xs bg-[#FAF8F5] border border-[#DCD5C5] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#1B3B2B]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#1B3B2B] mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={newLead.email}
                    onChange={(e) => setNewLead({ ...newLead, email: e.target.value })}
                    placeholder="e.g. client@example.com"
                    className="w-full px-3 py-2 text-xs bg-[#FAF8F5] border border-[#DCD5C5] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#1B3B2B]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#1B3B2B] mb-1">
                    Location / Village / City
                  </label>
                  <input
                    type="text"
                    value={newLead.location}
                    onChange={(e) => setNewLead({ ...newLead, location: e.target.value })}
                    placeholder="e.g. Rajahmundry, AP"
                    className="w-full px-3 py-2 text-xs bg-[#FAF8F5] border border-[#DCD5C5] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#1B3B2B]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#1B3B2B] mb-1">
                    Service Interest
                  </label>
                  <select
                    value={newLead.serviceCategory}
                    onChange={(e) => setNewLead({ ...newLead, serviceCategory: e.target.value })}
                    className="w-full px-3 py-2 text-xs bg-[#FAF8F5] border border-[#DCD5C5] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#1B3B2B]"
                  >
                    <option value="Home & Terrace Gardening">Home & Terrace Gardening</option>
                    <option value="Agricultural Land Development">Agricultural Land Development</option>
                    <option value="Managed Farm Care">Managed Farm Care</option>
                    <option value="Commercial Orchard Planning">Commercial Orchard Planning</option>
                    <option value="Farmhouse & Estate Landscaping">Farmhouse & Estate Landscaping</option>
                    <option value="Precision Drip Irrigation">Precision Drip Irrigation</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#1B3B2B] mb-1">
                    Lead Source
                  </label>
                  <select
                    value={newLead.source}
                    onChange={(e) => setNewLead({ ...newLead, source: e.target.value as LeadSource })}
                    className="w-full px-3 py-2 text-xs bg-[#FAF8F5] border border-[#DCD5C5] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#1B3B2B]"
                  >
                    <option value="website">Website Form</option>
                    <option value="phone">Incoming Phone Call</option>
                    <option value="referral">Client Referral</option>
                    <option value="campaign">Marketing Campaign</option>
                    <option value="social_media">Social Media</option>
                    <option value="manual">Manual Sales Entry</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#1B3B2B] mb-1">
                    Estimated Deal Budget (₹)
                  </label>
                  <input
                    type="number"
                    value={newLead.estimatedDealValue}
                    onChange={(e) => setNewLead({ ...newLead, estimatedDealValue: e.target.value })}
                    placeholder="e.g. 150000"
                    className="w-full px-3 py-2 text-xs bg-[#FAF8F5] border border-[#DCD5C5] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#1B3B2B]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#1B3B2B] mb-1">
                    Assigned Executive
                  </label>
                  <input
                    type="text"
                    value={newLead.assignedExecutive}
                    onChange={(e) => setNewLead({ ...newLead, assignedExecutive: e.target.value })}
                    placeholder="e.g. Suresh Varma"
                    className="w-full px-3 py-2 text-xs bg-[#FAF8F5] border border-[#DCD5C5] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#1B3B2B]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#1B3B2B] mb-1">
                  Customer Enquiry / Requirements
                </label>
                <textarea
                  rows={3}
                  value={newLead.initialRequirements}
                  onChange={(e) =>
                    setNewLead({
                      ...newLead,
                      initialRequirements: e.target.value,
                      message: e.target.value,
                    })
                  }
                  placeholder="Describe what the customer requires (e.g. 2 acres mango grove revitalization or 500 sqft organic kitchen garden setup)..."
                  className="w-full px-3 py-2 text-xs bg-[#FAF8F5] border border-[#DCD5C5] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#1B3B2B]"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-3 border-t border-[#E6E1D8]">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-xs font-medium text-[#7C887E] hover:bg-[#F3EFE6] rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2 text-xs font-semibold text-white bg-[#1B3B2B] hover:bg-[#152e22] rounded-lg transition-all shadow-sm disabled:opacity-60"
                >
                  {submitting ? "Saving Lead..." : "Create Lead & Start Journey →"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
