"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Settings,
  ArrowLeft,
  Save,
  CheckCircle2,
  RefreshCw,
  Plus,
  Trash2,
  AlertCircle,
  Sliders,
} from "lucide-react";
import { CrmSettings } from "@/lib/cms/types";

export default function CrmSettingsPage() {
  const [settings, setSettings] = useState<CrmSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/leads/settings");
      const data = await res.json();
      if (data.success && data.data) {
        setSettings(data.data);
      }
    } catch (err) {
      console.error("Failed to load CRM settings:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!settings) return;

    setSaving(true);
    try {
      const res = await fetch("/api/admin/leads/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to update CRM settings");

      setSettings(data.data);
      showToast("CRM Settings saved successfully");
    } catch (err: any) {
      alert(err.message || "Could not save settings");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="p-16 text-center text-[#7C887E]">
        <RefreshCw className="w-8 h-8 animate-spin mx-auto text-[#1B3B2B] mb-3" />
        <p className="text-sm">Loading CRM Configuration...</p>
      </div>
    );
  }

  if (!settings) return null;

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
            href="/admin/leads"
            className="text-xs font-semibold text-[#4A5D4E] hover:text-[#1B3B2B] flex items-center gap-1 mb-1"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Leads Desk
          </Link>
          <h1 className="text-2xl font-serif font-bold text-[#1B3B2B]">
            CRM & Pipeline Settings
          </h1>
          <p className="text-xs text-[#7C887E]">
            Configure sales stages, scale acreage thresholds, auto-assignment rules, and loss categories.
          </p>
        </div>

        <button
          onClick={handleSave}
          disabled={saving}
          className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#1B3B2B] text-white text-xs font-semibold rounded-lg hover:bg-[#152e22] disabled:opacity-60"
        >
          <Save className="w-3.5 h-3.5" />
          {saving ? "Saving..." : "Save Settings"}
        </button>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Scale Acreage Ranges */}
        <div className="bg-white rounded-2xl border border-[#E6E1D8] p-6 shadow-sm space-y-4">
          <div>
            <h3 className="text-sm font-bold text-[#1B3B2B] uppercase tracking-wider">
              Operation Scale Definitions (Acreage Ranges)
            </h3>
            <p className="text-xs text-[#7C887E]">
              Define thresholds used during Qualification (Small, Medium, Large scales).
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Small Scale */}
            <div className="p-4 bg-[#FAF8F5] rounded-xl border border-[#E6E1D8] space-y-2 text-xs">
              <span className="font-bold text-[#1B3B2B]">Small Scale</span>
              <div className="space-y-1">
                <label className="text-[10px] text-[#7C887E]">Max Acres</label>
                <input
                  type="number"
                  value={settings.scaleAcreageRanges.small.max}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      scaleAcreageRanges: {
                        ...settings.scaleAcreageRanges,
                        small: {
                          ...settings.scaleAcreageRanges.small,
                          max: Number(e.target.value),
                        },
                      },
                    })
                  }
                  className="w-full px-2.5 py-1.5 bg-white border border-[#DCD5C5] rounded-lg"
                />
              </div>
            </div>

            {/* Medium Scale */}
            <div className="p-4 bg-[#FAF8F5] rounded-xl border border-[#E6E1D8] space-y-2 text-xs">
              <span className="font-bold text-[#1B3B2B]">Medium Scale</span>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[10px] text-[#7C887E]">Min Acres</label>
                  <input
                    type="number"
                    value={settings.scaleAcreageRanges.medium.min}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        scaleAcreageRanges: {
                          ...settings.scaleAcreageRanges,
                          medium: {
                            ...settings.scaleAcreageRanges.medium,
                            min: Number(e.target.value),
                          },
                        },
                      })
                    }
                    className="w-full px-2.5 py-1.5 bg-white border border-[#DCD5C5] rounded-lg"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-[#7C887E]">Max Acres</label>
                  <input
                    type="number"
                    value={settings.scaleAcreageRanges.medium.max}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        scaleAcreageRanges: {
                          ...settings.scaleAcreageRanges,
                          medium: {
                            ...settings.scaleAcreageRanges.medium,
                            max: Number(e.target.value),
                          },
                        },
                      })
                    }
                    className="w-full px-2.5 py-1.5 bg-white border border-[#DCD5C5] rounded-lg"
                  />
                </div>
              </div>
            </div>

            {/* Large Scale */}
            <div className="p-4 bg-[#FAF8F5] rounded-xl border border-[#E6E1D8] space-y-2 text-xs">
              <span className="font-bold text-[#1B3B2B]">Large Scale</span>
              <div className="space-y-1">
                <label className="text-[10px] text-[#7C887E]">Min Acres (Commercial)</label>
                <input
                  type="number"
                  value={settings.scaleAcreageRanges.large.min}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      scaleAcreageRanges: {
                        ...settings.scaleAcreageRanges,
                        large: {
                          ...settings.scaleAcreageRanges.large,
                          min: Number(e.target.value),
                        },
                      },
                    })
                  }
                  className="w-full px-2.5 py-1.5 bg-white border border-[#DCD5C5] rounded-lg"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Lead Assignment & Notifications */}
        <div className="bg-white rounded-2xl border border-[#E6E1D8] p-6 shadow-sm space-y-4">
          <div>
            <h3 className="text-sm font-bold text-[#1B3B2B] uppercase tracking-wider">
              Automatic Lead Assignment & Notifications
            </h3>
            <p className="text-xs text-[#7C887E]">
              Controls initial assignment when a visitor submits an enquiry.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-semibold text-[#1B3B2B] mb-1">
                Default Sales Executive
              </label>
              <input
                type="text"
                value={settings.autoAssignExecutive || "Suresh Varma"}
                onChange={(e) =>
                  setSettings({ ...settings, autoAssignExecutive: e.target.value })
                }
                className="w-full px-3 py-2 bg-[#FAF8F5] border border-[#DCD5C5] rounded-lg text-[#1B3B2B]"
              />
            </div>

            <div>
              <label className="block font-semibold text-[#1B3B2B] mb-1">
                Notification Emails (comma separated)
              </label>
              <input
                type="text"
                value={(settings.notificationRecipients || []).join(", ")}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    notificationRecipients: e.target.value.split(",").map((s) => s.trim()),
                  })
                }
                className="w-full px-3 py-2 bg-[#FAF8F5] border border-[#DCD5C5] rounded-lg text-[#1B3B2B]"
              />
            </div>
          </div>

          <div className="pt-2">
            <label className="inline-flex items-center gap-2 cursor-pointer text-xs font-medium text-[#1B3B2B]">
              <input
                type="checkbox"
                checked={settings.sendCustomerAcknowledgement}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    sendCustomerAcknowledgement: e.target.checked,
                  })
                }
                className="rounded border-[#DCD5C5] text-[#1B3B2B] focus:ring-[#1B3B2B]"
              />
              Send instant automated acknowledgement email to the customer upon form submission
            </label>
          </div>
        </div>

        {/* Dropdowns Configuration */}
        <div className="bg-white rounded-2xl border border-[#E6E1D8] p-6 shadow-sm space-y-4">
          <div>
            <h3 className="text-sm font-bold text-[#1B3B2B] uppercase tracking-wider">
              Supported Agricultural Crop Types
            </h3>
            <p className="text-xs text-[#7C887E]">
              Common crops populated in qualification dropdowns.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            {(settings.cropTypes || []).map((crop, idx) => (
              <span
                key={idx}
                className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#FAF8F5] border border-[#DCD5C5] rounded-full text-xs text-[#1B3B2B]"
              >
                {crop}
                <button
                  type="button"
                  onClick={() => {
                    const list = (settings.cropTypes || []).filter((_, i) => i !== idx);
                    setSettings({ ...settings, cropTypes: list });
                  }}
                  className="text-rose-500 hover:text-rose-700 font-bold ml-1"
                >
                  ×
                </button>
              </span>
            ))}
          </div>

          <div className="flex items-center gap-2 max-w-sm">
            <input
              type="text"
              id="newCropInput"
              placeholder="Add new crop type..."
              className="px-3 py-1.5 text-xs bg-[#FAF8F5] border border-[#DCD5C5] rounded-lg flex-1"
            />
            <button
              type="button"
              onClick={() => {
                const el = document.getElementById("newCropInput") as HTMLInputElement;
                if (el && el.value.trim()) {
                  setSettings({
                    ...settings,
                    cropTypes: [...(settings.cropTypes || []), el.value.trim()],
                  });
                  el.value = "";
                }
              }}
              className="px-3 py-1.5 bg-[#1B3B2B] text-white text-xs font-semibold rounded-lg hover:bg-[#152e22]"
            >
              Add
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
