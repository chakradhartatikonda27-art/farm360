"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  ArrowLeft,
  CheckCircle2,
  Clock,
  Briefcase,
  User,
  Phone,
  Mail,
  MapPin,
  Calendar,
  Save,
  Plus,
  Trash2,
  DollarSign,
  AlertCircle,
  RefreshCw,
  Sparkles,
} from "lucide-react";
import { ProjectItem, ProjectMilestone } from "@/lib/cms/types";

export default function ProjectDetailPage() {
  const urlParams = useParams();
  const id = (urlParams?.id as string) || "";

  const [project, setProject] = useState<ProjectItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const fetchProject = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/admin/projects/${id}`);
      const data = await res.json();
      if (data.success && data.data) {
        setProject(data.data);
      }
    } catch (err) {
      console.error("Failed to load project:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProject();
  }, [id]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const handleSaveProject = async () => {
    if (!project) return;
    setSaving(true);
    try {
      const res = await fetch(`/api/admin/projects/${project.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(project),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to save project");

      setProject(data.data);
      showToast("Project updated successfully");
    } catch (err: any) {
      alert(err.message || "Could not save project");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="p-16 text-center text-[#7C887E]">
        <RefreshCw className="w-8 h-8 animate-spin mx-auto text-[#1B3B2B] mb-3" />
        <p className="text-sm">Loading project workspace...</p>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="p-12 text-center text-[#7C887E]">
        <AlertCircle className="w-10 h-10 text-rose-500 mx-auto mb-3" />
        <h3 className="text-base font-bold text-[#1B3B2B]">Project Not Found</h3>
        <Link href="/admin/projects" className="mt-4 inline-block text-xs text-[#1B3B2B] font-semibold underline">
          ← Back to Projects List
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-16">
      {toastMessage && (
        <div className="fixed top-4 right-4 z-50 bg-[#1B3B2B] text-white px-4 py-2.5 rounded-xl shadow-lg text-xs flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-[#C5A869]" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-[#E6E1D8]">
        <div>
          <Link
            href="/admin/projects"
            className="text-xs font-semibold text-[#4A5D4E] hover:text-[#1B3B2B] flex items-center gap-1 mb-1"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> All Projects
          </Link>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-serif font-bold text-[#1B3B2B]">
              {project.title}
            </h1>
            <span className="font-mono text-xs px-2 py-0.5 rounded bg-[#FAF8F5] border border-[#DCD5C5] text-[#1B3B2B]">
              {project.referenceId}
            </span>
          </div>
          <p className="text-xs text-[#7C887E] mt-0.5">
            Customer: {project.customerName} ({project.customerPhone}) • {project.location}
          </p>
        </div>

        <div className="flex items-center gap-2">
          {project.leadId && (
            <Link
              href={`/admin/leads/${project.leadId}`}
              className="px-3.5 py-2 text-xs font-semibold text-[#1B3B2B] bg-[#FAF8F5] border border-[#DCD5C5] rounded-lg hover:bg-[#F3EFE6]"
            >
              View Origin Deal ({project.leadReferenceId || "Lead"})
            </Link>
          )}

          <button
            onClick={handleSaveProject}
            disabled={saving}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#1B3B2B] text-white text-xs font-semibold rounded-lg hover:bg-[#152e22] disabled:opacity-60"
          >
            <Save className="w-3.5 h-3.5" />
            {saving ? "Saving..." : "Save Project"}
          </button>
        </div>
      </div>

      {/* Project Status & Financials Ribbon */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-[#E6E1D8] shadow-sm">
          <div className="text-[10px] text-[#7C887E] uppercase tracking-wider font-semibold">Total Contract Value</div>
          <div className="text-xl font-bold text-[#1B3B2B] mt-1 font-serif">
            ₹{(project.totalContractValue || 0).toLocaleString("en-IN")}
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-[#E6E1D8] shadow-sm">
          <div className="text-[10px] text-emerald-700 uppercase tracking-wider font-semibold">Amount Received</div>
          <div className="text-xl font-bold text-emerald-800 mt-1 font-serif">
            ₹{(project.amountReceived || 0).toLocaleString("en-IN")}
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-[#E6E1D8] shadow-sm">
          <div className="text-[10px] text-amber-700 uppercase tracking-wider font-semibold">Outstanding Balance</div>
          <div className="text-xl font-bold text-amber-800 mt-1 font-serif">
            ₹{(project.outstandingBalance || 0).toLocaleString("en-IN")}
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-[#E6E1D8] shadow-sm">
          <div className="text-[10px] text-[#7C887E] uppercase tracking-wider font-semibold">Execution Status</div>
          <select
            value={project.status}
            onChange={(e) => setProject({ ...project, status: e.target.value as any })}
            className="mt-1 w-full text-xs font-semibold bg-[#FAF8F5] border border-[#DCD5C5] rounded-lg p-1.5 text-[#1B3B2B]"
          >
            <option value="planning">Planning</option>
            <option value="mobilization">Mobilization</option>
            <option value="in_progress">In Progress</option>
            <option value="completed">Completed</option>
            <option value="on_hold">On Hold</option>
          </select>
        </div>
      </div>

      {/* Milestones Card */}
      <div className="bg-white rounded-2xl border border-[#E6E1D8] p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-serif font-bold text-[#1B3B2B]">
              Field Execution Milestones
            </h3>
            <p className="text-xs text-[#7C887E]">
              Track deliverables, site works, and sign-off handover.
            </p>
          </div>

          <button
            type="button"
            onClick={() => {
              const newM: ProjectMilestone = {
                id: `m_${Date.now()}`,
                title: "New Field Milestone",
                status: "pending",
                dueDate: new Date(Date.now() + 14 * 86400000).toISOString().split("T")[0],
              };
              setProject({
                ...project,
                milestones: [...(project.milestones || []), newM],
              });
            }}
            className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-[#1B3B2B] bg-[#FAF8F5] border border-[#DCD5C5] rounded-lg hover:bg-[#F3EFE6]"
          >
            <Plus className="w-3.5 h-3.5" /> Add Milestone
          </button>
        </div>

        <div className="space-y-3">
          {(project.milestones || []).map((m, idx) => (
            <div
              key={m.id}
              className="p-4 bg-[#FAF8F5] rounded-xl border border-[#E6E1D8] flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs"
            >
              <div className="flex-1 space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-[#8C7A5B]">#{idx + 1}</span>
                  <input
                    type="text"
                    value={m.title}
                    onChange={(e) => {
                      const list = [...(project.milestones || [])];
                      list[idx].title = e.target.value;
                      setProject({ ...project, milestones: list });
                    }}
                    className="font-semibold text-[#1B3B2B] bg-transparent border-b border-transparent hover:border-[#DCD5C5] focus:border-[#1B3B2B] focus:outline-none flex-1"
                  />
                </div>
                {m.description && (
                  <p className="text-[11px] text-[#4A5D4E]">{m.description}</p>
                )}
              </div>

              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1 text-[11px] text-[#7C887E]">
                  <Calendar className="w-3.5 h-3.5" />
                  <input
                    type="date"
                    value={m.dueDate || ""}
                    onChange={(e) => {
                      const list = [...(project.milestones || [])];
                      list[idx].dueDate = e.target.value;
                      setProject({ ...project, milestones: list });
                    }}
                    className="bg-transparent border border-[#DCD5C5] rounded px-1.5 py-0.5 text-[11px]"
                  />
                </div>

                <select
                  value={m.status}
                  onChange={(e) => {
                    const list = [...(project.milestones || [])];
                    list[idx].status = e.target.value as any;
                    setProject({ ...project, milestones: list });
                  }}
                  className={`px-2 py-1 rounded text-xs font-semibold ${
                    m.status === "completed"
                      ? "bg-emerald-100 text-emerald-800"
                      : m.status === "in_progress"
                      ? "bg-amber-100 text-amber-800"
                      : "bg-slate-100 text-slate-700"
                  }`}
                >
                  <option value="pending">Pending</option>
                  <option value="in_progress">In Progress</option>
                  <option value="completed">Completed ✓</option>
                </select>

                <button
                  type="button"
                  onClick={() => {
                    const list = (project.milestones || []).filter((item) => item.id !== m.id);
                    setProject({ ...project, milestones: list });
                  }}
                  className="text-rose-600 hover:text-rose-800"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Scope and Technical Specs */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl border border-[#E6E1D8] p-5 shadow-sm space-y-3">
          <h4 className="text-xs font-bold text-[#1B3B2B] uppercase tracking-wider">
            Scope of Work & Specification
          </h4>
          <textarea
            rows={5}
            value={project.scopeOfWork || ""}
            onChange={(e) => setProject({ ...project, scopeOfWork: e.target.value })}
            placeholder="Detailed scope transferred from Proposal..."
            className="w-full p-3 text-xs bg-[#FAF8F5] border border-[#DCD5C5] rounded-xl focus:outline-none focus:ring-1 focus:ring-[#1B3B2B]"
          />
        </div>

        <div className="bg-white rounded-2xl border border-[#E6E1D8] p-5 shadow-sm space-y-3">
          <h4 className="text-xs font-bold text-[#1B3B2B] uppercase tracking-wider">
            Project Management Notes
          </h4>
          <textarea
            rows={5}
            value={project.notes || ""}
            onChange={(e) => setProject({ ...project, notes: e.target.value })}
            placeholder="Field staff notes, logistics, machinery deployment..."
            className="w-full p-3 text-xs bg-[#FAF8F5] border border-[#DCD5C5] rounded-xl focus:outline-none focus:ring-1 focus:ring-[#1B3B2B]"
          />
        </div>
      </div>
    </div>
  );
}
