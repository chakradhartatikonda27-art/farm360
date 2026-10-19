"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Layers,
  Save,
  Plus,
  Trash2,
  Image as ImageIcon,
  CheckCircle2,
  AlertCircle,
  Loader2,
  ExternalLink,
  Edit,
  ArrowRight,
} from "lucide-react";
import AdminCard from "@/components/admin/AdminCard";
import AdminButton from "@/components/admin/AdminButton";
import MediaPickerModal from "@/components/admin/MediaPickerModal";
import ConfirmModal from "@/components/admin/ConfirmModal";
import { SpaceItem } from "@/lib/cms/types";

export default function AdminSpacesPage() {
  const [spaces, setSpaces] = useState<SpaceItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Selected space for modal/editor
  const [editingSpace, setEditingSpace] = useState<SpaceItem | null>(null);
  const [mediaPickerOpen, setMediaPickerOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [spaceToDelete, setSpaceToDelete] = useState<SpaceItem | null>(null);

  // Input helpers for editing challenges / solutions
  const [newChallenge, setNewChallenge] = useState("");
  const [newSolution, setNewSolution] = useState("");
  const [newFactor, setNewFactor] = useState("");

  useEffect(() => {
    fetchSpaces();
  }, []);

  const fetchSpaces = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/spaces");
      const json = await res.json();
      if (json.success) {
        setSpaces(json.data);
      }
    } catch (err) {
      console.error("Failed to load spaces:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveSpace = async (updated: SpaceItem) => {
    try {
      setSaving(true);
      setErrorMsg(null);
      setSuccessMsg(null);

      const exists = spaces.some((s) => s.id === updated.id);
      const url = exists ? `/api/admin/spaces/${updated.id}` : "/api/admin/spaces";
      const method = exists ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updated),
      });

      const json = await res.json();
      if (json.success) {
        setSuccessMsg("Space category saved successfully!");
        fetchSpaces();
        setEditingSpace(null);
        setTimeout(() => setSuccessMsg(null), 3000);
      } else {
        setErrorMsg(json.error || "Failed to save space category.");
      }
    } catch (err) {
      setErrorMsg("Network error saving space.");
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteSpace = async () => {
    if (!spaceToDelete) return;
    try {
      const res = await fetch(`/api/admin/spaces/${spaceToDelete.id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setSpaces((prev) => prev.filter((s) => s.id !== spaceToDelete.id));
        setDeleteModalOpen(false);
        setSpaceToDelete(null);
      }
    } catch (err) {
      console.error("Failed to delete space:", err);
    }
  };

  const handleAddNewSpace = () => {
    const newSp: SpaceItem = {
      id: `space-${Date.now()}`,
      slug: `custom-space-${Date.now()}`,
      title: "New Space Category",
      category: "custom",
      description: "Description of land type, typical size, and requirements.",
      image: "https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=800&q=80",
      keyChallenges: ["Lack of supervision", "Labour coordination"],
      farmcareSolutions: ["Dedicated agronomist", "Turnkey maintenance"],
      assessmentFactors: ["Soil profile", "Water yield"],
      displayOrder: spaces.length + 1,
      isActive: true,
    };
    setEditingSpace(newSp);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-forest">
            Spaces We Serve Management
          </h1>
          <p className="text-sm text-charcoal-muted mt-1">
            Manage the 4 primary land environments (Agricultural Land, Residential Plots,
            Terraces, Spaces Around Homes) and add specialized categories.
          </p>
        </div>

        <AdminButton
          variant="gold"
          size="md"
          onClick={handleAddNewSpace}
          icon={<Plus className="w-4 h-4" />}
        >
          Add Space Category
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

      {/* Grid of Spaces */}
      {loading ? (
        <div className="flex items-center justify-center py-20 text-charcoal-muted gap-2 text-sm">
          <Loader2 className="w-5 h-5 animate-spin text-forest" />
          <span>Loading space categories...</span>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {spaces.map((space) => (
            <AdminCard
              key={space.id}
              bodyClassName="p-0"
              className="flex flex-col justify-between"
            >
              {/* Image & Header */}
              <div className="relative aspect-video w-full bg-cream/30 border-b border-cream-border overflow-hidden">
                <img
                  src={space.image}
                  alt={space.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-3 right-3 flex items-center gap-2">
                  <span
                    className={`px-2.5 py-1 rounded-full text-xs font-semibold backdrop-blur-md ${
                      space.isActive
                        ? "bg-emerald-900/80 text-emerald-200 border border-emerald-500/40"
                        : "bg-stone-900/80 text-stone-300 border border-stone-500/40"
                    }`}
                  >
                    {space.isActive ? "Active" : "Hidden"}
                  </span>
                </div>
              </div>

              {/* Body */}
              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <div>
                  <div className="flex items-center justify-between">
                    <h3 className="font-serif text-lg font-bold text-forest">
                      {space.title}
                    </h3>
                    <span className="font-mono text-xs px-2 py-0.5 rounded bg-cream/60 text-charcoal-muted border border-cream-border">
                      Order: {space.displayOrder || 1}
                    </span>
                  </div>
                  <p className="text-xs text-charcoal-muted mt-2 line-clamp-3">
                    {space.description}
                  </p>

                  <div className="mt-4 pt-3 border-t border-cream-border/60 grid grid-cols-2 gap-3 text-xs">
                    <div>
                      <span className="font-bold text-charcoal block mb-1">
                        Challenges ({space.keyChallenges?.length || 0})
                      </span>
                      <ul className="list-disc list-inside text-charcoal-subtle space-y-0.5 text-[11px]">
                        {space.keyChallenges?.slice(0, 2).map((c, i) => (
                          <li key={i} className="truncate">{c}</li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <span className="font-bold text-forest block mb-1">
                        Solutions ({space.farmcareSolutions?.length || 0})
                      </span>
                      <ul className="list-disc list-inside text-charcoal-subtle space-y-0.5 text-[11px]">
                        {space.farmcareSolutions?.slice(0, 2).map((s, i) => (
                          <li key={i} className="truncate">{s}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-cream-border flex items-center justify-between">
                  <a
                    href={`/for-your-space`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-xs text-forest hover:text-gold transition-colors font-medium"
                  >
                    <span>View Public Page</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setSpaceToDelete(space);
                        setDeleteModalOpen(true);
                      }}
                      className="p-1.5 rounded-lg text-rose-600 hover:bg-rose-50 transition-colors"
                      title="Delete space"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                    <AdminButton
                      variant="primary"
                      size="sm"
                      onClick={() => setEditingSpace(space)}
                      icon={<Edit className="w-3.5 h-3.5" />}
                    >
                      Edit Space
                    </AdminButton>
                  </div>
                </div>
              </div>
            </AdminCard>
          ))}
        </div>
      )}

      {/* Edit Space Modal / Drawer */}
      {editingSpace && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-3xl max-h-[90vh] bg-white rounded-2xl shadow-elevated border border-cream-border flex flex-col overflow-hidden">
            <div className="flex items-center justify-between p-5 border-b border-cream-border/70 bg-ivory-surface">
              <h3 className="font-serif text-lg font-bold text-forest">
                Edit Space Category: {editingSpace.title}
              </h3>
              <button
                onClick={() => setEditingSpace(null)}
                className="text-charcoal-muted hover:text-charcoal p-1 rounded-lg"
              >
                &times;
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-charcoal mb-1">
                    Space Title
                  </label>
                  <input
                    type="text"
                    value={editingSpace.title}
                    onChange={(e) =>
                      setEditingSpace({ ...editingSpace, title: e.target.value })
                    }
                    className="w-full px-3 py-2 text-xs rounded-lg border border-cream-border focus:outline-none focus:border-forest"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-charcoal mb-1">
                    Slug
                  </label>
                  <input
                    type="text"
                    value={editingSpace.slug}
                    onChange={(e) =>
                      setEditingSpace({
                        ...editingSpace,
                        slug: e.target.value.toLowerCase(),
                      })
                    }
                    className="w-full px-3 py-2 text-xs rounded-lg border border-cream-border font-mono focus:outline-none focus:border-forest"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-charcoal mb-1">
                    Description
                  </label>
                  <textarea
                    rows={3}
                    value={editingSpace.description}
                    onChange={(e) =>
                      setEditingSpace({
                        ...editingSpace,
                        description: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 text-xs rounded-lg border border-cream-border focus:outline-none focus:border-forest"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-charcoal mb-1">
                    Cover Image URL
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={editingSpace.image}
                      onChange={(e) =>
                        setEditingSpace({
                          ...editingSpace,
                          image: e.target.value,
                        })
                      }
                      className="flex-1 px-3 py-2 text-xs rounded-lg border border-cream-border focus:outline-none focus:border-forest"
                    />
                    <AdminButton
                      variant="outline"
                      size="sm"
                      onClick={() => setMediaPickerOpen(true)}
                      icon={<ImageIcon className="w-3.5 h-3.5 text-forest" />}
                    >
                      Pick Image
                    </AdminButton>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-charcoal mb-1">
                    Display Order
                  </label>
                  <input
                    type="number"
                    value={editingSpace.displayOrder || 1}
                    onChange={(e) =>
                      setEditingSpace({
                        ...editingSpace,
                        displayOrder: parseInt(e.target.value) || 1,
                      })
                    }
                    className="w-full px-3 py-2 text-xs rounded-lg border border-cream-border focus:outline-none focus:border-forest"
                  />
                </div>

                <div className="flex items-center gap-2 pt-5">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={editingSpace.isActive}
                      onChange={(e) =>
                        setEditingSpace({
                          ...editingSpace,
                          isActive: e.target.checked,
                        })
                      }
                      className="rounded text-forest focus:ring-forest"
                    />
                    <span className="text-xs font-bold text-charcoal">
                      Active on Public Website
                    </span>
                  </label>
                </div>
              </div>

              {/* Challenges & Solutions */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-cream-border">
                {/* Key Challenges */}
                <div>
                  <label className="block text-xs font-semibold text-charcoal mb-1">
                    Key Landowner Challenges
                  </label>
                  <div className="flex gap-2 mb-2">
                    <input
                      type="text"
                      value={newChallenge}
                      onChange={(e) => setNewChallenge(e.target.value)}
                      placeholder="Add challenge..."
                      className="flex-1 px-3 py-1.5 text-xs rounded-lg border border-cream-border focus:outline-none focus:border-forest"
                    />
                    <AdminButton
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        if (!newChallenge.trim()) return;
                        setEditingSpace({
                          ...editingSpace,
                          keyChallenges: [
                            ...(editingSpace.keyChallenges || []),
                            newChallenge.trim(),
                          ],
                        });
                        setNewChallenge("");
                      }}
                    >
                      Add
                    </AdminButton>
                  </div>
                  <div className="space-y-1 max-h-32 overflow-y-auto">
                    {editingSpace.keyChallenges?.map((c, i) => (
                      <div
                        key={i}
                        className="flex items-center justify-between p-1.5 rounded bg-cream/30 text-xs"
                      >
                        <span className="truncate">{c}</span>
                        <button
                          type="button"
                          onClick={() =>
                            setEditingSpace({
                              ...editingSpace,
                              keyChallenges: (editingSpace.keyChallenges || []).filter(
                                (_, idx) => idx !== i
                              ),
                            })
                          }
                          className="text-rose-500 hover:text-rose-700 ml-2"
                        >
                          &times;
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* FarmCare Solutions */}
                <div>
                  <label className="block text-xs font-semibold text-forest mb-1">
                    FarmCare360 Solutions
                  </label>
                  <div className="flex gap-2 mb-2">
                    <input
                      type="text"
                      value={newSolution}
                      onChange={(e) => setNewSolution(e.target.value)}
                      placeholder="Add solution..."
                      className="flex-1 px-3 py-1.5 text-xs rounded-lg border border-cream-border focus:outline-none focus:border-forest"
                    />
                    <AdminButton
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        if (!newSolution.trim()) return;
                        setEditingSpace({
                          ...editingSpace,
                          farmcareSolutions: [
                            ...(editingSpace.farmcareSolutions || []),
                            newSolution.trim(),
                          ],
                        });
                        setNewSolution("");
                      }}
                    >
                      Add
                    </AdminButton>
                  </div>
                  <div className="space-y-1 max-h-32 overflow-y-auto">
                    {editingSpace.farmcareSolutions?.map((s, i) => (
                      <div
                        key={i}
                        className="flex items-center justify-between p-1.5 rounded bg-cream/30 text-xs"
                      >
                        <span className="truncate">{s}</span>
                        <button
                          type="button"
                          onClick={() =>
                            setEditingSpace({
                              ...editingSpace,
                              farmcareSolutions:
                                (editingSpace.farmcareSolutions || []).filter(
                                  (_, idx) => idx !== i
                                ),
                            })
                          }
                          className="text-rose-500 hover:text-rose-700 ml-2"
                        >
                          &times;
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 p-4 border-t border-cream-border/70 bg-ivory-surface">
              <AdminButton
                variant="outline"
                size="sm"
                onClick={() => setEditingSpace(null)}
              >
                Cancel
              </AdminButton>
              <AdminButton
                variant="gold"
                size="sm"
                loading={saving}
                onClick={() => handleSaveSpace(editingSpace)}
                icon={<Save className="w-3.5 h-3.5" />}
              >
                Save Space Category
              </AdminButton>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={deleteModalOpen}
        title="Delete Space Category"
        message={`Are you sure you want to delete "${spaceToDelete?.title}"?`}
        confirmText="Delete Space"
        onConfirm={handleDeleteSpace}
        onCancel={() => {
          setDeleteModalOpen(false);
          setSpaceToDelete(null);
        }}
      />

      {/* Media Picker Modal */}
      <MediaPickerModal
        isOpen={mediaPickerOpen}
        onClose={() => setMediaPickerOpen(false)}
        onSelect={(url) => {
          if (editingSpace) {
            setEditingSpace({ ...editingSpace, image: url });
          }
        }}
      />
    </div>
  );
}
