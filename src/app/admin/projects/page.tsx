"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Briefcase,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  ArrowUpRight,
  Plus,
  DollarSign,
  MapPin,
  Calendar,
  Layers,
  RefreshCw,
  AlertCircle,
} from "lucide-react";
import { ProjectItem } from "@/lib/cms/types";

const STATUS_CONFIG: Record<string, { label: string; color: string }> = {
  planning: { label: "Planning", color: "bg-blue-50 text-blue-700 border-blue-200" },
  mobilization: { label: "Mobilization", color: "bg-amber-50 text-amber-700 border-amber-200" },
  in_progress: { label: "In Progress", color: "bg-emerald-50 text-emerald-800 border-emerald-300" },
  on_hold: { label: "On Hold", color: "bg-slate-100 text-slate-700 border-slate-200" },
  completed: { label: "Completed", color: "bg-teal-50 text-teal-800 border-teal-300" },
};

export default function ProjectsListPage() {
  const [projects, setProjects] = useState<ProjectItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (search) params.set("search", search);
      if (statusFilter !== "all") params.set("status", statusFilter);

      const res = await fetch(`/api/admin/projects?${params.toString()}`);
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
  }, [statusFilter]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchProjects();
  };

  return (
    <div className="space-y-6 pb-16">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-[#E6E1D8]">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl md:text-3xl font-serif text-[#1B3B2B] font-bold">
              Active Projects
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
              {projects.length} Total Projects
            </span>
          </div>
          <p className="text-xs md:text-sm text-[#4A5D4E] mt-1">
            Converted Closed Won customer contracts in field execution & milestone delivery.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/admin/leads"
            className="px-4 py-2 bg-[#FAF8F5] text-[#1B3B2B] border border-[#DCD5C5] text-xs font-semibold rounded-lg hover:bg-[#F3EFE6] transition-colors"
          >
            ← View Leads Desk
          </Link>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-4 rounded-xl border border-[#E6E1D8] shadow-sm">
        <form onSubmit={handleSearchSubmit} className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-[#8C7A5B] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by project title, customer, reference ID..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs md:text-sm bg-[#FAF8F5] border border-[#DCD5C5] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#1B3B2B]"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 text-xs bg-[#FAF8F5] border border-[#DCD5C5] rounded-lg text-[#1B3B2B]"
          >
            <option value="all">Every status</option>
            <option value="planning">Planning</option>
            <option value="mobilization">Mobilization</option>
            <option value="in_progress">In Progress</option>
            <option value="completed">Completed</option>
            <option value="on_hold">On Hold</option>
          </select>

          <button
            type="submit"
            className="px-4 py-2 bg-[#1B3B2B] text-white text-xs font-semibold rounded-lg hover:bg-[#152e22]"
          >
            Filter
          </button>
        </form>
      </div>

      {/* Projects Table */}
      <div className="bg-white rounded-xl border border-[#E6E1D8] shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-[#7C887E]">
            <RefreshCw className="w-6 h-6 animate-spin mx-auto text-[#1B3B2B] mb-2" />
            <p className="text-xs">Loading projects...</p>
          </div>
        ) : projects.length === 0 ? (
          <div className="p-12 text-center text-[#7C887E]">
            <Briefcase className="w-10 h-10 mx-auto text-[#B5A48B] mb-3 opacity-60" />
            <h3 className="text-base font-semibold text-[#1B3B2B]">No projects found</h3>
            <p className="text-xs text-[#7C887E] mt-1">
              Mark a deal as "Closed Won" in the Lead Journey to automatically initiate an execution project.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#FAF8F5] text-[#7C887E] uppercase text-[10px] tracking-wider font-semibold border-b border-[#E6E1D8]">
                <tr>
                  <th className="py-3 px-4">Project Ref</th>
                  <th className="py-3 px-4">Title & Customer</th>
                  <th className="py-3 px-4">Scope & Location</th>
                  <th className="py-3 px-4">Contract Value</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Milestones</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E6E1D8]">
                {projects.map((project) => {
                  const statusInfo = STATUS_CONFIG[project.status] || {
                    label: project.status,
                    color: "bg-gray-100 text-gray-700",
                  };
                  const completedMilestones = (project.milestones || []).filter(
                    (m) => m.status === "completed"
                  ).length;
                  const totalMilestones = (project.milestones || []).length;

                  return (
                    <tr
                      key={project.id}
                      className="hover:bg-[#FAF8F5]/80 transition-colors group cursor-pointer"
                      onClick={() => (window.location.href = `/admin/projects/${project.id}`)}
                    >
                      <td className="py-3.5 px-4 font-mono">
                        <div className="font-bold text-[#1B3B2B] text-xs">
                          {project.referenceId}
                        </div>
                        {project.leadReferenceId && (
                          <div className="text-[10px] text-[#7C887E] mt-0.5">
                            From: {project.leadReferenceId}
                          </div>
                        )}
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="font-semibold text-[#1B3B2B] text-xs">
                          {project.title}
                        </div>
                        <div className="text-[11px] text-[#4A5D4E] mt-0.5">
                          {project.customerName} ({project.customerPhone})
                        </div>
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="text-[#1B3B2B] font-medium">
                          {project.serviceCategory}
                        </div>
                        <div className="text-[11px] text-[#7C887E] mt-0.5">
                          {project.location} {project.landAreaAcres ? `• ${project.landAreaAcres} Acres` : ""}
                        </div>
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="font-bold text-[#1B3B2B]">
                          ₹{(project.totalContractValue || 0).toLocaleString("en-IN")}
                        </div>
                        <div className="text-[10px] text-emerald-700 mt-0.5">
                          Rec: ₹{(project.amountReceived || 0).toLocaleString("en-IN")}
                        </div>
                      </td>

                      <td className="py-3.5 px-4">
                        <span
                          className={`inline-block px-2.5 py-1 rounded-full text-[11px] font-semibold border ${statusInfo.color}`}
                        >
                          {statusInfo.label}
                        </span>
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-1.5">
                          <span className="font-semibold text-[#1B3B2B]">
                            {completedMilestones} / {totalMilestones}
                          </span>
                          <span className="text-[10px] text-[#7C887E]">done</span>
                        </div>
                        <div className="w-20 h-1.5 bg-[#FAF8F5] border border-[#DCD5C5] rounded-full overflow-hidden mt-1">
                          <div
                            className="h-full bg-emerald-600 rounded-full"
                            style={{
                              width: `${totalMilestones > 0 ? (completedMilestones / totalMilestones) * 100 : 0}%`,
                            }}
                          />
                        </div>
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        <Link
                          href={`/admin/projects/${project.id}`}
                          onClick={(e) => e.stopPropagation()}
                          className="inline-flex items-center justify-center w-7 h-7 rounded-lg text-[#1B3B2B] bg-[#FAF8F5] border border-[#DCD5C5] hover:bg-[#1B3B2B] hover:text-white transition-all shadow-sm"
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
    </div>
  );
}
