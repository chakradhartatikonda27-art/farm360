"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import {
  Briefcase,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  ArrowUpRight,
  Plus,
  RefreshCw,
  AlertCircle,
  ExternalLink,
  ChevronRight,
  Calendar,
  X,
} from "lucide-react";
import { ProjectItem } from "@/lib/cms/types";

export default function ProjectsListPage() {
  const [projects, setProjects] = useState<ProjectItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [serviceFilter, setServiceFilter] = useState("all");

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/projects");
      const data = await res.json();
      if (data.success && Array.isArray(data.data)) {
        setProjects(data.data);
      }
    } catch (err) {
      console.error("Failed to load projects:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const stats = useMemo(() => {
    const total = projects.length;
    const inProgress = projects.filter((p) => p.status === "in_progress" || p.status === "mobilization").length;
    const notStarted = projects.filter((p) => p.status === "planning").length;
    const completed = projects.filter((p) => p.status === "completed").length;
    return { total, inProgress, notStarted, completed };
  }, [projects]);

  const filteredProjects = useMemo(() => {
    return projects.filter((p) => {
      if (statusFilter !== "all" && p.status !== statusFilter) return false;
      if (serviceFilter !== "all" && p.serviceCategory !== serviceFilter) return false;
      if (search.trim()) {
        const q = search.toLowerCase();
        const matchRef = (p.referenceId || "").toLowerCase().includes(q);
        const matchTitle = (p.title || "").toLowerCase().includes(q);
        const matchClient = (p.customerName || "").toLowerCase().includes(q);
        const matchPhone = (p.customerPhone || "").toLowerCase().includes(q);
        const matchLoc = (p.location || "").toLowerCase().includes(q);
        if (!matchRef && !matchTitle && !matchClient && !matchPhone && !matchLoc) return false;
      }
      return true;
    });
  }, [projects, search, statusFilter, serviceFilter]);

  return (
    <div className="space-y-8 pb-16">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="text-[11px] font-bold text-[#4A5D4E] tracking-wider uppercase mb-1">
            DELIVERY & CLIENT CARE
          </div>
          <h1 className="text-3xl md:text-5xl font-serif font-bold text-[#1B3B2B] tracking-tight">
            Projects
          </h1>
          <p className="text-xs md:text-sm text-[#7C887E] mt-1.5">
            A clear record of every agreement, payment and step forward.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/admin/leads"
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-medium text-[#1B3B2B] bg-white border border-[#DCD5C5] rounded-lg hover:bg-[#F3EFE6] transition-colors shadow-sm"
          >
            <span>View lead desk</span>
            <span className="text-sm">↗</span>
          </Link>
          <button
            onClick={fetchProjects}
            title="Refresh projects"
            className="p-2 rounded-lg bg-white border border-[#DCD5C5] text-[#1B3B2B] hover:bg-[#FAF8F5] transition-colors shadow-sm"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          </button>
        </div>
      </div>

      {/* Stats Cards Ribbon */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-[#E6E1D8] shadow-sm">
          <div className="text-xs font-medium text-[#7C887E]">All projects</div>
          <div className="text-3xl font-bold text-[#1B3B2B] mt-2 font-serif">
            {stats.total}
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#E6E1D8] shadow-sm">
          <div className="text-xs font-medium text-[#7C887E]">In progress</div>
          <div className="text-3xl font-bold text-[#1B3B2B] mt-2 font-serif">
            {stats.inProgress}
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#E6E1D8] shadow-sm">
          <div className="text-xs font-medium text-[#7C887E]">Not started</div>
          <div className="text-3xl font-bold text-[#1B3B2B] mt-2 font-serif">
            {stats.notStarted}
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#E6E1D8] shadow-sm">
          <div className="text-xs font-medium text-[#7C887E]">Completed</div>
          <div className="text-3xl font-bold text-[#1B3B2B] mt-2 font-serif">
            {stats.completed}
          </div>
        </div>
      </div>

      {/* Search and Filters Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-[#8C7A5B] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by project ID, client name, phone, title, or location..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs bg-white border border-[#DCD5C5] rounded-lg text-[#1B3B2B] focus:outline-none focus:ring-1 focus:ring-[#1B3B2B]"
          />
        </div>

        <div className="flex flex-wrap sm:flex-nowrap items-center gap-2">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            aria-label="Every status"
            className="px-3 py-2 text-xs bg-white border border-[#DCD5C5] rounded-lg text-[#1B3B2B] focus:outline-none focus:ring-1 focus:ring-[#1B3B2B]"
          >
            <option value="all">Every status</option>
            <option value="planning">Planning (Not Started)</option>
            <option value="mobilization">Mobilization</option>
            <option value="in_progress">In Progress</option>
            <option value="completed">Completed</option>
            <option value="on_hold">On Hold</option>
          </select>

          <select
            value={serviceFilter}
            onChange={(e) => setServiceFilter(e.target.value)}
            aria-label="Every service"
            className="px-3 py-2 text-xs bg-white border border-[#DCD5C5] rounded-lg text-[#1B3B2B] focus:outline-none focus:ring-1 focus:ring-[#1B3B2B]"
          >
            <option value="all">Every service</option>
            <option value="Managed Farmland Care">Managed Farmland Care</option>
            <option value="Home & Terrace Gardening">Home & Terrace Gardening</option>
            <option value="Farmhouse & Villa Development">Farmhouse & Villa Development</option>
            <option value="Land Development & Fencing">Land Development & Fencing</option>
            <option value="Drip Irrigation & Water Automation">Drip Irrigation & Water Automation</option>
            <option value="Soil & Crop Health Management">Soil & Crop Health Management</option>
            <option value="Organic Cultivation">Organic Cultivation</option>
          </select>

          {(search || statusFilter !== "all" || serviceFilter !== "all") && (
            <button
              type="button"
              onClick={() => {
                setSearch("");
                setStatusFilter("all");
                setServiceFilter("all");
              }}
              className="px-3 py-2 text-xs font-semibold text-[#7C887E] hover:text-[#1B3B2B] bg-white border border-[#DCD5C5] rounded-lg transition-colors"
            >
              Reset
            </button>
          )}
        </div>
      </div>

      {/* Project Register Section */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1">
          <div>
            <div className="text-[10px] font-bold text-[#7C887E] tracking-wider uppercase">
              CLIENT WORK
            </div>
            <h2 className="text-xl font-serif font-bold text-[#1B3B2B] mt-0.5">
              Your project register ({filteredProjects.length})
            </h2>
          </div>
          <div className="text-xs text-[#7C887E]">
            Created from a won lead after an advance payment is verified
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-[#E6E1D8] shadow-sm overflow-hidden">
          {loading ? (
            <div className="p-12 text-center text-[#7C887E]">
              <RefreshCw className="w-6 h-6 animate-spin mx-auto text-[#1B3B2B] mb-2" />
              <p className="text-xs">Loading project register...</p>
            </div>
          ) : filteredProjects.length === 0 ? (
            <div className="p-12 text-center text-[#7C887E]">
              <Briefcase className="w-10 h-10 mx-auto text-[#B5A48B] mb-3 opacity-60" />
              <h3 className="text-base font-semibold text-[#1B3B2B]">
                {projects.length === 0 ? "No active projects" : "No matching projects"}
              </h3>
              <p className="text-xs text-[#7C887E] mt-1 max-w-sm mx-auto">
                {projects.length === 0
                  ? "When an enquiry advances to Closed Won, convert it into a registered project."
                  : "Try clearing your search query or reset your filters."}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#FAF8F5] text-[#7C887E] uppercase text-[10px] tracking-wider font-semibold border-b border-[#E6E1D8]">
                  <tr>
                    <th className="py-3 px-5">PROJECT</th>
                    <th className="py-3 px-5">CLIENT</th>
                    <th className="py-3 px-5">SERVICE</th>
                    <th className="py-3 px-5">STATUS</th>
                    <th className="py-3 px-5">AGREED VALUE</th>
                    <th className="py-3 px-5">RECEIVED</th>
                    <th className="py-3 px-5">CREATED</th>
                    <th className="py-3 px-5 text-right"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E6E1D8]">
                  {filteredProjects.map((project) => (
                    <tr
                      key={project.id}
                      className="hover:bg-[#FAF8F5]/80 transition-colors group cursor-pointer"
                      onClick={() => (window.location.href = `/admin/projects/${project.id}`)}
                    >
                      {/* PROJECT */}
                      <td className="py-4 px-5">
                        <div className="font-mono text-xs font-bold text-[#1B3B2B]">
                          {project.referenceId}
                        </div>
                        <div className="text-[11px] text-[#4A5D4E] font-medium mt-0.5 line-clamp-1">
                          {project.title}
                        </div>
                      </td>

                      {/* CLIENT */}
                      <td className="py-4 px-5">
                        <div className="font-bold text-[#1B3B2B] text-xs">
                          {project.customerName}
                        </div>
                        <div className="text-[11px] text-[#7C887E] mt-0.5">
                          {project.customerPhone}
                          {project.location ? ` · ${project.location}` : ""}
                        </div>
                      </td>

                      {/* SERVICE */}
                      <td className="py-4 px-5 text-[#1B3B2B] text-xs font-medium">
                        {project.serviceCategory || "Agricultural Planning"}
                      </td>

                      {/* STATUS */}
                      <td className="py-4 px-5">
                        <span
                          className={`inline-block px-2.5 py-1 rounded-full text-[11px] font-semibold border ${
                            project.status === "completed"
                              ? "bg-emerald-50 text-emerald-800 border-emerald-300"
                              : project.status === "in_progress"
                              ? "bg-amber-50 text-amber-800 border-amber-300"
                              : project.status === "planning"
                              ? "bg-blue-50 text-blue-800 border-blue-200"
                              : "bg-slate-50 text-slate-800 border-slate-200"
                          }`}
                        >
                          {project.status === "in_progress"
                            ? "In Progress"
                            : project.status === "planning"
                            ? "Not Started"
                            : project.status === "completed"
                            ? "Completed"
                            : project.status === "mobilization"
                            ? "Mobilization"
                            : "On Hold"}
                        </span>
                      </td>

                      {/* AGREED VALUE */}
                      <td className="py-4 px-5 font-bold text-[#1B3B2B] text-xs font-mono">
                        ₹
                        {Number(project.totalContractValue || 0).toLocaleString("en-IN", {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                      </td>

                      {/* RECEIVED */}
                      <td className="py-4 px-5 font-bold text-emerald-800 text-xs font-mono">
                        ₹
                        {Number(project.amountReceived || 0).toLocaleString("en-IN", {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                      </td>

                      {/* CREATED */}
                      <td className="py-4 px-5 text-[#7C887E] text-xs whitespace-nowrap">
                        {new Date(project.createdAt).toLocaleDateString("en-IN", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        })}
                      </td>

                      {/* VIEW DETAILS */}
                      <td className="py-4 px-5 text-right">
                        <Link
                          href={`/admin/projects/${project.id}`}
                          onClick={(e) => e.stopPropagation()}
                          className="inline-flex items-center gap-1 text-xs font-semibold text-[#1B3B2B] hover:underline"
                        >
                          <span>Manage</span>
                          <span>→</span>
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
