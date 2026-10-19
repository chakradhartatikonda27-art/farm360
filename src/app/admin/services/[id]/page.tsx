"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Save,
  Plus,
  Trash2,
  Image as ImageIcon,
  CheckCircle2,
  AlertCircle,
  Loader2,
  ExternalLink,
  Layers,
  Sparkles,
  HelpCircle,
} from "lucide-react";
import AdminCard from "@/components/admin/AdminCard";
import AdminButton from "@/components/admin/AdminButton";
import MediaPickerModal from "@/components/admin/MediaPickerModal";
import { ServiceItem } from "@/lib/cms/types";

export default function AdminServiceEditorPage() {
  const params = useParams();
  const id = params.id as string;
  const router = useRouter();

  const isNew = id === "new";

  const [service, setService] = useState<ServiceItem>({
    id: `srv-${Date.now()}`,
    slug: "",
    title: "",
    shortDescription: "",
    fullDescription: "",
    category: "agricultural-land",
    icon: "Sprout",
    heroImage: "",
    gallery: [],
    features: [],
    benefits: [],
    pricingNote: "Custom quote based on land acreage, soil profile, and water access.",
    displayOrder: 1,
    isFeatured: false,
    isActive: true,
    seoTitle: "",
    seoDescription: "",
  });

  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Media Picker state
  const [mediaPickerOpen, setMediaPickerOpen] = useState(false);
  const [mediaTarget, setMediaTarget] = useState<"hero" | "gallery">("hero");

  // Feature / Benefit inputs
  const [newFeature, setNewFeature] = useState("");
  const [newBenefit, setNewBenefit] = useState("");

  useEffect(() => {
    if (!isNew) {
      fetchService();
    }
  }, [id, isNew]);

  const fetchService = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/admin/services/${id}`);
      const json = await res.json();
      if (json.success && json.data) {
        setService(json.data);
      } else {
        setErrorMsg("Failed to load service details.");
      }
    } catch (err) {
      setErrorMsg("Network error fetching service.");
    } finally {
      setLoading(false);
    }
  };

  const handleTitleChange = (val: string) => {
    setService((prev) => {
      const updated = { ...prev, title: val };
      if (isNew || !prev.slug) {
        updated.slug = val
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/(^-|-$)+/g, "");
      }
      return updated;
    });
  };

  const handleSave = async () => {
    if (!service.title || !service.slug) {
      setErrorMsg("Service Title and Slug are required.");
      return;
    }

    try {
      setSaving(true);
      setErrorMsg(null);
      setSuccessMsg(null);

      const url = isNew ? "/api/admin/services" : `/api/admin/services/${id}`;
      const method = isNew ? "POST" : "PUT";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(service),
      });

      const json = await res.json();
      if (json.success) {
        setSuccessMsg(
          isNew
            ? "New service created successfully!"
            : "Service details updated successfully!"
        );
        if (isNew && json.data) {
          router.push(`/admin/services/${json.data.id}`);
        } else {
          setService(json.data);
          setTimeout(() => setSuccessMsg(null), 3000);
        }
      } else {
        setErrorMsg(json.error || "Failed to save service.");
      }
    } catch (err) {
      setErrorMsg("Network error saving service.");
    } finally {
      setSaving(false);
    }
  };

  const addFeature = () => {
    if (!newFeature.trim()) return;
    setService((prev) => ({
      ...prev,
      features: [...(prev.features || []), newFeature.trim()],
    }));
    setNewFeature("");
  };

  const removeFeature = (index: number) => {
    setService((prev) => ({
      ...prev,
      features: prev.features?.filter((_, idx) => idx !== index) || [],
    }));
  };

  const addBenefit = () => {
    if (!newBenefit.trim()) return;
    setService((prev) => ({
      ...prev,
      benefits: [...(prev.benefits || []), newBenefit.trim()],
    }));
    setNewBenefit("");
  };

  const removeBenefit = (index: number) => {
    setService((prev) => ({
      ...prev,
      benefits: prev.benefits?.filter((_, idx) => idx !== index) || [],
    }));
  };

  const removeGalleryImage = (index: number) => {
    setService((prev) => ({
      ...prev,
      gallery: prev.gallery?.filter((_, idx) => idx !== index) || [],
    }));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20 text-charcoal-muted gap-2 text-sm">
        <Loader2 className="w-6 h-6 animate-spin text-forest" />
        <span>Loading service details...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link
            href="/admin/services"
            className="p-2 rounded-lg bg-white border border-cream-border text-charcoal-muted hover:text-charcoal hover:bg-cream/40 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <h1 className="font-serif text-2xl font-bold text-forest">
              {isNew ? "Create Agricultural Service" : `Edit: ${service.title}`}
            </h1>
            <p className="text-xs text-charcoal-muted mt-0.5">
              Configure descriptions, feature bullet points, images, and public visibility.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {!isNew && service.slug && (
            <a
              href={`/services/${service.slug}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold text-charcoal border border-cream-border bg-white hover:bg-cream/30 transition-colors"
            >
              <span>View Live</span>
              <ExternalLink className="w-3.5 h-3.5 text-charcoal-subtle" />
            </a>
          )}
          <AdminButton
            variant="gold"
            size="md"
            loading={saving}
            onClick={handleSave}
            icon={<Save className="w-4 h-4" />}
          >
            {isNew ? "Create Service" : "Save Changes"}
          </AdminButton>
        </div>
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

      {/* Basic Information */}
      <AdminCard title="Core Service Details">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-charcoal mb-1">
              Service Title *
            </label>
            <input
              type="text"
              required
              value={service.title}
              onChange={(e) => handleTitleChange(e.target.value)}
              placeholder="e.g. End-to-End Farm Management"
              className="w-full px-3 py-2 text-sm rounded-lg border border-cream-border focus:outline-none focus:border-forest"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-charcoal mb-1">
              URL Slug *
            </label>
            <input
              type="text"
              required
              value={service.slug}
              onChange={(e) =>
                setService({ ...service, slug: e.target.value.toLowerCase() })
              }
              placeholder="e.g. farm-management"
              className="w-full px-3 py-2 text-sm rounded-lg border border-cream-border font-mono text-xs focus:outline-none focus:border-forest"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-charcoal mb-1">
              Category
            </label>
            <select
              value={service.category}
              onChange={(e) =>
                setService({ ...service, category: e.target.value })
              }
              className="w-full px-3 py-2 text-sm rounded-lg border border-cream-border bg-white focus:outline-none focus:border-forest"
            >
              <option value="agricultural-land">Agricultural Land</option>
              <option value="residential-plots">Residential & Open Plots</option>
              <option value="terraces">Terraces & Rooftops</option>
              <option value="specialized">Specialized Agriculture</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-charcoal mb-1">
              Display Sort Order
            </label>
            <input
              type="number"
              value={service.displayOrder || 1}
              onChange={(e) =>
                setService({
                  ...service,
                  displayOrder: parseInt(e.target.value) || 1,
                })
              }
              className="w-full px-3 py-2 text-sm rounded-lg border border-cream-border focus:outline-none focus:border-forest"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-xs font-semibold text-charcoal mb-1">
              Short Summary Description (Cards & Discovery)
            </label>
            <textarea
              rows={2}
              value={service.shortDescription}
              onChange={(e) =>
                setService({ ...service, shortDescription: e.target.value })
              }
              placeholder="Concise overview explaining how FarmCare360 executes this service..."
              className="w-full px-3 py-2 text-sm rounded-lg border border-cream-border focus:outline-none focus:border-forest"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-xs font-semibold text-charcoal mb-1">
              Full Detailed Description (Detail Page)
            </label>
            <textarea
              rows={5}
              value={service.fullDescription || ""}
              onChange={(e) =>
                setService({ ...service, fullDescription: e.target.value })
              }
              placeholder="In-depth operational breakdown, methodology, agronomy expertise..."
              className="w-full px-3 py-2 text-sm rounded-lg border border-cream-border focus:outline-none focus:border-forest"
            />
          </div>

          <div className="flex items-center gap-6 md:col-span-2 pt-2 border-t border-cream-border/60">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={service.isActive}
                onChange={(e) =>
                  setService({ ...service, isActive: e.target.checked })
                }
                className="rounded text-forest focus:ring-forest"
              />
              <span className="text-xs font-bold text-charcoal">
                Active & Published
              </span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={service.isFeatured}
                onChange={(e) =>
                  setService({ ...service, isFeatured: e.target.checked })
                }
                className="rounded text-gold focus:ring-gold"
              />
              <span className="text-xs font-bold text-charcoal">
                Featured on Homepage
              </span>
            </label>
          </div>
        </div>
      </AdminCard>

      {/* Imagery & Media */}
      <AdminCard
        title="Visual Imagery & Media Assets"
        subtitle="Select cover banners and gallery photos for this service"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-charcoal mb-2">
              Primary Hero / Cover Image
            </label>
            <div className="flex items-center gap-4">
              <div className="w-32 h-20 rounded-xl border border-cream-border overflow-hidden bg-cream/30 shrink-0 relative">
                {service.heroImage ? (
                  <img
                    src={service.heroImage}
                    alt={service.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-charcoal-subtle">
                    <ImageIcon className="w-6 h-6" />
                  </div>
                )}
              </div>
              <div className="flex-1 space-y-2">
                <input
                  type="text"
                  value={service.heroImage}
                  onChange={(e) =>
                    setService({ ...service, heroImage: e.target.value })
                  }
                  placeholder="Image URL or pick from media vault..."
                  className="w-full px-3 py-2 text-xs rounded-lg border border-cream-border focus:outline-none focus:border-forest"
                />
                <AdminButton
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setMediaTarget("hero");
                    setMediaPickerOpen(true);
                  }}
                  icon={<ImageIcon className="w-3.5 h-3.5 text-forest" />}
                >
                  Choose From Media Vault
                </AdminButton>
              </div>
            </div>
          </div>

          {/* Additional Gallery Photos */}
          <div className="pt-4 border-t border-cream-border/60">
            <div className="flex items-center justify-between mb-2">
              <label className="block text-xs font-semibold text-charcoal">
                Additional Gallery Photos ({service.gallery?.length || 0})
              </label>
              <AdminButton
                variant="outline"
                size="sm"
                onClick={() => {
                  setMediaTarget("gallery");
                  setMediaPickerOpen(true);
                }}
                icon={<Plus className="w-3.5 h-3.5" />}
              >
                Add Image to Gallery
              </AdminButton>
            </div>

            {service.gallery && service.gallery.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-3">
                {service.gallery.map((url, idx) => (
                  <div
                    key={idx}
                    className="relative group rounded-xl border border-cream-border overflow-hidden aspect-video bg-cream/20"
                  >
                    <img
                      src={url}
                      alt={`Gallery ${idx + 1}`}
                      className="w-full h-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => removeGalleryImage(idx)}
                      className="absolute top-1 right-1 p-1 rounded-full bg-rose-600 text-white opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-charcoal-subtle italic">
                No additional gallery images added.
              </p>
            )}
          </div>
        </div>
      </AdminCard>

      {/* Features & Benefits */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Key Features */}
        <AdminCard
          title="Key Deliverables & Features"
          subtitle="Bullet points highlighting practical services included"
        >
          <div className="space-y-3">
            <div className="flex gap-2">
              <input
                type="text"
                value={newFeature}
                onChange={(e) => setNewFeature(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addFeature())}
                placeholder="Add deliverable feature..."
                className="flex-1 px-3 py-1.5 text-xs rounded-lg border border-cream-border focus:outline-none focus:border-forest"
              />
              <AdminButton
                variant="outline"
                size="sm"
                onClick={addFeature}
                icon={<Plus className="w-3.5 h-3.5" />}
              >
                Add
              </AdminButton>
            </div>

            <div className="space-y-1.5 max-h-56 overflow-y-auto">
              {service.features?.map((f, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-2 rounded-lg bg-ivory-surface border border-cream-border text-xs"
                >
                  <span className="text-charcoal">{f}</span>
                  <button
                    type="button"
                    onClick={() => removeFeature(idx)}
                    className="text-rose-500 hover:text-rose-700 p-1"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </AdminCard>

        {/* Benefits to Landowner */}
        <AdminCard
          title="Landowner Benefits"
          subtitle="Value propositions and outcomes for the owner"
        >
          <div className="space-y-3">
            <div className="flex gap-2">
              <input
                type="text"
                value={newBenefit}
                onChange={(e) => setNewBenefit(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addBenefit())}
                placeholder="Add landowner benefit..."
                className="flex-1 px-3 py-1.5 text-xs rounded-lg border border-cream-border focus:outline-none focus:border-forest"
              />
              <AdminButton
                variant="outline"
                size="sm"
                onClick={addBenefit}
                icon={<Plus className="w-3.5 h-3.5" />}
              >
                Add
              </AdminButton>
            </div>

            <div className="space-y-1.5 max-h-56 overflow-y-auto">
              {service.benefits?.map((b, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-2 rounded-lg bg-ivory-surface border border-cream-border text-xs"
                >
                  <span className="text-charcoal">{b}</span>
                  <button
                    type="button"
                    onClick={() => removeBenefit(idx)}
                    className="text-rose-500 hover:text-rose-700 p-1"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </AdminCard>
      </div>

      {/* Bottom Save Bar */}
      <div className="flex items-center justify-end gap-3 pt-4 border-t border-cream-border">
        <Link href="/admin/services">
          <AdminButton variant="outline" size="md">
            Back to Services List
          </AdminButton>
        </Link>
        <AdminButton
          variant="gold"
          size="md"
          loading={saving}
          onClick={handleSave}
          icon={<Save className="w-4 h-4" />}
        >
          {isNew ? "Create Service" : "Save Changes"}
        </AdminButton>
      </div>

      {/* Media Picker Modal */}
      <MediaPickerModal
        isOpen={mediaPickerOpen}
        onClose={() => setMediaPickerOpen(false)}
        onSelect={(url) => {
          if (mediaTarget === "hero") {
            setService((prev) => ({ ...prev, heroImage: url }));
          } else {
            setService((prev) => ({
              ...prev,
              gallery: [...(prev.gallery || []), url],
            }));
          }
        }}
      />
    </div>
  );
}
