"use client";

import React, { useState, useEffect } from "react";
import {
  Building2,
  Save,
  Plus,
  Trash2,
  CheckCircle2,
  AlertCircle,
  Loader2,
  FileCheck,
  ShieldCheck,
  ChevronRight,
  HandCoins,
} from "lucide-react";
import AdminCard from "@/components/admin/AdminCard";
import AdminButton from "@/components/admin/AdminButton";
import { BusinessModelItem } from "@/lib/cms/types";

export default function AdminBusinessModelsPage() {
  const [models, setModels] = useState<BusinessModelItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<number>(0);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // New service item input
  const [newServiceItem, setNewServiceItem] = useState("");

  useEffect(() => {
    fetchModels();
  }, []);

  const fetchModels = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/models");
      const json = await res.json();
      if (json.success) {
        setModels(json.data);
      }
    } catch (err) {
      console.error("Failed to fetch business models:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveAll = async () => {
    try {
      setSaving(true);
      setErrorMsg(null);
      setSuccessMsg(null);

      const res = await fetch("/api/admin/models", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ models }),
      });

      const json = await res.json();
      if (json.success) {
        setSuccessMsg("All 4 Business Models and partnership terms saved!");
        setModels(json.data);
        setTimeout(() => setSuccessMsg(null), 3000);
      } else {
        setErrorMsg(json.error || "Failed to save business models.");
      }
    } catch (err) {
      setErrorMsg("Network error saving business models.");
    } finally {
      setSaving(false);
    }
  };

  const updateCurrentModel = (field: keyof BusinessModelItem, value: any) => {
    setModels((prev) => {
      const updated = [...prev];
      updated[activeTab] = {
        ...updated[activeTab],
        [field]: value,
      };
      return updated;
    });
  };

  const addServiceOffered = () => {
    if (!newServiceItem.trim()) return;
    const current = models[activeTab];
    updateCurrentModel("servicesOffered", [
      ...(current.servicesOffered || []),
      newServiceItem.trim(),
    ]);
    setNewServiceItem("");
  };

  const removeServiceOffered = (index: number) => {
    const current = models[activeTab];
    updateCurrentModel(
      "servicesOffered",
      current.servicesOffered?.filter((_, i) => i !== index) || []
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20 text-charcoal-muted gap-2 text-sm">
        <Loader2 className="w-6 h-6 animate-spin text-forest" />
        <span>Loading FarmCare360 business models...</span>
      </div>
    );
  }

  const currentModel = models[activeTab] || models[0];

  return (
    <div className="space-y-6 pb-12 max-w-5xl mx-auto">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-forest">
            Business Models & Landowner Terms
          </h1>
          <p className="text-sm text-charcoal-muted mt-1">
            Configure the 4 core operating models, client fee structures, guarantees,
            and flexible land leasing terms.
          </p>
        </div>

        <AdminButton
          variant="gold"
          size="md"
          loading={saving}
          onClick={handleSaveAll}
          icon={<Save className="w-4 h-4" />}
        >
          Save All Models
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

      {/* Models Tab Selector */}
      <div className="flex flex-wrap gap-2 border-b border-cream-border pb-2">
        {models.map((m, idx) => (
          <button
            key={m.id || idx}
            onClick={() => setActiveTab(idx)}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === idx
                ? "bg-forest text-ivory shadow-sm"
                : "bg-white text-charcoal-muted hover:text-charcoal hover:bg-cream/40 border border-cream-border"
            }`}
          >
            <span className="w-5 h-5 rounded-full bg-gold/20 text-gold flex items-center justify-center text-[10px]">
              {idx + 1}
            </span>
            <span className="truncate max-w-[200px]">{m.title}</span>
          </button>
        ))}
      </div>

      {currentModel && (
        <div className="space-y-6">
          {/* Core Overview Card */}
          <AdminCard title={`Model ${activeTab + 1}: Core Strategy`}>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-charcoal mb-1">
                    Model Title
                  </label>
                  <input
                    type="text"
                    value={currentModel.title}
                    onChange={(e) => updateCurrentModel("title", e.target.value)}
                    className="w-full px-3 py-2 text-sm rounded-lg border border-cream-border focus:outline-none focus:border-forest"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-charcoal mb-1">
                    Subtitle / Value Proposition
                  </label>
                  <input
                    type="text"
                    value={currentModel.subtitle}
                    onChange={(e) => updateCurrentModel("subtitle", e.target.value)}
                    className="w-full px-3 py-2 text-sm rounded-lg border border-cream-border focus:outline-none focus:border-forest"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-charcoal mb-1">
                  The Problem We Solve
                </label>
                <textarea
                  rows={3}
                  value={currentModel.problemSolved}
                  onChange={(e) =>
                    updateCurrentModel("problemSolved", e.target.value)
                  }
                  className="w-full px-3 py-2 text-xs rounded-lg border border-cream-border focus:outline-none focus:border-forest"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-forest mb-1">
                  FarmCare360 Turnkey Solution
                </label>
                <textarea
                  rows={3}
                  value={currentModel.solution}
                  onChange={(e) => updateCurrentModel("solution", e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-cream-border focus:outline-none focus:border-forest"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-3 border-t border-cream-border">
                <div>
                  <label className="block text-xs font-semibold text-charcoal mb-1 flex items-center gap-1.5">
                    <HandCoins className="w-3.5 h-3.5 text-gold" />
                    <span>Commercial / Revenue Model</span>
                  </label>
                  <textarea
                    rows={3}
                    value={currentModel.revenueModel || ""}
                    onChange={(e) =>
                      updateCurrentModel("revenueModel", e.target.value)
                    }
                    className="w-full px-3 py-2 text-xs rounded-lg border border-cream-border focus:outline-none focus:border-forest"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-charcoal mb-1 flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-forest" />
                    <span>Our Guarantee & Brand Promise</span>
                  </label>
                  <textarea
                    rows={3}
                    value={currentModel.promise || ""}
                    onChange={(e) =>
                      updateCurrentModel("promise", e.target.value)
                    }
                    className="w-full px-3 py-2 text-xs rounded-lg border border-cream-border focus:outline-none focus:border-forest"
                  />
                </div>
              </div>
            </div>
          </AdminCard>

          {/* Services Included in this Model */}
          <AdminCard
            title="Operational Deliverables & Services Included"
            subtitle="Specific capabilities delivered to landowners under this model"
          >
            <div className="space-y-3">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newServiceItem}
                  onChange={(e) => setNewServiceItem(e.target.value)}
                  onKeyDown={(e) =>
                    e.key === "Enter" && (e.preventDefault(), addServiceOffered())
                  }
                  placeholder="e.g. Transparent expense bookkeeping and monthly photographic audit..."
                  className="flex-1 px-3 py-2 text-xs rounded-lg border border-cream-border focus:outline-none focus:border-forest"
                />
                <AdminButton
                  variant="outline"
                  size="sm"
                  onClick={addServiceOffered}
                  icon={<Plus className="w-3.5 h-3.5" />}
                >
                  Add Service
                </AdminButton>
              </div>

              <div className="space-y-2 max-h-72 overflow-y-auto">
                {currentModel.servicesOffered?.map((srv, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-3 rounded-lg bg-ivory-surface border border-cream-border text-xs"
                  >
                    <div className="flex items-center gap-2">
                      <FileCheck className="w-4 h-4 text-forest shrink-0" />
                      <span className="text-charcoal font-medium">{srv}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeServiceOffered(idx)}
                      className="text-rose-500 hover:text-rose-700 p-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </AdminCard>

          {/* Sub-models (e.g. Model 4A, 4B, 4C, 4D for Land Leasing) */}
          {currentModel.subModels && currentModel.subModels.length > 0 && (
            <AdminCard
              title="Partnership Sub-Models & Options"
              subtitle="Specific contract structures available to landowners"
            >
              <div className="space-y-4">
                {currentModel.subModels.map((sub, sIdx) => (
                  <div
                    key={sub.id || sIdx}
                    className="p-4 rounded-xl border border-cream-border bg-stone-50/50 space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs uppercase tracking-wider text-forest">
                        {sub.title}
                      </span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                      <div>
                        <label className="block text-[11px] font-semibold text-charcoal mb-1">
                          Subtitle
                        </label>
                        <input
                          type="text"
                          value={sub.subtitle || ""}
                          onChange={(e) => {
                            const newSubs = [...(currentModel.subModels || [])];
                            newSubs[sIdx].subtitle = e.target.value;
                            updateCurrentModel("subModels", newSubs);
                          }}
                          className="w-full px-2.5 py-1.5 text-xs rounded border border-cream-border bg-white"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-semibold text-charcoal mb-1">
                          Description
                        </label>
                        <textarea
                          rows={2}
                          value={sub.description || ""}
                          onChange={(e) => {
                            const newSubs = [...(currentModel.subModels || [])];
                            newSubs[sIdx].description = e.target.value;
                            updateCurrentModel("subModels", newSubs);
                          }}
                          className="w-full px-2.5 py-1.5 text-xs rounded border border-cream-border bg-white"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </AdminCard>
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
              Save All Models
            </AdminButton>
          </div>
        </div>
      )}
    </div>
  );
}
