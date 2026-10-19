"use client";

import React, { useState, useEffect } from "react";
import {
  ShieldCheck,
  Save,
  Plus,
  Trash2,
  FileText,
  Upload,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Calendar,
  Lock,
  Eye,
  ExternalLink,
} from "lucide-react";
import AdminCard from "@/components/admin/AdminCard";
import AdminButton from "@/components/admin/AdminButton";
import {
  TransparencyStep,
  TransparencyPrinciple,
  TransparencyDocument,
} from "@/lib/cms/types";

export default function AdminTransparencyPage() {
  const [steps, setSteps] = useState<TransparencyStep[]>([]);
  const [principles, setPrinciples] = useState<TransparencyPrinciple[]>([]);
  const [documents, setDocuments] = useState<TransparencyDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<"steps" | "principles" | "documents">("steps");
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // New document modal state
  const [newDocTitle, setNewDocTitle] = useState("");
  const [newDocCategory, setNewDocCategory] = useState("Policy");
  const [newDocFileUrl, setNewDocFileUrl] = useState("");
  const [uploadingDoc, setUploadingDoc] = useState(false);

  useEffect(() => {
    fetchTransparency();
  }, []);

  const fetchTransparency = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/transparency");
      const json = await res.json();
      if (json.success && json.data) {
        setSteps(json.data.steps || []);
        setPrinciples(json.data.principles || []);
        setDocuments(json.data.documents || []);
      }
    } catch (err) {
      console.error("Failed to load transparency data:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveAll = async () => {
    try {
      setSaving(true);
      setErrorMsg(null);
      setSuccessMsg(null);

      const res = await fetch("/api/admin/transparency", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ steps, principles, documents }),
      });

      const json = await res.json();
      if (json.success) {
        setSuccessMsg("Transparency workflows, principles, and policy documents saved!");
        setTimeout(() => setSuccessMsg(null), 3000);
      } else {
        setErrorMsg(json.error || "Failed to save transparency data.");
      }
    } catch (err) {
      setErrorMsg("Network error saving transparency.");
    } finally {
      setSaving(false);
    }
  };

  const handleDocUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploadingDoc(true);
      const formData = new FormData();
      formData.append("file", file);
      formData.append("folder", "documents");

      const res = await fetch("/api/admin/media", {
        method: "POST",
        body: formData,
      });

      const json = await res.json();
      if (json.success && json.data) {
        setNewDocFileUrl(json.data.url);
      }
    } catch (err) {
      console.error("Doc upload failed:", err);
    } finally {
      setUploadingDoc(false);
    }
  };

  const addDocument = () => {
    if (!newDocTitle.trim() || !newDocFileUrl.trim()) return;
    const doc: TransparencyDocument = {
      id: `doc-${Date.now()}`,
      title: newDocTitle.trim(),
      category: newDocCategory,
      fileUrl: newDocFileUrl.trim(),
      fileSize: "PDF Document",
      effectiveDate: new Date().toISOString().split("T")[0],
      isPublic: true,
      displayOrder: documents.length + 1,
    };
    setDocuments([...documents, doc]);
    setNewDocTitle("");
    setNewDocFileUrl("");
  };

  const removeDocument = (id: string) => {
    setDocuments(documents.filter((d) => d.id !== id));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20 text-charcoal-muted gap-2 text-sm">
        <Loader2 className="w-6 h-6 animate-spin text-forest" />
        <span>Loading transparency controls...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-12 max-w-5xl mx-auto">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-forest">
            Transparency, Workflow & Governance
          </h1>
          <p className="text-sm text-charcoal-muted mt-1">
            Manage the 7-Step Landowner Approval Process, 5 Core Principles, and downloadable
            policy documents.
          </p>
        </div>

        <AdminButton
          variant="gold"
          size="md"
          loading={saving}
          onClick={handleSaveAll}
          icon={<Save className="w-4 h-4" />}
        >
          Save All Changes
        </AdminButton>
      </div>

      {/* Notifications */}
      {successMsg && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-800 text-sm flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}
      {errorMsg && (
        <div className="p-4 rounded-xl bg-rose-50 border border-rose-300 text-rose-800 text-sm flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-2 border-b border-cream-border pb-2">
        <button
          onClick={() => setActiveTab("steps")}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
            activeTab === "steps"
              ? "bg-forest text-ivory shadow-sm"
              : "bg-white text-charcoal-muted hover:text-charcoal border border-cream-border"
          }`}
        >
          7-Step Workflow ({steps.length})
        </button>
        <button
          onClick={() => setActiveTab("principles")}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
            activeTab === "principles"
              ? "bg-forest text-ivory shadow-sm"
              : "bg-white text-charcoal-muted hover:text-charcoal border border-cream-border"
          }`}
        >
          5 Core Principles ({principles.length})
        </button>
        <button
          onClick={() => setActiveTab("documents")}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
            activeTab === "documents"
              ? "bg-forest text-ivory shadow-sm"
              : "bg-white text-charcoal-muted hover:text-charcoal border border-cream-border"
          }`}
        >
          Policy Documents ({documents.length})
        </button>
      </div>

      {/* Tab 1: 7-Step Workflow */}
      {activeTab === "steps" && (
        <div className="space-y-4">
          <div className="bg-ivory-surface p-4 rounded-xl border border-cream-border text-xs text-charcoal-muted">
            The 7-Step Execution and Approval Workflow ensures landowners have complete
            visibility and authorization over every soil preparation, irrigation, labour, and
            billing phase.
          </div>

          {steps.map((step, idx) => (
            <AdminCard
              key={step.id || idx}
              title={
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-gold text-forest-deep flex items-center justify-center font-bold text-xs">
                    {step.stepNumber}
                  </span>
                  <span className="font-serif font-bold text-forest text-base">
                    {step.title}
                  </span>
                </div>
              }
              actions={
                <span className="text-[10px] uppercase font-semibold px-2 py-0.5 rounded bg-forest/5 text-forest border border-forest/15">
                  {step.badge || `Stage ${step.stepNumber}`}
                </span>
              }
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-charcoal mb-1">
                    Step Title
                  </label>
                  <input
                    type="text"
                    value={step.title}
                    onChange={(e) => {
                      const newSteps = [...steps];
                      newSteps[idx].title = e.target.value;
                      setSteps(newSteps);
                    }}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-cream-border focus:outline-none focus:border-forest"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-charcoal mb-1">
                    Badge Label
                  </label>
                  <input
                    type="text"
                    value={step.badge || ""}
                    onChange={(e) => {
                      const newSteps = [...steps];
                      newSteps[idx].badge = e.target.value;
                      setSteps(newSteps);
                    }}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-cream-border focus:outline-none focus:border-forest"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-xs font-semibold text-charcoal mb-1">
                    Detailed Step Explanation
                  </label>
                  <textarea
                    rows={2}
                    value={step.description}
                    onChange={(e) => {
                      const newSteps = [...steps];
                      newSteps[idx].description = e.target.value;
                      setSteps(newSteps);
                    }}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-cream-border focus:outline-none focus:border-forest"
                  />
                </div>
              </div>
            </AdminCard>
          ))}
        </div>
      )}

      {/* Tab 2: 5 Core Principles */}
      {activeTab === "principles" && (
        <div className="space-y-4">
          <div className="bg-ivory-surface p-4 rounded-xl border border-cream-border text-xs text-charcoal-muted">
            These 5 Core Principles define FarmCare360's governance model: No Surprises,
            Documented Execution, Client Control, Traceable Inputs, and Open Access.
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {principles.map((p, idx) => (
              <AdminCard key={p.id || idx} title={p.title}>
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-semibold text-charcoal mb-1">
                      Principle Title
                    </label>
                    <input
                      type="text"
                      value={p.title}
                      onChange={(e) => {
                        const newP = [...principles];
                        newP[idx].title = e.target.value;
                        setPrinciples(newP);
                      }}
                      className="w-full px-3 py-2 text-xs rounded-lg border border-cream-border focus:outline-none focus:border-forest"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-charcoal mb-1">
                      Description
                    </label>
                    <textarea
                      rows={3}
                      value={p.description}
                      onChange={(e) => {
                        const newP = [...principles];
                        newP[idx].description = e.target.value;
                        setPrinciples(newP);
                      }}
                      className="w-full px-3 py-2 text-xs rounded-lg border border-cream-border focus:outline-none focus:border-forest"
                    />
                  </div>
                </div>
              </AdminCard>
            ))}
          </div>
        </div>
      )}

      {/* Tab 3: Policy Documents */}
      {activeTab === "documents" && (
        <div className="space-y-6">
          {/* Add Document Card */}
          <AdminCard
            title="Upload or Add Official Document / Policy"
            subtitle="Publish sample management agreements, transparency charters, or audit reports"
          >
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-charcoal mb-1">
                  Document Title
                </label>
                <input
                  type="text"
                  value={newDocTitle}
                  onChange={(e) => setNewDocTitle(e.target.value)}
                  placeholder="e.g. FarmCare360 Transparent Billing & Audit Policy 2026"
                  className="w-full px-3 py-2 text-xs rounded-lg border border-cream-border focus:outline-none focus:border-forest"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-charcoal mb-1">
                  Category
                </label>
                <select
                  value={newDocCategory}
                  onChange={(e) => setNewDocCategory(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-cream-border bg-white focus:outline-none focus:border-forest"
                >
                  <option value="Policy">Policy</option>
                  <option value="Agreement">Sample Agreement</option>
                  <option value="Charter">Transparency Charter</option>
                  <option value="Report">Audit Report</option>
                </select>
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-charcoal mb-1">
                  Document URL (PDF / File)
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newDocFileUrl}
                    onChange={(e) => setNewDocFileUrl(e.target.value)}
                    placeholder="https://... or upload local PDF"
                    className="flex-1 px-3 py-2 text-xs rounded-lg border border-cream-border font-mono focus:outline-none focus:border-forest"
                  />
                  <label className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-forest text-ivory hover:bg-forest-light transition-colors">
                    {uploadingDoc ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <Upload className="w-3.5 h-3.5" />
                    )}
                    <span>{uploadingDoc ? "Uploading..." : "Upload PDF"}</span>
                    <input
                      type="file"
                      accept=".pdf,.doc,.docx"
                      className="hidden"
                      onChange={handleDocUpload}
                      disabled={uploadingDoc}
                    />
                  </label>
                </div>
              </div>

              <div className="flex items-end">
                <AdminButton
                  variant="gold"
                  size="md"
                  onClick={addDocument}
                  disabled={!newDocTitle || !newDocFileUrl}
                  className="w-full"
                  icon={<Plus className="w-4 h-4" />}
                >
                  Add Document
                </AdminButton>
              </div>
            </div>
          </AdminCard>

          {/* Documents Table */}
          <AdminCard title="Published Documents & Disclosures" bodyClassName="p-0">
            {documents.length === 0 ? (
              <div className="p-8 text-center text-charcoal-muted text-xs">
                No policy documents added yet.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-cream-border bg-ivory-surface/60 text-charcoal-muted uppercase tracking-wider text-[10px]">
                      <th className="py-3 px-4">Document Title</th>
                      <th className="py-3 px-4">Category</th>
                      <th className="py-3 px-4">Effective Date</th>
                      <th className="py-3 px-4">Public Status</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-cream-border/60">
                    {documents.map((doc) => (
                      <tr key={doc.id} className="hover:bg-ivory-surface/40">
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-2">
                            <FileText className="w-4 h-4 text-forest shrink-0" />
                            <span className="font-semibold text-charcoal">
                              {doc.title}
                            </span>
                          </div>
                        </td>
                        <td className="py-3.5 px-4">
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-forest/5 text-forest border border-forest/15">
                            {doc.category}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-charcoal-subtle">
                          {doc.effectiveDate}
                        </td>
                        <td className="py-3.5 px-4">
                          <span className="inline-flex items-center gap-1 text-emerald-700 font-semibold">
                            <CheckCircle2 className="w-3 h-3" />
                            <span>Public</span>
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <a
                              href={doc.fileUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-1.5 rounded-lg text-charcoal-muted hover:text-forest"
                              title="Download / Open file"
                            >
                              <ExternalLink className="w-3.5 h-3.5" />
                            </a>
                            <button
                              type="button"
                              onClick={() => removeDocument(doc.id)}
                              className="p-1.5 rounded-lg text-rose-600 hover:bg-rose-50"
                              title="Delete document"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </AdminCard>
        </div>
      )}

      {/* Bottom Save Bar */}
      <div className="flex items-center justify-end gap-3 pt-4 border-t border-cream-border">
        <AdminButton
          variant="gold"
          size="md"
          loading={saving}
          onClick={handleSaveAll}
          icon={<Save className="w-4 h-4" />}
        >
          Save All Changes
        </AdminButton>
      </div>
    </div>
  );
}
