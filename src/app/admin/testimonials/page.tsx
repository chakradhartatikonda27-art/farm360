"use client";

import React, { useState, useEffect } from "react";
import {
  MessageSquareQuote,
  Star,
  Plus,
  Trash2,
  Edit,
  Save,
  CheckCircle2,
  Clock,
  XCircle,
  Loader2,
  Search,
  ExternalLink,
  ShieldCheck,
} from "lucide-react";
import AdminCard from "@/components/admin/AdminCard";
import AdminButton from "@/components/admin/AdminButton";
import ConfirmModal from "@/components/admin/ConfirmModal";
import MediaPickerModal from "@/components/admin/MediaPickerModal";
import { TestimonialItem } from "@/lib/cms/types";

export default function AdminTestimonialsPage() {
  const [testimonials, setTestimonials] = useState<TestimonialItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState("");

  const [editingItem, setEditingItem] = useState<TestimonialItem | null>(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<TestimonialItem | null>(null);
  const [mediaPickerOpen, setMediaPickerOpen] = useState(false);

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const fetchTestimonials = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/testimonials");
      const json = await res.json();
      const list = json.data || json;
      if (Array.isArray(list)) {
        setTestimonials(list);
      }
    } catch (err) {
      console.error("Failed to load testimonials:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveItem = async () => {
    if (!editingItem || !editingItem.clientName) return;

    try {
      setSaving(true);
      const exists = testimonials.some((t) => t.id === editingItem.id);
      const url = exists
        ? `/api/admin/testimonials/${editingItem.id}`
        : "/api/admin/testimonials";
      const method = exists ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editingItem),
      });

      const json = await res.json();
      if (json.success) {
        fetchTestimonials();
        setEditingItem(null);
      }
    } catch (err) {
      console.error("Failed to save testimonial:", err);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!itemToDelete) return;
    try {
      const res = await fetch(`/api/admin/testimonials/${itemToDelete.id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setTestimonials((prev) => prev.filter((t) => t.id !== itemToDelete.id));
        setDeleteModalOpen(false);
        setItemToDelete(null);
      }
    } catch (err) {
      console.error("Failed to delete testimonial:", err);
    }
  };

  const openNewModal = () => {
    setEditingItem({
      id: `testi-${Date.now()}`,
      clientName: "",
      location: "Hyderabad, Telangana",
      landType: "Agricultural Land (5 Acres)",
      rating: 5,
      quote: "",
      fullStory: "",
      isVerified: true,
      isFeatured: false,
      isApproved: true,
      displayOrder: testimonials.length + 1,
    });
  };

  const filteredTestimonials = testimonials.filter(
    (t) =>
      (t.clientName || t.name || "").toLowerCase().includes(search.toLowerCase()) ||
      (t.location || "").toLowerCase().includes(search.toLowerCase()) ||
      (t.quote || "").toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-forest">
            Testimonials & Client Stories
          </h1>
          <p className="text-sm text-charcoal-muted mt-1">
            Manage landowner reviews, verified testimonials, ratings, and featured
            homepage showcases.
          </p>
        </div>

        <AdminButton
          variant="gold"
          size="md"
          onClick={openNewModal}
          icon={<Plus className="w-4 h-4" />}
        >
          Add Testimonial
        </AdminButton>
      </div>

      {/* Search Bar */}
      <div className="flex items-center justify-between gap-3 bg-white p-4 rounded-xl border border-cream-border">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-charcoal-subtle" />
          <input
            type="text"
            placeholder="Search reviews by client, location, or text..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-cream-border focus:outline-none focus:border-forest"
          />
        </div>
      </div>

      {/* Testimonials Table */}
      <AdminCard bodyClassName="p-0">
        {loading ? (
          <div className="flex items-center justify-center py-20 text-charcoal-muted gap-2 text-sm">
            <Loader2 className="w-5 h-5 animate-spin text-forest" />
            <span>Loading client testimonials...</span>
          </div>
        ) : filteredTestimonials.length === 0 ? (
          <div className="p-8 text-center text-charcoal-muted text-sm">
            No testimonials found.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-cream-border bg-ivory-surface/60 text-charcoal-muted uppercase tracking-wider text-[11px]">
                  <th className="py-3.5 px-4">Client</th>
                  <th className="py-3.5 px-4">Location / Property</th>
                  <th className="py-3.5 px-4">Rating</th>
                  <th className="py-3.5 px-4">Quote</th>
                  <th className="py-3.5 px-4">Featured</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-cream-border/60">
                {filteredTestimonials.map((t) => (
                  <tr key={t.id} className="hover:bg-ivory-surface/40 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-charcoal flex items-center gap-1.5">
                        <span>{t.clientName}</span>
                        {t.isVerified && (
                          <span title="Verified Landowner">
                            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="text-xs text-charcoal">{t.location}</div>
                      <div className="text-[11px] text-charcoal-subtle">
                        {t.landType}
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-0.5 text-amber-500">
                        {Array.from({ length: t.rating || 5 }).map((_, i) => (
                          <Star key={i} className="w-3.5 h-3.5 fill-amber-500" />
                        ))}
                      </div>
                    </td>
                    <td className="py-3.5 px-4 max-w-xs">
                      <p className="text-xs text-charcoal-muted truncate italic">
                        "{t.quote}"
                      </p>
                    </td>
                    <td className="py-3.5 px-4">
                      {t.isFeatured ? (
                        <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-amber-100 text-amber-800 border border-amber-300">
                          Featured
                        </span>
                      ) : (
                        <span className="text-[10px] text-charcoal-subtle">
                          Standard
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-4">
                      {t.isApproved ? (
                        <span className="inline-flex items-center gap-1 text-xs text-emerald-700 font-semibold">
                          <CheckCircle2 className="w-3 h-3" />
                          <span>Approved</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-xs text-stone-500">
                          <Clock className="w-3 h-3" />
                          <span>Pending</span>
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => setEditingItem(t)}
                          className="p-1.5 rounded-lg text-charcoal-muted hover:text-forest hover:bg-cream/40 transition-colors"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setItemToDelete(t);
                            setDeleteModalOpen(true);
                          }}
                          className="p-1.5 rounded-lg text-rose-600 hover:bg-rose-50 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
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

      {/* Edit / Create Modal */}
      {editingItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-lg bg-white rounded-2xl shadow-elevated border border-cream-border overflow-hidden">
            <div className="flex items-center justify-between p-5 border-b border-cream-border/70 bg-ivory-surface">
              <h3 className="font-serif text-lg font-bold text-forest">
                {editingItem.clientName ? "Edit Testimonial" : "New Testimonial"}
              </h3>
              <button
                onClick={() => setEditingItem(null)}
                className="text-charcoal-muted hover:text-charcoal p-1 rounded-lg"
              >
                &times;
              </button>
            </div>

            <div className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
              <div>
                <label className="block text-xs font-semibold text-charcoal mb-1">
                  Client Name *
                </label>
                <input
                  type="text"
                  required
                  value={editingItem.clientName}
                  onChange={(e) =>
                    setEditingItem({ ...editingItem, clientName: e.target.value })
                  }
                  placeholder="e.g. Ramesh Varma"
                  className="w-full px-3 py-2 text-xs rounded-lg border border-cream-border focus:outline-none focus:border-forest"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-charcoal mb-1">
                    Location
                  </label>
                  <input
                    type="text"
                    value={editingItem.location}
                    onChange={(e) =>
                      setEditingItem({ ...editingItem, location: e.target.value })
                    }
                    placeholder="e.g. Hyderabad, Telangana"
                    className="w-full px-3 py-2 text-xs rounded-lg border border-cream-border focus:outline-none focus:border-forest"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-charcoal mb-1">
                    Land Type
                  </label>
                  <input
                    type="text"
                    value={editingItem.landType}
                    onChange={(e) =>
                      setEditingItem({ ...editingItem, landType: e.target.value })
                    }
                    placeholder="e.g. 5-Acre Farm"
                    className="w-full px-3 py-2 text-xs rounded-lg border border-cream-border focus:outline-none focus:border-forest"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-charcoal mb-1">
                  Star Rating (1 - 5)
                </label>
                <select
                  value={editingItem.rating}
                  onChange={(e) =>
                    setEditingItem({
                      ...editingItem,
                      rating: parseInt(e.target.value) || 5,
                    })
                  }
                  className="w-full px-3 py-2 text-xs rounded-lg border border-cream-border bg-white focus:outline-none focus:border-forest"
                >
                  <option value={5}>5 Stars (Exceptional)</option>
                  <option value={4}>4 Stars (Very Good)</option>
                  <option value={3}>3 Stars (Satisfactory)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-charcoal mb-1">
                  Highlight Quote
                </label>
                <textarea
                  rows={2}
                  value={editingItem.quote}
                  onChange={(e) =>
                    setEditingItem({ ...editingItem, quote: e.target.value })
                  }
                  placeholder="Short impact sentence..."
                  className="w-full px-3 py-2 text-xs rounded-lg border border-cream-border focus:outline-none focus:border-forest"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-charcoal mb-1">
                  Full Story (Optional)
                </label>
                <textarea
                  rows={3}
                  value={editingItem.fullStory || ""}
                  onChange={(e) =>
                    setEditingItem({ ...editingItem, fullStory: e.target.value })
                  }
                  placeholder="Detailed breakdown of how FarmCare360 transformed their property..."
                  className="w-full px-3 py-2 text-xs rounded-lg border border-cream-border focus:outline-none focus:border-forest"
                />
              </div>

              <div className="flex flex-wrap items-center gap-4 pt-3 border-t border-cream-border">
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editingItem.isVerified}
                    onChange={(e) =>
                      setEditingItem({
                        ...editingItem,
                        isVerified: e.target.checked,
                      })
                    }
                    className="rounded text-forest focus:ring-forest"
                  />
                  <span className="text-xs font-semibold text-charcoal">
                    Verified Landowner
                  </span>
                </label>

                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editingItem.isFeatured}
                    onChange={(e) =>
                      setEditingItem({
                        ...editingItem,
                        isFeatured: e.target.checked,
                      })
                    }
                    className="rounded text-gold focus:ring-gold"
                  />
                  <span className="text-xs font-semibold text-charcoal">
                    Featured on Home
                  </span>
                </label>

                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editingItem.isApproved}
                    onChange={(e) =>
                      setEditingItem({
                        ...editingItem,
                        isApproved: e.target.checked,
                      })
                    }
                    className="rounded text-emerald-600 focus:ring-emerald-500"
                  />
                  <span className="text-xs font-semibold text-charcoal">
                    Approved & Published
                  </span>
                </label>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 p-4 border-t border-cream-border/70 bg-ivory-surface">
              <AdminButton
                variant="outline"
                size="sm"
                onClick={() => setEditingItem(null)}
              >
                Cancel
              </AdminButton>
              <AdminButton
                variant="gold"
                size="sm"
                loading={saving}
                onClick={handleSaveItem}
                icon={<Save className="w-3.5 h-3.5" />}
              >
                Save Review
              </AdminButton>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={deleteModalOpen}
        title="Delete Testimonial"
        message={`Are you sure you want to remove the testimonial from "${itemToDelete?.clientName}"?`}
        confirmText="Delete Review"
        onConfirm={handleDelete}
        onCancel={() => {
          setDeleteModalOpen(false);
          setItemToDelete(null);
        }}
      />
    </div>
  );
}
