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
} from "lucide-react";
import { ProjectItem } from "@/lib/cms/types";

export default function ProjectsListPage() {
  const [projects, setProjects] = useState<ProjectItem[]>([]);
  const [loading, setLoading] = useState(true);

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

  return (
    <div className="space-y-8 pb-16">
      {/* Top Header matching screenshot 4 */}
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

        <div>
          <Link
            href="/admin/leads"
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-medium text-[#1B3B2B] bg-white border border-[#DCD5C5] rounded-lg hover:bg-[#F3EFE6] transition-colors shadow-sm"
          >
            <span>View lead desk</span>
            <span className="text-sm">↗</span>
          </Link>
        </div>
      </div>

      {/* Stats Cards Ribbon (4 cards matching screenshot 4) */}
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

      {/* Project Register Section (matching screenshot 4) */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1">
          <div>
            <div className="text-[10px] font-bold text-[#7C887E] tracking-wider uppercase">
              CLIENT WORK
            </div>
            <h2 className="text-xl font-serif font-bold text-[#1B3B2B] mt-0.5">
              Your project register
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
          ) : projects.length === 0 ? (
            <div className="p-12 text-center text-[#7C887E]">
              <Briefcase className="w-10 h-10 mx-auto text-[#B5A48B] mb-3 opacity-60" />
              <h3 className="text-base font-semibold text-[#1B3B2B]">No active projects</h3>
              <p className="text-xs text-[#7C887E] mt-1">
                When an enquiry advances to Closed Won, convert it into a registered project.
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
                    <th className="py-3 px-5">CREATED</th>
                    <th className="py-3 px-5 text-right"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E6E1D8]">
                  {projects.map((project) => (
                    <tr
                      key={project.id}
                      className="hover:bg-[#FAF8F5]/80 transition-colors group cursor-pointer"
                      onClick={() => (window.location.href = `/admin/projects/${project.id}`)}
                    >
                      {/* PROJECT */}
                      <td className="py-4 px-5 font-mono text-xs font-bold text-[#1B3B2B]">
                        {project.referenceId}
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
                        <span className="inline-block px-2.5 py-1 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
                          {project.status === "in_progress"
                            ? "In Progress"
                            : project.status === "planning"
                            ? "Not Started"
                            : project.status === "completed"
                            ? "Completed"
                            : "In Progress"}
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
                          <span>View details</span>
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
