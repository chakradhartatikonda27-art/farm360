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
  ExternalLink,
  Layers,
  Image as ImageIcon,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Sparkles,
  Sliders,
  Eye,
  EyeOff,
  Move,
  Upload,
} from "lucide-react";
import AdminCard from "@/components/admin/AdminCard";
import AdminButton from "@/components/admin/AdminButton";
import ConfirmModal from "@/components/admin/ConfirmModal";
import MediaPickerModal from "@/components/admin/MediaPickerModal";
import { CmsPage, SectionBlock } from "@/lib/cms/types";

interface MediaTarget {
  type?: "ogImage" | "sectionMedia" | "sectionSecondaryMedia" | "stripAdd" | "stepImage" | "galleryItemImage";
  sectionIndex?: number;
  stepIndex?: number;
  itemIndex?: number;
}

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
  const [activeMediaTarget, setActiveMediaTarget] = useState<MediaTarget>({});

  // Delete section confirmation
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [sectionToDeleteIndex, setSectionToDeleteIndex] = useState<number | null>(null);

  // Collapsible SEO card toggle
  const [showSeoSettings, setShowSeoSettings] = useState(false);

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

    newSections.forEach((s, idx) => {
      s.displayOrder = idx + 1;
      s.order = idx + 1;
    });

    setPage({ ...page, sections: newSections });
  };

  const toggleSectionEnabled = (index: number) => {
    if (!page) return;
    const newSections = [...page.sections];
    const currentVal = newSections[index].enabled ?? newSections[index].isVisible ?? true;
    newSections[index] = {
      ...newSections[index],
      enabled: !currentVal,
      isVisible: !currentVal,
    };
    setPage({ ...page, sections: newSections });
  };

  const isSectionActive = (s: SectionBlock) => {
    if (typeof s.enabled === "boolean") return s.enabled;
    if (typeof s.isVisible === "boolean") return s.isVisible;
    return true;
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

  const updateSectionContent = (
    index: number,
    contentUpdates: Record<string, any>
  ) => {
    if (!page) return;
    const newSections = [...page.sections];
    const currentContent =
      typeof newSections[index].content === "object" && newSections[index].content !== null
        ? newSections[index].content
        : {};
    newSections[index] = {
      ...newSections[index],
      content: {
        ...currentContent,
        ...contentUpdates,
      },
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
      isVisible: true,
      displayOrder: page.sections.length + 1,
      order: page.sections.length + 1,
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
      s.order = idx + 1;
    });
    setPage({ ...page, sections: newSections });
    setDeleteModalOpen(false);
    setSectionToDeleteIndex(null);
  };

  const handleMediaSelect = (url: string) => {
    if (!page) return;
    const { type, sectionIndex, stepIndex, itemIndex } = activeMediaTarget;

    if (type === "ogImage") {
      setPage({ ...page, ogImage: url });
    } else if (type === "sectionMedia" && sectionIndex !== undefined) {
      updateSectionField(sectionIndex, "mediaUrl", url);
      const sec = page.sections[sectionIndex];
      if (sec.type === "hero") {
        updateSectionContent(sectionIndex, { heroImage: url });
      }
    } else if (type === "sectionSecondaryMedia" && sectionIndex !== undefined) {
      updateSectionField(sectionIndex, "secondaryMediaUrl", url);
    } else if (type === "stripAdd" && sectionIndex !== undefined) {
      const sec = page.sections[sectionIndex];
      const curImages = Array.isArray(sec.content?.images) ? [...sec.content.images] : [];
      curImages.push({ src: url, alt: "Agricultural landscape" });
      updateSectionContent(sectionIndex, { images: curImages });
    } else if (type === "stepImage" && sectionIndex !== undefined && stepIndex !== undefined) {
      const sec = page.sections[sectionIndex];
      const curSteps = Array.isArray(sec.content?.steps) ? [...sec.content.steps] : [];
      if (curSteps[stepIndex]) {
        curSteps[stepIndex] = { ...curSteps[stepIndex], image: url };
        updateSectionContent(sectionIndex, { steps: curSteps });
      }
    } else if (type === "galleryItemImage" && sectionIndex !== undefined && itemIndex !== undefined) {
      const sec = page.sections[sectionIndex];
      const curItems = Array.isArray(sec.content?.items) ? [...sec.content.items] : [];
      if (curItems[itemIndex]) {
        curItems[itemIndex] = { ...curItems[itemIndex], image: url };
        updateSectionContent(sectionIndex, { items: curItems });
      }
    }
    setMediaPickerOpen(false);
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

  const activeCount = page.sections.filter(isSectionActive).length;

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-16">
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
              Customize website copy, photographs, section ordering, and toggle visibility.
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
            <span>Live Preview</span>
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

      {/* PAGE LENGTH & SECTION VISIBILITY CONTROLS */}
      <div className="bg-gradient-to-br from-forest-deep via-forest to-forest-dark rounded-2xl p-5 sm:p-6 text-white shadow-md border border-forest-light/20">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-white/10">
          <div>
            <div className="flex items-center gap-2 text-gold text-xs font-bold uppercase tracking-wider">
              <Sliders className="w-4 h-4" />
              <span>Page Length & Section Visibility</span>
            </div>
            <h2 className="font-serif text-lg font-bold text-ivory mt-0.5">
              Control What Appears on Your Website
            </h2>
            <p className="text-xs text-sage mt-0.5">
              Currently showing <strong className="text-white">{activeCount}</strong> of <strong className="text-white">{page.sections.length}</strong> sections.
              If the page feels too long, simply click to hide any section below.
            </p>
          </div>
          <div className="flex items-center gap-2 self-start sm:self-auto">
            <span className="text-[11px] font-mono px-2.5 py-1 rounded-full bg-white/10 border border-white/15 text-gold">
              {activeCount === page.sections.length ? "All Sections Visible" : `${page.sections.length - activeCount} Hidden`}
            </span>
          </div>
        </div>

        {/* Quick toggle chips */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5 pt-4">
          {page.sections.map((section, idx) => {
            const active = isSectionActive(section);
            return (
              <div
                key={section.id || idx}
                onClick={() => toggleSectionEnabled(idx)}
                className={`flex items-center justify-between p-2.5 rounded-xl border text-xs cursor-pointer transition-all ${
                  active
                    ? "bg-forest-deep/80 border-gold/40 text-ivory hover:border-gold shadow-xs"
                    : "bg-black/25 border-white/10 text-white/50 hover:bg-black/35"
                }`}
              >
                <div className="flex items-center gap-2 min-w-0 pr-2">
                  <span className="font-mono text-[10px] text-gold shrink-0 font-bold">
                    #{idx + 1}
                  </span>
                  <span className="truncate font-medium">
                    {section.name || section.title || `Section ${idx + 1}`}
                  </span>
                </div>
                <div className="shrink-0 flex items-center gap-1.5">
                  {active ? (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                      <Eye className="w-3 h-3" />
                      <span>Shown</span>
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-white/5 text-white/40 border border-white/10">
                      <EyeOff className="w-3 h-3" />
                      <span>Hidden</span>
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* SEO & Publishing Drawer (Collapsible) */}
      <div className="bg-white rounded-xl border border-cream-border p-4 shadow-soft">
        <div
          className="flex items-center justify-between cursor-pointer"
          onClick={() => setShowSeoSettings(!showSeoSettings)}
        >
          <div className="flex items-center gap-2">
            <span className="font-serif text-sm font-bold text-forest">
              Page Metadata & SEO Settings
            </span>
            <span className="text-xs text-charcoal-muted">
              (Title Tag, Meta Description, Status)
            </span>
          </div>
          <button
            type="button"
            className="text-xs text-forest font-semibold hover:underline"
          >
            {showSeoSettings ? "Hide Details" : "Edit SEO"}
          </button>
        </div>

        {showSeoSettings && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 mt-3 border-t border-cream-border">
            <div>
              <label className="block text-xs font-semibold text-charcoal mb-1">
                Page Title Tag
              </label>
              <input
                type="text"
                value={page.title}
                onChange={(e) => setPage({ ...page, title: e.target.value })}
                className="w-full px-3 py-2 text-xs rounded-lg border border-cream-border focus:outline-none focus:border-forest"
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
                className="w-full px-3 py-2 text-xs rounded-lg border border-cream-border bg-stone-50 font-mono focus:outline-none disabled:opacity-70"
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
                className="w-full px-3 py-2 text-xs rounded-lg border border-cream-border focus:outline-none focus:border-forest"
              />
            </div>
          </div>
        )}
      </div>

      {/* SECTION BLOCKS LIST */}
      <div className="space-y-5">
        <div className="flex items-center justify-between pt-2">
          <div>
            <h2 className="font-serif text-xl font-bold text-forest flex items-center gap-2">
              <Layers className="w-5 h-5 text-gold" />
              <span>Section Content Editors ({page.sections.length})</span>
            </h2>
            <p className="text-xs text-charcoal-muted">
              Edit the headings, text descriptions, images, and buttons for each section.
            </p>
          </div>
          <AdminButton
            variant="outline"
            size="sm"
            onClick={addSection}
            icon={<Plus className="w-4 h-4 text-forest" />}
          >
            Add New Section
          </AdminButton>
        </div>

        {page.sections.map((section, idx) => {
          const active = isSectionActive(section);
          const type = section.type;

          return (
            <div
              key={section.id || idx}
              className={`bg-white rounded-2xl border transition-all overflow-hidden ${
                active
                  ? "border-cream-border shadow-soft"
                  : "border-cream-border/60 bg-stone-50/70 opacity-60"
              }`}
            >
              {/* Section Header */}
              <div className="flex items-center justify-between p-4 border-b border-cream-border/70 bg-ivory-surface/50">
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
                      <span className="text-xs font-mono font-bold text-forest px-2 py-0.5 rounded bg-cream/70 border border-cream-border">
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

                {/* Visibility Toggle & Delete */}
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => toggleSectionEnabled(idx)}
                    className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold transition-all ${
                      active
                        ? "bg-emerald-50 text-emerald-800 border border-emerald-200 hover:bg-emerald-100"
                        : "bg-stone-100 text-stone-500 border border-stone-200 hover:bg-stone-200"
                    }`}
                  >
                    {active ? <Eye className="w-3.5 h-3.5 text-emerald-600" /> : <EyeOff className="w-3.5 h-3.5" />}
                    <span>{active ? "Visible" : "Hidden"}</span>
                  </button>

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

              {/* DEDICATED VISUAL EDITORS BASED ON SECTION TYPE */}
              <div className="p-5 space-y-5">
                {/* 1. HERO SECTION EDITOR */}
                {type === "hero" && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-charcoal mb-1">
                          Eyebrow Badge / Tagline
                        </label>
                        <input
                          type="text"
                          value={section.subtitle || ""}
                          onChange={(e) =>
                            updateSectionField(idx, "subtitle", e.target.value)
                          }
                          placeholder="e.g. Complete Agricultural Solutions"
                          className="w-full px-3 py-2 text-xs rounded-lg border border-cream-border focus:outline-none focus:border-forest"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-charcoal mb-1">
                          Editorial Main Headline
                        </label>
                        <input
                          type="text"
                          value={section.title || ""}
                          onChange={(e) =>
                            updateSectionField(idx, "title", e.target.value)
                          }
                          placeholder="e.g. Owning land is a privilege. We make it productive."
                          className="w-full px-3 py-2 text-xs font-semibold rounded-lg border border-cream-border focus:outline-none focus:border-forest"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-charcoal mb-1">
                        Introductory Story / Description
                      </label>
                      <textarea
                        rows={3}
                        value={
                          section.content?.description ||
                          (typeof section.content === "string"
                            ? section.content
                            : "")
                        }
                        onChange={(e) =>
                          updateSectionContent(idx, {
                            description: e.target.value,
                          })
                        }
                        placeholder="Explain the mission, idle land challenges, and FarmCare360 stewardship..."
                        className="w-full px-3 py-2 text-xs rounded-lg border border-cream-border focus:outline-none focus:border-forest leading-relaxed"
                      />
                    </div>

                    {/* Dual Action Buttons */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-3.5 rounded-xl bg-ivory-surface/50 border border-cream-border">
                      <div className="space-y-2">
                        <span className="text-[11px] font-bold uppercase text-forest block">
                          Primary Button (Gold CTA)
                        </span>
                        <input
                          type="text"
                          value={section.ctaText || ""}
                          onChange={(e) =>
                            updateSectionField(idx, "ctaText", e.target.value)
                          }
                          placeholder="Label: Explore Our 4 Models"
                          className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-cream-border"
                        />
                        <input
                          type="text"
                          value={section.ctaLink || ""}
                          onChange={(e) =>
                            updateSectionField(idx, "ctaLink", e.target.value)
                          }
                          placeholder="Link URL: /services"
                          className="w-full px-2.5 py-1.5 text-xs font-mono rounded-lg border border-cream-border"
                        />
                      </div>

                      <div className="space-y-2">
                        <span className="text-[11px] font-bold uppercase text-forest block">
                          Secondary Button (Bordered CTA)
                        </span>
                        <input
                          type="text"
                          value={section.secondaryCtaText || ""}
                          onChange={(e) =>
                            updateSectionField(
                              idx,
                              "secondaryCtaText",
                              e.target.value
                            )
                          }
                          placeholder="Label: Discuss Your Land"
                          className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-cream-border"
                        />
                        <input
                          type="text"
                          value={section.secondaryCtaLink || ""}
                          onChange={(e) =>
                            updateSectionField(
                              idx,
                              "secondaryCtaLink",
                              e.target.value
                            )
                          }
                          placeholder="Link URL: /contact"
                          className="w-full px-2.5 py-1.5 text-xs font-mono rounded-lg border border-cream-border"
                        />
                      </div>
                    </div>

                    {/* Hero Image & Trust Badge */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
                      <div>
                        <label className="block text-xs font-semibold text-charcoal mb-1">
                          Hero Photograph
                        </label>
                        <div className="flex gap-3 items-center">
                          <div className="relative w-20 h-14 rounded-lg overflow-hidden bg-cream border border-cream-border shrink-0">
                            <img
                              src={
                                section.mediaUrl ||
                                section.content?.heroImage ||
                                "/images/hero/hero-terrace-farm.jpg"
                              }
                              alt="Hero Preview"
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="flex-1 space-y-1.5">
                            <input
                              type="text"
                              value={
                                section.mediaUrl ||
                                section.content?.heroImage ||
                                ""
                              }
                              onChange={(e) => {
                                updateSectionField(idx, "mediaUrl", e.target.value);
                                updateSectionContent(idx, {
                                  heroImage: e.target.value,
                                });
                              }}
                              placeholder="/images/hero/hero-terrace-farm.jpg"
                              className="w-full px-2.5 py-1.5 text-xs font-mono rounded-lg border border-cream-border"
                            />
                            <button
                              type="button"
                              onClick={() => {
                                setActiveMediaTarget({
                                  type: "sectionMedia",
                                  sectionIndex: idx,
                                });
                                setMediaPickerOpen(true);
                              }}
                              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-[11px] font-semibold text-forest bg-forest/10 hover:bg-forest/20 transition-colors"
                            >
                              <ImageIcon className="w-3.5 h-3.5 text-forest" />
                              <span>Select from Media Library</span>
                            </button>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <label className="block text-xs font-semibold text-charcoal mb-1">
                          Transparency Trust Pill
                        </label>
                        <input
                          type="text"
                          value={section.content?.trustBadgeText || ""}
                          onChange={(e) =>
                            updateSectionContent(idx, {
                              trustBadgeText: e.target.value,
                            })
                          }
                          placeholder="e.g. Customer Transparency Model: Zero unexplained bills"
                          className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-cream-border"
                        />
                        <input
                          type="text"
                          value={section.content?.trustBadgeLink || ""}
                          onChange={(e) =>
                            updateSectionContent(idx, {
                              trustBadgeLink: e.target.value,
                            })
                          }
                          placeholder="Link: /transparency"
                          className="w-full px-2.5 py-1.5 text-xs font-mono rounded-lg border border-cream-border"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* 2. PHOTO STRIP / CAROUSEL EDITOR */}
                {type === "photo_strip" && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between pb-2 border-b border-cream-border">
                      <div>
                        <h4 className="text-xs font-bold text-forest uppercase tracking-wider">
                          Strip Images Carousel ({Array.isArray(section.content?.images) ? section.content.images.length : 12})
                        </h4>
                        <p className="text-[11px] text-charcoal-muted">
                          Continuous marquee strip running below the hero section.
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          setActiveMediaTarget({
                            type: "stripAdd",
                            sectionIndex: idx,
                          });
                          setMediaPickerOpen(true);
                        }}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-forest bg-forest/10 hover:bg-forest/20 transition-colors"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Add Photo to Strip</span>
                      </button>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                      {(section.content?.images || []).map(
                        (img: any, imgIdx: number) => (
                          <div
                            key={imgIdx}
                            className="relative group rounded-xl border border-cream-border bg-ivory-surface/40 p-2 space-y-1.5"
                          >
                            <div className="relative aspect-video rounded-lg overflow-hidden bg-cream border border-cream-border">
                              <img
                                src={img.src}
                                alt={img.alt || `Strip image ${imgIdx + 1}`}
                                className="w-full h-full object-cover"
                              />
                              <button
                                type="button"
                                onClick={() => {
                                  const cur = [...(section.content?.images || [])];
                                  cur.splice(imgIdx, 1);
                                  updateSectionContent(idx, { images: cur });
                                }}
                                className="absolute top-1 right-1 p-1 rounded-full bg-rose-600/90 hover:bg-rose-700 text-white shadow-xs opacity-0 group-hover:opacity-100 transition-opacity"
                                title="Remove image"
                              >
                                <Trash2 className="w-3 h-3" />
                              </button>
                            </div>
                            <input
                              type="text"
                              value={img.alt || ""}
                              onChange={(e) => {
                                const cur = [...(section.content?.images || [])];
                                cur[imgIdx] = { ...cur[imgIdx], alt: e.target.value };
                                updateSectionContent(idx, { images: cur });
                              }}
                              placeholder="Alt description..."
                              className="w-full px-2 py-1 text-[11px] rounded border border-cream-border"
                            />
                          </div>
                        )
                      )}
                    </div>
                  </div>
                )}

                {/* 3. OUR APPROACH (4 STEPS) EDITOR */}
                {type === "approach" && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pb-2 border-b border-cream-border">
                      <div>
                        <label className="block text-xs font-semibold text-charcoal mb-1">
                          Section Eyebrow
                        </label>
                        <input
                          type="text"
                          value={section.subtitle || ""}
                          onChange={(e) =>
                            updateSectionField(idx, "subtitle", e.target.value)
                          }
                          placeholder="Our approach"
                          className="w-full px-3 py-2 text-xs rounded-lg border border-cream-border"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-charcoal mb-1">
                          Section Headline
                        </label>
                        <input
                          type="text"
                          value={section.title || ""}
                          onChange={(e) =>
                            updateSectionField(idx, "title", e.target.value)
                          }
                          placeholder="From your idea to a living space."
                          className="w-full px-3 py-2 text-xs font-semibold rounded-lg border border-cream-border"
                        />
                      </div>
                    </div>

                    <div>
                      <h4 className="text-xs font-bold text-forest uppercase tracking-wider mb-2">
                        The 4 Roadmap Steps
                      </h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
                        {(section.content?.steps || []).map(
                          (step: any, stepIdx: number) => (
                            <div
                              key={stepIdx}
                              className="p-3 rounded-xl border border-cream-border bg-ivory-surface/40 space-y-2.5"
                            >
                              <div className="relative aspect-square rounded-lg overflow-hidden bg-cream border border-cream-border group">
                                <img
                                  src={step.image}
                                  alt={step.title}
                                  className="w-full h-full object-cover"
                                />
                                <button
                                  type="button"
                                  onClick={() => {
                                    setActiveMediaTarget({
                                      type: "stepImage",
                                      sectionIndex: idx,
                                      stepIndex: stepIdx,
                                    });
                                    setMediaPickerOpen(true);
                                  }}
                                  className="absolute inset-0 bg-black/50 text-white text-[11px] font-semibold flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                  Change Image
                                </button>
                              </div>

                              <div className="flex items-center gap-1.5">
                                <span className="font-serif font-bold text-gold text-base">
                                  {step.number}
                                </span>
                                <input
                                  type="text"
                                  value={step.title || ""}
                                  onChange={(e) => {
                                    const cur = [...(section.content?.steps || [])];
                                    cur[stepIdx] = {
                                      ...cur[stepIdx],
                                      title: e.target.value,
                                    };
                                    updateSectionContent(idx, { steps: cur });
                                  }}
                                  placeholder="Step Title"
                                  className="w-full px-2 py-1 text-xs font-bold rounded border border-cream-border"
                                />
                              </div>

                              <textarea
                                rows={2}
                                value={step.description || ""}
                                onChange={(e) => {
                                  const cur = [...(section.content?.steps || [])];
                                  cur[stepIdx] = {
                                    ...cur[stepIdx],
                                    description: e.target.value,
                                  };
                                  updateSectionContent(idx, { steps: cur });
                                }}
                                placeholder="Step description..."
                                className="w-full px-2 py-1 text-[11px] rounded border border-cream-border leading-relaxed"
                              />
                            </div>
                          )
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* 4. PHOTO GALLERY (PROJECTS GRID) EDITOR */}
                {type === "gallery" && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pb-2 border-b border-cream-border">
                      <div>
                        <label className="block text-xs font-semibold text-charcoal mb-1">
                          Section Eyebrow
                        </label>
                        <input
                          type="text"
                          value={section.subtitle || ""}
                          onChange={(e) =>
                            updateSectionField(idx, "subtitle", e.target.value)
                          }
                          placeholder="Photo Gallery"
                          className="w-full px-3 py-2 text-xs rounded-lg border border-cream-border"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-charcoal mb-1">
                          Headline
                        </label>
                        <input
                          type="text"
                          value={section.title || ""}
                          onChange={(e) =>
                            updateSectionField(idx, "title", e.target.value)
                          }
                          placeholder="Possibilities start with a plan."
                          className="w-full px-3 py-2 text-xs font-semibold rounded-lg border border-cream-border"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-charcoal mb-1">
                          Button Text & Link
                        </label>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={section.ctaText || section.content?.ctaText || ""}
                            onChange={(e) => {
                              updateSectionField(idx, "ctaText", e.target.value);
                              updateSectionContent(idx, { ctaText: e.target.value });
                            }}
                            placeholder="Explore Full Gallery (14+ Projects)"
                            className="w-full px-2.5 py-1.5 text-xs rounded border border-cream-border"
                          />
                        </div>
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="text-xs font-bold text-forest uppercase tracking-wider">
                          Featured Project Cards ({Array.isArray(section.content?.items) ? section.content.items.length : 7})
                        </h4>
                        <button
                          type="button"
                          onClick={() => {
                            const cur = [...(section.content?.items || [])];
                            cur.push({
                              title: "New Agricultural Project",
                              category: "farms",
                              image: "/images/managed/cat-managed-farms.jpg",
                              isHero: false,
                            });
                            updateSectionContent(idx, { items: cur });
                          }}
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded text-xs font-semibold text-forest bg-forest/10 hover:bg-forest/20 transition-colors"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>Add Project Card</span>
                        </button>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                        {(section.content?.items || []).map(
                          (item: any, itemIdx: number) => (
                            <div
                              key={itemIdx}
                              className="p-3 rounded-xl border border-cream-border bg-ivory-surface/40 space-y-2 group"
                            >
                              <div className="relative aspect-video rounded-lg overflow-hidden bg-cream border border-cream-border">
                                <img
                                  src={item.image}
                                  alt={item.title}
                                  className="w-full h-full object-cover"
                                />
                                <button
                                  type="button"
                                  onClick={() => {
                                    setActiveMediaTarget({
                                      type: "galleryItemImage",
                                      sectionIndex: idx,
                                      itemIndex: itemIdx,
                                    });
                                    setMediaPickerOpen(true);
                                  }}
                                  className="absolute inset-0 bg-black/50 text-white text-[11px] font-semibold flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                  Change Image
                                </button>
                              </div>

                              <input
                                type="text"
                                value={item.title || ""}
                                onChange={(e) => {
                                  const cur = [...(section.content?.items || [])];
                                  cur[itemIdx] = {
                                    ...cur[itemIdx],
                                    title: e.target.value,
                                  };
                                  updateSectionContent(idx, { items: cur });
                                }}
                                placeholder="Project Title"
                                className="w-full px-2 py-1 text-xs font-semibold rounded border border-cream-border"
                              />

                              <div className="flex items-center justify-between gap-2 pt-1">
                                <input
                                  type="text"
                                  value={item.category || ""}
                                  onChange={(e) => {
                                    const cur = [...(section.content?.items || [])];
                                    cur[itemIdx] = {
                                      ...cur[itemIdx],
                                      category: e.target.value,
                                    };
                                    updateSectionContent(idx, { items: cur });
                                  }}
                                  placeholder="Category: farms"
                                  className="w-24 px-1.5 py-0.5 text-[10px] font-mono rounded border border-cream-border"
                                />

                                <label className="flex items-center gap-1 text-[11px] cursor-pointer">
                                  <input
                                    type="checkbox"
                                    checked={!!item.isHero}
                                    onChange={(e) => {
                                      const cur = [...(section.content?.items || [])];
                                      cur[itemIdx] = {
                                        ...cur[itemIdx],
                                        isHero: e.target.checked,
                                      };
                                      updateSectionContent(idx, { items: cur });
                                    }}
                                    className="rounded text-forest"
                                  />
                                  <span>Hero 2x2</span>
                                </label>

                                <button
                                  type="button"
                                  onClick={() => {
                                    const cur = [...(section.content?.items || [])];
                                    cur.splice(itemIdx, 1);
                                    updateSectionContent(idx, { items: cur });
                                  }}
                                  className="text-rose-600 hover:text-rose-800 p-0.5"
                                  title="Delete card"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </div>
                          )
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* 5. GENERIC / OTHER SECTIONS EDITOR */}
                {type !== "hero" && type !== "photo_strip" && type !== "approach" && type !== "gallery" && (
                  <div className="space-y-4">
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
                          className="w-full px-3 py-2 text-xs rounded-lg border border-cream-border"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-charcoal mb-1">
                          CTA Destination Link
                        </label>
                        <input
                          type="text"
                          value={section.ctaLink || ""}
                          onChange={(e) =>
                            updateSectionField(idx, "ctaLink", e.target.value)
                          }
                          className="w-full px-3 py-2 text-xs font-mono rounded-lg border border-cream-border"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-charcoal mb-1">
                        Section Description / Summary
                      </label>
                      <textarea
                        rows={2}
                        value={
                          typeof section.content === "string"
                            ? section.content
                            : section.content?.description || ""
                        }
                        onChange={(e) => {
                          if (typeof section.content === "string") {
                            updateSectionField(idx, "content", e.target.value);
                          } else {
                            updateSectionContent(idx, {
                              description: e.target.value,
                            });
                          }
                        }}
                        className="w-full px-3 py-2 text-xs rounded-lg border border-cream-border focus:outline-none focus:border-forest"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Floating or bottom Save Bar */}
      <div className="flex items-center justify-between p-4 rounded-xl bg-white border border-cream-border shadow-soft sticky bottom-4 z-20">
        <div className="text-xs text-charcoal-muted">
          Showing <strong>{activeCount}</strong> of <strong>{page.sections.length}</strong> sections on live page
        </div>
        <div className="flex items-center gap-3">
          <Link href="/admin/pages">
            <AdminButton variant="outline" size="sm">
              Back to Pages
            </AdminButton>
          </Link>
          <AdminButton
            variant="gold"
            size="sm"
            loading={saving}
            onClick={handleSave}
            icon={<Save className="w-4 h-4" />}
          >
            Save All Changes
          </AdminButton>
        </div>
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
        onSelect={handleMediaSelect}
      />
    </div>
  );
}
