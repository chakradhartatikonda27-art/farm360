"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Save,
  Plus,
  Trash2,
  ChevronUp,
  ChevronDown,
  Eye,
  ExternalLink,
  Layers,
  Image as ImageIcon,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Settings,
  Sparkles,
} from "lucide-react";
import AdminCard from "@/components/admin/AdminCard";
import AdminButton from "@/components/admin/AdminButton";
import ConfirmModal from "@/components/admin/ConfirmModal";
import MediaPickerModal from "@/components/admin/MediaPickerModal";
import { CmsPage, SectionBlock } from "@/lib/cms/types";

export default function AdminPageEditor() {
  const params = useParams();
  const slug = params.slug as string;
  const router = useRouter();

  const [page, setPage] = useState<CmsPage | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Media Picker state
  const [mediaPickerOpen, setMediaPickerOpen] = useState(false);
  const [activeMediaTarget, setActiveMediaTarget] = useState<{
    sectionIndex?: number;
    isOgImage?: boolean;
  }>({});

  // Delete section confirmation
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [sectionToDeleteIndex, setSectionToDeleteIndex] = useState<number | null>(null);

  useEffect(() => {
    fetchPage();
  }, [slug]);

  const fetchPage = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/admin/pages/${slug}`);
      const json = await res.json();
      const data = json.data || json;
      if (data && data.slug) {
        setPage(data);
      } else {
        setErrorMsg("Failed to find page.");
      }
    } catch (err) {
      setErrorMsg("Network error fetching page.");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!page) return;
    try {
      setSaving(true);
      setErrorMsg(null);
      setSuccessMsg(null);

      const res = await fetch(`/api/admin/pages/${slug}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(page),
      });

      const json = await res.json();
      if (json.success) {
        setPage(json.data);
        setSuccessMsg("Page and sections saved successfully!");
        setTimeout(() => setSuccessMsg(null), 3500);
      } else {
        setErrorMsg(json.error || "Failed to save page.");
      }
    } catch (err) {
      setErrorMsg("Network error saving page.");
    } finally {
      setSaving(false);
    }
  };

  const moveSection = (index: number, direction: "up" | "down") => {
    if (!page) return;
    const newSections = [...page.sections];
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= newSections.length) return;

    const temp = newSections[index];
    newSections[index] = newSections[targetIndex];
    newSections[targetIndex] = temp;

    // update displayOrder
    newSections.forEach((s, idx) => {
      s.displayOrder = idx + 1;
    });

    setPage({ ...page, sections: newSections });
  };

  const toggleSectionEnabled = (index: number) => {
    if (!page) return;
    const newSections = [...page.sections];
    newSections[index] = {
      ...newSections[index],
      enabled: !newSections[index].enabled,
    };
    setPage({ ...page, sections: newSections });
  };

  const updateSectionField = (
    index: number,
    field: keyof SectionBlock,
    value: any
  ) => {
    if (!page) return;
    const newSections = [...page.sections];
    newSections[index] = {
      ...newSections[index],
      [field]: value,
    };
    setPage({ ...page, sections: newSections });
  };

  const addSection = () => {
    if (!page) return;
    const newSection: SectionBlock = {
      id: `sec-${Date.now()}`,
      name: "Custom Section Block",
      type: "custom",
      title: "New Section Title",
      subtitle: "Optional section badge or subtitle",
      enabled: true,
      displayOrder: page.sections.length + 1,
      content: {},
    };
    setPage({ ...page, sections: [...page.sections, newSection] });
  };

  const confirmDeleteSection = (index: number) => {
    setSectionToDeleteIndex(index);
    setDeleteModalOpen(true);
  };

  const handleDeleteSection = () => {
    if (!page || sectionToDeleteIndex === null) return;
    const newSections = page.sections.filter(
      (_, idx) => idx !== sectionToDeleteIndex
    );
    newSections.forEach((s, idx) => {
      s.displayOrder = idx + 1;
    });
    setPage({ ...page, sections: newSections });
    setDeleteModalOpen(false);
    setSectionToDeleteIndex(null);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20 text-charcoal-muted gap-2 text-sm">
        <Loader2 className="w-6 h-6 animate-spin text-forest" />
        <span>Loading page configuration...</span>
      </div>
    );
  }

  if (!page) {
    return (
      <div className="p-8 text-center text-charcoal">
        <p className="text-base font-semibold">Page not found</p>
        <Link href="/admin/pages" className="text-forest hover:underline text-sm mt-2 inline-block">
          &larr; Return to Pages List
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      {/* Top Navigation & Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link
            href="/admin/pages"
            className="p-2 rounded-lg bg-white border border-cream-border text-charcoal-muted hover:text-charcoal hover:bg-cream/40 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-serif text-2xl font-bold text-forest">
                {page.title}
              </h1>
              <span className="font-mono text-xs px-2 py-0.5 rounded bg-cream/70 text-forest border border-cream-border">
                /{page.slug === "home" ? "" : page.slug}
              </span>
            </div>
            <p className="text-xs text-charcoal-muted mt-0.5">
              Edit page SEO, publication status, and rearrange or customize section blocks.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <a
            href={`/${page.slug === "home" ? "" : page.slug}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold text-charcoal border border-cream-border bg-white hover:bg-cream/30 transition-colors"
          >
            <span>Preview Page</span>
            <ExternalLink className="w-3.5 h-3.5 text-charcoal-subtle" />
          </a>
          <AdminButton
            variant="gold"
            size="md"
            loading={saving}
            onClick={handleSave}
            icon={<Save className="w-4 h-4" />}
          >
            Save All Changes
          </AdminButton>
        </div>
      </div>

      {/* Notification Alerts */}
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

      {/* Page Settings & SEO Card */}
      <AdminCard
        title="Page Settings & Search Engine Optimization (SEO)"
        subtitle="Manage the page metadata, title tag, description, and status"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-charcoal mb-1">
              Page Display Title
            </label>
            <input
              type="text"
              value={page.title}
              onChange={(e) => setPage({ ...page, title: e.target.value })}
              className="w-full px-3 py-2 text-sm rounded-lg border border-cream-border focus:outline-none focus:border-forest"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-charcoal mb-1">
              URL Slug
            </label>
            <input
              type="text"
              disabled={page.slug === "home"}
              value={page.slug}
              onChange={(e) => setPage({ ...page, slug: e.target.value })}
              className="w-full px-3 py-2 text-sm rounded-lg border border-cream-border bg-stone-50 font-mono text-xs focus:outline-none disabled:opacity-70"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-xs font-semibold text-charcoal mb-1">
              Meta SEO Description
            </label>
            <textarea
              rows={2}
              value={page.seoDescription || ""}
              onChange={(e) =>
                setPage({ ...page, seoDescription: e.target.value })
              }
              placeholder="Recommended 150-160 characters describing this page for search engines..."
              className="w-full px-3 py-2 text-sm rounded-lg border border-cream-border focus:outline-none focus:border-forest"
            />
          </div>

          <div className="flex items-center gap-3 pt-2">
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={page.isPublished}
                onChange={(e) =>
                  setPage({ ...page, isPublished: e.target.checked })
                }
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-stone-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-forest"></div>
            </label>
            <div>
              <div className="text-xs font-bold text-charcoal">
                Publicly Published
              </div>
              <div className="text-[11px] text-charcoal-muted">
                When disabled, this page will be hidden from non-admin visitors.
              </div>
            </div>
          </div>
        </div>
      </AdminCard>

      {/* Sections List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-serif text-xl font-bold text-forest flex items-center gap-2">
              <Layers className="w-5 h-5 text-gold" />
              <span>Section Blocks ({page.sections.length})</span>
            </h2>
            <p className="text-xs text-charcoal-muted">
              Drag, reorder, toggle visibility, and edit content for each section on this page.
            </p>
          </div>
          <AdminButton
            variant="outline"
            size="sm"
            onClick={addSection}
            icon={<Plus className="w-4 h-4 text-forest" />}
          >
            Add Section Block
          </AdminButton>
        </div>

        {page.sections.map((section, idx) => (
          <div
            key={section.id || idx}
            className={`bg-white rounded-xl border transition-all overflow-hidden ${
              section.enabled
                ? "border-cream-border shadow-soft"
                : "border-cream-border/50 bg-stone-50/70 opacity-70"
            }`}
          >
            {/* Section Header */}
            <div className="flex items-center justify-between p-4 border-b border-cream-border/60 bg-ivory-surface/40">
              <div className="flex items-center gap-3">
                {/* Order controls */}
                <div className="flex flex-col gap-0.5">
                  <button
                    type="button"
                    disabled={idx === 0}
                    onClick={() => moveSection(idx, "up")}
                    className="p-1 rounded text-charcoal-muted hover:text-charcoal hover:bg-cream disabled:opacity-30"
                    title="Move section up"
                  >
                    <ChevronUp className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    disabled={idx === page.sections.length - 1}
                    onClick={() => moveSection(idx, "down")}
                    className="p-1 rounded text-charcoal-muted hover:text-charcoal hover:bg-cream disabled:opacity-30"
                    title="Move section down"
                  >
                    <ChevronDown className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold text-forest px-2 py-0.5 rounded bg-cream/60 border border-cream-border">
                      #{idx + 1}
                    </span>
                    <span className="text-sm font-bold text-charcoal">
                      {section.name || section.title || `Section ${idx + 1}`}
                    </span>
                    <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-forest/5 text-forest border border-forest/15">
                      {section.type}
                    </span>
                  </div>
                </div>
              </div>

              {/* Action toggles */}
              <div className="flex items-center gap-3">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={section.enabled}
                    onChange={() => toggleSectionEnabled(idx)}
                    className="rounded text-forest focus:ring-forest"
                  />
                  <span className="text-xs font-medium text-charcoal-muted">
                    {section.enabled ? "Visible" : "Hidden"}
                  </span>
                </label>

                <button
                  type="button"
                  onClick={() => confirmDeleteSection(idx)}
                  className="p-1.5 rounded-lg text-rose-600 hover:bg-rose-50 transition-colors"
                  title="Delete section"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Section Editable Fields */}
            <div className="p-4 sm:p-5 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-charcoal mb-1">
                    Section Heading / Title
                  </label>
                  <input
                    type="text"
                    value={section.title || ""}
                    onChange={(e) =>
                      updateSectionField(idx, "title", e.target.value)
                    }
                    placeholder="Enter section heading..."
                    className="w-full px-3 py-2 text-xs rounded-lg border border-cream-border focus:outline-none focus:border-forest"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-charcoal mb-1">
                    Badge / Subtitle
                  </label>
                  <input
                    type="text"
                    value={section.subtitle || ""}
                    onChange={(e) =>
                      updateSectionField(idx, "subtitle", e.target.value)
                    }
                    placeholder="Optional badge or subtitle..."
                    className="w-full px-3 py-2 text-xs rounded-lg border border-cream-border focus:outline-none focus:border-forest"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-charcoal mb-1">
                    Call To Action (CTA) Button Text
                  </label>
                  <input
                    type="text"
                    value={section.ctaText || ""}
                    onChange={(e) =>
                      updateSectionField(idx, "ctaText", e.target.value)
                    }
                    placeholder="e.g. Schedule Land Visit"
                    className="w-full px-3 py-2 text-xs rounded-lg border border-cream-border focus:outline-none focus:border-forest"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-charcoal mb-1">
                    CTA Button Destination URL
                  </label>
                  <input
                    type="text"
                    value={section.ctaLink || ""}
                    onChange={(e) =>
                      updateSectionField(idx, "ctaLink", e.target.value)
                    }
                    placeholder="e.g. /contact or #consultation"
                    className="w-full px-3 py-2 text-xs rounded-lg border border-cream-border focus:outline-none focus:border-forest"
                  />
                </div>
              </div>

              {/* Section Content Payload / JSON editor */}
              <div>
                <label className="block text-xs font-semibold text-charcoal mb-1 flex items-center justify-between">
                  <span>Custom Section Configuration (JSON)</span>
                  <span className="text-[10px] text-charcoal-subtle font-normal">
                    Advanced custom properties for cards, steps, or copy
                  </span>
                </label>
                <textarea
                  rows={3}
                  value={
                    typeof section.content === "string"
                      ? section.content
                      : JSON.stringify(section.content || {}, null, 2)
                  }
                  onChange={(e) => {
                    try {
                      const parsed = JSON.parse(e.target.value);
                      updateSectionField(idx, "content", parsed);
                    } catch {
                      updateSectionField(idx, "content", e.target.value);
                    }
                  }}
                  className="w-full px-3 py-2 text-xs font-mono rounded-lg border border-cream-border bg-stone-50/60 focus:outline-none focus:border-forest"
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Floating or bottom Save Button */}
      <div className="flex items-center justify-end gap-3 pt-4 border-t border-cream-border">
        <Link href="/admin/pages">
          <AdminButton variant="outline" size="md">
            Cancel
          </AdminButton>
        </Link>
        <AdminButton
          variant="gold"
          size="md"
          loading={saving}
          onClick={handleSave}
          icon={<Save className="w-4 h-4" />}
        >
          Save All Changes
        </AdminButton>
      </div>

      {/* Confirm Delete Section Modal */}
      <ConfirmModal
        isOpen={deleteModalOpen}
        title="Delete Section Block"
        message="Are you sure you want to remove this section block from the page? You can save or discard your changes afterwards."
        confirmText="Remove Section"
        onConfirm={handleDeleteSection}
        onCancel={() => setDeleteModalOpen(false)}
      />

      {/* Media Picker Modal */}
      <MediaPickerModal
        isOpen={mediaPickerOpen}
        onClose={() => setMediaPickerOpen(false)}
        onSelect={(url) => {
          if (activeMediaTarget.isOgImage && page) {
            setPage({ ...page, ogImage: url });
          }
        }}
      />
    </div>
  );
}
